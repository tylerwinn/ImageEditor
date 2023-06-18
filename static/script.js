document.addEventListener("DOMContentLoaded", () => {
    document.getElementById('editButton').addEventListener('click', sendImageForEditing);
    document.getElementById('generateButton').addEventListener('click', generateImage);

    const imageUpload = document.getElementById('imageUpload');
    const canvas = document.getElementById('imageCanvas');
    const ctx = canvas.getContext('2d');
    const editButton = document.getElementById('editButton');
    const generateButton = document.getElementById('generateButton');
    const loadingMessage = document.getElementById('loadingMessage');

    let drawing = false;
    let points = [];

    let originalImageData;

    imageUpload.addEventListener('change', handleImageUpload);
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mouseup', endDrawing);
    canvas.addEventListener('mousemove', draw);

    async function sendImageForEditing() {
        // Disable buttons and show loading message
        disableButtons();
        
        const promptText = document.getElementById('editPrompt').value;
    
        const image = canvas.toDataURL();
        const response = await fetch('/edit_image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                image: image,
                prompt: promptText
            })
        });
    
        const editedImage = await response.blob();
        const imageUrl = URL.createObjectURL(editedImage);
    
        const img = new Image();
        img.onload = function () {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);
            originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            // Re-enable buttons and hide loading message
            enableButtons();
        };
        img.src = imageUrl;

        // Clear the input
        document.getElementById('editPrompt').value = '';
    }

    async function generateImage() {
        // Disable buttons and show loading message
        disableButtons();
        
        const promptText = document.getElementById('generatePrompt').value;
        
        const response = await fetch('/generate_image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: promptText
            })
        });

        const generatedImage = await response.blob();
        const imageUrl = URL.createObjectURL(generatedImage);

        const img = new Image();
        img.onload = function () {
            canvas.width = 512;
            canvas.height = 512;
            ctx.drawImage(img, 0, 0, 512, 512);
            originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            // Re-enable buttons and hide loading message
            enableButtons();
        };
        img.src = imageUrl;

        // Clear the input
        document.getElementById('generatePrompt').value = '';
    }

    function disableButtons() {
        editButton.disabled = true;
        generateButton.disabled = true;
        loadingMessage.style.display = 'inline';
    }

    function enableButtons() {
        editButton.disabled = false;
        generateButton.disabled = false;
        loadingMessage.style.display = 'none';
    }
    function handleImageUpload(e) {
        const file = e.target.files[0];
        if (file) {
            const image = new Image();
            image.onload = () => {
                canvas.width = 512; // Set the canvas width to 512
                canvas.height = 512; // Set the canvas height to 512
                ctx.drawImage(image, 0, 0, 512, 512); // Scale the image to 512x512
                originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            }
            image.src = URL.createObjectURL(file);
        }
    }
    

    function startDrawing(e) {
        drawing = true;
        points.push({ x: e.clientX - canvas.offsetLeft, y: e.clientY - canvas.offsetTop });
    }

    function endDrawing() {
        drawing = false;
        ctx.putImageData(originalImageData, 0, 0);
        makeTransparent();
        points = [];
    }

    function draw(e) {
        if (!drawing) return;
        points.push({ x: e.clientX - canvas.offsetLeft, y: e.clientY - canvas.offsetTop });
        ctx.putImageData(originalImageData, 0, 0);
        ctx.strokeStyle = 'red';
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.stroke();
    }

    function makeTransparent() {
        if (points.length === 0) return;
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let i = 1; i < points.length; i++) {
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.closePath();
        ctx.fill();
        originalImageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'source-over';
    }
});
