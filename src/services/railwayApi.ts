import { OptimizationRequest, OptimizationResponse } from '@/types/railway';

class RailwayApiService {
  private baseUrl: string;

  constructor(baseUrl: string = 'http://localhost:8081') {
    this.baseUrl = baseUrl;
  }

  async healthCheck(): Promise<{ status: string; timestamp: string; version: string }> {
    const response = await fetch(`${this.baseUrl}/health`);
    if (!response.ok) {
      throw new Error(`Health check failed: ${response.status}`);
    }
    return response.json();
  }

  async requestOptimization(request: OptimizationRequest): Promise<OptimizationResponse> {
    const response = await fetch(`${this.baseUrl}/optimize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      throw new Error(`Optimization request failed: ${response.status}`);
    }

    return response.json();
  }

  async getOptimizationHistory(limit: number = 10, offset: number = 0) {
    const response = await fetch(`${this.baseUrl}/optimizations?limit=${limit}&offset=${offset}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch optimization history: ${response.status}`);
    }
    return response.json();
  }

  async acceptOptimization(optimizationId: string, candidateId: string): Promise<void> {
    // This endpoint might need to be implemented in the backend
    const response = await fetch(`${this.baseUrl}/optimizations/${optimizationId}/accept`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ candidate_id: candidateId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to accept optimization: ${response.status}`);
    }
  }

  async rejectOptimization(optimizationId: string, candidateId: string, reason?: string): Promise<void> {
    // This endpoint might need to be implemented in the backend
    const response = await fetch(`${this.baseUrl}/optimizations/${optimizationId}/reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ candidate_id: candidateId, reason }),
    });

    if (!response.ok) {
      throw new Error(`Failed to reject optimization: ${response.status}`);
    }
  }
}

export const railwayApi = new RailwayApiService();