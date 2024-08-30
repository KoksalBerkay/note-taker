# Note Taker

## Description

NoteTaker is an AI-powered companion that captures and organizes your lecture notes, so you can focus on learning instead of writing. It mainly uses the [SpeechRecognition](https://pypi.org/project/SpeechRecognition/) python library to convert speech to text from uploaded audio, and [gpt4free](https://github.com/xtekky/gpt4free/) library to summarize the text and answer questions.

## Installation

1. Clone the repository:

```sh
git clone https://github.com/KoksalBerkay/note-taker.git && cd note-taker
```

2. Install node packages in `frontend/` & run frontend:

```sh
cd nextjs-frontend
npm install
npm run dev
```

3. Install pip dependencies in `backend/` & run backend:

```sh
cd ../backend
pip install -r requirements.txt
python app.py
```

## Images
<img src="https://github.com/KoksalBerkay/note-taker/blob/main/images/Main-page.png" alt="Main Page" style="width: 80%;">

<img src="https://github.com/KoksalBerkay/note-taker/blob/main/images/Note-page.png" alt="Note Page" style="width: 80%;">

<img src="https://github.com/KoksalBerkay/note-taker/blob/main/images/Note-page(1).png" alt="Note Page" style="width: 80%;">

<img src="https://github.com/KoksalBerkay/note-taker/blob/main/images/Note-page(2).png" alt="Note Page" style="width: 80%;">

<img src="https://github.com/KoksalBerkay/note-taker/blob/main/images/Note-page(3).png" alt="Note Page" style="width: 80%;">

<img src="https://github.com/KoksalBerkay/note-taker/blob/main/images/Study-timer-work.png" alt="Study Timer" style="width: 80%;">

<img src="https://github.com/KoksalBerkay/note-taker/blob/main/images/Study-timer-break.png" alt="Study Timer" style="width: 80%;">


## To-Do

- [x] Create the backend for the study timer
- [ ] Add analytics for the study timer
- [ ] Write the backend for the "Continue Chatting" feature

## License

Distributed under the GNU General Public License. See [`LICENSE`](LICENSE) for more information.
