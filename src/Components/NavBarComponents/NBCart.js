import React from "react";
import "./NBCart.css";
import Expand from "react-expand-animated";
import { connect } from "react-redux";
import { addToCart } from "../../Actions";
import NBCartProductCard from "./NBCartProductCard";
import { Link } from "react-router-dom";
import { getFormattedCurrency } from "../../Helpers/CurrencyFormatter";
import uuid from 'react-uuid'

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
    this.setQuantityAndAmount();
  }

  getRefresh() {
    this.forceUpdate();
    this.props.refreshParent();
  }

  componentDidUpdate() {
    this.setQuantityAndAmount();
  }

  setQuantityAndAmount() {
    const { cart, currency } = this.props;
    let totalAmount = 0;
    let totalQuantity = 0;
    for (let i = 0; i < cart.length; i++) {
      totalQuantity += cart[i].quantity;
      totalAmount += cart[i].prices[currency.id].amount * cart[i].quantity;
    }
    totalAmount = Math.round(totalAmount * 100) / 100;
    if (totalAmount !== this.state.totalAmount) {
      this.setState({
        totalQuantity: totalQuantity,
        totalAmount: totalAmount,
      });
    }
  }

  setProductCards() {
    return this.props.cart.map((e, id) => (
      <NBCartProductCard
        origin={"NBCart"}
        refreshParent={this.getRefresh}
        index={id}
        product={e}
        key={uuid()}
      />
    ));
  }

  setClassName() {
    if (this.props.expanded) return "NBCartMiniContainer";
    return "NBCartMiniContainer Shrunk";
  }

  setFormattedCurrency() {
    return getFormattedCurrency(
      this.props.currency.name,
      this.state.totalAmount
    );
  }
  render() {
    const { expanded, sendTint } = this.props;
    return (
      <div className="OuterContainer">
        <div className={this.setClassName()}>
          <Expand open={expanded} transitions={["opacity", "background"]}>
            <p className="MyBag">
              My bag,{" "}
              <b className="ItemCount">{this.state.totalQuantity} items</b>
            </p>
            {this.setProductCards()}
            <div className="TotalContainer">
              <p>Total</p>
              <b className="TotalContainerAmount">
                {this.setFormattedCurrency()}
              </b>
            </div>

            <span>
              <div className="ButtonsContainer">
                <Link className="ViewBagLink" to={"/cart"}>
                  <button className="ViewBagButton" onClick={() => sendTint()}>
                    VIEW BAG
                  </button>
                </Link>
                <button className="CheckOutButton">CHECK OUT</button>
              </div>
            </span>
          </Expand>
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(NBCart);
