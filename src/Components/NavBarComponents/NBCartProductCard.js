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
      totalAmount: this.calculateTotalAmount(),
      pictureId: 0,
    };
  }
  componentDidUpdate() {
    // this.recalculateTotalAmount()
  }
  
  incrementQuantity() {
    this.props.incrementQuantity(this.props.index);
    this.forceUpdate();
    // this.recalculateTotalAmount();
    this.props.refreshParent();
  }

  decrementQuantity() {
    if(this.props.cart[this.props.index].quantity == 1){
      this.removeItem()
      return
    }
    this.props.decrementQuantity(this.props.index);
    this.forceUpdate();
    this.props.refreshParent();
  }

  removeItem() {
    this.props.removeFromCart(this.props.index);
    this.forceUpdate();
    this.props.refreshParent();
  }

  recalculateTotalAmount() {
    let newTotalAmount = this.calculateTotalAmount()
    if(this.state.totalAmount !== newTotalAmount){
      this.setState({
      totalAmount: newTotalAmount,
      pictureId: 0,
    });
    }
  }
  calculateTotalAmount(){
    return (this.props.cart[this.props.index].prices[this.props.currency.id].amount
    ).toLocaleString("en-US", {
      style: "currency",
      currency: this.props.currency.name,
    })
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

  render() {
    // this component also can be called by different parent components, so style depends on the origin
    let className = this.props.origin + "Container";
    return (
      <div style={this.props.origin === "cart" ? { width: "100%" } : {}}>
        {this.props.origin === "cart" ? <hr /> : <div />}
        <div className={className}>
          <div className="NamePriceAttributeContainer">
            <div>
              <p className="ItemBrandName">{this.props.product.brand}</p>
              <p className="ItemName">{this.props.product.name}</p>
              <p className="MiniCartPrice">{this.state.totalAmount}</p>
            </div>
            <div>
              {this.props.cart[this.props.index].attributes.map(
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
              )}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div className="QuantityContainer">
              <button
                className="UniversalButton"
                onClick={() => this.incrementQuantity()}
              >
                <img
                  className="SVGLine"
                  style={{ transform: "rotate(90deg)" }}
                  src={Line}
                  alt="line"
                />
                <img className="SVGLine" src={Line} alt="line"/>
              </button>
              <div className="QuantityNumberContainer">
                {this.props.cart[this.props.index].quantity}
              </div>
              <div id="DecrementRemoveButton">
                <button
                  id="DecrementButton"
                  className="UniversalButton"
                  disabled={this.props.cart[this.props.index].quantity < 1}
                  onClick={() => this.decrementQuantity()}
                >
                  <img className="SVGLine" src={Line} alt="line"/>
                </button>
                <button
                  className="RemoveItem"
                  onClick={() => this.removeItem()}
                >
                  <img
                    className="SVGLine"
                    style={{ transform: "rotate(45deg)" }}
                    src={Line}
                    alt="line"
                  />
                  <img
                    className="SVGLine"
                    style={{ transform: "rotate(135deg)" }}
                    src={Line}
                    alt="line"
                  />
                </button>
              </div>
            </div>
            {this.props.origin === "cart" ? (
              <div>
                <div className="ImageContainerForCart">
                  <button
                    className="PreviousButton"
                    onClick={() => this.previousPicture()}
                  >
                    <img
                      className="SVGArrow"
                      src={Arrow}
                      disabled={this.props.cart[this.props.index].gallery.length < 1}
                      style={{ transform: "rotate(-90deg)", opacity: `${this.props.cart[this.props.index].gallery.length - 1}` } }
                      alt="line"
                    ></img>{" "}
                  </button>

                  <img
                    id="ProductImage"
                    src={
                      this.props.cart[this.props.index].gallery[
                        this.state.pictureId
                      ]
                    }
                    alt="line"
                  />
                  <button className="NextButton" onClick={() => this.nextPicture()}>
                    <img
                      disabled={this.props.cart[this.props.index].gallery.length < 1}
                      className="SVGArrow"
                      src={Arrow}
                      style={{ transform: "rotate(90deg)", opacity: `${this.props.cart[this.props.index].gallery.length - 1}` }}
                      alt="line"
                    ></img>
                  </button>
                </div>
              </div>
            ) : (
              <div className="ImageContainer">
                <img
                  id="ProductImage"
                  src={
                    this.props.cart[this.props.index].gallery[
                      this.state.pictureId
                    ]
                  }
                  alt="line"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NBCartProductCard);
