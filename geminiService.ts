
import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you'd want to handle this more gracefully.
  // For this example, we'll proceed, but API calls will fail.
  console.warn("API_KEY environment variable not set. Gemini API calls will fail.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

const fileToGenerativePart = (file: File) => {
  return new Promise<{ inlineData: { data: string; mimeType: string } }>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        // result is "data:mime/type;base64,..."
        const base64Data = event.target.result.split(',')[1];
        resolve({
          inlineData: {
            data: base64Data,
            mimeType: file.type,
          },
        });
      } else {
        reject(new Error('Failed to read file as base64 string.'));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

export const extractMedicationInfo = async (imageFile: File): Promise<{ name: string; dosage: string }> => {
  try {
    const imagePart = await fileToGenerativePart(imageFile);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          imagePart,
          { text: "From the image of the medicine packaging, extract the medication name and its dosage. Respond ONLY with a valid JSON object with 'name' and 'dosage' as keys." },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            dosage: { type: Type.STRING },
          },
          required: ['name', 'dosage'],
        },
      },
    });

    const jsonString = response.text;
    const result = JSON.parse(jsonString);
    return {
      name: result.name || 'Não identificado',
      dosage: result.dosage || 'Não identificada',
    };
  } catch (error) {
    console.error("Error extracting medication info:", error);
    return { name: "Erro ao ler", dosage: "Erro ao ler" };
  }
};

export const extractExamInfo = async (imageFile: File): Promise<{ examName: string; examDate: string }> => {
   try {
    const imagePart = await fileToGenerativePart(imageFile);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          imagePart,
          { text: "From the image of the medical exam document, extract the exam title/name and the date it was performed. Respond ONLY with a valid JSON object with 'examName' and 'examDate' as keys. The date should be in 'YYYY-MM-DD' format." },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            examName: { type: Type.STRING },
            examDate: { type: Type.STRING },
          },
          required: ['examName', 'examDate'],
        },
      },
    });

    const jsonString = response.text;
    const result = JSON.parse(jsonString);
    return {
      examName: result.examName || 'Não identificado',
      examDate: result.examDate || new Date().toISOString().split('T')[0],
    };
  } catch (error) {
    console.error("Error extracting exam info:", error);
    return { examName: "Erro ao ler", examDate: new Date().toISOString().split('T')[0] };
  }
};

export const extractFullExamInfo = async (imageFile: File): Promise<{ name: string; date: string; time: string; location: string; preparation: string; }> => {
   try {
    const imagePart = await fileToGenerativePart(imageFile);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          imagePart,
          { text: "From the image of the medical exam request/document, extract the exam title/name, the date and time it should be performed, the location (clinic/hospital name), and any preparation instructions. Respond ONLY with a valid JSON object with 'name', 'date', 'time', 'location', and 'preparation' as keys. The date should be in 'YYYY-MM-DD' format and time in 'HH:MM' format. If a value is not found, return an empty string for it." },
        ],
      },
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            date: { type: Type.STRING },
            time: { type: Type.STRING },
            location: { type: Type.STRING },
            preparation: { type: Type.STRING },
          },
          required: ['name', 'date', 'time', 'location', 'preparation'],
        },
      },
    });

    const jsonString = response.text;
    const result = JSON.parse(jsonString);
    return {
      name: result.name || 'Não identificado',
      date: result.date || '',
      time: result.time || '',
      location: result.location || '',
      preparation: result.preparation || '',
    };
  } catch (error) {
    console.error("Error extracting full exam info:", error);
    return { 
        name: "Erro ao ler", 
        date: new Date().toISOString().split('T')[0],
        time: "",
        location: "",
        preparation: "" 
    };
  }
};
