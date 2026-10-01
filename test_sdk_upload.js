import { GoogleGenAI } from "@google/genai";
async function run() {
    const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});
    const blob = new Blob(["test"], {type: "text/plain"});
    try {
        const res = await ai.files.upload({
            file: blob, // Let's see if this works
            mimeType: "text/plain"
        });
        console.log("Success", res);
    } catch(e) {
        console.error("Error", e);
    }
}
run();
