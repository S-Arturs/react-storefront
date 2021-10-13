import React from "react";
import "./HomePage.css";
import ProductCard from "../Components/ProductCard";
import { connect } from "react-redux";
import { addToCart, setCategory } from "../Actions";
import { fetchProducts } from "../Api/Fetch";

const mapStateToProps = (state) => {
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    addToCart: (id) => dispatch(addToCart(id)),
    setCategory: (id) => dispatch(setCategory(id)),
  };
};
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      prevCategory: "",
      fetched: false,
      fetchedData: [],
    };
  }

  async componentDidMount() {
    if (!this.state.fetched) {
      await this.loadFetchedData()
    }
  }

  async componentDidUpdate() {
    if (this.props.match.params.category !== this.state.prevCategory) {
       await this.loadFetchedData()
    }
  }
  async loadFetchedData(){
    this.props.setCategory(this.props.match.params.category);
      let queryResult = await fetchProducts(this.props.match.params.category);
      if (queryResult !== "error") {
        this.setState({
          prevCategory: this.props.match.params.category,
          fetched: true,
          fetchedData: queryResult,
        });
      } else {
        this.setState({ fetched: false });
      }
  }
  setProductCards(){
    return this.state.fetchedData.category.products.map((product, id) => (
      <ProductCard product={product} key={id} />
    ))
  }
  render() {
    if (!this.state.fetched) return null;
    return (
      <div className="CenteringContainer">
        <div className="ShopContainer">
          <h1 className="CategoryHeader">
            {capitalizeFirstLetter(this.props.match.params.category)}
          </h1>
          <div className="Window">
            {this.setProductCards()}
          </div>
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Home);
