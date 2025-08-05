import { useState } from 'react';
import { login, register } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import '../styles/AuthForm.css';

const AuthForm = ({ type }) => {
    const [formData, setFormData] = useState({
        enrolment_id: '',
        name: '',
        surname: '',
        email: '',
        username: '',
        password: ''
    });

    const [error, setError] = useState('');
    const navigate = useNavigate();

    const isLogin = type === 'login';

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isLogin) {
                await login({
                    enrolment_id: formData.enrolment_id,
                    password: formData.password
                });

                // 👇 Fetch homepage data based on role
                const homepageRes = await fetch('http://88.200.63.148:9333/api/homepage', {
                    credentials: 'include'
                });
                const homepageData = await homepageRes.json();

                if (homepageData.homepage === 'provider') {
                    navigate('/provider-home');
                } else {
                    navigate('/student-home');
                }

            } else {
                await register(formData);
                navigate('/login');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };


    return (
        <div className="auth-form-container">
            <form className="auth-form" onSubmit={handleSubmit}>
                <h2>{isLogin ? 'Login' : 'Register'}</h2>

                <input type="text" name="enrolment_id" placeholder="Enrolment ID" onChange={handleChange} required />
                {!isLogin && (
                    <>
                        <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
                        <input type="text" name="surname" placeholder="Surname" onChange={handleChange} required />
                        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                        <input type="text" name="username" placeholder="Username" onChange={handleChange} required />
                    </>
                )}
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />

                {error && <p>{error}</p>}

                <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
            </form>
        </div>
    );

};

export default AuthForm;
