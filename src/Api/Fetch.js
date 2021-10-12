import { client } from "@tilework/opus";
import { Query } from "@tilework/opus";

client.setEndpoint("http://localhost:4000/");
async function fetchProducts(category) {
  let query;
  if (category === "all") {
    category = "";
  }

  query = new Query(
    `          
  category(input: {title: "${category}"}){
    name
    products{
      name
      brand   
      id
      inStock
      gallery
      prices{
        currency
        amount
        }
      attributes{
        id
        name
        type
        items{
          displayValue
          value
          id
          }
        }
      }
    } 
`
  );
  return performFetch(query);
}

async function fetchCategories() {
  const query = new Query(
    `categories{
            name
          }`,
    true
  );
  return performFetch(query);
}

async function fetchProductPage(productId) {
  const query = new Query(
    `
      product(id: "${productId}")
      {
        brand
        name
        prices{
          currency
          amount
        }
        inStock
        gallery
        description
        attributes
        {
          id
          name
          type
          items
          {
            displayValue
            value
            id
          }
        }
      }
            `,
    true
  );
  return performFetch(query);
}

async function fetchCurrencies() {
  const query = new Query(`currencies`, true);
  return performFetch(query);
}

async function performFetch(query) {
  let queryResult = "error";
  try {
    queryResult = await client.post(query);
  } catch {
    return queryResult;
  }
  if (
    Object.keys(queryResult)[0] === 0 ||
    queryResult[Object.keys(queryResult)[0]] === null
  ) {
    queryResult = "error";
  }
  console.log(queryResult);
  return queryResult;
}

export { fetchProducts, fetchCategories, fetchProductPage, fetchCurrencies };
