
import { GoogleGenAI, Type } from "@google/genai";
import { WorkflowConfig, GenerationResult } from "../types";

export async function generateWorkflowContent(config: WorkflowConfig): Promise<GenerationResult> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const contentTypeStr = config.contentType.join(', ');
  const toneStr = config.tone.join(', ');

  const textResponse = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Generate a detailed set of content for the following platforms: [${contentTypeStr}] about the topic: "${config.topic}". 
    The tone of voice should be a blend of: [${toneStr}]. 
    Context/Style focus: ${config.imageContext}.
    Provide a cohesive output that works across all these platforms while respecting their individual styles.
    Include a title and structured content body.`,
    config: {
      temperature: 0.8,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          body: { type: Type.STRING },
          metrics: {
            type: Type.OBJECT,
            properties: {
              readingTime: { type: Type.NUMBER },
              sentiment: { type: Type.STRING },
              keywordDensity: { type: Type.NUMBER }
            },
            required: ['readingTime', 'sentiment', 'keywordDensity']
          }
        },
        required: ['title', 'body', 'metrics']
      }
    }
  });

  const contentData = JSON.parse(textResponse.text || '{}');
  let imageUrl: string | undefined = undefined;

  if (config.generateImages) {
    try {
      const imagePrompt = config.imageContext 
        ? `A high-quality professional visual showing: ${config.imageContext}. Specifically related to ${config.topic}. Style: Clean, editorial, corporate.`
        : `A high-quality editorial cover image for a post about ${config.topic}. Style: Modern, clean, professional.`;

      const imgResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: imagePrompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: "16:9"
          }
        }
      });

      if (imgResponse.candidates?.[0]?.content?.parts) {
        for (const part of imgResponse.candidates[0].content.parts) {
          if (part.inlineData) {
            imageUrl = `data:image/png;base64,${part.inlineData.data}`;
            break;
          }
        }
      }
    } catch (e) {
      console.error("Image generation failed", e);
    }
  }

  return {
    id: crypto.randomUUID(),
    timestamp: Date.now(),
    config,
    text: `## ${contentData.title}\n\n${contentData.body}`,
    imageUrl,
    metrics: contentData.metrics
  };
}
