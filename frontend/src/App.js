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
import SignupScreen from './components/screens/SignupScreen.js';
import PaymentScreen from './components/screens/PaymentScreen.js';
import PlaceOrderScreen from './components/screens/PlaceOrderScreen.js';
import OrderScreen from './components/screens/OrderScreen.js';
import OrderHistoryScreen from './components/screens/OrderHistoryScreen.js';
import UserProfileScreen from './components/screens/UserProfileScreen.js';
import CheckoutSuccess from './components/main_components/CheckoutSuccess.js';

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
    localStorage.removeItem('paymentMethod');
  };

  return (
    <Router>
      <div className="d-flex flex-column site-container">
        <header>
          <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
              <LinkContainer to="/">
                <Navbar.Brand>amazona</Navbar.Brand>
              </LinkContainer>

              <ToastContainer position="top-center" limit={1} />

              <Navbar.Toggle aria-controls="basic-control-nav" />

              <Navbar.Collapse id="basic-control-nav">
                <Nav className="me-auto w-100 justify-content-end">
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
              </Navbar.Collapse>
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
              <Route path="/signup" element={<SignupScreen />} />
              <Route path="/shipping" element={<ShippingScreen />} />
              <Route path="/payment" element={<PaymentScreen />} />
              <Route path="/placeorder" element={<PlaceOrderScreen />} />
              <Route path="/order/:id" element={<OrderScreen />} />
              <Route path="/orderhistory" element={<OrderHistoryScreen />} />
              <Route path="/profile" element={<UserProfileScreen />} />
              <Route path="/checkoutsuccess" element={<CheckoutSuccess />} />
              
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
