const form = document.querySelector('#fileForm');
const canvas = document.querySelector('#imageShow');
const resultTag = document.querySelector('#result');
form.addEventListener('submit', async(e) => {
    e.preventDefault();
    
    const model = await tf.loadLayersModel("model_js/model.json");
    const labels = ["hombre", "mujer"]


    const img = new Image();
    try {
        img.src = URL.createObjectURL(form.fileInput.files[0]);
    } catch (err) {
        console.log(err);
        resultTag.innerHTML = "Error al cargar la imagen"
        return
    }
    img.onload = () => {
        const pixels = tf.browser.fromPixels(img);
        const resized = tf.image.resizeBilinear(pixels, [224, 224]).toFloat();
        const reshape = tf.reshape(resized, [1, 224, 224, 3]);
        const prediction = model.predict(reshape);
        let result = prediction.argMax(1).dataSync()[0]
        result = labels[result]
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, 224, 224);

        resultTag.textContent = result
    }

})