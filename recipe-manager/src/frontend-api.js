// frontend-api.js - API client for use in your React app
const API_URL = 'http://localhost:5000';

// Token storage - use localStorage in browser environments only
let authToken = null;

// Check if we're in a browser environment before using localStorage
if (typeof window !== 'undefined' && window.localStorage) {
    authToken = localStorage.getItem('authToken');
}

// API client
const recipeApi = {
    // Set token and store in localStorage if in browser
    setToken: (token) => {
        authToken = token;
        if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.setItem('authToken', token);
        }
    },

    // Clear token from memory and localStorage
    clearToken: () => {
        authToken = null;
        if (typeof window !== 'undefined' && window.localStorage) {
            localStorage.removeItem('authToken');
        }
    },

    // Get token from server
    getToken: async (role = 'VISITOR') => {
        try {
            const response = await fetch(`${API_URL}/token`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ role }),
            });

            if (!response.ok) {
                throw new Error(`Failed to get token: ${response.status}`);
            }

            const data = await response.json();
            recipeApi.setToken(data.token);
            return data.token;
        } catch (error) {
            console.error('Error getting token:', error);
            throw error;
        }
    },

    // Handle API requests with token
    request: async (endpoint, options = {}) => {
        if (!authToken) {
            await recipeApi.getToken();
        }

        const headers = {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
            ...options.headers,
        };

        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                ...options,
                headers,
            });

            // Handle token expired error
            if (response.status === 401) {
                const errorData = await response.json();
                if (errorData.error === 'Token expired') {
                    // Try to get a new token with the same role
                    await recipeApi.getToken();

                    // Retry the request with new token
                    return recipeApi.request(endpoint, options);
                }
                throw new Error(errorData.error);
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `API error: ${response.status}`);
            }

            return response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    },

    // Recipe API methods
    getRecipes: (limit = 10, skip = 0) => {
        return recipeApi.request(`/api/recipes?limit=${limit}&skip=${skip}`);
    },

    getRecipe: (id) => {
        return recipeApi.request(`/api/recipes/${id}`);
    },

    createRecipe: (recipe) => {
        return recipeApi.request('/api/recipes', {
            method: 'POST',
            body: JSON.stringify(recipe),
        });
    },

    updateRecipe: (id, updates) => {
        return recipeApi.request(`/api/recipes/${id}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
    },

    toggleLike: (id) => {
        return recipeApi.request(`/api/recipes/${id}/like`, {
            method: 'PUT',
        });
    },

    deleteRecipe: (id) => {
        return recipeApi.request(`/api/recipes/${id}`, {
            method: 'DELETE',
        });
    },
};

// Export for use in your React components
export default recipeApi;

// For CommonJS environments (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = recipeApi;
}