(function () {

    let canvas = document.querySelector("canvas");
    let statusDiv = document.querySelector("#status");
    let content = document.querySelector("#content");
    let resultDiv = document.querySelector("#result");
    let knn = new yunp.KNN();

    /**
     *
     * @type {CanvasRenderingContext2D | null}
     */
    let context2d = canvas.getContext("2d");

    function canvas_mouseMoveHandler(e) {
        context2d.lineTo(e.x, e.y);
        context2d.stroke();
    }

    function canvas_mouseUpHandler() {
        canvas.onmousemove = null;
        canvas.onmouseup = null;
    }

    function canvas_mouseDownHandler(e) {
        canvas.onmousemove = canvas_mouseMoveHandler;
        canvas.onmouseup = canvas_mouseUpHandler;

        context2d.beginPath();
        context2d.lineWidth = 20;
        context2d.lineCap = "round";
        context2d.lineJoin = "round";
        context2d.moveTo(e.x, e.y);
    }

    function clearCanvas() {
        context2d.clearRect(0, 0, canvas.width, canvas.height);
    }

    function recognizeNumber() {
        resultDiv.innerHTML = `识别结果：${knn.predict(canvas)}`;
    }

    function addListeners() {
        canvas.onmousedown = canvas_mouseDownHandler;
        document.querySelector("#btn-clear").onclick = clearCanvas;
        document.querySelector("#btn-recognize").onclick = recognizeNumber;
    }

    async function main() {
        statusDiv.innerHTML = "正在加载样本...";
        for (let i = 0; i < 10; i++) {
            for (let j = 1; j <= 10; j++) {
                let url = `num_images/${i}-${(j < 10 ? "0" : "")}${j}.png`;
                await knn.loadSample(url, i);
            }
        }
        statusDiv.innerHTML = "";
        content.style.display = "block";
        addListeners();
    }

    main();
})();