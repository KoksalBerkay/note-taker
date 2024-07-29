import os
from datetime import datetime
from flask_cors import CORS
from note_taker import NoteTaker
from study_timer import StudyTimer
from flask import Flask, request, jsonify
from werkzeug.utils import secure_filename

UPLOAD_FOLDER = os.path.join(os.getcwd(), "uploads")
ALLOWED_EXTENSIONS = {"mp3", "wav", "m4a", "flac", "aac", "aiff", "ogg"}

app = Flask(__name__)
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER
CORS(app)

# Ensure the upload folder exists
if not os.path.exists(app.config["UPLOAD_FOLDER"]):
    os.makedirs(app.config["UPLOAD_FOLDER"])

note_taker = NoteTaker()
note_taker.lang = "en"

timer = StudyTimer()

@app.route("/api/notes", methods=["POST"])
def notes():
  data = request.get_json()

  action = data["action"]

  if action == "start":
    note_taker.listen()

    summary = note_taker.summarize()

    filename = f"summaries/summary_{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}.md"

    with open(filename, "w", encoding="utf-8") as f:
      f.write(summary)

    print("Summary written to: ", filename)

    return jsonify({
      "status": "success",
      "message": "summary complete!",
      "data": str(summary)
    })

  elif action == "stop":
    note_taker.stop()

    return jsonify({
      "status": "success",
      "message": "Stopped listening!"
    })

  else:
    return jsonify({
      "status": "error",
      "message": "Invalid action!"
    })

@app.route("/api/notes/<int:id>", methods=["GET"])
def get_note_by_id(id):
  note = note_taker.get_by_id(id)

  print(note)

  if note:
    return jsonify({
      "status": "success",
      "message": "Retrieved note!",
      "data": {
        "id": note[0][0],
        "transcript": note[0][1],
        "summary": note[0][2],
        "date": note[0][3]
      }
    })
  else:
    return jsonify({
      "status": "error",
      "message": "Note not found!"
    })

@app.route("/api/notes", methods=["GET"])
def get_notes():
  all_notes = note_taker.get_all()
  notes_in_dicts = []

  for i in all_notes:
    # Turn the tuple into a dictionary
    x = {
      "id": i[0],
      "transcript": i[1],
      "summary": i[2],
      "date": i[3]
    }

    notes_in_dicts.append(x)

  return jsonify({
    "status": "success",
    "message": "Retrieved notes!",
    "data": notes_in_dicts
  })

@app.route("/api/study-timer", methods=["GET", "POST"])
def study_timer():
    if request.method == "GET":
        # Handle GET request to fetch study timer records
        study_timer_records = timer.fetch()
        return jsonify({
            "status": "success",
            "message": "Retrieved study timer records",
            "data": study_timer_records
        })

    elif request.method == "POST":
        # Handle POST request
        data = request.get_json()
        stage = data.get("stage")
        time_spent = data.get("time_spent")
        date = data.get("date")

        if stage is None or time_spent is None or date is None:
            return jsonify({
                "status": "error",
                "message": "Incomplete data provided"
            }), 400

        # Insert the study timer record into the database
        timer.insert(stage, time_spent, date)

        return jsonify({
            "status": "success",
            "data": {
                "stage": stage,
                "time_spent": time_spent,
                "date": date
            }
        }), 201

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route("/api/upload-audio", methods=["POST"])
def upload_audio():
        if request.method == 'POST':
            # check if the post request has the file part
            if 'file' not in request.files:
                return jsonify({
                    "status": "error",
                    "message": "No file part"
                }), 400
            file = request.files['file']
            # If the user does not select a file, the browser submits an
            # empty file without a filename.
            if file.filename == '':
                return jsonify({
                    "status": "error",
                    "message": "No selected file"
                }), 400
            if file and allowed_file(file.filename):
                filename = secure_filename(file.filename)
                file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(file_path)

                note_taker.transcribe_audio_file(file_path)

                summary = note_taker.summarize()
                filename = f"summaries/summary_{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}.md"
                with open(filename, "w", encoding="utf-8") as f:
                        f.write(summary)

                return jsonify({
                    "status": "success",
                    "message": "File uploaded successfully"
                }), 201
            else:
                return jsonify({
                    "status": "error",
                    "message": "Invalid file format"
                }), 400

if __name__ == "__main__":
  if not os.path.exists("summaries"):
    os.mkdir("summaries")

  app.run(debug=True)
