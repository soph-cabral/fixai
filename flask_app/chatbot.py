# chatbot.py
import os
import subprocess
from typing import List
from langchain_community.llms import Ollama

# A module-level variable to hold the most recent image analysis
latest_image_analysis = ""

def analyze_image(image_paths: List[str]) -> str:
    """
    prompt here
    """
    valid_images = []
    for path in image_paths:
        if not os.path.exists(path):
            return f"Error: Image not found at {path}"
        valid_images.append(os.path.basename(path))
    
    image_refs = ", ".join([f"./uploads/{fname}" for fname in valid_images])

    # Construct a prompt that instructs Ollama to be a helpful handyman:
    prompt = (
        f"prompt here"
    )
    
    command = [
        "ollama",
        "run",
        "model",
        prompt
    ]
    res = subprocess.run(command, capture_output=True, text=True)
    
    # Save the analysis to a global variable for future context
    global latest_image_analysis
    latest_image_analysis = res.stdout.strip()
    
    # Return the analysis to the caller (Flask route)
    return latest_image_analysis

def process_text(message: str) -> str:
    """
    Respond to user queries about the images, 
    factoring in the previously stored analysis context.
    """
    llm = Ollama(model="minicpm-v")

    # Incorporate the prior image analysis into the prompt
    # so the LLM answers questions in context of the images
    contextual_prompt = (
        f"Based on the previous image analysis:\n"
        f"{latest_image_analysis}\n\n"
        f"User's question: {message}\n"
        "Answer as a helpful handyman, referencing the above analysis."
    )
    
    response = llm(contextual_prompt)
    return response
