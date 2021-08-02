#!/usr/bin/env python3

import bs4
from bs4 import BeautifulSoup
import codecs
import sys

file = sys.argv[1]
with open(file, "r", encoding='utf-8') as f:
    text = f.read()
    soup = BeautifulSoup(text, 'html.parser')
    print(soup.get_text())
    sys.stdout.flush()
