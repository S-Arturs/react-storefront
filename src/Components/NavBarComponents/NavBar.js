import React from "react";
import "./NavBar.css";
import Cart from "../../Assets/SVG/Cart.svg";
import Arrow from "../../Assets/SVG/Arrow.svg";
import logo from "../../Assets/SVG/Group.svg";
import OutsideClickHandler from "react-outside-click-handler";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import NBCurrencyPicker from "./NBCurrencyPicker";
import NBCart from "./NBCart";
import {
  setCategory,
} from "../../Actions";
import { getSymbol } from "../../Helpers/CurrencyFormatter";

const mapStateToProps = (state) => {
  return {
    category: state.categorizer,
    cart: state.cart,
    currency: state.currency,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setCategory: (id) => dispatch(setCategory(id)),
  };
};

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.getRefresh = this.getRefresh.bind(this);
    this.getCloseCurrency = this.getCloseCurrency.bind(this);
    this.getTint = this.getTint.bind(this);
    this.state = {
      quantity: this.totalQuantityOfItems(),
      removedCart: false,
      removedCurrency: false,
      showCart: false,
      showCurrency: false,
    };
  }

  componentDidUpdate() {
    let quantity = this.totalQuantityOfItems();
    if (this.state.quantity !== quantity) {
      this.setState({
        quantity: quantity,
      });
    }
  }
  getCloseCurrency() {
    this.setState({ showCurrency: false });
  }
  getTint() {
    this.setState({ showCart: false });
    this.props.sendTint();
  }

  getRefresh() {
    this.forceUpdate();
  }
  handleClickOutsideCart() {
    if (this.state.showCart) {
      this.setState({ showCart: false, removedCart: true });
      this.props.sendTint();
    } else {
      this.setState({
        removedCart: false,
      });
    }
  }
  handleClickOutsideCurrencyPicker() {
    if (this.state.showCurrency) {
      this.setState({ showCurrency: false, removedCurrency: true });
    } else {
      this.setState({
        removedCurrency: false,
      });
    }
  }
  handleCurrencyPickerButtonClick() {
    if (!this.state.showCurrency && !this.state.removedCurrency) {
      this.setState({ showCurrency: true, removedCurrency: false });
    }
  }
  handleCartButtonClick() {
    this.setState({ showCurrency: false });
    if (!this.state.showCart && !this.state.removedCart) {
      this.setState({ showCart: true, removedCart: false });
      this.props.sendTint();
    }
  }
  // style for button with category that's currently selected
  setCategorySelectorClassname(name) {
    if (this.props.category === name) {
      return "CategorySelector Selected";
    }
    return "CategorySelector";
  }

  totalQuantityOfItems() {
    let totalQuantity = 0;
    this.props.cart.forEach((element) => {
      totalQuantity += element.quantity;
    });
    return totalQuantity;
  }
  setCategoryButtons() {
    const { categories } = this.props;
    return categories.map((category, id) => (
      <Link key={id} to={`/shop/${categories[id].name}`}>
        <button
          className={this.setCategorySelectorClassname(categories[id].name)}
          type="button"
          onClick={() => this.props.setCategory(category.name)}
        >
          {category.name.toUpperCase()}
        </button>
      </Link>
    ));
  }
  setArrowClassname() {
    if (this.state.showCurrency) return "Arrow Flipped";
    return "Arrow";
  }
  setItemAmountCircleClassname() {
    if (this.props.cart.length > 0) return "ItemAmountCircle";
    return "ItemAmountCircle Hidden";
  }
  render() {
    const { categories, currency } = this.props;
    const { showCurrency, quantity, showCart } = this.state;
    if (categories.length === 0) return null;
    return (
      <div className="NavBar">
        <div className="CategoriesContainer">{this.setCategoryButtons()}</div>
        <div className="LogoContainer">
          <Link to={`/`}>
            <img className="Logo" src={logo} alt="logo" />
          </Link>
        </div>
        <div className="CurrencyCartContainer">
          <button
            className="CartButton"
            onClick={() => {
              this.handleCurrencyPickerButtonClick();
            }}
          >
            {getSymbol(currency.name)}
            <img src={Arrow} className={this.setArrowClassname()} alt="arrow" />
          </button>
          <OutsideClickHandler
            onOutsideClick={() => this.handleClickOutsideCurrencyPicker()}
          >
            <NBCurrencyPicker
              expanded={showCurrency}
              sendCloseCurrency={this.getCloseCurrency}
            />
          </OutsideClickHandler>
          <button
            className="CartButton"
            onClick={() => this.handleCartButtonClick()}
          >
            <div className={this.setItemAmountCircleClassname()}>
              <p>{quantity}</p>
            </div>
            <img src={Cart} className="CartSVG" alt="cart"></img>
          </button>
          <OutsideClickHandler
            onOutsideClick={() => this.handleClickOutsideCart()}
          >
            <NBCart
              expanded={showCart}
              sendTint={this.getTint}
              refreshParent={this.getRefresh}
            />
          </OutsideClickHandler>
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
