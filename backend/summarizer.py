from gensim.summarization.summarizer import summarize
from wikipedia import wikipedia
from textacy import preprocessing
import re
from newspaper import Article, Config
import urllib.parse


def clean(text: str) -> str:
    txt = text.strip()
    txt = preprocessing.normalize_unicode(txt, form="NFKC")
    # Collapse whitespaces
    txt = preprocessing.normalize_whitespace(txt)
    # Remove newlines
    txt = preprocessing.normalize_repeating_chars(txt, chars="\n", maxn=1)
    # fix hyphen-ated words
    txt = preprocessing.normalize_hyphenated_words(txt)
    txt = preprocessing.normalize_quotation_marks(txt)
    txt = preprocessing.replace_urls(txt, replace_with="")
    txt = preprocessing.replace_phone_numbers(txt, replace_with="")
    txt = preprocessing.replace_emails(txt, replace_with="")
    txt = preprocessing.replace_user_handles(txt, replace_with="")
    txt = preprocessing.normalize_repeating_chars(txt, chars=".,;:-_ ", maxn=1)
    txt = re.sub("\n ", " ", txt)
    txt = re.sub(" \n", " ", txt)
    txt = re.sub("\n", " ", txt)
    txt = re.sub(" . ", " ", txt)
    txt = re.sub(r"\.([A-Z])", r". \1", txt)
    txt = re.sub(r"\. ([A-Z])", r".\n\1", txt)
    # fix for some common abbreviations
    for abv in ['Dr', 'St', 'Mr', 'Ms', 'mt', 'Inst', 'inc', 'est']:
        txt = re.sub(abv + "\.\n", abv + ". ", txt)
    return txt


def get_wiki_text(url: str) -> str:
    page_name = url.split("/")[-1]
    page = wikipedia.page(page_name)
    text = page.content
    return clean(text)


def get_article_text(url: str) -> str:
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36 Edg/89.0.774.54'}
    text = ''
    try:
        config = Config()
        config.browser_user_agent = headers['User-Agent']
        article = Article(url, keep_article_html=True, fetch_images=False, config=config)
        article.download()
        article.parse()
        # article.nlp()
        text = article.text
        meta = {
            "source": "web_article",
            "source_url": article.source_url,
            "article_html": article.article_html,
            "title": article.title,
            "top_image": article.top_image,
            "images": article.images,
            "videos": article.movies,
            "meta_language": article.meta_lang,
            "meta_keywords": article.meta_keywords,
            "authors": article.authors,
            "publish_date": article.publish_date,
        }
        text = clean(text)
    except Exception as e:
        msg = f"Error using newspaper3k extractor: {str(e)}"
        print(msg)
    return text


# return a summary of max 1000 words
def get_summary(url: str) -> str:
    if 'wikipedia' in urllib.parse.urlparse(url).netloc:
        sentences = get_wiki_text(url)
    else:
        sentences = get_article_text(url)
    if len(sentences.split()) > 2000:
        return summarize(sentences, word_count=1000)
    else:
        return summarize(sentences, ratio=0.5)
