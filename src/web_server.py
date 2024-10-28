from flask import Flask, jsonify, request
from prisma import Prisma
from clipboard import clipboard_histories
import asyncio

app = Flask(__name__)

@app.route('/histories', methods=['GET'])
def get_histories():
    return jsonify(asyncio.run(clipboard_histories()))