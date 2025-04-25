import { useState } from 'react';
import axios from 'axios';
import { useAuthContext } from './userContext';

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

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
        try {
            const response = await axios.post('http://localhost:8080/login', formData, { withCredentials: true }); //{ withCredentials: true } ensures axios sends cookies
            console.log('Login successful:', response.data);
            onClose();
            login(response.data);
        } catch (error) {
            console.error('Login failed:', error);
        }
    };


    return (
        <div className="modal">
        <div className="modal-content">
            <span className="close-button" onClick={onClose}>&times;</span>
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Login</button>
                <div>
                    <a href="Fh'tagn!">Don't have an account? Create one!</a>
                </div>
            </form>
        </div>
    </div>
    );
}