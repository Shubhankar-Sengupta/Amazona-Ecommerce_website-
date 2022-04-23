import HomeScreen from "./components/screens/HomeScreen";
import ProductScreen from "./components/screens/ProductScreen";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";


function App() {

  return (

    <Router>

      <div className="App">

        <header>
          <Link to="/">amazona</Link>
        </header>

        <main>
          <Routes>
              <Route path='/' element={<HomeScreen/>}/>
              <Route path='/product/:slug' element={<ProductScreen/>}/> 
          </Routes>
        </main>

      </div>

    </Router>
  );
}


export default App;