const { GoogleGenAI } = require("@google/genai");
const ai = new GoogleGenAI({apiKey:"123"});
console.log(typeof ai.files.upload);
