import { GoogleGenAI } from "@google/genai";
const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function test() {
    try {
        const response = await genAI.models.generateContent({
            model: 'gemini-3.7-flash',
            contents: [
                {
                    role: "user",
                    parts: [
                        { fileData: { fileUri: "https://www.youtube.com/watch?v=dQw4w9WgXcQ", mimeType: "video/mp4" } },
                        { text: "What happens in this video?" }
                    ]
                }
            ],
            config: {
                processing: "agentic"
            }
        });
        console.log("Success:");
        console.log(response.text);
    } catch (e) {
        console.error("Failed:", e);
    }
}
test();
