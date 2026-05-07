/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || 'MISSING_KEY' });
};

export async function getWorkoutSuggestion(goal: string, targetMuscle: string) {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Suggest a intense workout for ${targetMuscle} with the goal of ${goal}. Return as JSON with structure: { name: string, exercises: { name: string, sets: number, reps: string }[] }`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            exercises: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  sets: { type: Type.NUMBER },
                  reps: { type: Type.STRING },
                }
              }
            }
          }
        }
      }
    });

    const text = response.text || '{}';
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Gemini Workout Suggestion Error:", error);
    return null;
  }
}

export async function getMealSuggestion(calories: number, goal: string) {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Suggest a healthy meal with approximately ${calories} calories for a goal of ${goal}. Return as JSON: { name: string, calories: number, protein: number, carbs: number, fat: number, recipeShort: string }`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            calories: { type: Type.NUMBER },
            protein: { type: Type.NUMBER },
            carbs: { type: Type.NUMBER },
            fat: { type: Type.NUMBER },
            recipeShort: { type: Type.STRING },
          }
        }
      }
    });

    const text = response.text || '{}';
    const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Gemini Meal Suggestion Error:", error);
    return null;
  }
}
