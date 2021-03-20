import os

import requests
from flask import Flask, request, redirect, url_for, jsonify
from flask_cors import CORS
import sys

from dotenv import load_dotenv
from os import environ
from requests import post
import json

app = Flask(__name__)
CORS(app)

load_dotenv()


@app.route('/', methods=['GET', 'POST'])
def hello_world():
    if request.method == 'GET':
        return 'Hello, World!'
    elif request.method == 'POST':
        uploaded_file = request.files['file']
        if uploaded_file.filename != '':
            uploaded_file.save(uploaded_file.filename)
        return redirect(url_for('hello_world'))


@app.route('/GetTokenAndSubdomain', methods=['GET'])
def getTokenAndSubdomain():
    'Get the access token'
    if request.method == 'GET':
        try:
            headers = {'content-type': 'application/x-www-form-urlencoded'}
            data = {
                'client_id': str(os.environ.get('CLIENT_ID')),
                'client_secret': str(os.environ.get('CLIENT_SECRET')),
                'resource': 'https://cognitiveservices.azure.com/',
                'grant_type': 'client_credentials'
            }

            resp = requests.post('https://login.windows.net/' + str(os.environ.get('TENANT_ID')) + '/oauth2/token',
                                 data=data, headers=headers)
            jsonResp = resp.json()

            if ('access_token' not in jsonResp):
                print(jsonResp)
                raise Exception('AAD Authentication error')

            token = jsonResp['access_token']
            subdomain = str(os.environ.get('SUBDOMAIN'))

            return jsonify(token=token, subdomain=subdomain)
        except Exception as e:
            message = 'Unable to acquire Azure AD token. Check the debugger for more information.'
            print(message, e)
            return jsonify(error=message)
