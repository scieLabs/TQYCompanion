import { useState } from 'react';
import axios from 'axios';
import { useAuthContext } from './authContext';

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

        // Basic validation
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
        } //should we be doing this in the front end? Belongs into the backend, ain't it, chief?
        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            setErrorMessage('Email is invalid.');
            return;
        } //same here, should be in the backend, I wager
        //nah, me big dummy - this is just to tell the user that they are doing something wrong, all good, chief
        //just got to make sure that the backend is also doing this, so that we don't get any weird errors in the future
        //tad bit terrifying that the machine spirit is tel

        try {
            setLoading(true); // Show loading state
            const response = await axios.post('/register', formData, { withCredentials: true });
            console.log('Registration successful:', response.data);
            setSuccessMessage('Registration successful! Redirecting...');
            login(response.data);

            // Close the modal after a short delay
            setTimeout(() => {
                setLoading(false);
                onClose();
            }, 20000); // 20 seconds delay before closing the modal
        } catch (error) {
            console.error('Registration failed:', error.response?.data || error.message);
            setErrorMessage('Registration failed. Please try again.');
            setLoading(false);
        }
    };

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
                    <h2 className="text-2xl font-bold mb-4">Registration Form</h2>
                    {errorMessage && (
                        <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
                    )}
                    {successMessage && (
                        <div className="text-green-500 text-sm mb-4">{successMessage}</div>
                    )}
                    <div className="mb-4">
                        <label
                            className="block text-gray-700 text-sm font-bold mb-2"
                            htmlFor="username"
                        >
                            Username
                        </label>
                        <input
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
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
                            className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                                loading ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                            type="submit"
                            disabled={loading}
                        >
                            {loading ? 'Registering...' : 'Register'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}