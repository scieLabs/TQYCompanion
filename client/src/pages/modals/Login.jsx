import { useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '../../contexts/authContext.jsx';
import { useSeason } from "../../contexts/seasonContext";


const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export default function Login({ onClose, handleRegisterClick }) {
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
    const theme = seasonThemes[currentSeason] || { bodyBg: 'bg-white', bodyText: '${theme.bodyText}' }; // Get the theme based on the current season

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setSuccessMessage('');

        if (!formData.email || !formData.password /*|| !formData.username*/) {
            setErrorMessage('Login failed. Please check your credentials and try again.');
            return;
        }

        try {
            setLoading(true);
            await login(formData); // Use the login function from authContext
            setSuccessMessage('Login successful! Redirecting...');
            setTimeout(() => {
                setLoading(false);
                onClose();
            }, 2000);
        } catch (error) {
            console.error('Login failed:', error);
            setErrorMessage(error.message || 'Login failed. Please try again.');
            setLoading(false);
        }
    };
    //{``}

    return (
        <div
            className={`flex justify-center items-center`}
        >
            <form
                className={`
                    login-form 
                    ${theme.bodyBg} ${theme.bodyText}
                    p-6 rounded
                    `}
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
                <h2 className={`text-2xl font-bold mb-4 ${theme.bodyText}`}>Login</h2>
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
                            block gray-700 text-sm font-bold mb-2
                            `}
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
                                block text-gray-700 text-sm font-bold mb-2
                                `}
                        htmlFor="password"
                    >
                        Password
                    </label>
                    <input
                        className={`
                                shadow appearance-none border rounded 
                                w-full py-2 px-3 text-gray-700 mb-3 
                                leading-tight
                                `}
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
                        className={`
                            login-button flex justify-center items-center mt-4
                            ${theme.headerBtnBg} ${theme.headerBtnBgHover} ${theme.headerBtnText} 
                            py-2 px-4 rounded hover:cursor-pointer  ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                            `}
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                    <p
                        className='${theme.bodyText} flex justify-center items-center mt-4 text-sm'
                    >
                        Don't have an account?
                    </p>
                    <a
                        onClick={() => {
                            onClose();
                            handleRegisterClick();
                        }}
                        className={`
                            register-button flex justify-center items-center mt-4
                            font-bold py-2 px-4 rounded text-blue-500 text-sm
                            hover:text-purple-500 hover:underline hover:cursor-pointer
                            `}
                    >
                        Create one!
                    </a>
                </div>
            </form>
        </div>
    );
}