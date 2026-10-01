import { GoogleGenAI } from "@google/genai";
import fetch from "node-fetch";

async function run() {
    const apiKey = process.env.GEMINI_API_KEY;
    const fileContent = Buffer.from("test");
    const fileSize = fileContent.length;
    
    const initRes = await fetch(`https://generativelanguage.googleapis.com/upload/v1beta/files?key=${apiKey}`, {
        method: 'POST',
        headers: {
            'X-Goog-Upload-Protocol': 'resumable',
            'X-Goog-Upload-Command': 'start',
            'X-Goog-Upload-Header-Content-Length': fileSize.toString(),
            'X-Goog-Upload-Header-Content-Type': "audio/mpeg",
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ file: { display_name: '' } })
    });

    if (!initRes.ok) {
        console.error("Init failed", await initRes.text());
        return;
    }
    console.log("Success");
}
run();
