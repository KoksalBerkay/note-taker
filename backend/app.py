import os
from datetime import datetime
from note_taker import NoteTaker

note_taker = NoteTaker()
note_taker.lang = "en"

if __name__ == "__main__":
    if not os.path.exists("summaries"):
        os.mkdir("summaries")

    note_taker.listen()

    summary = note_taker.summarize()

    filename = f"summaries/summary_{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}.md"

    with open(filename, "w", encoding="utf-8") as f:
      f.write(summary)
    
    print(f"Summary saved to {os.path.abspath(filename)}")