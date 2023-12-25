import { Button, Form, Modal } from 'react-bootstrap';
import { FC, useEffect, useState } from 'react';
import axios from 'axios';
import './index.css'
import { NavLink, useNavigate } from 'react-router-dom';


const Login: FC = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleEmailChange = (event: any) => {
        setEmail(event.target.value);
    };

    const handlePasswordChange = (event: any) => {
        setPassword(event.target.value);
    };

    const Login = () => {
        console.log(email, password);
        axios.post('/api/user/login',
            {
                "Email_address": email,
                "Password": password,
            }
        )
            .then(response => {
                console.log(response);
                window.localStorage.setItem("token", response.data);
                const token = window.localStorage.getItem("token");
                const decodedToken = token ? JSON.parse(atob(token.split('.')[1])) : 'Guest';
                console.log(decodedToken);
                decodedToken.role === "User" ? navigate("/MSRM/samples"): null;
                decodedToken.role === "Moderator" ? navigate("/MSRM/admin/samples"): null;
            })
            .catch(error => (
                console.log(error)
            ))
    }

    return (
        <>
            <div className='login'>
                <h1>Войти в аккаунт</h1>
                <Form >
                    <Form.Floating className="mb-3">
                        <Form.Control
                            id="floatingInputCustom"
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={handleEmailChange}
                        />
                        <label htmlFor="floatingInputCustom">Адрес электронной почты</label>
                    </Form.Floating>
                    <Form.Floating>
                        <Form.Control
                            id="floatingPasswordCustom"
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                        <label htmlFor="floatingPasswordCustom">Пароль</label>
                    </Form.Floating>
                    <div className='loginBtn'>
                        <Button variant="primary" onClick={Login}>
                            Войти
                        </Button>
                        <NavLink to="/MSRM/auth">
                            <Button variant="outline-secondary">
                                Зарегистрироваться
                            </Button>
                        </NavLink>
                    </div>
                </Form>
            </div>

        </>
    );
};

export default Login;
