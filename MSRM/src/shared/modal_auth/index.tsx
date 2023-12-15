// PopupAuth.tsx
import { Button, Form, Modal } from 'react-bootstrap';
import { FC, useState } from 'react';
import axios from 'axios';

interface PopupAuthProps {
    onHide: () => void;
    title: string;
    show: boolean; // Состояние модального окна регистрации
    switchToLogin: () => void; // Функция для переключения на окно входа
}

const PopupAuth: FC<PopupAuthProps> = ({ onHide, title, show, switchToLogin }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phoneNumber: '',
        password: '',
        confirmPassword: '',
    });

    const handleClose = () => {
        onHide();
    };

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
            handleClose();
        })
        .catch(error => (
            console.log(error)
        ))


        handleClose();
    }
    return (
        <Modal
            show={show}
            onHide={handleClose}
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
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
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="outline-secondary" onClick={onHide}>
                    Отмена
                </Button>
                <Button variant="primary" onClick={Registration}>
                    Зарегистрироваться
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default PopupAuth;
