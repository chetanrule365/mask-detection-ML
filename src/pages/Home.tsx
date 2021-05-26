import {
    IonContent,
    IonHeader,
    IonImg,
    IonPage,
    IonTitle,
    IonToolbar,
} from "@ionic/react";
import "@tensorflow/tfjs-backend-cpu";
import "@tensorflow/tfjs-backend-webgl";
import * as cocoSsd from "@tensorflow-models/coco-ssd";
import * as mobilenet from "@tensorflow-models/mobilenet";
import * as posenet from "@tensorflow-models/posenet";
import * as tf from "@tensorflow/tfjs";
import * as knnClassifier from "@tensorflow-models/knn-classifier";
import { useEffect } from "react";
const Home: React.FC = () => {
    const detectObjects = async (img: any) => {
        console.log("model loading");
        await cocoSsd.load().then(async (model) => {
            console.log("model loaded");
            const predictions = await model.detect(img);
            console.log(predictions);
            for (let i = 0; i < predictions.length; i++) {
                let rect = document.createElement("div");
                let label = document.createElement("p");
                rect.style.position = "absolute";
                rect.style.left = `${predictions[i].bbox[0]}px`;
                rect.style.top = `${predictions[i].bbox[1]}px`;
                rect.style.width = `${predictions[i].bbox[2]}px`;
                rect.style.height = `${predictions[i].bbox[3]}px`;
                rect.style.border = "2px solid red";
                label.style.position = "absolute";
                label.style.left = `${predictions[i].bbox[0]}px`;
                label.style.top = `${predictions[i].bbox[1]}px`;
                label.innerText = `${predictions[i].class}`;
                label.style.color = "red";
                document.getElementById("layer")?.appendChild(rect);
                document.getElementById("layer")?.appendChild(label);
            }
        });
    };
    const classify = async (img: any) => {
        const net = await mobilenet.load();
        const result = await net.classify(img);
        console.log(result);
    };
    const detectPose = async (img: any) => {
        await posenet.load().then(async (net) => {
            const pose = await net.estimateSinglePose(img);
            console.log(pose);
            for (let i = 0; i < pose.keypoints.length; i++) {
                let rect = document.createElement("div");
                rect.style.position = "absolute";
                rect.style.left = `${pose.keypoints[i].position.x}px`;
                rect.style.top = `${pose.keypoints[i].position.y}px`;
                rect.style.width = "10px";
                rect.style.height = "10px";
                rect.style.borderRadius = "50%";
                rect.style.background = "blue";
                document.getElementById("layer")?.appendChild(rect);
            }
        });
    };
    useEffect(() => {
        const img = document.getElementById("img");
        const layer = document.getElementById("layer");
        if (layer) layer.innerHTML = "";
        detectObjects(img);
    }, []);
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Blank</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent id='content'>
                <img
                    id='img'
                    src={`${process.env.PUBLIC_URL}/assets/img.jpg`}
                    alt=''
                />
                {/* <video
                    id='webcam'
                    autoPlay
                    playsInline
                    muted
                    width='224'
                    height='224'></video> */}
                {/* <button>Add example</button> */}
                <div
                    id='layer'
                    style={{
                        position: "absolute",
                        width: "100vw",
                        height: "100vh",
                        top: "0",
                        left: "0",
                    }}></div>
            </IonContent>
        </IonPage>
    );
};

export default Home;
