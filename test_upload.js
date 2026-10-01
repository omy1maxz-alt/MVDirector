import { GoogleGenAI } from "@google/genai";
import fetch from "node-fetch";
import fs from "fs";

async function run() {
    const apiKey = process.env.GEMINI_API_KEY;
    const fileContent = "test audio data".repeat(100);
    const fileSize = Buffer.byteLength(fileContent);
    const mimeType = "audio/mpeg";

    console.log("Starting upload...");
    const initRes = await fetch(`https://generativelanguage.googleapis.com/upload/v1beta/files?key=${apiKey}`, {
        method: 'POST',
        headers: {
            'X-Goog-Upload-Protocol': 'resumable',
            'X-Goog-Upload-Command': 'start',
            'X-Goog-Upload-Header-Content-Length': fileSize.toString(),
            'X-Goog-Upload-Header-Content-Type': mimeType,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ file: { display_name: 'test.mp3' } })
    });

    if (!initRes.ok) {
        console.error("Init failed", await initRes.text());
        return;
    }

    const uploadUri = initRes.headers.get('x-goog-upload-url');
    console.log("Upload URI:", uploadUri);

    // Test sending with multipart/form-data
    const uploadRes = await fetch(uploadUri, {
        method: 'POST',
        headers: {
            'X-Goog-Upload-Protocol': 'resumable',
            'X-Goog-Upload-Command': 'upload, finalize',
            'X-Goog-Upload-Offset': '0',
            'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundary123'
        },
        body: Buffer.from(fileContent)
    });

    if (!uploadRes.ok) {
        console.error("Upload failed", uploadRes.status, await uploadRes.text());
        return;
    }

    const data = await uploadRes.json();
    console.log("Success:", data);
}
run();
