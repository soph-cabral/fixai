document.addEventListener("DOMContentLoaded", function() {
    const video = document.getElementById("video");
    const canvas = document.getElementById("canvas");
    const captureBtn = document.getElementById("capture-btn");
    const switchBtn = document.getElementById("switch-btn");
    const imageGrid = document.getElementById("image-grid");
    let currentFacingMode = "environment";
    let stream = null;
    
    // Array to store captured image blobs for submission
    window.capturedImages = [];

    // Initialize camera with the specified facing mode
    async function initCamera() {
        try {
            const constraints = {
                video: { facingMode: currentFacingMode },
                audio: false
            };
            stream = await navigator.mediaDevices.getUserMedia(constraints);
            video.srcObject = stream;
        } catch (error) {
            console.error("Error accessing camera:", error);
        }
    }

    // Start the camera on page load
    initCamera();

    // Switch between front and back cameras
    switchBtn.addEventListener("click", async function() {
        currentFacingMode = currentFacingMode === "environment" ? "user" : "environment";
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
        }
        await initCamera();
    });

    // Capture image from the video feed
    captureBtn.addEventListener("click", function() {
        // Set canvas size to match the video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext("2d");
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Create a data URL for preview
        const dataURL = canvas.toDataURL("image/png");
        
        // Convert canvas to Blob for uploading and store it
        canvas.toBlob(function(blob) {
            // Create a new grid cell and image element for preview
            const cell = document.createElement("div");
            cell.classList.add("grid-cell");
            const img = document.createElement("img");
            img.src = dataURL;
            cell.appendChild(img);
            imageGrid.appendChild(cell);
            
            // Save the captured image blob
            window.capturedImages.push(blob);
            
            // Enable "Analyze Images" button if 4 images have been captured
            if (window.capturedImages.length === 4) {
                document.getElementById("analyze-btn").disabled = false;
            }
        }, "image/png");
    });
});
