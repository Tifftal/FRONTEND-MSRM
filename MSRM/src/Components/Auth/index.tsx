// PopupAuth.tsx
import { Button, Form, Modal } from 'react-bootstrap';
import { FC, useState } from 'react';
import axios from 'axios';
import './index.css'
import { NavLink, useNavigate } from 'react-router-dom';

const Auth: FC = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
    });

    const handleInputChange = (event: any) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const Registration = (event: any) => {
        const { name, value } = event.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        console.log('Регистрация:', formData);

        axios.post('/api/user/register',
            {
                "Email_address": formData.email,
                "Password": formData.password,
                "RepeatPassword": formData.confirmPassword,
                "Name": formData.name,
                "Phone_Number": formData.phoneNumber
            }
        )
            .then(response => {
                console.log(response);
                navigate("/MSRM/login");
                window.location.reload();

            })
            .catch(error => (
                console.log(error)
            ))
    }
    return (
        <>
            <div className='registr'>
                <h1>Создать аккаунт</h1>
                <Form>
                    <Form.Group className="mb-3" controlId="name">
                        <Form.Label>Ваше имя</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Иванов Иван Иванович"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            autoFocus
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="email">
                        <Form.Label>Адрес электронной почты</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="name@example.com"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="phoneNumber">
                        <Form.Label>Номер телефона</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="8-999-000-00-00"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="password">
                        <Form.Label>Пароль</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Введите пароль"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="confirmPassword">
                        <Form.Control
                            type="password"
                            placeholder="Повторите пароль"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                        />
                    </Form.Group>
                </Form >
                <NavLink to="/MSRM/login">
                    <Button variant="outline-secondary" style={{ marginRight: 30 }}>
                        Отмена
                    </Button>
                </NavLink>
                <Button variant="primary" onClick={Registration}>
                    Зарегистрироваться
                </Button>
            </div >
        </>
    );
};

export default Auth;
