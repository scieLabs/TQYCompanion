import { useState } from 'react';
import axios from 'axios';
import { useAuthContext } from '../../contexts/authContext.jsx';
import { useSeason } from "../../contexts/seasonContext";


export default function Logout() {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const { logout } = useAuthContext();

    const { currentSeason = 'Spring', setCurrentSeason, seasonThemes = {} } = useSeason(); // Access season context
    const theme = seasonThemes[currentSeason] || { bodyBg: 'bg-white', bodyText: 'text-black'}; // Get the theme based on the current season

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
            <button
                className={`
                    login-button flex justify-center items-center mt-4
                    ${theme.headerBg} ${theme.headerBtnBgHover} ${theme.headerBtnText} 
                    py-2 px-4 rounded hover:cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
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