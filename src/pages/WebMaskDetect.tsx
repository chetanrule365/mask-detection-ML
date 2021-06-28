import React, { useEffect } from "react";
import * as tmImage from "@teachablemachine/image";
const baseHost = "http://192.168.43.87";
function WebMaskDetect() {
    const effect = async () => {
        let tm_model: tmImage.CustomMobileNet;
        const tmURL = "https://teachablemachine.withgoogle.com/models/32pEiF4Id/";
        const modelURL = tmURL + "model.json";
        const metadataURL = tmURL + "metadata.json";
        await tmImage.load(modelURL, metadataURL).then(async (model) => {
            console.log("model loaded");
            tm_model = model;

            const maxPredictions = model.getTotalClasses();

            // Convenience function to setup a webcam
            const flip = true; // whether to flip the webcam
            const webcam = new tmImage.Webcam(200, 200, flip); // width, height, flip
            await webcam.setup(); // request access to the webcam
            await webcam.play();
            window.requestAnimationFrame(loop);

            // append elements to the DOM
            const web_con = document.getElementById("web-cam");
            if (web_con) web_con.appendChild(webcam.canvas);

            const labelContainer = document.getElementById("label-con");
            for (let i = 0; i < maxPredictions; i++) {
                // and class labels
                if (labelContainer) labelContainer.appendChild(document.createElement("div"));
            }

            async function loop() {
                webcam.update(); // update the webcam frame
                await predict();
                window.requestAnimationFrame(loop);
            }

            // run the webcam image through the image model
            async function predict() {
                // predict can take in an image, video or canvas html element
                const prediction = await model.predict(webcam.canvas);
                for (let i = 0; i < maxPredictions; i++) {
                    const classPrediction = prediction[i].className + ": " + prediction[i].probability.toFixed(2);
                    if (labelContainer) labelContainer.childNodes[i].textContent = classPrediction;
                }
            }
        });
    };
    useEffect(() => {
        effect();
    }, []);

    return (
        <div className="content">
            <div className="mask-detect-con">
                <div className="header">
                    <div>
                        <h3>Mask Detection</h3>
                    </div>
                </div>
                <div className="stream">
                    <div id="web-cam" style={{}}></div>
                    <div id="label-con"></div>
                </div>
            </div>
        </div>
    );
}

export default WebMaskDetect;
