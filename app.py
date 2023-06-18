from flask import Flask, render_template, request, send_file
import os
import requests
import io
from PIL import Image
import openai
import base64
from io import BytesIO
from urllib.request import urlopen

app = Flask(__name__)

@app.route('/', methods=['GET', 'POST'])
def index():
    return render_template('index.html')

@app.route('/edit_image', methods=['POST'])
def edit_image():
    data = request.json
    image_data = base64.b64decode(data['image'].split(',')[1])
    prompt_text = data['prompt']
    
    # Sending the image to OpenAI API for editing
    response = openai.Image.create_edit(
        image=BytesIO(image_data),
        # mask=open("mask.png", "rb"), # Use appropriate mask or transparency mask
        prompt=prompt_text,
        n=1,
        size="512x512"
    )

    # Extract the URL of the edited image
    edited_image_url = response['data'][0]['url']

    # Download the edited image
    edited_image = urlopen(edited_image_url).read()
    
    return send_file(BytesIO(edited_image), mimetype='image/png')

@app.route('/generate_image', methods=['POST'])
def generate_image():
    data = request.json
    prompt = data.get('prompt')

    openai.api_key = os.getenv("OPENAI_API_KEY")
    response = openai.Image.create(prompt=prompt, n=1, size="512x512")
    
    # Assuming the response contains the image URL in the data field
    image_url = response['data'][0]['url']
    image = Image.open(io.BytesIO(requests.get(image_url).content))

    output_buffer = io.BytesIO()
    image.save(output_buffer, format="PNG")
    output_buffer.seek(0)

    return send_file(output_buffer, mimetype='image/png')

if __name__ == "__main__":
    app.run(debug=True)
