import { Button, NavDropdown } from 'react-bootstrap';
import './index.css';
import { FC, useEffect, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import sampleData from '../../mock/sampleMock';
import { useSelector } from 'react-redux';
import { RootState } from '../../reduxToolkit/store';

const NavBar: FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const targetPath = '/MSRM/samples';
    const isTargetPage = location.pathname === targetPath;

    const token = window.localStorage.getItem("token");
    const decodedToken = token ? JSON.parse(atob(token.split('.')[1])) : 'Guest';
    console.log(decodedToken);


    const draftID = useSelector((state: RootState) => state.toolkit.draftID)

    const Logout = () => {
        window.localStorage.removeItem("token");
        navigate("/MSRM/samples");
        window.location.reload();
    }

    return (
        <Navbar sticky="top" expand="lg" className="bg-body-tertiary nav-bar" data-bs-theme="dark">
            <Container>
                <Navbar.Brand><NavLink className="logo" to='/MSRM'>MSRM</NavLink></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className='flex-navbar'>
                    <Nav className="me-auto">
                        {
                            decodedToken.role !== 'Moderator' ?
                                <>
                                    <Nav.Link><NavLink className="link" to='/MSRM/'>Главная</NavLink></Nav.Link>
                                </>
                                : null
                        }
                        {
                            decodedToken.role === 'Moderator' ?
                                <>
                                    <Nav.Link><NavLink className="link" to='/MSRM/admin/samples'>Образцы</NavLink></Nav.Link>
                                    <Nav.Link><NavLink className="link" to='/MSRM/missions'>Миссии</NavLink></Nav.Link>
                                </>
                                : null
                        }
                        {
                            decodedToken.role !== 'Moderator' ?
                                <Nav.Link><NavLink className="link" to='/MSRM/samples'>Образцы</NavLink></Nav.Link>
                                : null
                        }
                        {
                            (decodedToken.role === 'User' && window.localStorage.getItem("token")) ?
                                <Nav.Link><NavLink className="link" to='/MSRM/missions'>Мои Миссии</NavLink></Nav.Link>
                                : null
                        }

                    </Nav>
                    {
                        isTargetPage ? (
                            (window.localStorage.getItem("token") && decodedToken.role === 'User') ?
                                <div>
                                    {
                                        draftID !== 0 ?
                                            <NavLink to={`/MSRM/mission/detail/${draftID}`} className="bagBtnNavbar">
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
