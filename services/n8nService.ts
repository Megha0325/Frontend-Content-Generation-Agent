
import { WorkflowConfig } from "../types";

/**
 * N8N PRODUCTION ENDPOINTS
 */
const N8N_BLOG_WEBHOOK_URL = 'https://kandjtech.app.n8n.cloud/webhook/472e9bac-9aa8-4c02-b037-494ff43262ec';
const N8N_SOCIAL_WEBHOOK_URL = 'https://kandjtech.app.n8n.cloud/webhook/885b3900-d6f2-4caf-94f9-cd5f90427209';
const N8N_VERIFICATION_WEBHOOK_URL = 'https://kandjtech.app.n8n.cloud/webhook/verify-email'; 
const N8N_EXECUTION_VIEW_URL = 'https://kandjtech.app.n8n.cloud/home/workflows';

export async function sendVerificationEmail(email: string): Promise<{ success: boolean }> {
  try {
    console.log(`Sending verification payload for: ${email}`);
    const response = await fetch(N8N_VERIFICATION_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        type: 'VERIFICATION',
        timestamp: new Date().toISOString()
      }),
    });
    return { success: response.ok };
  } catch (error) {
    console.error("Verification bridge failed:", error);
    return { success: false };
  }
}

export async function triggerN8NWorkflow(config: WorkflowConfig): Promise<{ success: boolean; error?: string }> {
  try {
    const isBlog = config.contentType.includes('Blog Post');
    const isSocial = config.contentType.some(t => 
      ['EXAIR - LinkedIn', 'EXAIR Corporation - Facebook', 'exair_corporation - Instagram', 'EXAIR - Twitter'].includes(t)
    );

    let url = '';
    let payload: any[] = [];

    // Constructing specific payloads while ensuring 'email' key is present for N8N processing
    if (isBlog) {
      url = N8N_BLOG_WEBHOOK_URL;
      payload = [
        {
          "Content Topic": config.topic || "No Topic Provided",
          "Tone of Voice": config.tone || [],
          "Image Needed?": config.generateImages ? "Yes" : "No",
          "Image Context/Prompt": config.imageContext || "",
          "Target Email": config.targetEmail,
          "email": config.targetEmail, // Generic key for N8N email nodes
          "submittedAt": new Date().toISOString(),
          "formMode": "production"
        }
      ];
    } else if (isSocial) {
      url = N8N_SOCIAL_WEBHOOK_URL;
      payload = [
        {
          "Platform": config.contentType || [],
          "Topic": config.topic || "No Topic Provided",
          "Tone": config.tone || [],
          "Image Desired?": config.generateImages ? "Yes" : "No",
          "Image Description": config.imageContext || "",
          "Target Email": config.targetEmail,
          "email": config.targetEmail, // Generic key for N8N email nodes
          "submittedAt": new Date().toISOString(),
          "formMode": "production"
        }
      ];
    } else {
      url = N8N_BLOG_WEBHOOK_URL; 
      payload = [{
        ...config,
        email: config.targetEmail,
        submittedAt: new Date().toISOString(),
        formMode: "production"
      }];
    }

    console.group(`FlowForge >> N8N Transmit`);
    console.log("Endpoint:", url);
    console.log("Target Email Dispatch:", config.targetEmail);
    console.groupEnd();

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      return { success: false, error: errorData.message || `HTTP ${response.status}` };
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Network Error" }; 
  }
}

export function getRedirectUrl() {
  return N8N_EXECUTION_VIEW_URL;
}
