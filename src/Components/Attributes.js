import React from "react";
import "./Attributes.css";

class Attributes extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeAttributeIndex: this.props.attribute.selectedvalue,
    };
  }
  // this component gets called from multiple parents,
  // so functionality and styling depend on the origin (parent)
  clickHandler(id) {
    const { origin, sendAttributeData, index } = this.props;
    if (origin === "productCard" || origin === "productPage") {
      sendAttributeData([index, id]);
      this.setState({
        activeAttributeIndex: id,
      });
    }
  }
  setAttributeButtonClass(index) {
    const { origin, attribute } = this.props;
    let className = "AttributeButtons";
    if (origin === "cart" || origin === "productPage") {
      className += " Large";
    } else {
      className += " Small";
    }
    if (!attribute.type === "swatch") {
      className += " Swatch";
    } else {
      className += " Text";
    }
    if (index === this.state.activeAttributeIndex) {
      className += " Active";
    } else {
      className += " Inactive";
    }
    return className;
  }

  setAttributeItems() {
    const { attribute } = this.props;
    return attribute.items.map((choice, index) => {
      this.setAttributeButtonClass(index);
      let style;
      let buttonText = choice.value;
      if (attribute.type === "swatch") {
        style = { backgroundColor: `${choice.value}` };
        buttonText = "";
      }
      return (
        <button
          key={index}
          className={this.setAttributeButtonClass(index)}
          style={style}
          type="button"
          onClick={() => this.clickHandler(index)}
        >
          {buttonText}
        </button>
      );
    });
  }
  setAttributeNameClassName() {
    const { origin } = this.props;
    let className = "ProductCardAttributeName";
    if (origin === "cart" || origin === "productPage") {
      className += " Large";
    }
    return className;
  }
  render() {
    const { attribute: { name }} = this.props;
    return (
      <div>
        <p className={this.setAttributeNameClassName()}>{name}</p>
        {this.setAttributeItems()}
      </div>
    );
  }
}
export default Attributes;
