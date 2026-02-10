
import { WorkflowConfig } from "../types";

/**
 * N8N TEST INTEGRATION - BLOG POST SPECIALIZED
 * New Webhook URL: https://kandjtech.app.n8n.cloud/webhook-test/472e9bac-9aa8-4c02-b037-494ff43262ec
 */
const N8N_WEBHOOK_URL = 'https://kandjtech.app.n8n.cloud/webhook-test/472e9bac-9aa8-4c02-b037-494ff43262ec';
const N8N_EXECUTION_VIEW_URL = 'https://kandjtech.app.n8n.cloud/home/workflows';

export async function triggerN8NWorkflow(config: WorkflowConfig): Promise<{ success: boolean; error?: string }> {
  try {
    // Construct the payload exactly as requested in the user's example for the Blog Creation workflow
    const payload = [
      {
        "Content Topic": config.topic || "No Topic Provided",
        "Tone of Voice": config.tone || [],
        "Image Needed?": config.generateImages ? "Yes" : "No",
        "Image Context/Prompt": config.imageContext || "",
        "submittedAt": new Date().toISOString(),
        "formMode": "test"
      }
    ];

    // Log the transaction details for easy debugging in the browser console
    console.group("FlowForge >> N8N Handoff (BLOG WORKFLOW TEST)");
    console.log("Endpoint:", N8N_WEBHOOK_URL);
    console.log("Payload Mapping:", payload);
    console.groupEnd();

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      // Capture detailed error info from N8N if available
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      const errorMessage = errorData.message || `HTTP ${response.status}`;
      
      console.error(`N8N Webhook Failed (${response.status}):`, errorData);
      return { success: false, error: errorMessage };
    }

    return { success: true };
  } catch (error: any) {
    console.error("Critical Handoff Error:", error);
    return { success: false, error: error.message || "Network Error" }; 
  }
}

/**
 * Navigation helper to send the user to their N8N instance
 */
export function getRedirectUrl() {
  return N8N_EXECUTION_VIEW_URL;
}
