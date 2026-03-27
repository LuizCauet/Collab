import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiUrl } from "../api";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        loginUser();
        setEmail("");
        setPassword("");
    };

    const navigate = useNavigate();

    const loginUser = () => {
        fetch(apiUrl("/api/login"), {
            method: "POST",
            body: JSON.stringify({
                email,
                password,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.error_message) {
                    alert(data.error_message);
                } else {
                    navigate("/dashboard");
                    localStorage.setItem("_id", data.id);
                }
            })
            .catch((err) => console.error(err));
    };

    return (
        <>
        <nav className='navbar'>
            <img className="loginLogo" src="/Collab logo.png" alt="Collab Logo" style={{width: '200px', height: 'auto'}}/>
        </nav>
        <main className='login'>
            <h1 className='loginTitle'>Log in</h1>
            <form className='loginForm' onSubmit={handleSubmit}>
                <label htmlFor='email'>Email Address</label>
                <input
                    type='text'
                    name='email'
                    id='email'
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor='password'>Password</label>
                <input
                    type='password'
                    name='password'
                    id='password'
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button className='modalBtn'>Sign In</button>
                <p>
                    Don't have an account? <Link to='/register'>Create one</Link>
                </p>
            </form>
        </main>
        </>
    );
};
export default Login;