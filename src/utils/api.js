/**
 * API utility functions for Vanilla Builder
 */

// Get WordPress REST API base URL
const getApiUrl = (endpoint = '') => {
  const baseUrl = window.vanillaBuilderData?.apiUrl || '/wp-json/vanilla-builder/v1/';
  return baseUrl + endpoint.replace(/^\//, '');
};

// Get nonce for authentication
const getNonce = () => {
  return window.vanillaBuilderData?.nonce || '';
};

// Default request options
const getRequestOptions = (options = {}) => {
  return {
    headers: {
      'Content-Type': 'application/json',
      'X-WP-Nonce': getNonce(),
      ...options.headers
    },
    ...options
  };
};

// Generic API request function
export const apiRequest = async (endpoint, options = {}) => {
  const url = getApiUrl(endpoint);
  const requestOptions = getRequestOptions(options);
  
  try {
    const response = await fetch(url, requestOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Layout API functions
export const layoutApi = {
  // Get all layouts
  getLayouts: async (params = {}) => {
    const searchParams = new URLSearchParams(params);
    return apiRequest(`layouts?${searchParams}`);
  },
  
  // Get single layout
  getLayout: async (id) => {
    return apiRequest(`layouts/${id}`);
  },
  
  // Create new layout
  createLayout: async (layoutData) => {
    return apiRequest('layouts', {
      method: 'POST',
      body: JSON.stringify(layoutData)
    });
  },
  
  // Update layout
  updateLayout: async (id, layoutData) => {
    return apiRequest(`layouts/${id}`, {
      method: 'PUT',
      body: JSON.stringify(layoutData)
    });
  },
  
  // Delete layout
  deleteLayout: async (id) => {
    return apiRequest(`layouts/${id}`, {
      method: 'DELETE'
    });
  }
};

// Elements API functions
export const elementsApi = {
  // Get elements
  getElements: async (params = {}) => {
    const searchParams = new URLSearchParams(params);
    return apiRequest(`elements?${searchParams}`);
  },
  
  // Create element
  createElement: async (elementData) => {
    return apiRequest('elements', {
      method: 'POST',
      body: JSON.stringify(elementData)
    });
  },
  
  // Update element
  updateElement: async (id, elementData) => {
    return apiRequest(`elements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(elementData)
    });
  },
  
  // Delete element
  deleteElement: async (id) => {
    return apiRequest(`elements/${id}`, {
      method: 'DELETE'
    });
  }
};

// Settings API functions
export const settingsApi = {
  // Get settings
  getSettings: async () => {
    return apiRequest('settings');
  },
  
  // Update settings
  updateSettings: async (settings) => {
    return apiRequest('settings', {
      method: 'PUT',
      body: JSON.stringify({ settings })
    });
  }
};

// Export all APIs
export default {
  layouts: layoutApi,
  elements: elementsApi,
  settings: settingsApi
};