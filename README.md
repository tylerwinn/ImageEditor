# Image Editor with OpenAI Integration

This web application allows users to upload an image, draw freeform shapes to make parts of the image transparent, and either generate a new image based on a text prompt or edit the image using OpenAI's Image API.

![The project in action](./images/ImageEditor.gif)

## Features

- Upload an image to the canvas.
- Draw freeform shapes on the image to make certain parts transparent.
- Generate an image from a text prompt using OpenAI's API.
- Edit the uploaded image with OpenAI's API by providing a text prompt.
- View the edited/generated image on the canvas, ready for further editing.

## Prerequisites

- Python 3.x
- OpenAI API key (you'll need to sign up for access)

## Installation

1. Clone this repository or download it as a ZIP file.

   ```shell
   git clone https://github.com/tylerwinn/ImageEditor.git
   ```

2. Navigate to the project directory and create a virtual environment.

   ```shell
   cd path-to-project-directory
   python -m venv imageeditor
   ```

3. Activate the virtual environment.

   - On Windows:

     ```shell
     imageeditor\Scripts\activate
     ```

   - On MacOS/Linux:

     ```shell
     source imageeditor/bin/activate
     ```

4. Install the required dependencies.

   ```shell
   pip install -r requirements.txt
   ```

5. Set the OpenAI API key as an environment variable.

   - On Windows:

     ```shell
     set OPENAI_API_KEY=your-openai-api-key
     ```

   - On MacOS/Linux:

     ```shell
     export OPENAI_API_KEY=your-openai-api-key
     ```

6. Run the Flask application.

   ```shell
   python app.py
   ```

7. Open a web browser and navigate to `http://127.0.0.1:5000`.

## Usage

1. Use the file input to upload an image, which will be displayed on the canvas.
2. Draw on the image to make parts of it transparent.
3. Use the "Generate" input box and button to generate a new image from a text prompt.
4. Use the "Edit" input box and button to edit the image using OpenAI's API by providing a text prompt.
5. The edited/generated image will replace the original image on the canvas.

## Technologies

- Python
- Flask
- JavaScript
- HTML5 & CSS
- OpenAI API

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgements

Thanks to OpenAI for providing access to their amazing API.