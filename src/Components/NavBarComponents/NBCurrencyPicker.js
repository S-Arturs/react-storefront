import React from "react";
import "./NBCurrencyPicker.css";
import { connect } from "react-redux";
import {setCurrency } from "../../Actions";
import Expand from "react-expand-animated";
import { fetchCurrencies } from "../../Api/Fetch";
import { getSymbol } from "../../Helpers/CurrencyFormatter";

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

  render() {
    if(!this.state.fetched) return null
    return (
      <div className="CurrencyPicker">
        <Expand open={this.props.expanded}>
          <div className="CurrenciesContainer">
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
                  {getSymbol(currencyName) + " " + currencyName}
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
