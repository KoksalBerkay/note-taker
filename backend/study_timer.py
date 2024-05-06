import sqlite3

class StudyTimer:
    def __init__(self):
        self._conn = sqlite3.connect("study_timer.db", check_same_thread=False)
        self._c = self._conn.cursor()

        self._c.execute("""CREATE TABLE IF NOT EXISTS study_timer (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        stage TEXT NOT NULL,
        time_spent TEXT NOT NULL,
        date TEXT NOT NULL
        )""")

        self._conn.commit()
    
    @property
    def conn(self):
        return self._conn

    @property
    def c(self):
        return self._c

    def insert(self, stage, time_spent, date):
        if stage not in ['work', 'break']:
            raise ValueError("Invalid stage. Must be 'work' or 'break'.")
        
        self._c.execute("""INSERT INTO study_timer (stage, time_spent, date)
        VALUES (?, ?, ?)""", (stage, time_spent, date))
        self._conn.commit()

    def fetch(self):
        self._c.execute("SELECT * FROM study_timer")
        return self._c.fetchall()

    def delete(self, id):
        self._c.execute("DELETE FROM study_timer WHERE id=?", (id,))
        self._conn.commit()

    def update(self, id, stage, time_spent, date):
        if stage not in ['work', 'break']:
            raise ValueError("Invalid stage. Must be 'work' or 'break'.")
        
        self._c.execute("""UPDATE study_timer SET stage=?, time_spent=?, date=?
        WHERE id=?""", (stage, time_spent, date, id))
        self._conn.commit()
    
    def __del__(self):
        self._conn.close()
    
    def __str__(self):
        return "Study Timer"
