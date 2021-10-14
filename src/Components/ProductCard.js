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
    const { attributes } = this.state;
    const { product } = this.props;
    let newAttributes;
    if (
      typeof attributes[val[0]] == "undefined" ||
      attributes[val[0]].name !== product.attributes[val[0]].name ||
      attributes.length !== product.attributes.length
    ) {
      newAttributes = product.attributes;
      newAttributes = newAttributes.map((attribute, index) => ({
        ...attribute,
        selectedvalue:
          typeof attributes[index] == "undefined"
            ? -1
            : attributes[index].selectedvalue,
      }));
      newAttributes[val[0]].selectedvalue = val[1];
    } else {
      newAttributes = attributes;
      newAttributes[val[0]].selectedvalue = val[1];
    }
    this.setState({ attributes: newAttributes });
  }

  addToCartHandler() {
    // adding product to redux state
    const { product, addToCart } = this.props;
    const { attributes, quantity } = this.state;
    let allowAddingToCart = true;
    attributes.forEach((attribute) => {
      if (attribute.selectedvalue === -1) {
        allowAddingToCart = false;
        this.setState({ check: true });
      }
    });
    if (quantity < 1) allowAddingToCart = false;
    if (allowAddingToCart) {
      let item = {
        id: product.id,
        gallery: product.gallery,
        brand: product.brand,
        attributes: attributes,
        quantity: quantity,
        name: product.name,
        prices: product.prices,
      };
      addToCart(item);
    }
  }

  incrementHandler() {
    this.setState({ quantity: this.state.quantity + 1 });
  }

  decrementHandler() {
    this.setState({ quantity: this.state.quantity - 1 });
  }
  amountOfCurrency() {
    const { product, currency } = this.props;
    let id = currency.id;
    let amount = product.prices[id].amount;
    return getFormattedCurrency(currency.name, amount);
  }

  onMouseEnterHandler() {
    this.setState({ expanded: this.props.product.inStock });
  }
  onMouseLeaveHandler() {
    this.setState({ expanded: false });
  }
  setAttributes() {
    return this.props.product.attributes.map((e, id) => (
      <Attributes
        origin={"productCard"}
        attribute={e}
        index={id}
        sendAttributeData={this.getAttributeData}
        key={id}
      />
    ));
  }

  setContainerClassName() {
    if (this.props.product.inStock) return "CardContainer";
    return "CardContainer notInStock";
  }

  renderExpandablePart = () => {
    const { expanded, quantity, check } = this.state;
    //using package that lets smoothly expand elements
    return (
      <Expand open={expanded}>
        <button
          className="EmptyCartCircle"
          onClick={() => this.addToCartHandler()}
        >
          <img src={EmptyCartIcon} alt="cart" />
        </button>
        {this.setAttributes()}
        <div className="ProductCardQuantityContainer">
          <span className="QuantityName"> Quantity </span>
          <div>
            <button
              className="ProductCardQuantityContainerButton"
              disabled={quantity < 2}
              onClick={() => this.decrementHandler()}
            >
              <img src={Line} alt="line"></img>
            </button>
            <div>
              <div className="Quantity">{quantity}</div>
            </div>
            <button
              className="ProductCardQuantityContainerButton"
              onClick={() => this.incrementHandler()}
            >
              <img src={Crossing} alt="cross"></img>
            </button>
          </div>
        </div>
        <Expand open={check}>
          <span className="QuantityName">Please select all attributes</span>
        </Expand>
      </Expand>
    );
  };

  render() {
    const {
      product: { id, gallery, brand, name },
    } = this.props;
    return (
      <div
        onMouseEnter={() => this.onMouseEnterHandler()}
        onMouseLeave={() => this.onMouseLeaveHandler()}
        className={this.setContainerClassName()}
      >
        <p className="OutOfStock">OUT OF STOCK</p>
        <Link to={`product/${id}`}>
          <div className="DummyDiv">
            <img className="Image" src={gallery[0]} alt="product" />
          </div>
          <p className="Name">{brand + " " + name}</p>
          <p className="Price">{this.amountOfCurrency()}</p>
        </Link>
        <div className="ExpandAttributes">
          {this.renderExpandablePart()}
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(ProductCard);
