import os
from dotenv import load_dotenv
from openai import OpenAI

# Load variables from .env
load_dotenv()

# Create OpenAI client
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

# Send a request to the AI
response = client.responses.create(
    model="gpt-5",
    input="Explain what a frontend developer does in one simple sentence."
)

# Print the AI's response
print(response.output_text)
