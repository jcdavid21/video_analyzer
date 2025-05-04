import os
import logging
import sys
import json
import cv2
import numpy as np
from sklearn.cluster import KMeans
from pydub import AudioSegment
import whisper
import google.generativeai as genai
from deep_translator import GoogleTranslator
from deepface import DeepFace

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Suppress unnecessary logs
os.environ["GLOG_minloglevel"] = "2"
os.environ["TF_CPP_MIN_LOG_LEVEL"] = "2"
os.environ["GRPC_VERBOSITY"] = "NONE"

# Set your Gemini API key
genai.configure(api_key="AIzaSyDliYbJHopLp2GPRA8NS5eVwMRQGVu6SJY")


def extract_audio_from_video(video_path, audio_output_path="audio.wav"):
    """Extract audio from a video file using pydub and ffmpeg."""
    try:
        audio = AudioSegment.from_file(video_path)
        audio.export(audio_output_path, format="wav")
        logging.info(f"Audio extracted and saved to {audio_output_path}")
        return audio_output_path
    except Exception as e:
        logging.error(f"Error extracting audio: {e}")
        raise
    

def transcribe_audio(audio_path):
    """Transcribe audio to text using OpenAI's Whisper."""
    try:
        device = "cpu"
        model = whisper.load_model("base").to(device)
        result = model.transcribe(audio_path, fp16=False)
        if not result["text"].strip():
            raise ValueError("Whisper transcription failed or returned empty text")
        logging.info("Audio transcription completed successfully")
        return result["text"]
    except Exception as e:
        logging.error(f"Error transcribing audio: {e}")
        raise

def translate_text(text, target_language="en"):
    """Translate text to the target language using Google Translate."""
    try:
        translation = GoogleTranslator(source='auto', target=target_language).translate(text)
        logging.info(f"Text translated to {target_language}")
        return translation
    except Exception as e:
        logging.error(f"Error translating text: {e}")
        raise

def extract_dominant_colors(video_path, num_colors=5, frame_interval=10):
    """Extract dominant colors from a video."""
    try:
        cap = cv2.VideoCapture(video_path)
        frames = []
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            if len(frames) % frame_interval != 0:
                continue
            frame = cv2.resize(frame, (100, 100))
            frames.append(frame)
        cap.release()
        all_pixels = np.vstack([frame.reshape(-1, 3) for frame in frames])
        kmeans = KMeans(n_clusters=num_colors)
        kmeans.fit(all_pixels)
        dominant_colors = kmeans.cluster_centers_.astype(int)
        logging.info("Dominant colors extracted successfully")
        return dominant_colors
    except Exception as e:
        logging.error(f"Error extracting dominant colors: {e}")
        raise

def calculate_brightness_and_contrast(video_path, frame_interval=10):
    """Calculate brightness and contrast of video frames."""
    try:
        cap = cv2.VideoCapture(video_path)
        brightness_values = []
        contrast_values = []
        frame_count = 0

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            frame_count += 1

            # Process every nth frame
            if frame_count % frame_interval != 0:
                continue

            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            brightness = np.mean(gray)
            contrast = np.std(gray)
            brightness_values.append(brightness)
            contrast_values.append(contrast)

        cap.release()

        avg_brightness = np.mean(brightness_values) if brightness_values else 0
        avg_contrast = np.mean(contrast_values) if contrast_values else 0
        logging.info("Brightness and contrast calculated successfully")
        return avg_brightness, avg_contrast
    except Exception as e:
        logging.error(f"Error calculating brightness and contrast: {e}")
        raise

def detect_motion_intensity(video_path, frame_interval=10):
    """Detect motion intensity in a video."""
    try:
        cap = cv2.VideoCapture(video_path)
        prev_frame = None
        motion_intensities = []
        frame_count = 0

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            frame_count += 1

            # Process every nth frame
            if frame_count % frame_interval != 0:
                continue

            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            if prev_frame is not None:
                frame_diff = cv2.absdiff(prev_frame, gray)
                motion_intensity = np.mean(frame_diff)
                motion_intensities.append(motion_intensity)
            prev_frame = gray

        cap.release()
        avg_motion_intensity = np.mean(motion_intensities) if motion_intensities else 0
        logging.info("Motion intensity calculated successfully")
        return avg_motion_intensity
    except Exception as e:
        logging.error(f"Error detecting motion intensity: {e}")
        raise

def detect_scene_changes(video_path, threshold=30.0, frame_interval=10):
    """Detect scene changes in a video."""
    try:
        cap = cv2.VideoCapture(video_path)
        prev_frame = None
        scene_changes = 0
        frame_count = 0

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            frame_count += 1

            # Process every nth frame
            if frame_count % frame_interval != 0:
                continue

            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
            if prev_frame is not None:
                frame_diff = cv2.absdiff(prev_frame, gray)
                diff_score = np.mean(frame_diff)
                if diff_score > threshold:
                    scene_changes += 1
            prev_frame = gray

        cap.release()
        logging.info("Scene changes detected successfully")
        return scene_changes
    except Exception as e:
        logging.error(f"Error detecting scene changes: {e}")
        raise

def detect_emotions(video_path, frame_interval=10):
    """Detect emotions of people in a video."""
    try:
        cap = cv2.VideoCapture(video_path)
        emotions = []
        frame_count = 0

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break
            frame_count += 1

            # Process every nth frame
            if frame_count % frame_interval != 0:
                continue

            # Detect faces and emotions
            results = DeepFace.analyze(frame, actions=["emotion"], enforce_detection=False)
            for result in results:
                emotions.append(result["dominant_emotion"])

        cap.release()

        # Count the frequency of each emotion
        emotion_counts = {}
        for emotion in emotions:
            emotion_counts[emotion] = emotion_counts.get(emotion, 0) + 1

        logging.info("Emotions detected successfully")
        return emotion_counts
    except Exception as e:
        logging.error(f"Error detecting emotions: {e}")
        raise

def analyze_video(video_path):
    """Analyze video for visual elements and emotions."""
    try:
        dominant_colors = extract_dominant_colors(video_path)
        brightness, contrast = calculate_brightness_and_contrast(video_path)
        motion_intensity = detect_motion_intensity(video_path)
        scene_changes = detect_scene_changes(video_path)
        emotions = detect_emotions(video_path)

        return {
            "dominant_colors": dominant_colors.tolist(),
            "brightness": brightness,
            "contrast": contrast,
            "motion_intensity": motion_intensity,
            "scene_changes": scene_changes,
            "emotions": emotions
        }
    except Exception as e:
        logging.error(f"Error analyzing video: {e}")
        return {"error": str(e)}

def generate_summary(transcript, visual_analysis):
    """Generate a summary using Gemini, incorporating visual and emotion analysis."""
    model = genai.GenerativeModel("gemini-2.0-flash")
    
    prompt = (
        f"Analyze the following video content. Provide a concise easy-to-understand summary. Focus on the key message, emotional tone, and visual impact. Use clear, simple language and perfect grammar. The response should be human-readable. Ignore the unclear text from the transcript \n\n"
        f"**Transcript:**\n{transcript}\n\n"
        f"**Visual Analysis:**\n"
        f"- Dominant Colors: {visual_analysis['dominant_colors']}\n"
        f"- Brightness: {visual_analysis['brightness']:.2f}\n"
        f"- Contrast: {visual_analysis['contrast']:.2f}\n"
        f"- Motion Intensity: {visual_analysis['motion_intensity']:.2f}\n"
        f"- Scene Changes: {visual_analysis['scene_changes']}\n"
        f"- Emotions: {visual_analysis['emotions']}\n\n"
        f"Provide a detailed analysis in the following structure:\n"
        f"1. **Summary:** A concise summary of the video content.\n"
        f"2. **Impact on Audience:** How the video influences the audience based on its content, visuals, and emotions.\n"
        f"3. **Advertisement Effectiveness:** Based on summary and Impact on Audience, Assess if it's good advertisement or bad.\n"
        f"4. **Visual Appeal:** Analyze the visual elements (colors, brightness, contrast, motion, and scene changes) and their impact.\n"
        f"5. **Emotional Tone:** Analyze the emotions detected in the video and their impact on the audience.\n"
        f"6. **Overall Assessment:** Summarize the video's strengths and weaknesses.\n"
        f"7. **Viewer Emotions:** Estimate the possible emotions of the viewers (Happy, Sad, Excited, Neutral) based primarily on the visual analysis (colors, brightness, contrast, motion, scene changes) and secondarily on the transcript. Provide a brief reason for each emotion, focusing on how the visuals contribute to these emotions.\n\n"
        f"Return the response strictly in JSON format with the following structure:\n"
        f'{{'
        f'"transcript": {{"title": "Transcript", "content": "{transcript}"}}, '
        f'"summary": {{"title": "Summary", "content": "A concise summary of the video."}}, '
        f'"impact": {{"title": "Impact on Audience", "content": "Analyze how the video influences the audience."}}, '
        f'"advertisement_effectiveness": {{"title": "Advertisement Effectiveness", "content": "Assess the effectiveness of the video as an advertisement."}}, '
        f'"visual_appeal": {{"title": "Visual Appeal", "content": "Analyze the visual elements and their impact."}}, '
        f'"emotional_tone": {{"title": "Emotional Tone", "content": "Analyze the emotions detected in the video."}}, '
        f'"overall_assessment": {{"title": "Overall Assessment", "content": "Summarize the video\'s strengths and weaknesses."}}, '
        f'"viewer_emotions": {{"title": "Viewer Emotions", "content": {{"Happy": "X%", "Sad": "Y%", "Excited": "Z%", "Neutral": "W%"}}, "reason": {{"Happy": "Reason for happiness based on visuals.", "Sad": "Reason for sadness based on visuals.", "Excited": "Reason for excitement based on visuals.", "Neutral": "Reason for neutrality based on visuals."}}}}'
        f'}}'
    )
    
    try:
        response = model.generate_content(prompt)
        json_text = response.text.strip().replace("```json", "").replace("```", "").strip()
        json_response = json.loads(json_text)
        logging.info("Summary generated successfully")
        return json_response
    except json.JSONDecodeError as e:
        logging.error(f"Failed to parse JSON response. Raw response: {response.text}")
        return {"error": "Failed to parse Gemini response", "raw": response.text}
    except Exception as e:
        logging.error(f"Error generating summary: {e}")
        return {"error": str(e)}

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python_script.py <video_path>")
        sys.exit(1)

    video_path = sys.argv[1]

    try:
        # Step 1: Extract audio from the video
        audio_path = extract_audio_from_video(video_path)

        # Step 2: Transcribe the audio to text
        transcript = transcribe_audio(audio_path)

        # Step 3: Translate the transcript to English (if needed)
        translated_transcript = translate_text(transcript, target_language="en")

        # Step 4: Analyze visual elements and emotions
        visual_analysis = analyze_video(video_path)

        # Step 5: Generate a summary incorporating visual and emotion analysis
        summary = generate_summary(translated_transcript, visual_analysis)

        # Combine all results into a single JSON
        output_json = {
            "transcript": transcript,
            "translated_transcript": translated_transcript,
            "visual_analysis": visual_analysis,
            "summary": summary
        }
        print(json.dumps(output_json, ensure_ascii=False, indent=4))

    except Exception as e:
        error_response = {"error": str(e)}
        print(json.dumps(error_response, indent=4))