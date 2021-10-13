import React from "react";
import "./NBCart.css";
import Expand from "react-expand-animated";
import { connect } from "react-redux";
import { addToCart } from "../../Actions";
import NBCartProductCard from "./NBCartProductCard";
import { Link } from "react-router-dom";
import { getFormattedCurrency } from '../../Helpers/CurrencyFormatter';

const mapStateToProps = (state) => {
  return {
    cart: state.cart,
    currency: state.currency,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addToCart: (id) => dispatch(addToCart(id)),
  };
};

class NBCart extends React.Component {
  constructor(props) {
    super(props);
    this.getRefresh = this.getRefresh.bind(this);
    this.state = {
      totalQuantity: 0,
      totalAmount: 0,
      expanded: this.props.expanded,
    };
  }

  componentDidMount() {
    this.setQuantityAndAmount()
  }

  getRefresh() {  
    this.forceUpdate();
    this.props.refreshParent();
  }

  componentDidUpdate() {
    this.setQuantityAndAmount()
  }

  setQuantityAndAmount(){
    let totalAmount = 0;
    let totalQuantity = 0;
    for (let i = 0; i < this.props.cart.length; i++) {
      totalQuantity += this.props.cart[i].quantity;
      totalAmount +=
        this.props.cart[i].prices[this.props.currency.id].amount *
        this.props.cart[i].quantity;
    }
    totalAmount = Math.round(totalAmount * 100) / 100;
    if (totalAmount !== this.state.totalAmount) {
      this.setState({
        totalQuantity: totalQuantity,
        totalAmount: totalAmount,
      });
    }
  }
  render() {
    // add scroll wheel only if the contents don't fit
    let hideScrollWheel = "initial";
    if (this.props.expanded) {
      hideScrollWheel = "auto";
    } else {
      hideScrollWheel = "hidden";
    }
    return (
      <div
        style={{
          // changing padding to margin so that we don't have 
          // a white restangle floating around when cart is not expanded
          overflow: `${hideScrollWheel}`,
          padding: `${16 * this.props.expanded}px`,
          margin: `${16 * (1 - this.props.expanded)}px`,
        }}
        className="NBCartMiniContainer"
      >
        <Expand
          open={this.props.expanded}
          transitions={["opacity", "background"]}
        >
          <p className="MyBag">
            My bag, <b id="ItemCount">{this.props.cart.length} items</b>
          </p>
          {this.props.cart.map((e, id) => (
            <NBCartProductCard
              origin={"NBCart"}
              refreshParent={this.getRefresh}
              index={id}
              product={e}
              key={id + 1000}
            />
          ))}
          <div className="TotalContainer">
            <p>Total</p>{" "}
            <b className="TotalContainerAmount">
              {getFormattedCurrency(this.props.currency.name ,this.state.totalAmount)}
            </b>
          </div>

          <span>
            <div className="ButtonsContainer">
              <Link className="ViewBagLink" to={"/cart"}>
                <button
                  className="ViewBagButton"
                  onClick={() => this.props.sendTint()}
                >
                  VIEW BAG
                </button>
              </Link>
              <button className="CheckOutButton">CHECK OUT</button>
            </div>
          </span>
        </Expand>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(NBCart);
