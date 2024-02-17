import g4f
import speech_recognition as sr

class NoteTaker:
    def __init__(self, model="gpt_4", lang="en"):
        self._recognizer = sr.Recognizer()
        self._listening = False
        self._current_session = []
        self._model = model
        self._lang = lang
        self._extra_completion = True
    
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
    
    @lang.setter
    def lang(self, value):
        self._lang = value
    
    @model.setter
    def model(self, value):
        self._model = value
    
    @listening.setter
    def listening(self, value):
        self._listening = value
    
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
        else:
            return g4f.models.gpt_35_turbo_16k_0613
    
    def listen(self):
        if self.listening:
            return
        
        self.listening = True

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
            self.stop_listening()
    
    def stop_listening(self):
        self.listening = False

    def summarize(self):
        text = ", ".join(self.current_session)

        print("Summarizing the session...")

        if self._extra_completion:
            prompt = f"Please summarize the following text which is taken from a lecture session in Markdown format:\n\n{text}\n\n---\n\nPlease also extend the summary as much as you can with additional information that you know about the topic in a different section."
        else:
            prompt = f"Please summarize the following text which is taken from a lecture session in Markdown format:\n\n{text}"
        
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
        
        return str(response)
