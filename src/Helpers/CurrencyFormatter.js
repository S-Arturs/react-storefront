function getSymbol(currencyName) {
    if (currencyName === "RUB") return "₽";
    let symbolAndAmount = (0).toLocaleString("en-US", {
      style: "currency",
      currency: currencyName,
    });
    let extractedSymbol = symbolAndAmount.slice(
      0,
      symbolAndAmount.indexOf("0")
    );
    return extractedSymbol;
  }

function getFormattedCurrency(currencyName, amount) {
    let formattedAmount = amount.toLocaleString("en-US", {
        style: "currency",
        currency: currencyName,
      })
    if(currencyName === "RUB"){
        formattedAmount = formattedAmount.slice(formattedAmount.indexOf(' ') + 1)
        formattedAmount = "₽" + formattedAmount;
    }
    return formattedAmount;
}

export { getSymbol, getFormattedCurrency }
