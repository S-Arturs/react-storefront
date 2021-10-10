import React from "react";
import "./NBCurrencyPicker.css";
import { connect } from "react-redux";
import {setCurrency } from "../../Actions";
import Expand from "react-expand-animated";
import { fetchCurrencies } from "../../Api/Fetch";

const mapStateToProps = (state) => {
  return {
    category: state.categorizer,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setCurrency: (currency) => dispatch(setCurrency(currency)),
  };
};

class NBCurrencyPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currencies: [],
      currenc: [],
      fetched: false,
    };
  }
  async componentDidMount() {
    const queryResult = await fetchCurrencies();
    let currencies = queryResult.currencies;
    this.setState({
      currencies: currencies,
      fetched: true,
    });
  }

  getSymbol(currencyName) {
    if (currencyName === "RUB") return "₽";
    let symbolAndAmount = (0).toLocaleString("en-US", {
      style: "currency",
      currency: currencyName,
    });
    let extractedSymbol = symbolAndAmount.slice(0, symbolAndAmount.indexOf("0"));
    return extractedSymbol
  }

  render() {
    if(!this.state.fetched) return null
    return (
      <div id="CurrencyPicker">
        <Expand open={this.props.expanded}>
          <div id="CurrenciesContainer">
            {this.state.fetched ? (
              this.state.currencies.map((currencyName, id) => (
                <button
                  className="CurrencyButton"
                  key={id}
                  type="button"
                  onClick={() => {
                    this.props.setCurrency({
                      id: id,
                      name: this.state.currencies[id],
                    });
                    this.props.sendCloseCurrency();
                  }}
                >
                  {this.getSymbol(currencyName) + " " + currencyName}
                </button>
              ))
            ) : (
              <div></div>
            )}
          </div>
        </Expand>
      </div>
    );
  }
}
export default connect(mapStateToProps,mapDispatchToProps)(NBCurrencyPicker);
