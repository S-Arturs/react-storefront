import React from "react";
import Line from "../../Assets/SVG/Line.svg";
import Arrow from "../../Assets/SVG/Arrow.svg";
import "./NBCartProductCard.css";
import Attributes from "../Attributes";
import { connect } from "react-redux";
import {
  decrementQuantity,
  incrementQuantity,
  removeFromCart,
} from "../../Actions";
import { getFormattedCurrency } from "../../Helpers/CurrencyFormatter";
import { subscribeAfter } from "redux-subscribe-action";

const mapStateToProps = (state) => {
  return {
    cart: state.cart,
    currency: state.currency,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    removeFromCart: (id) => dispatch(removeFromCart(id)),
    incrementQuantity: (id) => dispatch(incrementQuantity(id)),
    decrementQuantity: (id) => dispatch(decrementQuantity(id)),
  };
};

class NBCartProductCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      totalAmount: getFormattedCurrency(
        this.props.currency.name,
        this.props.cart[this.props.index].prices[this.props.currency.id].amount
      ),
      pictureId: 0,
    };
  }
  unsubscribe = subscribeAfter(() => this.forceUpdate());

  incrementQuantity() {
    this.props.incrementQuantity(this.props.index);
    this.props.refreshParent();
  }

  decrementQuantity() {
    if (this.props.cart[this.props.index].quantity == 1) {
      this.removeItem();
      return;
    }
    this.props.decrementQuantity(this.props.index);
    this.props.refreshParent();
  }

  removeItem() {
    this.props.removeFromCart(this.props.index);
    this.forceUpdate();
    this.props.refreshParent();
  }

  recalculateTotalAmount() {
    let newTotalAmount = this.calculateTotalAmount();
    if (this.state.totalAmount !== newTotalAmount) {
      this.setState({
        totalAmount: newTotalAmount,
        pictureId: 0,
      });
    }
  }
  calculateTotalAmount() {
    this.setState({
      totalAmount: getFormattedCurrency(
        this.props.currency.name,
        this.props.cart[this.props.index].prices[this.props.currency.id].amount
      ),
    });
  }

  nextPicture() {
    this.setState({
      pictureId:
        (this.state.pictureId + 1) %
        this.props.cart[this.props.index].gallery.length,
    });
  }
  previousPicture() {
    this.setState({
      pictureId:
        this.state.pictureId === 0
          ? this.props.cart[this.props.index].gallery.length - 1
          : this.state.pictureId - 1,
    });
  }

  setAttributes() {
    return this.props.cart[this.props.index].attributes.map(
      (attribute, index) => (
        <Attributes
          origin={this.props.origin}
          attribute={attribute}
          productId={this.props.index}
          index={index}
          sendAttributeData={this.getAttributeData}
          key={index}
        />
      )
    );
  }

  setDisableGalleryButtons() {
    if (this.props.origin !== "cart") return true;
    return this.props.cart[this.props.index].gallery.length < 2;
  }

  setHR(){

  }

  render() {
    // this component also can be called by different parent components, so style depends on the origin
    if (typeof this.props.cart[this.props.index] === "undefined") return null;
    let className = this.props.origin + "Container";
    let containerClassName = this.props.origin + "ContainerContainer";
    console.log(containerClassName)
    return (
      <div className={containerClassName}>
        <hr/>
        <div className={className}>
          <div className="NamePriceAttributeContainer">
            <div>
              <p className="ItemBrandName">{this.props.product.brand}</p>
              <p className="ItemName">{this.props.product.name}</p>
              <p className="MiniCartPrice">{this.state.totalAmount}</p>
            </div>
            <div>{this.setAttributes()}</div>
          </div>
          <div className="NamePriceAttributeSubContainer">
            <div className="QuantityContainerNB">
              <button
                className="UniversalButton"
                onClick={() => this.incrementQuantity()}
              >
                <img className="SVGLine Upright" src={Line} alt="line" />
                <img className="SVGLine" src={Line} alt="line" />
              </button>
              <div className="QuantityNumberContainer">
                {this.props.cart[this.props.index].quantity}
              </div>
              <div className="DecrementRemoveButton">
                <button
                  className="DecrementButton"
                  onClick={() => this.decrementQuantity()}
                >
                  <img className="SVGLine" src={Line} alt="line" />
                </button>
                <button
                  className="RemoveItem"
                  onClick={() => this.removeItem()}
                >
                  <img className="SVGLine Left" src={Line} alt="line" />
                  <img className="SVGLine Right" src={Line} alt="line" />
                </button>
              </div>
            </div>
            <div className="ImageContainerForCart">
              <button
                className="PreviousButton"
                onClick={() => this.previousPicture()}
                disabled={this.setDisableGalleryButtons()}
              >
                <img src={Arrow} alt="line"></img>{" "}
              </button>

              <img
                className="ProductImage"
                src={
                  this.props.cart[this.props.index].gallery[
                    this.state.pictureId
                  ]
                }
                alt="line"
              />
              <button
                className="NextButton"
                onClick={() => this.nextPicture()}
                disabled={this.setDisableGalleryButtons()}
              >
                <img src={Arrow} alt="line"></img>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(NBCartProductCard);
