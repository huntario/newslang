#!/usr/bin/env python3

import bs4
from bs4 import BeautifulSoup
import codecs


with open("./test.html", "r", encoding='utf-8') as f:
    text = f.read()
    soup = BeautifulSoup(text, 'html.parser')
    print(soup.get_text())
    sys.stdout.flush()
  
print('Hello World!')
