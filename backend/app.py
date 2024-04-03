import os
from datetime import datetime
from flask_cors import CORS
from note_taker import NoteTaker
from flask import Flask, request, jsonify

app = Flask(__name__)
CORS(app)

note_taker = NoteTaker()
note_taker.lang = "en"

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

    print("Summary written to: {filename}")

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
  
if __name__ == "__main__":
  if not os.path.exists("summaries"):
    os.mkdir("summaries")

  app.run(debug=True)