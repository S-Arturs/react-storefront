import React from "react";
import Attributes from "./Attributes";
import Expand from "react-expand-animated";
import Line from "../Assets/SVG/Line.svg";
import Crossing from "../Assets/SVG/Crossing.svg";
import "./ProductCard.css";
import EmptyCartIcon from "../Assets/SVG/Vector.svg";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { addToCart } from "../Actions";
import { getFormattedCurrency } from "../Helpers/CurrencyFormatter";

const mapStateToProps = (state) => {
  return {
    currency: state.currency,
    cart: state.cart,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addToCart: (id) => {
      dispatch(addToCart(id));
    },
  };
};

class ProductCard extends React.Component {
  constructor(props) {
    super(props);
    this.getAttributeData = this.getAttributeData.bind(this);
    this.state = {
      cart: this.props.cart,
      check: false,
      quantity: 1,
      expanded: false,
      attributes: [],
    };
  }
  componentDidMount() {
    let attributes = this.props.product.attributes;
    attributes = attributes.map((attribute) => ({
      ...attribute,
      selectedvalue: -1,
    }));
    this.setState({
      attributes: attributes,
    });
  }

  getAttributeData(val) {
    // it seems like attributes get messed up when page gets reloaded, 
    // so if that happens, we rewrite the attributes to the correct ones
    let attributes;
    if (
      typeof this.state.attributes[val[0]] == "undefined" ||
      this.state.attributes[val[0]].name !==
        this.props.product.attributes[val[0]].name ||
      this.state.attributes.length !== this.props.product.attributes.length
    ) {
      attributes = this.props.product.attributes;
      attributes = attributes.map((attribute, index) => ({
        ...attribute,
        selectedvalue:
          typeof this.state.attributes[index] == "undefined"
            ? -1
            : this.state.attributes[index].selectedvalue,
      }));
      attributes[val[0]].selectedvalue = val[1];
    } else {
      attributes = this.state.attributes;
      attributes[val[0]].selectedvalue = val[1];
    }
    attributes = JSON.parse(JSON.stringify(this.state.attributes));
    attributes[val[0]].selectedvalue = val[1];
    this.setState({ attributes: attributes });
  }

  addToCartHandler() {
    // adding product to redux state
    let allowAddingToCart = true;
    this.state.attributes.forEach((attribute) => {
      if (attribute.selectedvalue === -1) {
        allowAddingToCart = false;
        this.setState({ check: true });
      }
    });
    if (allowAddingToCart) {
      let item = {
        id: this.props.product.id,
        gallery: this.props.product.gallery,
        brand: this.props.product.brand,
        attributes: this.state.attributes,
        quantity: this.state.quantity,
        name: this.props.product.name,
        prices: this.props.product.prices,
      };
      this.props.addToCart(item);
    }
  }
  amountOfCurrency(){
    let id = this.props.currency.id;
    let amount = this.props.product.prices[id].amount;
    return getFormattedCurrency(this.props.currency.name, amount)
  }

  setAttributes(){
    return this.props.product.attributes.map((e, id) => (
      <Attributes
        origin={"productCard"}
        attribute={e}
        index={id}
        sendAttributeData={this.getAttributeData}
        key={id}
      />
    ))
  }

  render() {
    return (
      <div
        onMouseEnter={() =>
          this.setState({ expanded: this.props.product.inStock })
        }
        onMouseLeave={() => this.setState({ expanded: false })}
        style={{ opacity: this.props.product.inStock ? 1 : 0.5 }}
        className="CardContainer"
      >
        <p
          className="OutOfStock"
          style={{ opacity: this.props.product.inStock ? 0 : 1 }}
        >
          OUT OF STOCK
        </p>
        <Link to={`product/${this.props.product.id}`}>
          <div className="DummyDiv">
            <img className="Image" src={this.props.product.gallery[0]} alt="product"/>
          </div>
          <p className="Name">
            {" "}
            {this.props.product.brand + " " + this.props.product.name}
          </p>
          <p className="Price">
            {this.amountOfCurrency()}
          </p>
        </Link>
        {/* using package that lets us smoothly expand components */}
        <div className="ExpandAttributes">
        <Expand open={this.state.expanded}>
          <button className="EmptyCartCircle" onClick={() => this.addToCartHandler()}>
            <img src={EmptyCartIcon} alt="cart"/>
          </button>
          {this.setAttributes()}
          <div className="ProductCardQuantityContainer">
            <span className="QuantityName"> Quantity </span>
            <button
              className="ProductCardQuantityContainerButton"
              disabled={this.state.quantity < 1}
              onClick={() =>
                this.setState({ quantity: this.state.quantity - 1 })
              }
            >
              <img src={Line} alt="line"></img>
            </button>
            <div>
              <div className="Quantity">{this.state.quantity}</div>
            </div>
            <button
              className="ProductCardQuantityContainerButton"
              onClick={() =>
                this.setState({ quantity: this.state.quantity + 1 })
              }
            >
              <img src={Crossing} alt="cross"></img>
            </button>
          </div>
          <Expand open={this.state.check}>
            <span className="QuantityName">Please select all attributes</span>
          </Expand>
        </Expand>
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ProductCard);
