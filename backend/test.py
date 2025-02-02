from bs4 import BeautifulSoup
import requests
import openai
import re
import json

def scrape_recipe(url: str):
    r = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
    soup = BeautifulSoup(r.text, "html.parser")
    text = soup.get_text(separator="\n", strip=True)
    return text


def ask_openai(text: str):
    client = openai.OpenAI(
        api_key=""
    )

    instructions = """Your purpose is to extract the essential instructions 
    of making this recipe, primarily including recipe name, 
    ingredients, instructions, and other essential details to 
    curate the recipe. After curating the recipe, format it into
    a structured json object with exclusively these 3 keys:

    - recipe_name
    - ingredients
    - instructions

    If the information extracted is not related or relevant to food
    and recipes, respond with "This is not a recipe" (No JSON needed).
    """

    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "developer", "content": instructions},
            {"role": "user", "content": text},
        ],
    )

    result = completion.choices[0].message.content
    print(result)
    return result

def extract_json(text):
    match = re.search(r"\{.*\}", text, re.DOTALL)

    if match:
        extracted_dict = match.group(0).strip()
        try:
            dict_object = json.loads(extracted_dict)
            return dict_object
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")
            return None
    else:
        print("No match found")
        return None

def main():
    url = input("Enter a URL: ")
    text = scrape_recipe(url)
    result = ask_openai(text)
    json = extract_json(result)
    print(json)

if __name__ == "__main__":
    main()