from flask import Flask
from flask_cors import CORS
from tika import parser
from PIL import Image
from pytesseract import pytesseract

from azure.core.credentials import AzureKeyCredential
from azure.ai.textanalytics import TextAnalyticsClient

app = Flask(__name__)
CORS(app)


def getTextFromFile(filename):
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
        print(getKeyWords(data))
        return data


def getKeyWords(text):
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


@app.route('/')
def hello_world():
    return 'Hello, World!'


@app.route('/image-to-text/<filename>')
def image_to_text(filename):
    return getTextFromFile(str(filename) + '.pdf')
