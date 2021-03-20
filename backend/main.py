from flask import Flask, request, redirect, url_for
from flask_cors import CORS
import sys

app = Flask(__name__)
CORS(app)


@app.route('/', methods=['GET', 'POST'])
def hello_world():
    if request.method == 'GET':
        return 'Hello, World!'
    elif request.method == 'POST':
        uploaded_file = request.files['file']
        if uploaded_file.filename != '':
            uploaded_file.save(uploaded_file.filename)
        return redirect(url_for('hello_world'))
