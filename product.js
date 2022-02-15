var _tableBody; // store tableBody content
const _baseURL = `https://fakestoreapi.com/`; //set base URL
// handle API call
const getProductList = new Promise((resolve, reject) => {
  fetch(_baseURL + `products`).then((res) => {
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

window.addEventListener("load", function () {
  const form = document.getElementById("addProductForm");
  if (form) {
    form.addEventListener("submit", validateProductForm);
  }
});

// get all products
getProductList
  .then((apiResponse) => apiResponse.json())
  .then((data) => {
    intializeTable(); // clear table content before binding to avoid data overwritten issue
    data.forEach(preparePostsTableView); // bind table data
  });

// get all categories
getCategoryList
  .then((apiResponse) => apiResponse.json())
  .then((data) => {
    categorylist = data;
    createSelectElement(data, "categoryList");
  });

function intializeTable() {
  _tableBody = document.getElementById("postsTable");
  _tableBody.innerHTML = "";
}
function preparePostsTableView(item) {
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

  let actionRow = document.createElement("td");
  actionRow.appendChild(
    createButtonElement(`edit`, `btn btn-info`, editProduct, item.id)
  );
  actionRow.appendChild(
    createButtonElement(`delete`, `btn btn-danger`, deleteProduct, item.id)
  );
  tr.appendChild(actionRow);

  _tableBody.appendChild(tr);
}

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

function createSelectElement(optionlist, id) {
  let element = document.getElementById(id);
  for (var i = 0; i < optionlist.length; i++) {
    var opt = document.createElement("option");
    opt.value = optionlist[i];
    opt.innerHTML = optionlist[i];
    element.appendChild(opt);
  }
}
function onloadData() {
  console.log("On Load");
}
// edit post
function editProduct(productId) {
  getProductById(productId);
}

function getProductById(productId) {
  fetch(_baseURL + `products/` + productId, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res) => patchvalueofProduct(res));
}

function setFormValue(id, value) {
  if (id == "image") {
    document.getElementById(id).src = value;
  } else {
    document.getElementById(id).value = value;
  }
}

function patchvalueofProduct(response) {
  const form = document.getElementById("addProductForm");
  setFormValue("title", response.title);
  setFormValue("categoryList", response.category);
  setFormValue("description", response.description);
  setFormValue("image", response.image);
  setFormValue("price", response.price);
}
function viewProductBasedOnCategory(category) {
  console.log(category);
}

// delete post
function deleteProduct(productId) {
  let isDeleted = confirm("Are you sure you want to delete the product");
  if (isDeleted) {
    fetch(_baseURL + `products/` + productId, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => console.log(res));
  }
}

function validateProductForm() {
  const form = document.getElementById("addProductForm");
  const TITLE_REQUIRED = "Please enter product title";
  const CATEGORY_REQUIRED = "Please enter product title";
  const PRICE_REQUIRED = "Please enter product price";
  const IMAGE_REQUIRED = "Please choose product image";
  const PRICE_INVALID = "Please enter valid price";
  const IMAGE_VALID = "Please choose valid file image file";
  // validate the form
  debugger;
  let nameValid = hasValue(form.elements["title"], TITLE_REQUIRED);
  let priceValid = validatePrice(
    form.elements["price"],
    PRICE_REQUIRED,
    PRICE_INVALID
  );

  let imageRequire = hasValue(form.elements["image"], IMAGE_REQUIRED);
  let imageValid = validateImage(form.elements["image"], IMAGE_VALID);
  let categoryValid = hasValue(
    form.elements["categoryList"],
    CATEGORY_REQUIRED
  );
  if (nameValid && priceValid && imageValid && categoryValid && imageRequire) {
    let obj = {
      title: form.elements["title"],
      price: form.elements["price"],
      image: "https://i.pravatar.cc",
      category: form.elements["categoryList"],
    };
    saveProductApiCall(obj);
  }
}

// show a mesge with a type of the input
function showMessage(input, message, type) {
  // get the small element and set the message
  const msg = input.parentNode.querySelector("small");
  msg.innerText = message;
  // update the class for the input
  input.className = type ? "success" : "error";
  return type;
}

function showError(input, message) {
  return showMessage(input, message, false);
}

function showSuccess(input) {
  return showMessage(input, "", true);
}

function hasValue(input, message) {
  console.log(input.value);
  if (input.value.trim() === "") {
    return showError(input, invalidMsg);
  }
  return true;
}

function validatePrice(input, requiredMsg, invalidMsg) {
  // check if the value is not empty
  if (!hasValue(input, requiredMsg)) {
    return showError(input, requiredMsg);
  }
  // validate price format
  const priceRegex = /^(\-?\d+\.?\d{0,2})$/;

  const price = input.value.trim();
  if (!priceRegex.test(price)) {
    return showError(input, invalidMsg);
  }
  return true;
}
function saveProductApiCall(obj) {
  fetch(_baseURL + `products`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: obj,
  })
    .then((res) => res.json())
    .then((res) => console.log(res));
}

function validateImage(input, requiredMsg) {
  if (
    input.files[0].type == "image/png" ||
    input.files[0].type == "image/jpg" ||
    input.files[0].type == "image/jpeg"
  ) {
    return true;
  }
}
