import { useState } from 'react';
import axios from 'axios';
import { useAuthContext } from './userContext';

export default function Logout() {

    const { logout } = useAuthContext();

    const handleLogout = async () => {
        try {
            const response = await axios.post('http://localhost:8080/logout', {}, { withCredentials: true });
            console.log('Logout successful:', response.data);
            logout();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <div>
            <button
                className=""
                type="submit"
                onClick={handleLogout}>Logout</button>
        </div>
    );
}