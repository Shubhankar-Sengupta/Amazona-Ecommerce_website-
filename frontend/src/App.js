import HomeScreen from './components/screens/HomeScreen';
import ProductScreen from './components/screens/ProductScreen';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';

function App() {

  return (

    <Router>

      <div className="d-flex flex-column site-container">

        <header>

          <Navbar bg="dark" variant="dark">

            <Container>

              <LinkContainer to="/">
                <Navbar.Brand>amazona</Navbar.Brand>
              </LinkContainer>

            </Container>

          </Navbar>

        </header>

        <main>

          <Container className="mt-3">

            <Routes>
              <Route path="/" element={<HomeScreen />} />
              <Route path="/product/:slug" element={<ProductScreen />} />
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
