// #region  ----- GLOBAL DECLARATION --------

const _baseURL = `https://fakestoreapi.com/`; //set base URL
var _tableBody; // store tableBody content
var _categorytableBod;
var categorylist;

// #endregion  ----- GLOBAL DECLARATION --------

// handle API call
const getCategoryList = new Promise((resolve, reject) => {
  fetch(_baseURL + `products/categories`).then((res) => {
    if (res && res.status) {
      let resStatus = res.status; // get response status here
      // handle different response code status scenirio
      switch (resStatus) {
        case 200:
          resolve(res);
          break;
        case 401:
          throw Error(`Unauthorized Request`);
        default:
          throw Error(`Invalid Request`);
      }
    } else {
      // throw an error or display the error message on toaster.
      throw Error("Invalid Request");
    }
  });
});

// #region  ----- CRUD OPERATIONS --------
// get all categories
getCategoryList
  .then((apiResponse) => apiResponse.json())
  .then((data) => {
    categorylist = data;
    intializeCategorytable(); // clear table content before binding to avoid data overwritten issue
    data.forEach(prepareCategoriesTable); // bind table data
  });

function viewProductBasedOnCategory(category) {
  console.log(category);
  const getProductList = new Promise((resolve, reject) => {
    fetch(_baseURL + `products/category/` + category).then((res) => {
      // check if response object is not null/undefined
      if (res && res.status) {
        let resStatus = res.status; // get response status here
        // handle different response code status scenirio
        switch (resStatus) {
          case 200:
            resolve(res);
            break;
          case 401:
            throw Error(`Unauthorized Request`);
          default:
            throw Error(`Invalid Request`);
        }
      } else {
        // throw an error or display the error message on toaster.
        throw Error("Invalid Request");
      }
    });
  });

  // get all products
  getProductList
    .then((apiResponse) => apiResponse.json())
    .then((data) => {
      intializeTable(); // clear table content before binding to avoid data overwritten issue
      data.forEach(prepateProductViewTable); // bind table data
    });
}

// #endregion  ----- CRUD OPERATIONS --------

// #region  ----- TABLE MODIFCATION --------
function intializeTable() {
  document.getElementById("productDiv").style.display = "block";
  _tableBody = document.getElementById("productTable");
  _tableBody.innerHTML = "";
}

function intializeCategorytable() {
  _categorytableBod = document.getElementById("categoryTable");
  _categorytableBod.innerHTML = "";
}

function prepateProductViewTable(item) {
  let tr = document.createElement("tr");

  let imgRow = document.createElement("img");
  imgRow.src = item.image;
  imgRow.style.width = "70px";
  imgRow.style.height = "50px";
  tr.appendChild(imgRow);

  let titleRow = document.createElement("td");
  titleRow.appendChild(document.createTextNode(item.title));
  tr.appendChild(titleRow);

  let categoryRow = document.createElement("td");
  categoryRow.appendChild(document.createTextNode(item.category));
  tr.appendChild(categoryRow);

  let priceRow = document.createElement("td");
  priceRow.appendChild(document.createTextNode(item.price));
  tr.appendChild(priceRow);
  _tableBody.appendChild(tr);
}

function prepareCategoriesTable(item) {
  let tr = document.createElement("tr");

  let categoryName = document.createElement("td");
  categoryName.appendChild(document.createTextNode(item));
  tr.appendChild(categoryName);

  let actionRow = document.createElement("td");
  actionRow.appendChild(
    createButtonElement(
      `View`,
      `btn btn-info`,
      viewProductBasedOnCategory,
      item
    )
  );
  tr.appendChild(actionRow);

  _categorytableBod.appendChild(tr);
}

// #endregion  ----- TABLE MODIFCATION --------

// #region  ----- GENERAL METHODS --------
function createButtonElement(
  buttonText,
  cssClassName,
  buttonClickFuction,
  funcArgument
) {
  let buttonElement = document.createElement("button");
  buttonElement.innerHTML = buttonText;
  buttonElement.className = cssClassName;
  buttonElement.addEventListener("click", () => {
    buttonClickFuction(funcArgument);
  });
  return buttonElement;
}

// #endregion  ----- GENERAL METHODS --------
