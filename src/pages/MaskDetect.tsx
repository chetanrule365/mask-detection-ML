import React, { useEffect } from "react";
import * as tmImage from "@teachablemachine/image";
function MaskDetect() {
    let tm_model: tmImage.CustomMobileNet;
    const effect = async () => {
        const URL = "https://teachablemachine.withgoogle.com/models/32pEiF4Id/";
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        await tmImage.load(modelURL, metadataURL).then(async (model) => {
            console.log("model loaded");

            tm_model = model;

            const webcam = new tmImage.Webcam(200, 200, true); // width, height, flip
            await webcam.setup(); // request access to the webcam
            await webcam.play();
            loop();
            const webcam_con = document.getElementById("webcam-con");
            if (webcam_con) webcam_con.appendChild(webcam.canvas);
            async function loop() {
                webcam.update(); // update the webcam frame
                await predict();
                window.requestAnimationFrame(loop);
            }

            const maxPredictions = model.getTotalClasses();
            for (let i = 0; i < maxPredictions; i++) {
                const label_con = document.getElementById("label-con");
                if (label_con)
                    label_con.appendChild(document.createElement("p"));
            }
            async function predict() {
                // predict can take in an image, video or canvas html element
                const prediction = await model.predict(webcam.canvas);
                for (let i = 0; i < maxPredictions; i++) {
                    const classPrediction =
                        prediction[i].className +
                        ": " +
                        prediction[i].probability.toFixed(2);
                    const label_con = document.getElementById("label-con");
                    if (label_con)
                        label_con.childNodes[i].textContent = classPrediction;
                }
            }
        });
    };
    useEffect(() => {
        effect();
    }, []);
    return (
        <div>
            <div id='webcam-con'></div>
            <div id='label-con'></div>
        </div>
    );
}

export default MaskDetect;
