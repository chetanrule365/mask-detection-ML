import React, { useEffect, useState } from "react";
import * as tmImage from "@teachablemachine/image";
import { Slider, Switch, IconButton } from "@material-ui/core";
import { Settings, Close } from "@material-ui/icons";
const baseHost = "http://192.168.43.87";
function MaskDetect() {
    const [vFlipChecked, setvFlipChecked] = useState(false);
    const [hFlipChecked, sethFlipChecked] = useState(false);
    const effect = async () => {
        var tm_model: tmImage.CustomMobileNet;
        const tmURL = "https://teachablemachine.withgoogle.com/models/32pEiF4Id/";
        const modelURL = tmURL + "model.json";
        const metadataURL = tmURL + "metadata.json";
        await tmImage.load(modelURL, metadataURL).then(async (model) => {
            console.log("model loaded");
            tm_model = model;

            const cnvs = document.querySelector("canvas");
            const ctx = cnvs?.getContext("2d");

            const maxPredictions = model.getTotalClasses();
            let labelContainer = document.getElementById("label-con");
            for (let i = 0; i < maxPredictions; i++) {
                // and class labels
                if (labelContainer) labelContainer.appendChild(document.createElement("div"));
            }

            const onFrame = () => {
                const frame = new Image();
                frame.src = `${baseHost}:81/stream`;
                frame.crossOrigin = "Anonymous";
                frame.onload = async () => {
                    ctx?.clearRect(0, 0, Number(cnvs?.width), Number(cnvs?.height));
                    ctx?.drawImage(frame, 0, 0);
                };
                window.requestAnimationFrame(onFrame);
            };
            onFrame();

            const predict = () => {
                const capture = new Image();
                capture.crossOrigin = "Anonymous";
                cnvs?.toBlob((blob) => {
                    let url = URL.createObjectURL(blob);
                    capture.src = url;
                    capture.onload = async () => {
                        await model.predict(capture).then((prediction) => {
                            for (let i = 0; i < maxPredictions; i++) {
                                const classPrediction =
                                    prediction[i].className + ": " + prediction[i].probability.toFixed(2);
                                if (labelContainer) labelContainer.childNodes[i].textContent = classPrediction;
                            }
                        });
                    };
                });
                window.requestAnimationFrame(predict);
            };
            predict();
        });
    };
    useEffect(() => {
        fetch(`${baseHost}/control?var=framesize&val=6`);
        effect();
    }, []);

    const slider_onChange_handler = (tag: string, val: number | number[]) => {
        const set_loader = document.getElementById("settings-loader");

        if (set_loader) set_loader.style.visibility = "visible";
        const query = `${baseHost}/control?var=${tag}&val=${val}`;
        fetch(query)
            .then((response) => {
                console.log(`request to ${query} finished, status: ${response.status}`);
            })
            .finally(() => {
                if (set_loader) set_loader.style.visibility = "hidden";
            });
    };
    const switch_handler = (tag: string, val: number) => {
        const set_loader = document.getElementById("settings-loader");

        if (set_loader) set_loader.style.visibility = "visible";
        const query = `${baseHost}/control?var=${tag}&val=${val}`;
        fetch(query)
            .then((response) => {
                console.log(`request to ${query} finished, status: ${response.status}`);
            })
            .finally(() => {
                if (set_loader) set_loader.style.visibility = "hidden";
            });
    };

    return (
        <div className="content">
            <div className="mask-detect-con">
                <div className="header">
                    <div>
                        <h3>Mask Detection</h3>
                    </div>
                    <IconButton
                        onClick={() => {
                            const set_hed = document.getElementById("settings");
                            if (set_hed) set_hed.classList.toggle("active");
                        }}
                    >
                        <Settings />
                    </IconButton>
                </div>
                <div className="stream">
                    <canvas width={640} height={480}></canvas>
                    <div id="label-con"></div>
                </div>

                <div id="settings">
                    <div id="settings-loader"></div>
                    <div className="settings-con">
                        <div className="settings-header">
                            <div></div>
                            <IconButton
                                onClick={() => {
                                    const set_hed = document.getElementById("settings");
                                    if (set_hed) set_hed.classList.toggle("active");
                                }}
                            >
                                <Close />
                            </IconButton>
                        </div>
                        <div className="VFlip switch">
                            <p>H-Mirror</p>
                            <Switch
                                checked={hFlipChecked}
                                onChange={(e) => {
                                    sethFlipChecked(e.target.checked);
                                    switch_handler("hmirror", e.target.checked ? 1 : 0);
                                }}
                                color="primary"
                            />
                        </div>
                        <div className="VFlip switch">
                            <p>V-Flip</p>
                            <Switch
                                checked={vFlipChecked}
                                onChange={(e) => {
                                    setvFlipChecked(e.target.checked);
                                    switch_handler("vflip", e.target.checked ? 1 : 0);
                                }}
                                color="primary"
                            />
                        </div>
                        <div className="brightness">
                            <p>Quality</p>
                            <Slider
                                defaultValue={10}
                                aria-labelledby="brightness-slider"
                                valueLabelDisplay="auto"
                                min={10}
                                max={63}
                                onChange={(e, val) => slider_onChange_handler("quality", val)}
                            />
                        </div>
                        <div className="brightness">
                            <p>Brightness</p>
                            <Slider
                                defaultValue={0}
                                aria-labelledby="brightness-slider"
                                valueLabelDisplay="auto"
                                step={1}
                                marks
                                min={-2}
                                max={2}
                                onChange={(e, val) => slider_onChange_handler("brightness", val)}
                            />
                        </div>
                        <div className="brightness">
                            <p>Contrast</p>
                            <Slider
                                defaultValue={0}
                                aria-labelledby="brightness-slider"
                                valueLabelDisplay="auto"
                                step={1}
                                marks
                                min={-2}
                                max={2}
                                onChange={(e, val) => slider_onChange_handler("contrast", val)}
                            />
                        </div>
                        <div className="brightness">
                            <p>Saturation</p>
                            <Slider
                                defaultValue={0}
                                aria-labelledby="brightness-slider"
                                valueLabelDisplay="auto"
                                step={1}
                                marks
                                min={-2}
                                max={2}
                                onChange={(e, val) => slider_onChange_handler("saturation", val)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MaskDetect;
