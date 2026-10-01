import { GoogleGenAI } from "@google/genai";
import fetch from "node-fetch";
import fs from "fs";

async function run() {
    const apiKey = process.env.GEMINI_API_KEY;
    // 16 MB
    const fileContent = Buffer.alloc(16 * 1024 * 1024, 'a');
    const fileSize = fileContent.length;
    const mimeType = "audio/mpeg";

    console.log("Starting upload...", fileSize);
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

    const uploadRes = await fetch(uploadUri, {
        method: 'POST',
        headers: {
            'X-Goog-Upload-Protocol': 'resumable',
            'X-Goog-Upload-Command': 'upload, finalize',
            'X-Goog-Upload-Offset': '0'
        },
        body: fileContent
    });

    if (!uploadRes.ok) {
        console.error("Upload failed", uploadRes.status, await uploadRes.text());
        return;
    }

    const data = await uploadRes.json();
    console.log("Success:", data);
}
run();
