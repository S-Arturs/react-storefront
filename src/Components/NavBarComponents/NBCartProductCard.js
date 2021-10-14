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
  setCurrency,
} from "../../Actions";
import { getFormattedCurrency } from "../../Helpers/CurrencyFormatter";
import uuid from "react-uuid";

const mapStateToProps = (state) => {
  return {
    cart: state.cart,
    currency: state.currency,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setCurrency: (currency) => dispatch(setCurrency(currency)),
    removeFromCart: (id) => dispatch(removeFromCart(id)),
    incrementQuantity: (id) => dispatch(incrementQuantity(id)),
    decrementQuantity: (id) => dispatch(decrementQuantity(id)),
  };
};

class NBCartProductCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      setContainerClassName: this.props.origin + "ContainerContainer",
      totalAmount: getFormattedCurrency(
        this.props.currency.name,
        this.props.cart[this.props.index].prices[this.props.currency.id].amount
      ),
      pictureId: 0,
    };
  }

  componentDidUpdate() {
    const { cart, index, currency } = this.props;
    if (typeof cart[index] === "undefined") return;
    let formattedCurrency = getFormattedCurrency(
      currency.name,
      cart[index].prices[currency.id].amount
    );
    if (this.state.totalAmount !== formattedCurrency) {
      this.setState({ totalAmount: formattedCurrency });
    }
  }
  incrementQuantity() {
    const { incrementQuantity, index, setCurrency, currency } = this.props;
    incrementQuantity(index);
    //quantity is a nested property in redux cart object.
    //because of that, none of the subscribed components are notified when quantity of an item changes.
    //a hack-y workaround is updating currency object, which all components are subscribed to.
    setCurrency(JSON.parse(JSON.stringify(currency)));
    this.forceUpdate();
  }

  decrementQuantity() {
    const { decrementQuantity, cart, index, setCurrency, currency } =
      this.props;
    if (cart[index].quantity === 1) {
      this.removeItem();
      return;
    }
    decrementQuantity(index);
    setCurrency(JSON.parse(JSON.stringify(currency)));
    this.forceUpdate();
  }

  removeItem() {
    this.setState({ pictureId: 0 });
    const { removeFromCart, index, setCurrency, currency } = this.props;
    removeFromCart(index);
    setCurrency(JSON.parse(JSON.stringify(currency)));
    this.forceUpdate();
  }

  nextPicture() {
    const { cart, index } = this.props;
    this.setState({
      pictureId: (this.state.pictureId + 1) % cart[index].gallery.length,
    });
  }
  previousPicture() {
    const { cart, index } = this.props;
    this.setState({
      pictureId:
        this.state.pictureId === 0
          ? cart[index].gallery.length - 1
          : this.state.pictureId - 1,
    });
  }

  setAttributes() {
    const { cart, index, origin } = this.props;
    return cart[index].attributes.map((attribute, id) => (
      <Attributes
        origin={origin}
        attribute={attribute}
        productId={index}
        index={id}
        sendAttributeData={this.getAttributeData}
        key={uuid()}
      />
    ));
  }

  setDisableGalleryButtons() {
    if (this.props.origin !== "cart") return true;
    return this.props.cart[this.props.index].gallery.length < 2;
  }

  setClassName() {
    return this.props.origin + "Container";
  }
  setContainerClassName() {
    return this.props.origin + "ContainerContainer";
  }

  render() {
    // this component also can be called by different parent components, so style depends on the origin
    const { cart, index } = this.props;
    const { totalAmount, pictureId } = this.state;
    if (typeof cart[index] === "undefined") return null;
    return (
      <div className={this.setContainerClassName()}>
        <hr />
        <div className={this.setClassName()}>
          <div className="NamePriceAttributeContainer">
            <div>
              <p className="ItemBrandName">{cart[index].brand}</p>
              <p className="ItemName">{cart[index].name}</p>
              <p className="MiniCartPrice">{totalAmount}</p>
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
                {cart[index].quantity}
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
                src={cart[index].gallery[pictureId]}
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
