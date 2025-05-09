import { useState } from 'react';
import { useAuthContext } from '../../contexts/authContext.jsx';
import { useSeason } from "../../contexts/seasonContext.jsx";
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
                onClose(); // Close the modal
                navigate('/');
            }, 2000);
        } catch (error) {
            console.error('Logout failed:', error);
            setErrorMessage(error.message || 'Logout failed. Please try again.');
            setLoading(false);
        }
    };


    return (
        <dialog id="logoutModal" className="modal modal-open">
            <div className="modal-box p-0">
                {/* Header */}
                <header className={`p-4 text-center ${theme.headerBg} ${theme.headerText}`}>
                    <h3 className="font-bold text-lg mb-4">Log Out</h3>
                </header>

                {/* Body */}
                <div className={`p-6 ${theme.bodyBg} ${theme.bodyText}`}>
                    {errorMessage && (
                        <div className="text-[#d44747] text-sm mb-4">{errorMessage}</div>
                    )}
                    {successMessage && (
                        <div className="text-[#97be5a] text-sm mb-4">{successMessage}</div>
                    )}
                    <p className="text-center mb-6">
                        Are you sure you want to log out?
                    </p>
                    <div className="modal-action">
                        <button
                            className={`btn btn-primary border-none shadow-md ${theme.pWeeksBtnBg} ${theme.pWeeksBtnText} ${theme.pWeeksBtnBgHover}`}
                            type="button"
                            onClick={handleLogout}
                            disabled={loading}
                        >
                            {loading ? 'Logging out...' : 'Logout'}
                        </button>
                        <button
                            className="btn border-none shadow-md bg-white text-grey-600 hover:bg-gray-200"
                            onClick={onClose}
                            type="button"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </dialog>
    );
}
//         <div>
//             <h2 className="text-2xl font-bold mb-4">Logout</h2>
//             {errorMessage && (
//                     <div className={`
//                             text-[#d44747] text-sm mb-4`}>
//                                 {errorMessage}
//                                 </div>
//                 )}
//                 {successMessage && (
//                     <div className={`
//                             text-[#97be5a] text-sm mb-4`}>
//                                 {successMessage}
//                                 </div>
//                 )}
//                 <div className="flex justify-center space-x-4">
//             <button
//                 className={`
//                     login-button flex justify-center items-center mt-4
//                     ${theme.headerBtnBg} ${theme.headerBtnBgHover} ${theme.headerBtnText} 
//                     py-2 px-4 rounded hover:cursor-pointer ${loading ? 'opacity-50 cursor-not-allowed' : ''}
//                     `}
//                 type="button"
//                 onClick={handleLogout}
//                 disabled={loading}
//             >
//                 {loading ? 'Logging out...' : 'Logout'}
//             </button>
//             <button
//                         onClick={onClose}
//                         className={`
//                             login-button flex justify-center items-center mt-4
//                             ${theme.headerBtnBg} ${theme.headerBtnBgHover} ${theme.headerBtnText} 
//                             py-2 px-4 rounded hover:cursor-pointer
//                             `}
//                     >
//                         Cancel
//                     </button>
//                     </div>
//         </div>
//     );
// };