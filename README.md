# Note Taker

## Description

NoteTaker is a simple application that uses AI to take notes for you during lectures. It uses the [SpeechRecognition](https://pypi.org/project/SpeechRecognition/) python library to convert speech to text, and [gpt4free](https://github.com/xtekky/gpt4free/) library to summarize the text.

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

## To-Do

- [ ] Improve the microphone listening functionality
- [ ] Create the backend for the study timer

## License

Distributed under the GNU General Public License. See [`LICENSE`](LICENSE) for more information.
