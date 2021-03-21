import re

from PIL import Image
from azure.ai.textanalytics import TextAnalyticsClient
from azure.core.credentials import AzureKeyCredential
from pytesseract import pytesseract
from tika import parser
import json
import requests
from bs4 import BeautifulSoup

credential = AzureKeyCredential("c02c15f9208d42c38e60c88a41a991f0")


def get_entities(text):
    endpoint = "https://westeurope.api.cognitive.microsoft.com/"

    # # client
    # text_analytics_client = TextAnalyticsClient(endpoint, credential)
    #
    # # analyse text from image/pdf
    # documents = [text[:-1]]
    #
    # response = text_analytics_client.extract_key_phrases(documents, language="en")
    # result = [doc for doc in response if not doc.is_error]

    text_analytics_client = TextAnalyticsClient(endpoint, credential)

    documents = [text[:-1]]
    response = text_analytics_client.recognize_entities(documents=documents)

    prepared_entities = [("presctiption", "main")]
    for document in response:
        for entity in document.entities:
            prepared_entities.append((entity.text, entity.category))

    print(prepared_entities)
    return prepared_entities


def get_visual_summary(filename):
    text = get_text_from_file(filename)
    text_dict = custom_analysis(text)
    text_dict[
        'Feedback'] = ' based on the information provided it could be concluded that you have a mild for of desease'
    result = ""
    for key in text_dict:
        result = result + '\n' + key
        if text_dict[key]:
            result += text_dict[key]
        else:
            result += " none"
    return result


def get_param_util(filename, param):
    text = get_text_from_file(filename)
    text_dict = custom_analysis(text)
    return text_dict[param]


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


def get_keywords(text):
    # account settings
    endpoint = "https://westeurope.api.cognitive.microsoft.com/"

    # client
    text_analytics_client = TextAnalyticsClient(endpoint, credential)

    # analyse text from image/pdf
    documents = [text[:-1]]

    response = text_analytics_client.extract_key_phrases(documents, language="en")
    result = [doc for doc in response if not doc.is_error]

    return result[0].key_phrases


def get_text_from_file(filename):
    path_to_tesseract = r"/usr/bin/tesseract"
    # filename = r"pr.pdf"

    if filename.endswith('.jpg') or filename.endswith('.png'):
        img = Image.open(filename)

        # Providing the tesseract executable location to pytesseract library
        pytesseract.tesseract_cmd = path_to_tesseract

        text = pytesseract.image_to_string(img)

        # Displaying the extracted text
        return text[:-1].strip()

    else:
        parsed_pdf = parser.from_file(filename)
        data = parsed_pdf['content']
        custom_analysis(data)

        return data.strip()


def get_lab_result_refs(filename: str) -> str:
    # referal lab result values taken from https://www.meditec.com/resourcestools/medical-reference-links/normal-lab-values
    with open('lab_refs.json', mode='r', encoding='utf-8') as file:
        lab_ref_results = json.load(file)
    if filename.endswith('.txt'):
        with open(filename, mode='r') as file:
            lines = file.read().splitlines()
    else:
        parsed_pdf = parser.from_file(filename)
        data = parsed_pdf['content']
        data = data.strip()
        data = re.sub(" \n\n", "\n", data)
        lines = data.splitlines()
    res = ''
    for line in lines:
        stripped = line.split(' ')
        test_name = stripped[0]
        gender = ''
        if 'male' in stripped[1]:
            gender = stripped[1]
            value = float(stripped[2])
        elif stripped[1].replace('.', '', 1).isdigit():
            value = float(stripped[1])
        else:
            test_name = test_name + ' ' + stripped[1]
            value = float(stripped[2])
        key = test_name + gender.lower()
        min, max, refs = lab_ref_results[key]
        if value < min:
            res += 'Value ' + str(value) + ' of ' + test_name + ' is bellow minimum of ' + str(min) + '\n'
        elif value > max:
            res += 'Value ' + str(value) + ' of ' + test_name + ' is above maximum of ' + str(max) + '\n'
        else:
            res += 'Value ' + str(value) + ' of ' + test_name + ' is within the norms\n'
        res += 'Normal values for this test are:\n'
        res += refs
        res += '\n\n'
    return res


def get_title(url: str) -> str:
    reqs = requests.get(url)
    soup = BeautifulSoup(reqs.text, 'html.parser')

    return soup.find('title').get_text()
