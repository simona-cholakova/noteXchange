import { useState } from 'react';
import { login, register } from '../api/auth';
import { useNavigate } from 'react-router-dom';
import '../styles/AuthForm.css';

const AuthForm = () => {
    const [type, setType] = useState('login');
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
                const loginResponse = await login({
                    enrolment_id: formData.enrolment_id,
                    password: formData.password
                });

                if (loginResponse.user) {
                    localStorage.setItem('user', JSON.stringify(loginResponse.user));
                    localStorage.setItem('provider_enrolment_id', loginResponse.user.enrolment_id || '');
                    localStorage.setItem('provider_name', loginResponse.user.name || '');
                    localStorage.setItem('provider_surname', loginResponse.user.surname || '');

                }

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
                // Register the user
                await register(formData);

                // After successful registration, perform login automatically
                const loginResponse = await login({
                    enrolment_id: formData.enrolment_id,
                    password: formData.password
                });

                if (loginResponse.user) {
                    localStorage.setItem('user', JSON.stringify(loginResponse.user));
                    localStorage.setItem('provider_enrolment_id', loginResponse.user.provider_enrolment_id || '');
                }

                const homepageRes = await fetch('http://88.200.63.148:9333/api/homepage', {
                    credentials: 'include'
                });
                const homepageData = await homepageRes.json();

                if (homepageData.homepage === 'provider') {
                    navigate('/provider-home');
                } else {
                    navigate('/student-home');
                }
            }
        } catch (err) {
            setError(err.message || 'Something went wrong');
        }
    };



    return (
        <div className="auth-form-wrapper">
            <form className="auth-form-card" onSubmit={handleSubmit}>
                <h2>Login Form</h2>

                <div className="tab-buttons">
                    <button
                        type="button"
                        className={isLogin ? 'active' : ''}
                        onClick={() => setType('login')}
                    >
                        Login
                    </button>
                    <button
                        type="button"
                        className={!isLogin ? 'active' : ''}
                        onClick={() => setType('register')}
                    >
                        Signup
                    </button>
                </div>

                <input
                    type="text"
                    name="enrolment_id"
                    placeholder="Enrolment ID"
                    onChange={handleChange}
                    required
                />

                {!isLogin && (
                    <>
                        <input
                            type="text"
                            name="name"
                            placeholder="Name"
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="surname"
                            placeholder="Surname"
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email"
                            onChange={handleChange}
                            required
                        />
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            onChange={handleChange}
                            required
                        />
                    </>
                )}

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={handleChange}
                    required
                />

                {error && <p className="error-msg">{error}</p>}

                <button className="submit-btn" type="submit">
                    {isLogin ? 'Login' : 'Register'}
                </button>

                <p className="toggle-link">
                    {isLogin ? "Not a member?" : "Already have an account?"} <span onClick={() => setType(isLogin ? 'register' : 'login')}>{isLogin ? "Signup now" : "Login"}</span>
                </p>
            </form>
        </div>
    );
};

export default AuthForm;