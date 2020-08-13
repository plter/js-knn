(function () {

    class KNN {

        constructor() {
            this._SHARED_CANVAS_WIDTH = 20;
            this._SHARED_CANVAS_HEIGHT = 20;

            this._knnLib = [];
        }

        tensorFromImageSource(imageSource) {
            /**
             * @type {HTMLCanvasElement}
             * @private
             */
            let canvas = document.createElement("canvas");
            canvas.width = this._SHARED_CANVAS_WIDTH;
            canvas.height = this._SHARED_CANVAS_HEIGHT;
            /**
             * @type {CanvasRenderingContext2D}
             * @private
             */
            let c2d = canvas.getContext("2d");
            c2d.fillStyle = "#ffffff";
            c2d.fillRect(0, 0, this._SHARED_CANVAS_WIDTH, this._SHARED_CANVAS_HEIGHT);
            c2d.drawImage(imageSource, 0, 0, imageSource.width, imageSource.height, 0, 0, this._SHARED_CANVAS_WIDTH, this._SHARED_CANVAS_HEIGHT);
            let imageData = c2d.getImageData(0, 0, this._SHARED_CANVAS_WIDTH, this._SHARED_CANVAS_HEIGHT);
            let imageTensor = [];
            for (let i = 0; i < imageData.data.length; i += 4) {
                let r = imageData.data[i];
                let g = imageData.data[i + 1];
                let b = imageData.data[i + 2];
                let grayDepth = 255 - Math.round((r + g + b) / 3);
                imageTensor.push(grayDepth);
            }
            return imageTensor;
        }

        fit(imageSource, target) {
            this._knnLib.push([this.tensorFromImageSource(imageSource), target]);
        }

        loadSample(imageUrl, target) {
            return new Promise((resolve) => {
                let img = new Image();
                img.onload = () => {
                    this.fit(img, target);
                    resolve();
                };
                img.src = imageUrl;
            });
        }

        predict(imageSource) {
            let distanceArr = [];
            let imageTensor = this.tensorFromImageSource(imageSource);
            for (let sample of this._knnLib) {
                let sumOfSquares = 0;
                let sampleTensor = sample[0];
                let target = sample[1];
                let length = sampleTensor.length;
                for (let i = 0; i < length; i++) {
                    let dif = sampleTensor[i] - imageTensor[i];
                    sumOfSquares += dif * dif;
                }
                let distance = Math.sqrt(sumOfSquares);
                distanceArr.push([distance, target]);
            }
            distanceArr = distanceArr.sort((a, b) => a[0] - b[0]);
            return distanceArr[0][1];
        }
    }

    window.yunp = window.yunp || {};
    yunp.KNN = KNN;
})();