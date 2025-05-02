import { useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '../../contexts/authContext.jsx';
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Login({ onClose }) {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuthContext();

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

        if (!formData.email || !formData.password || !formData.username) {
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

    //TODO: Old version:
    // const handleSubmit = async (e) => {
    //     e.preventDefault();
    //     setErrorMessage(''); // Clear previous error messages
    //     setSuccessMessage(''); // Clear previous success messages

    //     if (!formData.email || !formData.password) {
    //         setErrorMessage('Email and password are required.');
    //         return;
    //     }
    //     try {
    //         setLoading(true); // Show loading state
    //         const response = await axios.post(`${API_BASE_URL}/users/login`, formData, { withCredentials: true });
    //         console.log('Login successful:', response.data);
    //         // onClose(); FIXME: this should be done after the loading state is set to false
    //         login(response.data);
    //         setSuccessMessage('Login successful! Redirecting...');
    //                     // Close the modal after a short delay
    //                     setTimeout(() => {
    //                         setLoading(false);
    //                         onClose();
    //                     }, 2000); // 2 seconds delay before closing the modal
    //     } catch (error) {
    //         console.error('Login failed:', error);
    //         setErrorMessage('Login failed. Please check your credentials and try again.');
    //         setLoading(false);
    //     }
    // };

    return (
        <div className="bg-white p-6 rounded shadow-md w-full max-w-sm mx-auto">
            <div className="text-2xl font-bold mb-4">
                <button
                    className="close-button"
                    onClick={onClose}
                    aria-label="Close"
                >
                    &times;
                </button>
                <form
                    className="bg-white p-6 rounded shadow-md w-full max-w-sm mx-auto"
                    onSubmit={handleSubmit}
                >
                    <h2 className="text-2xl font-bold mb-4">Login</h2>
                    {errorMessage && (
                        <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
                    )}
                    {successMessage && (
                        <div className="text-green-500 text-sm mb-4">{successMessage}</div>
                    )}
                    <div className="mb-4">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mb-6">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                            id="password"
                            name="password"
                            type="password"
                            placeholder="******************"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex items-center justify-between">
                        <button
                            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Logging into your account...' : 'Login'}
                        </button>
                    </div>
                    <div>
                        <a href="/register"
                            className="register-button bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Don't have an account? Create one!
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
}