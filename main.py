import asyncio
import threading
from flask import Flask, jsonify
import prisma
from src.clipboard import  watch_clipboard
from prisma.models import History
 
db = prisma.Prisma()
prisma.register(db)
db.connect()
app = Flask(__name__)

@app.route('/history', methods=['GET'])
async def get_history():
    try:
        await db.connect()  
        histories = await History.prisma().find_many(order={'id': 'desc'})
        return jsonify([history.dict() for history in histories])  
    except Exception as e:
        return jsonify({"error": str(e)}), 500   
    finally:
        await db.disconnect() 

def run_clipboard_watcher():
    asyncio.run(watch_clipboard())

if __name__ == '__main__':
    watcher_thread = threading.Thread(target=run_clipboard_watcher)
    watcher_thread.daemon = True  
    watcher_thread.start()
    
    # Run the Flask app
    app.run(debug=True, port=5000)