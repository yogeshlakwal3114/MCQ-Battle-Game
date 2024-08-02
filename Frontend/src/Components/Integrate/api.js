import axios from 'axios';

const API_URL = 'http://localhost:5000'; // Adjust this URL if necessary

export const signup = async (username, email, password) => {
  try {
    const response = await axios.post(`${API_URL}/users/signup`, {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error('Error during signup:', error);
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/users/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error('Error during login:', error);
    throw error;
  }
};
