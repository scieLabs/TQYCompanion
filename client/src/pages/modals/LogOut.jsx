import { useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '../../contexts/authContext.jsx';
import { useSeason } from "../../contexts/seasonContext";


export default function Logout() {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { logout } = useAuthContext();

    const handleLogout = async () => {
        setErrorMessage('');
        setSuccessMessage('');
    
        try {
            setLoading(true);
            await logout(); // Use the logout function from authContext
            setSuccessMessage('Logout successful!');
            setTimeout(() => {
                setLoading(false);
            }, 2000);
        } catch (error) {
            console.error('Logout failed:', error);
            setErrorMessage(error.message || 'Logout failed. Please try again.');
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded shadow-md w-full max-w-sm mx-auto">
            <h2 className="text-2xl font-bold mb-4">Logout</h2>
            {errorMessage && (
                <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
            )}
            {successMessage && (
                <div className="text-green-500 text-sm mb-4">{successMessage}</div>
            )}
            <button
                className={`bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${
                    loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                type="button"
                onClick={handleLogout}
                disabled={loading}
                aria-label="Logout"
            >
                {loading ? 'Logging out...' : 'Logout'}
            </button>
        </div>
    );
}