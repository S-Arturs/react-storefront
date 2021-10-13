import React from 'react';
import './CartPage.css'
import { connect} from "react-redux";
import NBCartProductCard from "../Components/NavBarComponents/NBCartProductCard";
import { Link } from "react-router-dom";

const mapStateToProps = (state) => {
  return {
    cart: state.cart,
  };
};

class Cart extends React.Component {
  constructor(props) {
    super(props);
    this.getRefresh = this.getRefresh.bind(this);
    this.state = {}
    
  }
  
  // force refresh when a children component changes
  getRefresh() {
    this.forceUpdate();
  }

  setProductCards(){
    return this.props.cart.map((product, index) => (
      <NBCartProductCard origin={"cart"} refreshParent={this.getRefresh} index={index} product={product} key={index} />
    ))
  }

  render() {
    return (
      <div className="CartContainer">
        <h1 className="CartTitle">CART</h1>
        {this.setProductCards()}
            <Link to={'/cart'}>
            </Link>
      </div>
    );
  }
}
export default connect(mapStateToProps)(Cart);
