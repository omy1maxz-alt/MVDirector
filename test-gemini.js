import { GoogleGenAI } from '@google/genai';
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
async function test() {
  try {
    const res = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: 'a cat',
      config: {
        imageConfig: { aspectRatio: '16:9' }
      }
    });
    console.log(res.candidates[0].content ? "Success" : "Failed");
  } catch (e) {
    console.error(e.message);
  }
}
test();
