import './index.css';
import { FC } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { NavLink } from 'react-router-dom';

const NavBar: FC = () => {
    // const location = useLocation();
    // if (location.pathname.startsWith("/detail")) {
    //     return <></>
    // }
    return (
        <Navbar sticky="top" expand="lg" className="bg-body-tertiary nav-bar" data-bs-theme="dark">
            <Container>
                <Navbar.Brand><NavLink className="logo" to='/FRONTEND-MSRM'>MSRM</NavLink></Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav" className='flex-navbar'>
                    <Nav className="me-auto">
                        <Nav.Link><NavLink className="link" to='/FRONTEND-MSRM/'>Главная</NavLink></Nav.Link>
                        <Nav.Link><NavLink className="link" to='/FRONTEND-MSRM/samples'>Образцы</NavLink></Nav.Link>
                        {/* <Nav.Link><NavLink className="link" to='/FRONTEND-MSRM/'>Мои заказы</NavLink></Nav.Link> */}
                    </Nav>
                    
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavBar;