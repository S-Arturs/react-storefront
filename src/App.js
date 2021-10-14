import { connect } from "react-redux";
import NavBar from "./Components/NavBarComponents/NavBar.js";
import CartPage from "./Pages/CartPage.js";
import HomePage from "./Pages/HomePage.js";
import ProductPage from "./Pages/ProductPage";
import { fetchCategories } from "./Api/Fetch";
import {
  HashRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import "./App.css";
import { setCategory } from "./Actions/index";
import React from "react";

// redux
const mapStateToProps = (state) => {
  return {
    category: state.categorizer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setCategory: (id) => dispatch(setCategory(id)),
  };
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.getTint = this.getTint.bind(this);
    this.state = {
      categories: [],
      isTinted: false,
    };
  }
  async componentDidMount() {
    let categories;
    const queryResult = await fetchCategories();
    if (queryResult !== "error") {
      categories = JSON.parse(JSON.stringify(queryResult.categories));
      categories.unshift({name: "all"})
      this.setState({
        categories: categories,
        isCartFocused: false,
      });
    }
  }
  // a method that can be called from children 
  // components to remove tint when shopping cart is in focus
  getTint() {
    this.setState({
      isTinted: !this.state.isTinted,
    });
  }

  setTintedClassName(){
    if(this.state.isTinted) return "TintContainer"
    return ""
  }
  render() {
    const {categories} = this.state
    if (categories.length <= 1) return null;
    return (
      <Router>
        <div className="App">
          <div>
            <div className="App-Header">
              <NavBar
                id="NavBar"
                categories={categories}
                sendTint={this.getTint}
              />
            </div>
            <div className={this.setTintedClassName()}></div>
          </div>
          <div>
            <Switch>
              <Redirect
                exact
                from="/"
                to={`/shop/all`}
              />
              <Route
                exact
                path="/shop/:category?"
                render={(props) => <HomePage {...props} />}
              />
              <Route
                path="/shop/product/:id"
                render={(props) => <ProductPage {...props} />}
              />
              <Route exact path="/cart">
                <CartPage />
              </Route>
            </Switch>
          </div>
        </div>
      </Router>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(App);
