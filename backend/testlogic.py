from bs4 import BeautifulSoup
import requests

url = input("Enter a URL: ")

r = requests.get(url, headers={"User-Agent":"Mozilla/5.0"})

soup = BeautifulSoup(r.text, 'html.parser')

text = soup.get_text(separator='\n', strip=True)

print(text)
