const API_BASE_URL = 'http://localhost:5000/api';

export interface UploadItemData {
  title: string;
  description: string;
  level: string;
  price: string;
  rank: string;
  region: string;
  selectedAgents: string[];
  skins: {
    id: string;
    name: string;
    screenshotName: string; // Original filename for matching with uploaded files
  }[];
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

// Upload item to backend with files
export const uploadItem = async (data: UploadItemData, files: File[]): Promise<ApiResponse<any>> => {
  try {
    const formData = new FormData();
    
    // Add form data
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('level', data.level);
    formData.append('price', data.price);
    formData.append('rank', data.rank);
    formData.append('region', data.region);
    formData.append('selectedAgents', JSON.stringify(data.selectedAgents));
    formData.append('skins', JSON.stringify(data.skins));
    
    // Add files
    files.forEach((file, index) => {
      formData.append('screenshots', file);
    });

    const response = await fetch(`${API_BASE_URL}/uploadItem`, {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to upload item');
    }

    return result;
  } catch (error) {
    console.error('Error uploading item:', error);
    throw error;
  }
};

// Get all items
export const getAllItems = async (): Promise<ApiResponse<any[]>> => {
  try {
    const response = await fetch(`${API_BASE_URL}/uploadItem`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to fetch items');
    }

    return result;
  } catch (error) {
    console.error('Error fetching items:', error);
    throw error;
  }
};

// Health check
export const healthCheck = async (): Promise<ApiResponse<any>> => {
  try {
    const response = await fetch('http://localhost:5000/health', {
      method: 'GET',
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Health check failed:', error);
    throw error;
  }
};
