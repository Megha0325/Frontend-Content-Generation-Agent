
export type ContentType = 
  | 'EXAIR - LinkedIn' 
  | 'EXAIR Corporation - Facebook' 
  | 'exair_corporation - Instagram' 
  | 'EXAIR - Twitter' 
  | 'Blog Post' 
  | 'Email News Letter';

export type Tone = 'Professional' | 'Casual' | 'Witty' | 'Authoritative' | 'Inspirational';

export interface WorkflowConfig {
  topic: string;
  contentType: ContentType[];
  tone: Tone[];
  imageContext: string;
  generateImages: boolean;
  webhookUrl?: string;
}

export interface WorkflowStep {
  id: string;
  label: string;
  status: 'idle' | 'running' | 'completed' | 'failed';
  result?: string;
}

export interface GenerationResult {
  id: string;
  timestamp: number;
  config: WorkflowConfig;
  text: string;
  imageUrl?: string;
  metrics: {
    readingTime: number;
    keywordDensity: number;
    sentiment: string;
  };
}

export enum AppStatus {
  LANDING = 'LANDING',
  IDLE = 'IDLE',
  EXECUTING = 'EXECUTING',
  VIEWING = 'VIEWING'
}
