import React from "react";
import "./ProductPage.css";
import Attributes from "../Components/Attributes";
import { connect } from "react-redux";
import { fetchProductPage } from "../Api/Fetch";
import {addToCart } from "../Actions";

const mapStateToProps = (state) => {
  return {
    currency: state.currency,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addToCart: (id) => dispatch(addToCart(id)),
  };
};

class Product extends React.Component {
  constructor(props) {
    super(props);
    this.getAttributeData = this.getAttributeData.bind(this);
    this.state = {
      check: false,
      id: this.props.match.params.id,
      fetched: false,
      selectedImageIndex: 0,
      allowAddingToCart: false,
      product: {},
    };
  }
  async componentDidMount() {
    window.scrollTo(0, 0);
    let queryResult = await fetchProductPage(this.props.match.params.id);
    // adding selectedvalue property to fetched product json
    let product = JSON.parse(JSON.stringify(queryResult.product));
    let attributes = [...product.attributes];
    let allowAddingToCart = false;
    attributes = attributes.map((attribute) => ({
      ...attribute,
      selectedvalue: -1,
    }));
    product.attributes = attributes;
    product.quantity = 1;
    product.id = this.props.match.params.id;
    // skip checking if all attributes are selected if product has no attributes
    if (attributes.length === 0) allowAddingToCart = true;
    this.setState({
      product: product,
      fetched: true,
      allowAddingToCart: allowAddingToCart,
    });
  }
  // method that listens to button clicks from attributes component
  getAttributeData(val) {
    console.log(val);
    let product;
    let allSelected = true;
    // deep cloning
    product = JSON.parse(JSON.stringify(this.state.product));
    product.attributes[val[0]].selectedvalue = val[1];
    for (let i = 0; i < product.attributes.length; i++) {
      if (product.attributes[i].selectedvalue === -1) {
        allSelected = false;
      }
    }
    this.setState({ product: product });
    if (allSelected) {
      this.setState({ allowAddingToCart: true });
    }
  }
  addToCartHandler() {
    if (this.state.allowAddingToCart && this.state.product.inStock) {
      this.props.addToCart(this.state.product);
    } else {
      this.setState({ check: true });
    }
  }
  // using inbuild JS functions to get properly formatted price
  amountOfCurrency() {
    let id = this.props.currency.id;
    let amount = this.state.product.prices[id].amount;
    return amount.toLocaleString("en-US", {
      style: "currency",
      currency: this.props.currency.name,
    });
  }
  render() {
    if (!this.state.fetched) return null;
    return (
      <div id="CenteringContainer">
        <div id="ProductContainer">
          <div id="SidePicturesContainer">
            {this.state.product.gallery.map((e, id) => (
              <img
                key={id}
                className="SidePictures"
                src={e}
                onClick={() => this.setState({ selectedImageIndex: id })}
                alt="mini product"
              ></img>
            ))}
          </div>
          <div id="BigPictureContainer">
            <img
              id="BigPicture"
              src={this.state.product.gallery[this.state.selectedImageIndex]}
              alt="product"
            ></img>
          </div>

          <div id="InformationContainer">
            <h1>{this.state.product.brand}</h1>
            <h2>{this.state.product.name}</h2>

            {this.state.product.attributes.map((e, id) => (
              <Attributes
                origin={"productPage"}
                attribute={e}
                productId={0}
                index={id}
                sendAttributeData={this.getAttributeData}
                key={id}
              />
            ))}
            {this.state.check ? (
              <span className="PriceQuantity">
                Please select all attributes{" "}
              </span>
            ) : (
              <span></span>
            )}
            <p className="PriceQuantity">PRICE:</p>
            {this.state.fetched ? (
              <p id="Amount">{this.amountOfCurrency()}</p>
            ) : (
              <p></p>
            )}
            <button
              disabled={!this.state.product.inStock}
              className="AddToCartButton"
              onClick={() => this.addToCartHandler()}
            >
              {this.state.product.inStock
                ? "ADD TO CART"
                : "PRODUCT IS NOT IN STOCK"}
            </button>
            <div
              id="DangerouslySetHTML"
              dangerouslySetInnerHTML={{
                __html: this.state.product.description,
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Product);
