// tokenService.ts
import axios from 'axios';

const TOKEN_KEY = 'jwt';
const REFRESH_TOKEN_KEY = 'refreshToken';

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (token: string) => localStorage.setItem(TOKEN_KEY, token);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);
export const setRefreshToken = (refreshToken: string) => localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);

export const refreshToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error("No refresh token available");

  try {
    const response = await axios.post('/api/refresh-token', { refreshToken });
    const { jwt, newRefreshToken } = response.data;
    setToken(jwt);
    setRefreshToken(newRefreshToken);
    return jwt;
  } catch (error) {
    throw new Error("Failed to refresh token");
  }
};
