import React, { useContext } from 'react';
import { Store } from './Store';
import HomeScreen from './components/screens/HomeScreen';
import ProductScreen from './components/screens/ProductScreen';
import { BrowserRouter as Router, Link, Routes, Route } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Badge from 'react-bootstrap/Badge';
import CartScreen from './components/screens/CartScreen';

function App() {
  const { state } = useContext(Store);
  const { cart } = state;

  return (
    <Router>
      <div className="d-flex flex-column site-container">
        <header>
          <Navbar bg="dark" variant="dark">
            <Container>
              <LinkContainer to="/">
                <Navbar.Brand>amazona</Navbar.Brand>
              </LinkContainer>

              <Nav className="me-auto">
                <Link to="/cart" className="nav-link">
                  Cart
                  {cart.cartItems.length > 0 && (
                    <Badge pill bg="danger">
                      {cart.cartItems.reduce((a, c) => a + c.quantity, 0)}
                    </Badge>
                  )}
                </Link>
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
