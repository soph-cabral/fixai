document.addEventListener("DOMContentLoaded", function() {
    const analyzeBtn = document.getElementById("analyze-btn");
    const imageGridSection = document.getElementById("image-grid-section");
    const chatSection = document.getElementById("chat-section");
    const chatLog = document.getElementById("chat-log");
    const chatForm = document.getElementById("chat-form");
    const chatInput = document.getElementById("chat-input");

    // When "Analyze Images" is clicked, send all captured images to the backend
    analyzeBtn.addEventListener("click", async function() {
        if (!window.capturedImages || window.capturedImages.length < 4) {
            alert("Please capture 4 images before analyzing.");
            return;
        }
        let formData = new FormData();
        window.capturedImages.forEach((blob, index) => {
            formData.append("images", blob, `capture${index + 1}.png`);
        });
        try {
            const response = await fetch("/upload", {
                method: "POST",
                body: formData
            });
            const data = await response.json();
            appendMessage("Bot (Image Analysis):\n" + data.response);
            // Hide the image grid and show the chat section
            imageGridSection.style.display = "none";
            chatSection.style.display = "block";
        } catch (error) {
            console.error("Error uploading images:", error);
        }
    });

    // Chat functionality: send questions to the /chat endpoint
    chatForm.addEventListener("submit", async function(e) {
        e.preventDefault();
        const message = chatInput.value;
        appendMessage("You: " + message);
        chatInput.value = "";
        try {
            const response = await fetch("/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message })
            });
            const data = await response.json();
            appendMessage("Bot: " + data.response);
        } catch (error) {
            appendMessage("Error: Unable to reach server.");
        }
    });

    function appendMessage(message) {
        const p = document.createElement("p");
        p.textContent = message;
        chatLog.appendChild(p);
        chatLog.scrollTop = chatLog.scrollHeight;
    }
});
