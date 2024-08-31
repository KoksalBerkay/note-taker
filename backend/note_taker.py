import g4f
import speech_recognition as sr
import sqlite3
from pydub import AudioSegment
import os
import json

class NoteTaker:
    def __init__(self, model="gpt-4", lang="en", extra_completion=True, extra_questions=True):
        self._recognizer = sr.Recognizer()
        self._listening = False
        self._current_session = []
        self._model = model
        self._lang = lang
        self._extra_completion = extra_completion
        self._extra_questions = extra_questions

        # Create database
        conn = sqlite3.connect("lectures.db", check_same_thread=False)
        c = conn.cursor()

        # Create table for notes
        c.execute("""CREATE TABLE IF NOT EXISTS lectures (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            transcript TEXT NOT NULL,
            summary TEXT NOT NULL,
            date TEXT NOT NULL
        )""")

        # Create table for questions and answers
        c.execute("""CREATE TABLE IF NOT EXISTS questions_answers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            note_id INTEGER,
            question TEXT NOT NULL,
            answer TEXT NOT NULL,
            FOREIGN KEY (note_id) REFERENCES lectures (id)
        )""")

        conn.commit()

        self._conn = conn
        self._c = c


    @property
    def recognizer(self):
        return self._recognizer

    @property
    def listening(self):
        return self._listening

    @property
    def current_session(self):
        return self._current_session

    @property
    def lang(self):
        return self._lang

    @property
    def model(self):
        return self._model

    @property
    def extra_completion(self):
        return self._extra_completion

    @property
    def extra_questions(self):
        return self._extra_questions

    @lang.setter
    def lang(self, value):
        self._lang = value

    @model.setter
    def model(self, value):
        self._model = value

    @extra_completion.setter
    def extra_completion(self, value):
        self._extra_completion = value

    @extra_questions.setter
    def extra_questions(self, value):
        self._extra_questions = value

    @listening.setter
    def listening(self, value):
        self._listening = value

    def execute_query(self, query, args=()):
        self._c.execute(query, args)
        self._conn.commit()
        return self._c.fetchall()

    def save(self, transcript=None, summary=None, questions=None, answers=None, id=None):
        if id:
            if questions is not None and answers is not None:
                # Retrieve the note_id and insert each question and answer into the new table
                for q, a in zip(questions.split('\n'), answers.split('\n')):
                    self.execute_query(
                        "INSERT INTO questions_answers (note_id, question, answer) VALUES (?, ?, ?)",
                        (id, q, a)
                    )

        if transcript and summary:
            # Insert transcript and summary into a new record in the lectures table
            self.execute_query(
                "INSERT INTO lectures (transcript, summary, date) VALUES (?, ?, datetime('now'))",
                (transcript, summary)
            )


    def get_by_id(self, id):
        return self.execute_query("SELECT * FROM lectures WHERE id=?", (id,))

    def get_all(self):
        return self.execute_query("SELECT * FROM lectures ORDER BY date DESC")

    def find_model(self, model_name):
        model_name = model_name.lower()
        if model_name == "gpt_4":
            return g4f.models.gpt_4
        elif model_name == "claude_2":
            return g4f.models.claude_v2
        elif model_name == "mistral":
            return g4f.models.mistral_7b
        elif model_name == "llama_13b":
            return g4f.models.llama2_13b
        elif model_name == "llama_70b":
            return g4f.models.llama2_70b

    def reset_session(self):
        self._current_session = []

    def listen(self):
        if self.listening:
            return

        self.listening = True
        self.reset_session()

        if self._extra_completion:
            print("Extra completion is enabled.")

        try:
            while self.listening:
                with sr.Microphone() as source:
                    print("Listening the microphone...")
                    audio = self.recognizer.listen(source)
                    try:
                        text = self.recognizer.recognize_google(audio, language=self.lang)
                        print(f"Recognized: {text}")
                        self.current_session.append(text)
                    except sr.UnknownValueError:
                        print("Sorry, I didn't get that.")
                    except sr.RequestError as e:
                        print(f"Could not request results from the speech recognition service; {e}")
        except KeyboardInterrupt:
            print("\nStopping listening...")
            self.stop()

    def stop(self):
        self.listening = False

    def transcribe_audio_file(self, file_path):
        # TODO: Exception handling

        self.reset_session()
        # Convert the file to WAV formats
        wav_file_path = file_path.rsplit('.', 1)[0] + '.wav'
        try:
            audio = AudioSegment.from_file(file_path)
            audio.export(wav_file_path, format='wav')
        except Exception as e:
            print(f"Failed to convert file to WAV: {e}")
            return

        # Split the audio into chunks
        chunk_length_ms = 20000  # 20 seconds
        chunks = [audio[i:i + chunk_length_ms] for i in range(0, len(audio), chunk_length_ms)]

        # Process each chunk
        for i, chunk in enumerate(chunks):
            chunk_wav_path = f"{file_path.rsplit('.', 1)[0]}_chunk{i}.wav"
            chunk.export(chunk_wav_path, format='wav')
            try:
                with sr.AudioFile(chunk_wav_path) as source:
                    audio = self.recognizer.record(source)
                    try:
                        text = self.recognizer.recognize_google(audio, language=self.lang)
                        print(f"Transcribed chunk {i}: {text}")
                        self.current_session.append(text)
                    except sr.UnknownValueError:
                        print("Sorry, I didn't get that.")
                    except sr.RequestError as e:
                        print(f"Could not request results from the speech recognition service; {e}")
            except Exception as e:
                print(f"An error occurred while processing the WAV file: {e}")
            finally:
                # Remove the chunk WAV file
                if os.path.exists(chunk_wav_path):
                    os.remove(chunk_wav_path)

            # Remove the original WAV file
            if os.path.exists(wav_file_path):
                os.remove(wav_file_path)

    def summarize(self):
        text = ", ".join(self.current_session)

        print("Summarizing the session...")

        prompt = f"Please summarize the following text which is taken from a lecture session in the same language as the input text, which is '{self.lang}', in Markdown format:\n\n'{text}'"

        if self.extra_completion:
            prompt += "\n\n---\n\nPlease also extend the summary as much as you can with additional information that you know about the topic in a different section."
        if self.extra_questions:
            prompt += "\n\n---\n\nPlease also generate questions with answers about the topic for active recall practice in a different section."

        mdl = self.find_model(self.model)

        response = g4f.ChatCompletion.create(
            model=mdl,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        if not response:
            return "Sorry, I couldn't summarize the session."

        self.save(transcript = text, summary = str(response))

        return str(response)

    def chat(self, id, message):
        # Retrieve the transcript, summary, and questions/answers from the database
        note = self.get_by_id(id)
        if not note:
            return "Record not found."

        transcript = note[0][1]
        summary = note[0][2]

        # Reconstruct the conversation history
        history_prompt = ""
        existing_qas = self.execute_query("SELECT question, answer FROM questions_answers WHERE note_id=?", (id,))
        for q, a in existing_qas:
            history_prompt += f"Q: {q}\nA: {a}\n\n"

        prompt = (
            f"Given the following transcribed text from a lecture session:\n\n'{transcript}'\n\n"
            f"and the following summary:\n\n'{summary}'\n\n"
            f"Previous conversation:\n\n{history_prompt}"
            f"Now, please provide a response to the following question in the same language as the input text, "
            f"which is '{self.lang}', in Markdown format (only answer this and not include any more data):\n\n'{message}'"
        )

        mdl = self.find_model(self.model)

        response = g4f.ChatCompletion.create(
            model=mdl,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        if not response:
            return "Sorry, I couldn't generate a response."

        # Save the new question and answer to the database
        self.execute_query(
            "INSERT INTO questions_answers (note_id, question, answer) VALUES (?, ?, ?)",
            (id, message, str(response))
        )

        return str(response)
