import { useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '../../contexts/authContext.jsx'
import { useSeason } from "../../contexts/seasonContext";


// Import the base URL from the .env file
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Register({ onClose }) {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuthContext();

    const { currentSeason = 'Spring', setCurrentSeason, seasonThemes = {} } = useSeason(); // Access season context
    const theme = seasonThemes[currentSeason] || { bodyBg: 'bg-white', bodyText: 'text-black' }; // Get the theme based on the current season

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(''); // Clear previous error messages
        setSuccessMessage(''); // Clear previous success messages

        if (!formData.email || !formData.password) {
            setErrorMessage('Email and password are required.');
            return;
        }
        if (!formData.username) {
            setErrorMessage('Username is required.');
            return;
        }
        if (formData.password.length < 8) {
            setErrorMessage('Password must be at least 8 characters long.');
            return;
        }
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setErrorMessage('Email is invalid.');
            return;
        }

        try {
            setLoading(true); // Show loading state
            const response = await axios.post(`${API_BASE_URL}/users/register`, formData, { withCredentials: true });
            console.log('Registration successful:', response.data);
            setSuccessMessage('Registration successful! Redirecting...');
            login({ email: formData.email, password: formData.password });

            // Close the modal after a short delay
            setTimeout(() => {
                setLoading(false);
                onClose();
            }, 2000); // 2 seconds delay before closing the modal
        } catch (error) {
            console.error('Registration failed:', error.response?.data || error.message);
            setErrorMessage('Registration failed. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div
            className={`flex justify-center items-center`}
        >
            <form
                className={`login-form ${theme.bodyBg} ${theme.bodyText} p-6 rounded shadow-md`}
                onSubmit={handleSubmit}
            >
                <button
                    className={`close-button float-right
                        ${theme.headerBtnBg} ${theme.headerBtnBgHover} ${theme.headerBtnText}
                        px-1 rounded hover:cursor-pointer`}
                    onClick={onClose}
                    aria-label="Close"
                >
                    &times;
                </button>
                <h2 className={`text-2xl font-bold mb-4 ${theme.bodyText}`}>Registration Form</h2>
                {errorMessage && (
                    <div className={`
                            text-red-500 text-sm mb-4`}>
                                {errorMessage}
                                </div>
                )}
                {successMessage && (
                    <div className={`
                            text-green-500 text-sm mb-4`}>
                                {successMessage}
                                </div>
                )}
                <div className={`mb-4`}>
                    <label
                        className={`
                                block text-gray-700 text-sm font-bold mb-2`}
                        htmlFor="username"
                    >
                        Username
                    </label>
                    <input
                        className={`
                                shadow appearance-none border rounded 
                                w-full py-2 px-3 text-gray-700 leading-tight 
                                `}
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                    />
                </div>
                <div className="mb-4">
                    <label
                        className="block text-gray-700 text-sm font-bold mb-2"
                        htmlFor="email"
                    >
                        Email
                    </label>
                    <input
                        className={`
                                shadow appearance-none border rounded 
                                w-full py-2 px-3 text-gray-700 leading-tight 
                                `}
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div className={`mb-6`}>
                    <label
                        className={`
                                block text-gray-700 text-sm font-bold mb-2`}
                        htmlFor="password"
                    >
                        Password
                    </label>
                    <input
                        className={`
                                shadow appearance-none border rounded 
                                w-full py-2 px-3 text-gray-700 mb-3 
                                leading-tight `}
                        id="password"
                        name="password"
                        type="password"
                        placeholder="******************"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>
                <div className={`login-button-container`}>
                    <button
                        className={`login-button flex justify-center items-center mt-4
                                ${theme.headerBtnBg} ${theme.headerBtnBgHover} ${theme.headerBtnText} 
                                py-2 px-4 rounded hover:cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </div>
            </form>
        </div>
    );
}