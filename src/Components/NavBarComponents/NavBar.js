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
    this.getCloseCurrency = this.getCloseCurrency.bind(this);
    this.getTint = this.getTint.bind(this);
    this.state = {
      removedCart: false,
      showCart: false,
      showCurrency: false,
    };
  }
  getSymbol(currencyName) {
    if (currencyName === "RUB") return "₽";
    let symbolAndAmount = (0).toLocaleString("en-US", {
      style: "currency",
      currency: currencyName,
    });
    let extractedSymbol = symbolAndAmount.slice(
      0,
      symbolAndAmount.indexOf("0")
    );
    return extractedSymbol;
  }
  getCloseCurrency() {
    this.setState({ showCurrency: false });
  }
  getTint() {
    this.setState({ showCart: false });
    this.props.sendTint();
  }
  handleOutsideClick() {
    if (this.state.showCart) {
      this.setState({ showCart: false, removedCart: true });
      this.props.sendTint();
    } else {
      this.setState({
        removedCart: false,
      });
    }
  }
  handleCartButtonClick() {
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

  render() {
    if (this.props.categories.length === 0) return null;
    return (
      <div id="NavBar">
        <div id="CategoriesContainer">
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
        <div id="LogoContainer">
          {/* clicling logo brings user to home page */}
          <Link to={`/`}>
            <img className="Logo" src={logo} alt="logo" />
          </Link>
        </div>
        <div id="CurrencyCartContainer">
          <button
            className="CartButton"
            onClick={() => {
              this.setState({ showCurrency: !this.state.showCurrency });
            }}
          >
            {this.getSymbol(this.props.currency.name)}
            <img
              src={Arrow}
              style={{
                marginLeft: "10px",
                transform: `rotate(${180 * this.state.showCurrency + 180}deg)`,
              }}
              alt="arrow"
            />
          </button>
          <NBCurrencyPicker
            expanded={this.state.showCurrency}
            sendCloseCurrency={this.getCloseCurrency}
          />
          <button
            className="CartButton"
            onClick={() => this.handleCartButtonClick()}
          >
            {this.props.cart.length ? (
              <div id="ItemAmountCircle">{this.props.cart.length}</div>
            ) : (
              <div />
            )}
            <img src={Cart} style={{ height: "20px" }} alt="cart"></img>
          </button>
          <OutsideClickHandler onOutsideClick={() => this.handleOutsideClick()}>
            <NBCart expanded={this.state.showCart} sendTint={this.getTint} />
          </OutsideClickHandler>
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(NavBar);
