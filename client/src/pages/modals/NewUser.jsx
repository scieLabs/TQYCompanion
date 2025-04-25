import { useState } from 'react';
import axios from 'axios';
import { useAuthContext } from './userContext';

export default function Register() {
    const [formData, setFormData] = useState({
        username: '',
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
            const response = await axios.post('http://localhost:8080/register', formData, { withCredentials: true });
            console.log('Registration successful:', response.data);
            login(response.data);
            onclose();
        } catch (error) {
            console.error('Registration failed:', error);
        }
    };

    return (
        <div>
            <form
                className=""
                onSubmit={handleSubmit}
            >
                <h2 className="">Registration Form</h2>
                <div className="mb-4">
                    <label
                        className=""
                        htmlFor="username"
                    >
                        Username
                    </label>
                    <input
                        className=""
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
                        className=""
                        htmlFor="email"
                    >
                        Email
                    </label>
                    <input
                        className=""
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
                        className=""
                        htmlFor="password"
                    >
                        Password
                    </label>
                    <input
                        className=""
                        id="password"
                        name="password"
                        type="password"
                        placeholder="******************"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>
                <div className="">
                    <button
                        className=""
                        type="submit"
                    >
                        Register
                    </button>
                </div>
            </form>
        </div>
    );
}