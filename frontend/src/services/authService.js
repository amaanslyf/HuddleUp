// The base URL of our backend API for local use
//const API_URL = 'http://localhost:8000/api/v1/users';
// The base URL of our backend API, read from environment variables
const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api/v1/users`;


/**
 * Sends a POST request to the /register endpoint.
 * @param {object} userData - { name, username, password }
 * @returns {Promise<object>} - The JSON response from the server.
 */
export const register = async (userData) => {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });

    if (!response.ok) {
        // If the server response is not OK, throw an error with the message
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to register');
    }

    return response.json();
};

/**
 * Sends a POST request to the /login endpoint.
 * @param {object} credentials - { username, password }
 * @returns {Promise<object>} - The JSON response from the server, including the token.
 */
export const login = async (credentials) => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to login');
    }

    return response.json();
};
