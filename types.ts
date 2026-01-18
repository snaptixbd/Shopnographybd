
export interface AnalysisResult {
  platform: 'YouTube' | 'Facebook' | 'Unknown';
  title: string;
  creator: string;
  sentiment: string;
  engagementScore: number;
  hookStrength: number;
  improvementSuggestions: string[];
  marketingStrategy: {
    ethicalConsiderations: string;
    legalAdvice: string;
    growthTactics: string[];
  };
  previewSimulation: {
    mobile: string;
    tablet: string;
    desktop: string;
  };
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
