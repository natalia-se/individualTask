const productContainer = document.getElementById("root");
const totalContainer = document.getElementById("total");

const url = "https://mock-data-api.firebaseio.com/webb21/products.json";
let clicks = 0;
let totalSum = 0;
let shopingList = [];
let products = [];

function addToBasket(name, price) {
  let product = shopingList.find((item) => item.name === name);

  if (product) product.amount++;
  else shopingList.push({ name, price, amount: 1 });
  return;
}

function showBasket() {
  const basketContainer = document.getElementById("basket");

  basketContainer.innerText = "";

  shopingList.forEach((item) => {
    const productList = document.createElement("p");
    productList.innerHTML = `${item.name} för ${item.price} kr - ${item.amount} st`;
    productList.className = "productInBasket";

    basketContainer.appendChild(productList);
  });
}

function createTotalField(price) {
  totalSum += price;
  clicks++;
  totalContainer.innerText = `Total: ${clicks} st för ${totalSum} kr`;
}

function productItemOnClick(productItem) {
  return function () {
    createTotalField(productItem.price);

    addToBasket(productItem.name, productItem.price);

    showBasket();
  };
}

function createName(productItem) {
  const productName = document.createElement("h1");
  productName.innerHTML = productItem.name;
  return productName;
}

function createDescription(productItem) {
  const productDescription = document.createElement("p");
  productDescription.innerHTML = productItem.description;
  return productDescription;
}

function createImage(productItem) {
  const productImage = document.createElement("img");
  productImage.src = productItem.images[0].src.small;
  productImage.alt = productItem.images[0].alt;
  productImage.addEventListener("click", productItemOnClick(productItem));

  return productImage;
}

function createButton(productItem) {
  const button = document.createElement("button");
  button.innerText = "Köp";

  button.addEventListener("click", productItemOnClick(productItem));

  return button;
}

function createParagraph(productItem, key) {
  const paragraph = document.createElement("p");

  paragraph.innerHTML = productItem[key] ? `${key}: ${productItem[key]}` : "";
  paragraph.className = "productInfo";
  return paragraph;
}

function renderProductItem(productItem) {
  productContainer.appendChild(createName(productItem));

  productContainer.appendChild(createImage(productItem));

  productContainer.appendChild(createDescription(productItem));

  productContainer.appendChild(createParagraph(productItem, "price"));

  productContainer.appendChild(createParagraph(productItem, "rating"));

  productContainer.appendChild(createParagraph(productItem, "stock"));

  productContainer.appendChild(createButton(productItem));
}

function renderProductList(data) {
  productContainer.innerHTML = "";
  Object.entries(data).forEach((item) => {
    const productItem = item[1];
    renderProductItem(productItem);
  });
}

function filterData() {
  let filterRating = document.getElementById("filter").value;
  filterRating = !filterRating ? 0 : filterRating;
  const filteredData = products.filter(
    (item) => item.rating >= parseFloat(filterRating)
  );

  renderProductList(filteredData);
}

function getProductList() {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      products = data;
      renderProductList(data);
    });
}

getProductList();
