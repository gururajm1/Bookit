import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import pakka from "../assets/pakka.jpg";
import authService from "../services/authService";
import { validateEmail, validatePassword } from "../utils/validation";
import { getRedirectPath } from '../services/authService';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const validateField = (name: string, value: string) => {
    let error = "";
    switch (name) {
      case "email":
        error = validateEmail(value) || "";
        break;
      case "password":
        error = validatePassword(value) || "";
        break;
    }
    return error;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) {
        newErrors[key] = error;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const success = await authService.login(formData);
      if (success) {
        const redirectPath = getRedirectPath();
        navigate(redirectPath);
      } else {
        setServerError('Invalid credentials');
      }
    } catch (err: any) {
      setServerError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-screen flex">
      <div className="grid grid-cols-1 md:grid-cols-2 m-auto h-[550px] shadow-lg shadow-black-200 sm:max-w-[900px]">
        <div className="w-full h-[550px] hidden md:block">
          <img className="w-full h-full object-cover" src={pakka} alt="Login background" />
        </div>
        <div className="p-4 flex flex-col justify-around">
          <form onSubmit={handleSubmit} noValidate>
            <h2 className="text-4xl font-bold text-center mb-9 text-gray-600">Login</h2>
            {serverError && (
              <div className="text-red-500 text-center mb-4">{serverError}</div>
            )}
            <div className="ml-8">
              <div className="mb-4">
                <input
                  className={`border p-2 mr-2 w-80 ml-2 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  type="email"
                  name="email"
                  placeholder="Your Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 ml-4">{errors.email}</p>
                )}
              </div>
              <div className="mb-4">
                <input
                  className={`border p-2 w-80 ml-2 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                  type="password"
                  name="password"
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  required
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1 ml-4">{errors.password}</p>
                )}
              </div>
            </div>
            <button
              className={`w-[350px] ml-6 p-2 my-4 ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-yellow-500'
              } mt-7`}
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Log In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
