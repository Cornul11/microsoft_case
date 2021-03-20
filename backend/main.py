import os
import requests
from flask import Flask, request, redirect, url_for, jsonify
from flask_cors import CORS
from tika import parser
from PIL import Image
from pytesseract import pytesseract

from azure.core.credentials import AzureKeyCredential
from azure.ai.textanalytics import TextAnalyticsClient
import re

app = Flask(__name__)
CORS(app)


def get_text_from_file(filename):
    path_to_tesseract = r"/usr/bin/tesseract"
    # filename = r"pr.pdf"

    if filename.endswith('.jpg') or filename.endswith('.png'):
        img = Image.open(filename)

        # Providing the tesseract executable location to pytesseract library
        pytesseract.tesseract_cmd = path_to_tesseract

        text = pytesseract.image_to_string(img)

        # Displaying the extracted text
        return text[:-1]

    else:
        parsed_pdf = parser.from_file(filename)
        data = parsed_pdf['content']
        print(get_keywords(data))
        custom_analysis(data)

        return data


def get_keywords(text):
    # account settings
    credential = AzureKeyCredential("c02c15f9208d42c38e60c88a41a991f0")
    endpoint = "https://westeurope.api.cognitive.microsoft.com/"

    # client
    text_analytics_client = TextAnalyticsClient(endpoint, credential)

    # analyse text from image/pdf
    documents = [text[:-1]]

    response = text_analytics_client.extract_key_phrases(documents, language="en")
    result = [doc for doc in response if not doc.is_error]

    return result[0].key_phrases


def get_entities(text):
    credential = AzureKeyCredential("c02c15f9208d42c38e60c88a41a991f0")
    endpoint = "https://westeurope.api.cognitive.microsoft.com/"

    # client
    text_analytics_client = TextAnalyticsClient(endpoint, credential)

    # analyse text from image/pdf
    documents = [text[:-1]]

    response = text_analytics_client.extract_key_phrases(documents, language="en")
    result = [doc for doc in response if not doc.is_error]

    text_analytics_client = TextAnalyticsClient(endpoint, credential)

    documents = [text[:-1]]
    response = text_analytics_client.recognize_entities(documents=documents)

    prepared_entities = [("presctiption", "main")]
    for document in response:
        for entity in document.entities:
            prepared_entities.append((entity.text, entity.category))

    print(prepared_entities)
    return prepared_entities


def custom_analysis(text):
    txt = " ".join(re.findall(r"[a-zA-Z0-9]+", text))
    words = txt.split()

    matches = {'Diagnosis': "", 'Treatment': "", 'Prescription': "", 'Symptoms': "", 'Recommendations': ""}
    current_keyword = ""
    for word in words:
        if word in matches:
            current_keyword = word
            matches[word] = ""
        else:
            if current_keyword != "":
                matches[current_keyword] = matches[current_keyword] + ' ' + word

    return matches


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
def get_token_and_subdomain():
    """Get the access token"""
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

            if 'access_token' not in jsonResp:
                print(jsonResp)
                raise Exception('AAD Authentication error')

            token = jsonResp['access_token']
            subdomain = str(os.environ.get('SUBDOMAIN'))

            return jsonify(token=token, subdomain=subdomain)
        except Exception as e:
            message = 'Unable to acquire Azure AD token. Check the debugger for more information.'
            print(message, e)
            return jsonify(error=message)


@app.route('/image-to-text/<filename>')
def image_to_text(filename):
    return get_text_from_file(str(filename) + '.pdf')
