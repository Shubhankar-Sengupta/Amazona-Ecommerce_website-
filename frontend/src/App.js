import data from "./data";


function App() {

  return (

    <div className="App">

      <header>
          <a href="/">amazona</a>
      </header>

      <main>

        <h1 className="header-featured">Featured products</h1>

        <div className="products">

          {data.products.map((product) => (<div className="product" key={product.slug}> {/** key props given so that react could identify the elements*/}
            <img src={product.image} alt={product.name}/>

            <a href={`/product/${product.slug}`}>
              <p>{product.name}</p>
            </a>

            <p>{product.description}</p>

            <button>{`Add to cart`.toUpperCase()}</button>
          </div>
          ))}

        </div>

      </main>

    </div>
  );
}


export default App;