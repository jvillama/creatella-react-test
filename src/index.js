import React, { Component } from "react";
import ReactDOM from "react-dom";
import ProductsList from "./ProductsList";
import "./index.css";

const products_base_url = "http://localhost:3000/api/products";

class ProductsContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      nextPage: 1,
      limit: 20,
      sortBy: "",
      displayedProducts: [],
      products: [],
      end: false,
      adNum: (parseInt(Math.random() * 10, 10) % 10) + 1,
      adCount: 0
    };

    this.handleScroll = this.handleScroll.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.fetchProducts = this.fetchProducts.bind(this);
    this.displayNext = this.displayNext.bind(this);
    this.startFetching = this.startFetching.bind(this);
    this.abortFetching = this.abortFetching.bind(this);
    this.recurseFetch = this.recurseFetch.bind(this);
    this.getAdProduct = this.getAdProduct.bind(this);
  }
  abortController = new window.AbortController();
  abortFetching() {
    // console.log("Now aborting");
    this.abortController.abort();
  }
  componentDidMount() {
    // Invoked once the component is mounted to the DOM
    // Good for making AJAX requests
    this.setState({ loading: true });
    this.startFetching();
    
    window.addEventListener("scroll", this.handleScroll);
  }
  startFetching() {
    // Start fetching product asynchronously
    Promise.resolve()
      .then(() => 1)
      .then(page => this.recurseFetch(page))
  }
  recurseFetch(page, stop = false) {
    // Recursively fetch products
    if (stop) {
      return;
    }
    return this.fetchProducts(
      page,
      this.state.limit,
      this.state.sortBy
    );
  }
  componentWillUnmount() {
    // Cleanup
    this.abortController.abort();
    console.log("aborted");
    window.removeEventListener("scroll", this.handleScroll);
  }
  getAdProduct() {
    const adProduct = {
      media: Math.floor(Math.random() * 1000),
      adNum: this.state.adNum
    };
    let rand = (parseInt(Math.random() * 10, 10) % 10) + 1;
    while (true) {
      if (this.state.adNum !== rand) {
        this.setState({ adNum: rand });
        break;
      }
      rand = (parseInt(Math.random() * 10, 10) % 10) + 1;
    }
    return adProduct
  }
  fetchProducts(page, limit, sort) {
    const products_url = `${products_base_url}?_page=${page}&_limit=${limit}&_sort=${sort}`;
    return fetch(products_url, { signal: this.abortController.signal })
      .then(res => res.json())
      .then(myJson => {
        if (myJson.length > 0) {
          // Load with ad
          const adProduct = this.getAdProduct()
          this.setState(prevState => ({
            products: prevState.products.concat(
              myJson,
              adProduct
            ),
            adCount: prevState.adCount + 1,
            nextPage: page + 1
          }));
        } else {
          this.setState({ end: true });
        }
        if (this.state.loading === true) {
          this.displayNext();
        }
        return this.recurseFetch(page + 1, this.state.end);
      })
      .catch(err => {
        if (err.name === "AbortError") {
          // console.log(err.message);
        } else {
          console.error("Uh oh, an error!", err);
        }
      });
  }
  displayNext() {
    const displayLength = this.state.displayedProducts.length;
    const productLength = this.state.products.length;

    const nextSlice = this.state.products.slice(
      displayLength,
      displayLength + 21
    )
    if (nextSlice.length > 0) {
      this.setState(prevState => ({
        loading: false,
        displayedProducts: prevState.displayedProducts.concat(nextSlice)
      }));
    }
    if (
      this.state.loading === true &&
      this.state.end === true &&
      displayLength === productLength
    ) {
      this.setState({ loading: false });
    }
  }
  handleScroll() {
    const windowHeight =
      "innerHeight" in window
        ? window.innerHeight
        : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(
      body.scrollHeight,
      body.offsetHeight,
      html.clientHeight,
      html.scrollHeight,
      html.offsetHeight
    );
    const windowBottom = windowHeight + window.pageYOffset;
    if (windowBottom >= docHeight) {
      if (this.state.end !== true) {
        this.setState({ loading: true });
      }
      this.displayNext();
    }
    if (this.state.loading === true) {
      this.displayNext();
    }
  }
  handleChange(event) {
    const sortByVal = event.target.value;
    if (sortByVal !== this.state.sortBy) {
      // Abort all fetches and reset
      this.abortFetching();
      this.abortController = new window.AbortController();
      this.setState({
        loading: true,
        sortBy: sortByVal,
        displayedProducts: [],
        products: [],
        nextPage: 1,
        end: false,
        adNum: (parseInt(Math.random() * 10, 10) % 10) + 1,
        adCount: 0
      });
      this.startFetching();
    }
  }
  render() {
    return (
      <div>
        <div style={{ textAlign: "center" }}>
          Sort by: &nbsp;
          <select value={this.state.sortBy} onChange={this.handleChange}>
            <option value="">Default</option>
            <option value="size">Size</option>
            <option value="price">Price</option>
            <option value="id">Id</option>
          </select>
        </div>
        {this.state.displayedProducts && (
          <ProductsList
            products={this.state.displayedProducts}
            loading={this.state.loading}
          />
        )}
        {this.state.end &&
          this.state.displayedProducts.length >= this.state.products.length && (
            <div style={{ textAlign: "center" }}>~ end of catalogue ~</div>
          )}
      </div>
    );
  }
}

ReactDOM.render(<ProductsContainer />, document.getElementById("root"));
