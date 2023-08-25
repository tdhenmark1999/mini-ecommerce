import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './style.scss';

function Signin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const apiBaseUrl = process.env.REACT_APP_API_BASE_URL;

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${apiBaseUrl}/auth/signin`, { email, password });
            console.log(response.data);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('userId', response.data.userId);


        } catch (error) {
            console.error("Error signing in", error);
        } finally {
            const lastVisitedPath = localStorage.getItem('lastVisitedPath');

            console.log("Login was successful!");
            window.location.href = lastVisitedPath || '/products';
        }
    }

    return (
        <div className='login-container'>
            <div className='wrapper'>
                <form onSubmit={handleSubmit}>
                    <div className='container'>
                        <div className='text-container'>
                            <h2>Login</h2> | <h2><a href='/sign-up'>Register</a></h2>
                        </div>
                        <input required type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
                        <input required type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
                        <button type="submit">Sign in</button>

                    </div>
                </form>
            </div>
        </div>
    );
}

export default Signin;
