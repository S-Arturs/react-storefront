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
import { setCategory } from "../../Actions";
import { getSymbol } from "../../Helpers/CurrencyFormatter";
import { subscribeAfter } from 'redux-subscribe-action';

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
  
  componentDidUpdate(){
    let quantity = this.totalQuantityOfItems()
    if(this.state.quantity !== quantity){
      this.setState({
        quantity: quantity
      })
    }
  }
  unsubscribe = subscribeAfter(
    () => this.forceUpdate()
  );
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
      this.setState({ showCurrency: false, removedCurrency: true});  
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
    this.setState({showCurrency: false})
    if (!this.state.showCart && !this.state.removedCart) {
      this.setState({ showCart: true, removedCart: false });
      this.props.sendTint();
    }
  }
  // style for button with category that's currently selected
  appropriateStyle(name) {
    let selectedStyle = {};
    this.props.category === name
      ? (selectedStyle = {
          color: "#5ECE7B",
          boxShadow: "0px 2px #5ece7b",
          fontWeight: "800",
        })
      : (selectedStyle = {});
    return selectedStyle;
  }
  totalQuantityOfItems() {
    let totalQuantity = 0;
    this.props.cart.forEach(element => {
      totalQuantity += element.quantity
    });
    return totalQuantity
  }
  render() {
    if (this.props.categories.length === 0) return null;
    return (
      <div className="NavBar">
        <div className="CategoriesContainer">
          {this.props.categories.map((category, id) => {
            let selectedStyle = this.appropriateStyle(category.name);
            return (
              <Link key={id} to={`/shop/${this.props.categories[id].name}`}>
                <button
                  style={selectedStyle}
                  className="CategorySelector"
                  type="button"
                  onClick={() => this.props.setCategory(category.name)}
                >
                  {category.name.toUpperCase()}
                </button>
              </Link>
            );
          })}
        </div>
        <div className="LogoContainer">
          {/* clicling logo brings user to home page */}
          <Link to={`/`}>
            <img className="Logo" src={logo} alt="logo" />
          </Link>
        </div>
        <div className="CurrencyCartContainer">
          <button
            className="CartButton"
            onClick={() => {
              this.handleCurrencyPickerButtonClick()
            }}
          >
            {getSymbol(this.props.currency.name)}
            <img
              src={Arrow}
              style={{
                marginLeft: "10px",
                transform: `rotate(${180 * this.state.showCurrency + 180}deg)`,
              }}
              alt="arrow"
            />
          </button>
          <OutsideClickHandler onOutsideClick={() => this.handleClickOutsideCurrencyPicker()}>
          <NBCurrencyPicker
            expanded={this.state.showCurrency}
            sendCloseCurrency={this.getCloseCurrency}
          />
          </OutsideClickHandler>
          <button
            className="CartButton"
            onClick={() => this.handleCartButtonClick()}
          >
            {this.props.cart.length ? (
              <div className="ItemAmountCircle">{this.state.quantity}</div>
            ) : (
              <div />
            )}
            <img src={Cart} style={{ height: "20px" }} alt="cart"></img>
          </button>
          <OutsideClickHandler onOutsideClick={() => this.handleClickOutsideCart()}>
            <NBCart expanded={this.state.showCart} sendTint={this.getTint} refreshParent={this.getRefresh} />
          </OutsideClickHandler>
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
