import google.generativeai as genai

genai.configure(api_key="AIzaSyC685yAUJvIsQFIC7lPwGWXTHiRx0Y_UTc")  # Replace with your actual key

def generate_rights_summary(transcript: str) -> str:
    prompt = (
        f"Summarize this police-civilian interaction:\n{transcript}\n\n"
        "What constitutional rights should the civilian be reminded of in under 100 words?"
    )
    try:
        response = genai.generate_content(prompt, model="models/gemini-pro")
        return response.text.strip()
    except Exception as e:
        print("Gemini error:", e)
        return "You have the right to remain silent and to record public officials during their duties."
