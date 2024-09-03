// const text = [...document.querySelectorAll(".menu-item")];

// text.forEach((item) => {
//   let word = item.children[0].children[0].innerText.split("");
//   item.children[0].innerHTML = "";
//   word.forEach((letter, index) => {
//     item.children[0].innerHTML += `<span style="--index: ${index};">${letter}</span>`;
//   });

//   let cloneDiv = item.children[0].cloneNode(true);
//   cloneDiv.style.position = "absolute";
//   cloneDiv.style.left = "0";
//   cloneDiv.style.top = "0";
//   cloneDiv.style.pointerEvents = "none";
//   item.appendChild(cloneDiv);
// });

// import * as face from "face-api.js";

// class App {
//   constructor() {
//     this.modelsLoaded = false;
//     this.getVideoStream();
//     this.getVideoStreamImage();
//     this.getImageOnPageReload();
//     this.loadModels();

//     this.image = document.getElementById("displayImage");
//     this.image.onload = () => {
//       if (this.modelsLoaded) {
//         this.loadModels();
//       }
//     };

//     console.log(face);
//   }

//   getVideoStream() {
//     // Access webcam
//     if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//       navigator.mediaDevices
//         .getUserMedia({ video: true, audio: false })
//         .then((stream) => {
//           document.getElementById("video").srcObject = stream;
//         });
//     }
//   }

//   getVideoStreamImage() {
//     // Capture image and store in local storage
//     document.getElementById("capture").addEventListener("click", () => {
//       const canvas = document.getElementById("canvas");
//       const video = document.getElementById("video");
//       const context = canvas.getContext("2d");

//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;
//       context.drawImage(video, 0, 0, canvas.width, canvas.height);

//       const imgData = canvas.toDataURL("image/png");
//       localStorage.setItem("savedImage", imgData);
//       document.getElementById("displayImage").src = imgData;
//     });
//   }

//   getImageOnPageReload() {
//     // Load image on page reload
//     window.onload = function () {
//
//     };
//   }
//   async loadModels() {
//     await Promise.all([
//       face.nets.ssdMobilenetv1.loadFromUri("/models"),
//       face.nets.faceLandmark68Net.loadFromUri("/models"),
//       face.nets.faceRecognitionNet.loadFromUri("/models"),
//       face.nets.ageGenderNet.loadFromUri("/models"),
//     ]);

//     this.faceAIData = await face.detectAllFaces(this.image).withFaceLandmarks();
//     console.log(this.faceAIData);
//     console.log(this.image);
//   }
// }

// new App();

import * as face from "face-api.js";

const run = async (image) => {
  try {
    // Load all necessary models, including FaceExpressionNet
    await Promise.all([
      face.nets.ssdMobilenetv1.loadFromUri("/models"),
      face.nets.faceLandmark68Net.loadFromUri("/models"),
      face.nets.faceRecognitionNet.loadFromUri("/models"),
      face.nets.ageGenderNet.loadFromUri("/models"),
      face.nets.faceExpressionNet.loadFromUri("/models"), // Added this line
    ]);

    console.log("Models loaded successfully.");

    const faceOne = document.getElementById("image");

    // guard clause
    if (!faceOne || !faceOne.complete || faceOne.naturalWidth === 0) return;
    // console.error("Image is not loaded or has no dimensions.");

    // Run face detection with landmarks, descriptors, age, gender, and expressions
    let faceData = await face
      .detectAllFaces(faceOne)
      .withFaceLandmarks()
      .withFaceDescriptors()
      .withAgeAndGender()
      .withFaceExpressions();

    console.log("Face detection data:", faceData);

    // Prepare the canvas to draw detection results
    const canvas = document.getElementById("boundingBox");
    if (canvas) {
      canvas.style.position = "absolute";
      canvas.style.left = `${image.offsetLeft}px`;
      canvas.style.top = `${image.offsetTop}px`;
      canvas.height = image.naturalHeight;
      canvas.width = image.naturalWidth;

      // Draw the detected face data on the canvas
      face.draw.drawDetections(canvas, faceData);
      face.draw.drawFaceLandmarks(canvas, faceData);
      face.draw.drawFaceExpressions(canvas, faceData);

      // Draw age and gender text
      faceAIData.forEach((faceData) => {
        const { age, gender, genderProbability } = faceData;
        const ageText = `${gender} - ${genderProbability.toFixed(
          2
        )} (${Math.round(age)} years)`;

        // Check if DrawTextField is correctly initialized
        if (face.draw.DrawTextField) {
          const textField = new face.draw.DrawTextField(
            [ageText],
            faceData.detection.box.topRight
          );
          textField.draw(canvas);
        }
      });
    }
  } catch (error) {
    console.error("Error during face detection:", error);
  }
};

const videoFeed = async () => {
  //get access to the video stream and display video stream
  const video = document.getElementById("video");

  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true }).then((mediaStream) => {
      video.srcObject = mediaStream;
    });
  }

  //capture video stream image
  document.getElementById("capture").addEventListener("click", () => {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imgData = canvas.toDataURL("image/png");
    localStorage.setItem("savedImage", imgData); //store the image in local storage
    document.getElementById("displayImage").src = imgData;
  });

  const savedImage = localStorage.getItem("savedImage");
  if (savedImage) {
    document.getElementById("displayImage").src = savedImage;
  }
  run(savedImage);
};

videoFeed();

// class App {
//   constructor() {
//     // this.modelsLoaded = false;
//     // this.getVideoStream();
//     this.getVideoStreamImage();
//     this.getImageOnPageReload();
//     this.loadModels();

//     this.image = document.getElementById("displayImage");
//     this.canvas = document.getElementById("boundingBox");
//   }

//   getVideoStream() {
//     if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//       navigator.mediaDevices
//         .getUserMedia({ video: true, audio: false })
//         .then((stream) => {
//           document.getElementById("video").srcObject = stream;
//         })
//         .catch((err) => {
//           console.error("Error accessing webcam:", err);
//         });
//     } else {
//       console.error("getUserMedia not supported in this browser.");
//     }
//   }

//   getVideoStreamImage() {
//     document.getElementById("capture").addEventListener("click", () => {
//       const canvas = document.getElementById("canvas");
//       const video = document.getElementById("video");
//       const context = canvas.getContext("2d");

//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;
//       context.drawImage(video, 0, 0, canvas.width, canvas.height);

//       const imgData = canvas.toDataURL("image/png");
//       localStorage.setItem("savedImage", imgData);
//       document.getElementById("displayImage").src = imgData;
//     });
//   }

//   getImageOnPageReload() {
//     window.onload = () => {
//       const savedImage = localStorage.getItem("savedImage");
//       if (savedImage) {
//         console.log("Loading saved image from local storage.");
//         document.getElementById("displayImage").src = savedImage;
//       }
//     };
//   }

//   async loadModels() {
//     try {
//       await Promise.all([
//         face.nets.ssdMobilenetv1.loadFromUri("/models"),
//         face.nets.faceLandmark68Net.loadFromUri("/models"),
//         face.nets.faceRecognitionNet.loadFromUri("/models"),
//         face.nets.ageGenderNet.loadFromUri("/models"),
//       ]);
//       // this.modelsLoaded = true;
//       console.log("Models loaded successfully.");
//       this.detectFaces();
//     } catch (error) {
//       console.error("Error loading models:", error);
//     }
//   }

//   async detectFaces() {
//     console.log("Starting face detection...");

//     if (!this.image.complete || this.image.naturalWidth === 0) {
//       console.error("Image is not loaded or has no dimensions.");
//       return;
//     }

//     try {
//       this.faceAIData = await face
//         .detectAllFaces(this.image)
//         .withFaceLandmarks()
//         .withFaceDescriptors()
//         .withAgeAndGender();
//       console.log("Face detection data:", this.faceAIData);
//       // Set canvas dimensions and position it over the image

//       console.log(this.canvas);
//       this.canvas.style.position = "absolute";
//       this.canvas.style.left = `${this.image.offsetLeft}px`;
//       this.canvas.style.top = `${this.image.offsetTop}px`;
//       this.canvas.height = this.image.naturalHeight;
//       this.canvas.width = this.image.naturalWidth;

//       face.draw.drawDetections(this.canvas, this.faceAIData);
//     } catch (error) {
//       console.error("Error during face detection:", error);
//     }
//   }
// }

// new App();
