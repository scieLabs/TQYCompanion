import { useState } from 'react';
import { useAuthContext } from '../../contexts/authContext.jsx';
import { useSeason } from "../../contexts/seasonContext";
import { useNavigate } from 'react-router-dom';

export default function Logout({onClose}) {
    const { logout } = useAuthContext();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');


    const { currentSeason = 'Spring', setCurrentSeason, seasonThemes = {} } = useSeason(); // Access season context
    const theme = seasonThemes[currentSeason] || { bodyBg: 'bg-white', bodyText: 'text-black'}; // Get the theme based on the current season

    const handleLogout = async () => {
        // const confirmLeave = window.confirm('Are you sure you want to leave your ongoing game without saving?');
        setErrorMessage('');
        setSuccessMessage('');
        // if (confirmLeave) {
        try {
            setLoading(true);
            await logout(); // Use the logout function from authContext
            console.log('Logout successful:');
            setSuccessMessage('You are logged out! Redirecting to home page...');
            setTimeout(() => {
                setLoading(false);
                navigate('/');
            }, 2000);
        } catch (error) {
            console.error('Logout failed:', error);
            setErrorMessage(error.message || 'Logout failed. Please try again.');
            setLoading(false);
        }
    };


    return (
        <div>
            <h2 className="text-2xl font-bold mb-4">Logout</h2>
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
                <div className="flex justify-center space-x-4">
            <button
                className={`
                    login-button flex justify-center items-center mt-4
                    ${theme.headerBtnBg} ${theme.headerBtnBgHover} ${theme.headerBtnText} 
                    py-2 px-4 rounded hover:cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                type="button"
                onClick={handleLogout}
                disabled={loading}
            >
                {loading ? 'Logging out...' : 'Logout'}
            </button>
            <button
                        onClick={onClose}
                        className={`
                            login-button flex justify-center items-center mt-4
                            ${theme.headerBtnBg} ${theme.headerBtnBgHover} ${theme.headerBtnText} 
                            py-2 px-4 rounded hover:cursor-pointer
                            `}
                    >
                        Cancel
                    </button>
                    </div>
        </div>
    );
};