import { GoogleGenAI } from "@google/genai";
const f = new GoogleGenAI({apiKey: "foo"}).files;
console.log(Object.getOwnPropertyNames(Object.getPrototypeOf(f)));
