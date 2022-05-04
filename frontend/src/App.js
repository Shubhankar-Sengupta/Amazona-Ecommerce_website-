import React, { useContext } from 'react';
import { Store } from './Store.js';
import HomeScreen from './components/screens/HomeScreen';
import ProductScreen from './components/screens/ProductScreen';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter as Router, Link, Routes, Route } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Badge from 'react-bootstrap/Badge';
import CartScreen from './components/screens/CartScreen';
import SigninScreen from './components/screens/SigninScreen';
import NavDropdown from 'react-bootstrap/NavDropdown';
import ShippingScreen from './components/screens/ShippingScreen.js';

function App() {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  // signout from the application.
  const signoutHandler = () => {
    ctxDispatch({ type: 'User_SignedOut' });
    toast.success('Successfully signed out', {
      theme: 'colored',
    });

    localStorage.removeItem('shippingAddress');
    localStorage.removeItem('userInfo');
  };

  return (
    <Router>
      <div className="d-flex flex-column site-container">
        <header>
          <Navbar bg="dark" variant="dark">
            <Container>
              <LinkContainer to="/">
                <Navbar.Brand>amazona</Navbar.Brand>
              </LinkContainer>

              <ToastContainer position="top-center" limit={1} />

              <Nav className="me-auto">
                <Link
                  to="/cart"
                  className="nav-link"
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  Cart
                  {cart.cartItems.length > 0 && (
                    <Badge pill bg="danger">
                      {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                    </Badge>
                  )}
                </Link>

                {userInfo ? (
                  <NavDropdown
                    title={userInfo.name}
                    id="basic-nav-dropdown"
                    className="nav-link"
                    to="/signin"
                  >
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>User Profile</NavDropdown.Item>
                    </LinkContainer>

                    <LinkContainer to="/orderhistory">
                      <NavDropdown.Item>Order History</NavDropdown.Item>
                    </LinkContainer>

                    <NavDropdown.Divider />

                    <Link
                      className="dropdown-item"
                      onClick={signoutHandler}
                      to="#signout"
                    >
                      Sign Out
                    </Link>
                  </NavDropdown>
                ) : (
                  <Link className="nav-link" to="/signin">
                    Sign In
                  </Link>
                )}
              </Nav>
            </Container>
          </Navbar>
        </header>

        <main>
          <Container className="mt-3">
            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/product/:slug" element={<ProductScreen />} />
              <Route path="/cart" element={<CartScreen />} />
              <Route path="/signin" element={<SigninScreen />} />
              <Route path="/shipping" element={<ShippingScreen />} />
            </Routes>
          </Container>
        </main>

        <footer>
          <div className="text-center">All rights Reserved</div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
