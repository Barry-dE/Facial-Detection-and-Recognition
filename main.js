import * as face from "face-api.js";

const run = async (image) => {
  try {
    await Promise.all([
      face.nets.ssdMobilenetv1.loadFromUri("/models"),
      face.nets.faceLandmark68Net.loadFromUri("/models"),
      face.nets.faceRecognitionNet.loadFromUri("/models"),
      face.nets.ageGenderNet.loadFromUri("/models"),
      face.nets.faceExpressionNet.loadFromUri("/models"),
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
