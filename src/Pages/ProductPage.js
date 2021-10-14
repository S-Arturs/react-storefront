import React from "react";
import "./ProductPage.css";
import Attributes from "../Components/Attributes";
import { connect } from "react-redux";
import { fetchProductPage } from "../Api/Fetch";
import { addToCart } from "../Actions";
import { getFormattedCurrency } from "../Helpers/CurrencyFormatter";
import DOMPurify from "dompurify";
import Expand from "react-expand-animated";
import uuid from "react-uuid";

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
    const {allowAddingToCart, product} = this.state
    if (allowAddingToCart && product.inStock) {
      this.props.addToCart(product);
    } else {
      this.setState({ check: true });
    }
  }
  // using inbuild JS functions to get properly formatted price
  amountOfCurrency() {
    let id = this.props.currency.id;
    let amount = this.state.product.prices[id].amount;
    return getFormattedCurrency(this.props.currency.name, amount);
  }

  setAttributes() {
    return this.state.product.attributes.map((e, id) => (
      <Attributes
        origin={"productPage"}
        attribute={e}
        productId={0}
        index={id}
        sendAttributeData={this.getAttributeData}
        key={uuid()}
      />
    ));
  }
  setSideImages() {
    return this.state.product.gallery.map((e, id) => (
      <img
        key={uuid()}
        className="SidePictures"
        src={e}
        onClick={() => this.setState({ selectedImageIndex: id })}
        alt="mini product"
      ></img>
    ));
  }
  setButtonText() {
    if (this.state.product.inStock) return "ADD TO CART";
    return "PRODUCT IS NOT IN STOCK";
  }
  render() {
    const {
      fetched,
      product: { gallery, brand, name, inStock, description },
      selectedImageIndex,
      check,
    } = this.state;
    const sanitizer = DOMPurify.sanitize;
    if (!fetched) return null;
    return (
      <div className="CenteringContainer">
        <div className="ProductContainer">
          <div className="SidePicturesContainer">{this.setSideImages()}</div>
          <div className="BigPictureContainer">
            <img
              className="BigPicture"
              src={gallery[selectedImageIndex]}
              alt="product"
            ></img>
          </div>

          <div className="InformationContainer">
            <h1>{brand}</h1>
            <h2>{name}</h2>
            {this.setAttributes()}
            <Expand open={check}>
              <span className="PriceQuantity">
                Please select all attributes
              </span>
            </Expand>
            <p className="PriceQuantity">PRICE:</p>
            <p className="Amount">{this.amountOfCurrency()}</p>
            <button
              disabled={!inStock}
              className="AddToCartButton"
              onClick={() => this.addToCartHandler()}
            >
              {this.setButtonText()}
            </button>
            <div
              className="DangerouslySetHTML"
              dangerouslySetInnerHTML={{
                __html: sanitizer(description),
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(Product);
