import axios from 'axios';

const API_URL = 'http://localhost:1002/api/auth';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials {
  firstName: string;
  lastName: string;
  age: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    isAdmin: boolean;
  };
}

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/login`, credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('isAdmin', response.data.user.isAdmin.toString());
    }
    return response.data;
  }

  async signup(credentials: SignupCredentials): Promise<AuthResponse> {
    const response = await axios.post(`${API_URL}/register`, {
      firstName: credentials.firstName,
      lastName: credentials.lastName,
      email: credentials.email,
      password: credentials.password,
      age: credentials.age
    });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('isAdmin', response.data.user.isAdmin.toString());
    }
    return response.data;
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('isAdmin');
  }

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) return JSON.parse(userStr);
    return null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
  
  isAdmin(): boolean {
    const isAdmin = localStorage.getItem('isAdmin');
    return isAdmin === 'true';
  }
}

const authService = new AuthService();

// Auth service functions
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  console.log('Token:', token);
  console.log('Is token valid:', !!token);
  return !!token;
};

export const isAdmin = () => {
  return localStorage.getItem('isAdmin') === 'true';
};

export const login = async (credentials: { email: string; password: string }) => {
  // Implement login logic here
  const response = await authService.login(credentials);
  if (response.token) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    localStorage.setItem('isAdmin', response.user.isAdmin.toString());
  }
  return response.success;
};

export const logout = () => {
  authService.logout();
};

export const getRedirectPath = () => {
  const path = sessionStorage.getItem('redirectAfterLogin');
  console.log('Redirect Path:', path);
  sessionStorage.removeItem('redirectAfterLogin');
  
  // Redirect admin users to admin dashboard
  if (localStorage.getItem('isAdmin') === 'true') {
    return '/admin/dashboard';
  }
  
  return path || '/dash';
};

export default authService;
