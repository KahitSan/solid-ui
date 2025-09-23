// API response interface
export interface APIResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  size: number;
}

export class DataTableAPI {
  private baseURL: string;

  constructor(baseURL: string = 'http://localhost:3000') {
    this.baseURL = baseURL;
  }

  async fetchData(params: Record<string, any> = {}): Promise<APIResponse> {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(`${this.baseURL}/api/members?${queryString}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }

  async addMember(memberData: any): Promise<any> {
    const response = await fetch(`${this.baseURL}/api/members`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(memberData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }

  async updateMember(id: string | number, memberData: any): Promise<any> {
    const response = await fetch(`${this.baseURL}/api/members/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(memberData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }

  async deleteMember(id: string | number): Promise<any> {
    const response = await fetch(`${this.baseURL}/api/members/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }

  async importCSV(csvData: any, mappings: Record<string, string>): Promise<any> {
    const formData = new FormData();
    formData.append('csvFile', csvData.file);
    formData.append('mappings', JSON.stringify(mappings));

    const response = await fetch(`${this.baseURL}/api/members/import`, {
      method: 'POST',
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  }

  // Setup Server-Sent Events for real-time updates
  setupSSE(onUpdate: (data: any) => void): EventSource {
    const eventSource = new EventSource(`${this.baseURL}/api/members/events`);
    
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onUpdate(data);
    };

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
    };

    return eventSource;
  }
}