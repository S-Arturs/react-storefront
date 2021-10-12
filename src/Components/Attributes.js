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
  clickHandler(index) {
    if (
      this.props.origin === "productCard" ||
      this.props.origin === "productPage"
    ) {
      this.props.sendAttributeData([this.props.index, index]);
      this.setState({
        activeAttributeIndex: index,
      });
    }
  }
  render() {
    console.log(this.props.origin)
    return (
      <div>
        {this.props.origin === "productCard" || this.props.origin === "NBCart" ? (
          <p id="ProductCardAttributeName">{this.props.attribute.name}</p>
        ) : this.props.origin === "productPage" ? (
          <p id="ProductPageAttributeName">{this.props.attribute.name}</p>
        ) : (
          <div />
        )}
        {this.props.attribute.items.map((choice, index) => {
          let background = "#ffffff";
          let buttonText = choice.value;
          let opacity = 0.5;
          let color = "Black";
          // swatch attributes have different style requirements
          if (this.props.attribute.type === "swatch") {
            background = choice.value;
            buttonText = " ";
            if (index === this.state.activeAttributeIndex) opacity = 1;
          } else {
            if (index === this.state.activeAttributeIndex) {
              background = "#1D1F22";
              opacity = 1;
              color = "white";
            }
          }
          return (
            <button
              key={index}
              className={
                this.props.origin === "cart" ||
                this.props.origin === "productPage"
                  ? "AttributesButtons"
                  : "MiniAttributesButtons"
              }
              style={{
                backgroundColor: `${background}`,
                opacity: `${opacity}`,
                color: `${color}`,
              }}
              type="button"
              onClick={() => this.clickHandler(index)}
            >
              {buttonText}
            </button>
          );
        })}
      </div>
    );
  }
}
export default Attributes;
