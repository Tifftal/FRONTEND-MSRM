import { Button } from 'react-bootstrap';
import './index.css';
import { FC, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink, useLocation } from 'react-router-dom';
import axios from 'axios';
import sampleData from '../../mock/sampleMock';
import { useSelector } from 'react-redux';
import { RootState } from '../../reduxToolkit/store';

const NavBar: FC = () => {

    const location = useLocation();

    // Укажите целевой путь для страницы "Образец"
    const targetPath = '/MSRM/samples';

    // Проверка, соответствует ли текущий путь целевому
    const isTargetPage = location.pathname === targetPath;


    const draftID = useSelector((state: RootState) => state.toolkit.draftID)

    const Logout = () => {
        window.localStorage.removeItem("token")
        window.location.reload();
    }

    return (
        <Navbar sticky="top" expand="lg" className="bg-body-tertiary nav-bar" data-bs-theme="dark">
            <Container>
                <Navbar.Brand><NavLink className="logo" to='/MSRM'>MSRM</NavLink></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className='flex-navbar'>
                    <Nav className="me-auto">
                        <Nav.Link><NavLink className="link" to='/MSRM/'>Главная</NavLink></Nav.Link>
                        <Nav.Link><NavLink className="link" to='/MSRM/samples'>Образцы</NavLink></Nav.Link>
                        {
                            window.localStorage.getItem("token") ?
                                <Nav.Link><NavLink className="link" to='/MSRM/missions'>Мои заказы</NavLink></Nav.Link>
                                : null
                        }

                    </Nav>

                    {
                        isTargetPage ? (
                            window.localStorage.getItem("token") ?
                                <div>
                                    {
                                        draftID !== 0 ?
                                            <NavLink to="/MSRM/bag" className="bagBtnNavbar">
                                                <img src='bag.png' />Корзина
                                            </NavLink>
                                            : <NavLink to="#" className="bagBtnNavbar disabled">
                                                <img src='bag.png' />Корзина
                                            </NavLink>
                                    }
                                </div>
                                : null
                        ) : null
                    }


                    {
                        window.localStorage.getItem("token") ?
                            <Button variant="primary" size="sm" onClick={Logout}>Выйти</Button>
                            : <NavLink to='/MSRM/login' classname="loginBtn-navbar"><Button variant="primary" size="sm">Войти</Button></NavLink>
                    }

                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavBar;
