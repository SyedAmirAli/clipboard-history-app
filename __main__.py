print("App Running From Now... Press Ctrl+C to stop.")

import pyperclip
import time
import sqlite3
from datetime import datetime 
import threading
from flask_cors import CORS

# API development server setup
from flask import Flask, render_template, jsonify
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
CORS(app, resources={r"/*":{"origins":"*"}})
socketio = SocketIO(app, cors_allowed_origins="*", async_mode="threading")

column_names = ["id", "content", "timestamp", "status", "pin"]

def connect_db():
    conn = sqlite3.connect("/media/amir/STORE/personal/clipboard-history-app/database/clipboard_histories.sqlite")
    cursor = conn.cursor()
    return conn, cursor
 

def create_daily_table():
    conn, cursor = connect_db()
    today = datetime.now().strftime("%Y%m%d")
    table_name = f"histories_{today}"

    cursor.execute(f"""
        CREATE TABLE IF NOT EXISTS {table_name} (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            status BOOLEAN DEFAULT TRUE,
            pin BOOLEAN DEFAULT FALSE
        );
    """)
    conn.commit()
    conn.close()
    return table_name;

# Initiate the daily table
table_name = create_daily_table()
last_copied_text = ""

# GET clipboard Content
def get_clipboard_contents(limit=100, order='DESC'):
    conn, cursor = connect_db()
    cursor.execute(f"SELECT * FROM {table_name} WHERE status=1 ORDER BY id {order} {'LIMIT ' + str(limit) if limit != '*' else ''};")
    contents = cursor.fetchall()
    conn.commit()
    conn.close()
    return contents

def insert_clipboard_content(content):
    conn, cursor = connect_db() 

    # Fetch the last entry from the database
    check_last_content = cursor.execute(f"SELECT * FROM {table_name} ORDER BY id DESC;")
    get_last_content = check_last_content.fetchone()

    # Ensure get_last_content is not None before attempting to access it
    if get_last_content is not None and (get_last_content[1] == content or get_last_content[1] == last_copied_text):
        conn.close()
        return None   
    # Insert the new content if no duplicate found
    cursor.execute(f"INSERT INTO {table_name} (content) VALUES (?);", (content,))
    conn.commit()

    # Retrieve the newly inserted row for confirmation
    history = cursor.execute(f"SELECT * FROM {table_name} WHERE id = ?;", (cursor.lastrowid,))
    new_history = history.fetchone()

    conn.close()
    return new_history  


def last_history():
    conn, cursor = connect_db()
    history = cursor.execute(f"SELECT * FROM {table_name} ORDER BY id DESC LIMIT 1;")
    new_history = history.fetchone()
    conn.close()
    return new_history

# make history update function
def update_clipboard_pin_state(id, state):
    conn, cursor = connect_db()
    cursor.execute(f"UPDATE {table_name} SET pin = ? WHERE id = ?;", (state, id))
    conn.commit()
    conn.close()

def update_clipboard_content(id, state):
    conn, cursor = connect_db()
    cursor.execute(f"UPDATE {table_name} SET content = ? WHERE id = ?;", (state, id))
    conn.commit()
    conn.close()

def update_clipboard_disabled(id):
    conn, cursor = connect_db()
    cursor.execute(f"UPDATE {table_name} SET status = ? WHERE id = ?;", (0, id))
    conn.commit()
    conn.close()

def update_clipboard_delete(id):
    conn, cursor = connect_db()
    cursor.execute(f"DELETE FROM {table_name} WHERE id = ?;", (id,))
    conn.commit()
    conn.close()

def clipboard_watcher():
    global last_copied_text

    try:
        while True:
            # Get the current clipboard content
            clipboard_content = pyperclip.paste()

            # Check if the clipboard content has changed
            if clipboard_content != last_copied_text and clipboard_content:
                last_copied_text = clipboard_content

                make_history = insert_clipboard_content(last_copied_text)

                if make_history is not None:
                    history = dict(zip(column_names, make_history))
                    socketio.emit(
                        'new__history',
                        {'history': history}
                    )
                    # history['content']
                    # print(f"Inserted: {history}\n")
                    # socketio.emit('_chat', history['content'])
                # else:
                    # print(f"Duplicate content detected: {clipboard_content}\n")

            socketio.emit('_chat', 'Clipboard Watcher Running...')
            time.sleep(1)

    except KeyboardInterrupt:
        print("\nStopped monitoring clipboard.")
    finally:
        print('Clipboard History Saved!')


# API Development wit routes & actions define
@app.route('/histories')
def index():
    rows = get_clipboard_contents()
    json_data = [dict(zip(column_names, row)) for row in rows]

    # json_data = [row.dict() for row in rows]
    return jsonify(json_data)

@socketio.on('chat')
def test(chat):
    socketio.emit('_chat', 'Server Respond!')
    print(f'\n{chat}\n')

# Run the app
if __name__ == '__main__':
    watcher_tread = threading.Thread(target=clipboard_watcher)
    watcher_tread.daemon = True
    watcher_tread.start()

    socketio.run(app, host="localhost", port=5000, debug=True)