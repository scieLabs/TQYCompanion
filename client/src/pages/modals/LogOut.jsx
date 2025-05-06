import { useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '../../contexts/authContext.jsx';
import { useNavigate } from 'react-router-dom';

export default function Logout({onClose}) {
    const { logout } = useAuthContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');



    const handleLogout = async () => {
        const confirmLeave = window.confirm('Are you sure you want to leave your ongoing game without saving?');
        setErrorMessage('');
        setSuccessMessage('');
        if (confirmLeave) {
        try {
            setLoading(true);
            await logout(); // Use the logout function from authContext
            setSuccessMessage('Logout successful!');
            setTimeout(() => {
                setLoading(false);
                navigate('/');
            }, 2000);
        } catch (error) {
            console.error('Logout failed:', error);
            setErrorMessage(error.message || 'Logout failed. Please try again.');
            setLoading(false);
        } finally {
            onClose(); // Close the modal after logout
        }
    };


    return (
        <div className="popup-modal fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded shadow-lg text-center">
                <h2 className="text-2xl font-bold mb-4">Logout</h2>
                <p className="mb-4">Are you sure you want to log out?</p>
                {errorMessage && (
                    <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
                )}
                {successMessage && (
                    <div className="text-green-500 text-sm mb-4">{successMessage}</div>
                )}
                <div className="flex justify-center space-x-4">
                    <button
                        onClick={handleLogout}
                        className="btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? 'Logging out...' : 'Log Out'}
                    </button>
                    <button
                        onClick={onClose}
                        className="btn btn-secondary"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}};