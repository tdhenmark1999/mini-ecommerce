import React, { useState } from 'react';
import axios from 'axios';
import './style.scss';
import { useNavigate } from 'react-router-dom';

function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${apiBaseUrl}/auth/signup`, { email, password });
            alert("Successfully Created")
            navigate('/');

        } catch (error) {
            alert(error.response.data.error)
            console.error("Error signing up", error);
        }
    }

    return (
        <div className='signup-container'>
            <div className='wrapper'>
                <form onSubmit={handleSubmit}>
                    <div className='container'>
                        <div className='text-container'>
                            <h2><a href='/'>Login</a></h2> | <h2>Register</h2>
                        </div>
                        <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
                        <input required type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
                        <button type="submit">Sign up</button>

                    </div>
                </form>
            </div>
        </div>
    );
}

export default Signup;
