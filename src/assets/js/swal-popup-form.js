//addNewBrand show a popup form and then make an api call to insert brand data to the database table
function addNewBrand(page, brands) {
  Swal.fire({
    title: 'Add New Brand',
    width: 450,
    html: `
        <div class="x_panel">
            <div class="x_content">
                <form autocomplete="off" id="add-brand" class="needs-validation" novalidate>
                    <!-- Brand Name -->
                    <div class="col-6 form-group has-feedback">
                        <input type="text" class="form-control has-feedback-left" id="name" name="name"
                            placeholder="Brand Name" autocomplete="off" autofocus required>
                        <div class="invalid-feedback d-none text-danger">Please enter the brand name.</div>
                        <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon glyphicon-tags" aria-hidden="true"></span>
                    </div>
                    <div class="form-group">
                      <div id="btns" class="col-4">
                          <br>
                          <button type="submit" class="btn btn-sm btn-dark">Submit</button>
                      </div>
                    </div>
                </form>
            </div>
        </div>
          `,
    showCloseButton: true,
    showConfirmButton: false,
    showCancelButton: false,
    allowOutsideClick: false,
    preConfirm: () => {
      return new Promise((resolve) => {
        const form = document.getElementById('add-brand');
        const formFields = form.querySelectorAll('.form-control, .form-select');
        let isValid = true;

        // Reset all feedback messages
        form.querySelectorAll('.invalid-feedback').forEach(feedback => {
          feedback.classList.add('d-none');
        });

        // Check each field
        formFields.forEach(field => {
          if (!field.checkValidity()) {
            isValid = false;
            const feedback = field.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
              feedback.classList.remove('d-none');
            }
          }
        });

        if (isValid) {
          resolve({
            name: form.name.value,
          });
        } else {
          Swal.showValidationMessage('Please correct the errors in the form.');
        }
      });
    },
    willOpen: () => {
      const form = document.getElementById('add-brand');
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();
        document.querySelectorAll('.invalid-feedback').forEach(feedback => {
          feedback.classList.add('d-none');
        });
        let isValid = true;
        form.querySelectorAll('.form-control, .form-select').forEach(field => {
          if (!field.checkValidity()) {
            isValid = false;
            const feedback = field.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
              feedback.classList.remove('d-none');
            }
          }
        });
        if (isValid) {
          Swal.getConfirmButton().click();
        } else {
          Swal.showValidationMessage('Please correct the errors in the form.');
        }
      });
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const data = result.value;
      let brand = {
        name: data.name,
      }
      const requestOptions = {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(brand),
      }

      fetch(api+'/admin/inventory/brand/new', requestOptions)
        .then(response => response.json())
        .then(data => {
          if (data.error === true) {
            alertQuestion(data.message)
          } else {
            if (page === "purchase") {
              brands.push(data.result)
              showSuccessMessage(data.message)
            } else {
              location.reload()
            }
          }
        });
    }
  });
}
//updateBrand show a popup form and then make an api call to update brand data to the database table
function updateBrand(brand) {
  Swal.fire({
    title: 'Update Brand',
    width: 450,
    html: `
        <div class="x_panel">
            <div class="x_content text-left">
                <form autocomplete="off" id="edit-brand" class="needs-validation" novalidate>
                    <!-- Brand Name -->
                    <div class="col-6 form-group has-feedback">
                      <label for="name">Brand Name:</label>
                        <input type="text" class="form-control has-feedback-left" id="name" name="name" value="${brand.name}" autocomplete="off" autofocus required>
                        <div class="invalid-feedback d-none text-danger">Please enter the brand name.</div>
                        <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon glyphicon-tags" aria-hidden="true"></span>
                    </div>
                    <div class="col-6 form-group">
                      <div class="toggle-wrapper">
                        <label for="" style="color:#5F5454;background:white">Brand Status:</label>
                        <input type="radio" id="status_active" name="role" ${brand.status === 'true' ? 'checked' : ''} autocomplete="off" >
                        <label for="status_active">Active</label>
                        <input type="radio" id="status_inactive" name="role" ${brand.status === 'true' ? '' : 'checked'} autocomplete="off">
                        <label for="status_inactive">Inactive</label>
                      </div>
                    </div>
                        <div class="form-group">
                      <div id="btns" class="col-4">
                          <br>
                          <button type="submit" class="btn btn-sm btn-dark">Submit</button>
                      </div>
                    </div>
                </form>
            </div>
        </div>
          `,
    showCloseButton: true,
    showConfirmButton: false,
    showCancelButton: false,
    allowOutsideClick: false,
    preConfirm: () => {
      return new Promise((resolve) => {
        const form = document.getElementById('edit-brand');
        const formFields = form.querySelectorAll('.form-control, .form-select');
        let isValid = true;

        // Reset all feedback messages
        form.querySelectorAll('.invalid-feedback').forEach(feedback => {
          feedback.classList.add('d-none');
        });

        // Check each field
        formFields.forEach(field => {
          if (!field.checkValidity()) {
            isValid = false;
            const feedback = field.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
              feedback.classList.remove('d-none');
            }
          }
        });

        if (isValid) {
          resolve({
            name: form.name.value,
            status: form.status_active.checked,
          });
        } else {
          Swal.showValidationMessage('Please correct the errors in the form.');
        }
      });
    },
    willOpen: () => {
      const form = document.getElementById('edit-brand');
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();
        document.querySelectorAll('.invalid-feedback').forEach(feedback => {
          feedback.classList.add('d-none');
        });
        let isValid = true;
        form.querySelectorAll('.form-control, .form-select').forEach(field => {
          if (!field.checkValidity()) {
            isValid = false;
            const feedback = field.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
              feedback.classList.remove('d-none');
            }
          }
        });
        if (isValid) {
          Swal.getConfirmButton().click();
        } else {
          Swal.showValidationMessage('Please correct the errors in the form.');
        }
      });
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const data = result.value;

      brand.name = data.name
      if (data.status) {
        brand.status = "Active"
      }
      console.log("Updated:", brand)
      const requestOptions = {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(brand),
      }
      let btn = document.getElementById('edit-btn-' + btnIndex);
      btn.innerHTML = 'processing <i class="fa fa-spinner fa-spin"></i>'
      btn.disabled = true;
      fetch(api+'/admin/inventory/brand/edit', requestOptions)
        .then(response => response.json())
        .then(data => {
          if (data.error === true) {
            alertQuestion(data.message)
            btn.innerHTML = 'Error!'
            btn.classList.remove('btn-primary')
            btn.classList.add('btn-danger')
          } else {
            location.reload()
          }
        });
    }
  });
}

//addNewProduct show a popup form and then make an api call to insert item data to the database table
function addNewProduct(page, brands, categories, products) {
  let brandList = '';
  let categoryList = '';
  bLen = brands.length;
  if (bLen > 0) {
    brandList += `<select id="brand" class="form-control form-select has-feedback-left">
                          <option value="${brands[0].id}" selected>${brands[0].name}</option>`
    for (let i = 1; i < bLen; i++) {
      const b = brands[i];
      brandList += `<option value="${b.id}">${b.name}</option>`;
    }
    brandList += '</select>';
  } else {
    brandList += `<select id="brand" class="form-control form-select has-feedback-left" readonly>
                    <option value="" selected disabled>Please add brand first</option>
                  </select>`
  }
  cLen = categories.length;
  if (cLen > 0) {
    categoryList += `<select id="category" class="form-control form-select has-feedback-left">
                      <option value="${categories[0].id}" selected>${categories[0].name}</option>`

    for (let i = 1; i < cLen; i++) {
      const c = categories[i];
      categoryList += `<option value="${c.id}">${c.name}</option>`;
    }
    categoryList += '</select>';
  } else {
    categoryList += `<select id="category" class="form-control form-select has-feedback-left" readonly>
                    <option value="" selected disabled>Please add category first</option>
                  </select>`
  }
  let htmlContent = `
    <div class="x_panel">
      <div class="x_content text-left">
        <form autocomplete="off" id="add-product" class="needs-validation" novalidate>
            <!-- Product Name -->
            <div class="col-6 form-group has-feedback">
                <label for="name">Product Name * :</label>
                <input type="text" class="form-control has-feedback-left" id="name" name="name"
                    placeholder="Product Name" autocomplete="off" autofocus required>
                <div class="invalid-feedback d-none text-danger">Please enter the product name.</div>
                <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%);" class="form-control-feedback left glyphicon glyphicon-plus-sign" aria-hidden="true"></span>
            </div>
            <!-- Max Retail Price -->
            <div class="col-4 form-group has-feedback">
                <label for="max_retail_price">MRP. * :</label>
                <input type="number" class="form-control has-feedback-left" id="max_retail_price" name="max_retail_price"
                    placeholder="Maximum Retail Price" min="0" autocomplete="off" required>
                <div class="invalid-feedback d-none text-danger">Please enter MRP Amount.</div>
                <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left fa-solid fa-layer-group" aria-hidden="true"></span>
            </div>
            <!-- Stock Alert Level -->
            <div class="col-4 form-group has-feedback">
                <label for="stock_alert_level">Minimum Stock Level * :</label>
                <input type="number" class="form-control has-feedback-left" id="stock_alert_level" name="stock_alert_level"
                    placeholder="Minimum Stock Level" min="0" autocomplete="off" required>
                <div class="invalid-feedback d-none text-danger">Min Stock level must greater than 0</div>
                <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left fa-solid fa-layer-group" aria-hidden="true"></span>
            </div>
            <!-- Warranty Period -->
            <div class="col-6 form-group has-feedback">
                <label for="warranty_p">Warranty Period * :</label>
                <input type="number" class="form-control has-feedback-left" id="warranty_p" name="warranty_p"
                    placeholder="warranty in days" min="0" autocomplete="off" required>
                <div class="invalid-feedback d-none text-danger">Warranty must greater than 0</div>
                <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left fa-solid fa-layer-group" aria-hidden="true"></span>
            </div>
            <!-- Product Details -->
            <div class="col-6 form-group has-feedback">
                <label for="description">Product Details :</label>
                <input type="text" class="form-control has-feedback-left" id="description" name="description"
                    placeholder="Product Description(Optional)" autocomplete="off">
                <div class="invalid-feedback d-none text-danger">Please enter the product name.</div>
                <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon glyphicon-plus-sign" aria-hidden="true"></span>
            </div>
            <!-- Category -->
            <div class="col-6 form-group has-feedback">
              <label for="category">Category:</label>  
            ` + categoryList +
    `<div class="invalid-feedback d-none text-danger">Please select category name.</div>
              <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon glyphicon-list" aria-hidden="true"></span>
            </div>
            <!-- Brand -->
            <div class="col-6 form-group has-feedback">
              <label for="brand">Brand:</label>  
            `  + brandList +
    `<div class="invalid-feedback d-none text-danger">Please select brand name.</div>
            <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon glyphicon-tags" aria-hidden="true"></span>
            </div>
          <div class="col-6 text-center">
              <br>
              <button type="submit" class="btn btn-sm btn-dark">Submit</button>
          </div>
        </form>
      </div>
    </div>
          `;
  Swal.fire({
    title: 'Add New product',
    width: 450,
    height: 520,
    html: htmlContent,
    showCloseButton: true,
    showConfirmButton: false,
    showCancelButton: false,
    allowOutsideClick: false,
    preConfirm: () => {
      return new Promise((resolve) => {
        const form = document.getElementById('add-product');
        const formFields = form.querySelectorAll('.form-control, .form-select');
        let isValid = true;

        // Reset all feedback messages
        form.querySelectorAll('.invalid-feedback').forEach(feedback => {
          feedback.classList.add('d-none');
        });

        // Check each field
        formFields.forEach(field => {
          if (!field.checkValidity()) {
            isValid = false;
            const feedback = field.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
              feedback.classList.remove('d-none');
            }
          }
        });

        if (isValid) {
          resolve({
            name: form.name.value,
            max_retail_price: form.max_retail_price.value,
            stock_alert_level: form.stock_alert_level.value,
            warranty: form.warranty_p.value,
            description: form.description.value,
            brand_id: form.brand.value,
            category_id: form.category.value,
            category_name: form.category.options[form.category.selectedIndex].text,

          });
        } else {
          Swal.showValidationMessage('Please correct the errors in the form.');
        }
      });
    },
    willOpen: () => {
      const form = document.getElementById('add-product');
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();
        document.querySelectorAll('.invalid-feedback').forEach(feedback => {
          feedback.classList.add('d-none');
        });
        let isValid = true;
        form.querySelectorAll('.form-control, .form-select').forEach(field => {
          if (!field.checkValidity()) {
            isValid = false;
            const feedback = field.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
              feedback.classList.remove('d-none');
            }
          }
        });
        if (isValid) {
          Swal.getConfirmButton().click();
        } else {
          Swal.showValidationMessage('Please correct the errors in the form.');
        }
      });
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const data = result.value;
      categoryName = data.category_name;
      let product = {
        product_name: data.name,
        product_description: data.description,
        brand_id: parseInt(data.brand_id),
        category_id: parseInt(data.category_id),
        stock_alert_level: parseInt(data.stock_alert_level),
        warranty: parseInt(data.warranty),
        mrp: parseInt(data.max_retail_price),
      }
      const requestOptions = {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      }
      console.log(product)

      fetch(api+'/admin/inventory/product/new', requestOptions)
        .then(response => response.json())
        .then(data => {
          console.log(data)
          if (data.error === true) {
            showErrorMessage(data.message)
          } else {
            showSuccessMessage(data.message);
            //push new product item to the existing items array
            products.push(data.result)
            if (page === "purchase") {
              //update Product div
              updateProductsDiv();
              selectedProductItem = data.result
              selectedProductIndex = products.length - 1;
              addRow()
            }
          }
        });
    }
  });

}
//updateProduct show a popup form and then make an api call to update item info to the database table
function updateProduct(brands, categories, product) {
  let brandList = '', categoryList = '';
  bLen = brands.length;
  if (bLen > 0) {
    brandList += `<select id="brand" class="form-control form-select has-feedback-left">`
    for (let i = 0; i < bLen; i++) {
      const b = brands[i];
      if (b.id === product.brand.id) {
        brandList += `<option value="${b.id}" selected>${b.name}</option>`;
      } else {
        brandList += `<option value="${b.id}">${b.name}</option>`;
      }
    }
    brandList += '</select>';
  } else {
    brandList += `<select id="brand" class="form-control form-select has-feedback-left" readonly>
                    <option value="" selected disabled>Please add brand first</option>
                  </select>`
  }
  cLen = categories.length;
  if (cLen > 0) {
    categoryList += `<select id="category" class="form-control form-select has-feedback-left">`

    for (let i = 0; i < cLen; i++) {
      const c = categories[i];
      if (c.id === product.category.id) {
        categoryList += `<option value="${c.id}" selected>${c.name}</option>`;
      } else {
        categoryList += `<option value="${c.id}">${c.name}</option>`;
      }
    }
    categoryList += '</select>';
  } else {
    categoryList += `<select id="category" class="form-control form-select has-feedback-left" readonly>
                    <option value="" selected disabled>Please add category first</option>
                  </select>`
  }
  let htmlContent = `
    
      <div class="x_content text-left">
        <form autocomplete="off" id="update-product" class="needs-validation" novalidate>
            <!-- Product Name -->
            <div class="col-6 form-group has-feedback">
                <label for="name">Product Name * :</label>
                <input type="text" class="form-control has-feedback-left" id="name" name="name" value="${product.product_name}"
                    placeholder="Product Name" autocomplete="off" autofocus required>
                <div class="invalid-feedback d-none text-danger">Please enter the product name.</div>
                <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%);" class="form-control-feedback left glyphicon glyphicon-plus-sign" aria-hidden="true"></span>
            </div>
            <!-- Max Retail Price -->
            <div class="col-6 form-group has-feedback">
                <label for="max_retail_price">MRP. * :</label>
                <input type="number" class="form-control has-feedback-left" id="max_retail_price" name="max_retail_price" value="${product.mrp}"
                    placeholder="Stock Alert Level" min="0" autocomplete="off" required>
                <div class="invalid-feedback d-none text-danger">Please enter MRP Amount.</div>
                <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left fa-solid fa-layer-group" aria-hidden="true"></span>
            </div>
            <!-- Stock Alert Level -->
            <div class="col-6 form-group has-feedback">
                <label for="stock_alert_level">Minimum Stock Level * :</label>
                <input type="number" class="form-control has-feedback-left" id="stock_alert_level" name="stock_alert_level" value="${product.stock_alert_level}"
                    placeholder="Stock Alert Level" min="0" autocomplete="off" required>
                <div class="invalid-feedback d-none text-danger">Min Stock level must greater than 0</div>
                <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left fa-solid fa-layer-group" aria-hidden="true"></span>
            </div>
            <!-- Warranty Period -->
            <div class="col-4 form-group has-feedback">
                <label for="warranty">Warranty Period * :</label>
                <input type="number" class="form-control has-feedback-left" id="warranty" name="warranty" value="${product.warranty}"
                    placeholder="warranty in days" min="0" autocomplete="off" required>
                <div class="invalid-feedback d-none text-danger">Warranty must greater than 0</div>
                <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left fa-solid fa-layer-group" aria-hidden="true"></span>
            </div>
            <div class="col-6 form-group has-feedback">
                <label for="description">Product Details :</label>
                <input type="text" class="form-control has-feedback-left" id="description" name="description" value="${product.product_description}"
                    placeholder="Product Description(Optional)" autocomplete="off">
                <div class="invalid-feedback d-none text-danger">Please enter the product name.</div>
                <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon glyphicon-plus-sign" aria-hidden="true"></span>
            </div>

            <div class="col-6 form-group has-feedback">
              <label for="category">Category:</label>  
            ` + categoryList +
    `<div class="invalid-feedback d-none text-danger">Please select category name.</div>
              <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon glyphicon-list" aria-hidden="true"></span>
            </div>
            <div class="col-6 form-group has-feedback">
              <label for="brand">Brand:</label>  
            `  + brandList +
    `<div class="invalid-feedback d-none text-danger">Please select brand name.</div>
              <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon glyphicon-tags" aria-hidden="true"></span>
            </div>
            <div class="col-6 form-group">
              <div class="toggle-wrapper">
                <label for="" style="color:#5F5454;background:white">Product Status:</label>
                <input type="radio" id="status_active" name="role" ${product.product_status === true ? "checked" : ""} autocomplete="off" >
                <label for="status_active">Active</label>
                <input type="radio" id="status_inactive" name="role" ${product.product_status === true ? "" : "checked"} autocomplete="off" >
                <label for="status_inactive">Inactive</label>
              </div>
            </div>

            <div class="col-6 text-center">
            <br>
            <button type="submit" class="btn btn-sm btn-danger">Submit</button>
            </div>
        </form>
      </div>
  `;
  Swal.fire({
    title: 'Update Product',
    width: 450,
    height: 450,
    html: htmlContent,
    showCloseButton: true,
    showConfirmButton: false,
    showCancelButton: false,
    allowOutsideClick: false,
    preConfirm: () => {
      return new Promise((resolve) => {
        const form = document.getElementById('update-product');
        const formFields = form.querySelectorAll('.form-control, .form-select');
        let isValid = true;

        // Reset all feedback messages
        form.querySelectorAll('.invalid-feedback').forEach(feedback => {
          feedback.classList.add('d-none');
        });

        // Check each field
        formFields.forEach(field => {
          if (!field.checkValidity()) {
            isValid = false;
            const feedback = field.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
              feedback.classList.remove('d-none');
            }
          }
        });

        if (isValid) {
          resolve({
            name: form.name.value,
            max_retail_price: form.max_retail_price.value,
            stock_alert_level: form.stock_alert_level.value,
            warranty: form.warranty.value,
            description: form.description.value,
            status: form.status_active.checked,
            brand_id: form.brand.value,
            category_id: form.category.value,
          });
        } else {
          Swal.showValidationMessage('Please correct the errors in the form.');
        }
      });
    },
    willOpen: () => {
      const form = document.getElementById('update-product');
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();
        document.querySelectorAll('.invalid-feedback').forEach(feedback => {
          feedback.classList.add('d-none');
        });
        let isValid = true;
        form.querySelectorAll('.form-control, .form-select').forEach(field => {
          if (!field.checkValidity()) {
            isValid = false;
            const feedback = field.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
              feedback.classList.remove('d-none');
            }
          }
        });
        if (isValid) {
          Swal.getConfirmButton().click();
        } else {
          Swal.showValidationMessage('Please correct the errors in the form.');
        }
      });
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const data = result.value;
      let UpdatedInfo = {
        id: product.id,
        product_name: data.name,
        product_description: data.description,
        product_status: data.status,
        brand_id: parseInt(data.brand_id),
        category_id: parseInt(data.category_id),
        stock_alert_level: parseInt(data.stock_alert_level),
        warranty: parseInt(data.warranty),
        mrp: parseInt(data.max_retail_price)
      }

      const requestOptions = {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(UpdatedInfo),
      }
      console.log(UpdatedInfo)

      fetch(api+'/admin/inventory/product/update', requestOptions)
        .then(response => response.json())
        .then(data => {
          console.log(data)
          if (data.error === true) {
            showErrorMessage(data.message)
          } else {
            showSuccessMessage(data.message)
            // location.reload();
          }
        });
    }
  });

}
//addNewCategory show a popup form and then make an api call to insert category data to the database table
function addNewCategory(page, categories) {
  Swal.fire({
    title: 'Add Product Category',
    width: 450,
    html: `
        <div class="x_panel">
            <div class="x_content">
                <form autocomplete="off" id="add-category" class="needs-validation" novalidate>
                    <!-- Category Name -->
                    <div class="col-6 form-group has-feedback">
                        <input type="text" class="form-control has-feedback-left" id="name" name="name"
                            placeholder="Category Name" autocomplete="off" autofocus required>
                        <div class="invalid-feedback d-none text-danger">Please enter the category name.</div>
                        <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon glyphicon-plus" aria-hidden="true"></span>
                    </div>
                    <div class="form-group">
                      <div id="btns" class="col-4">
                          <br>
                          <button type="submit" class="btn btn-sm btn-dark">Submit</button>
                      </div>
                    </div>
                </form>
            </div>
        </div>
          `,
    showCloseButton: true,
    showConfirmButton: false,
    showCancelButton: false,
    allowOutsideClick: false,
    preConfirm: () => {
      return new Promise((resolve) => {
        const form = document.getElementById('add-category');
        const formFields = form.querySelectorAll('.form-control, .form-select');
        let isValid = true;

        // Reset all feedback messages
        form.querySelectorAll('.invalid-feedback').forEach(feedback => {
          feedback.classList.add('d-none');
        });

        // Check each field
        formFields.forEach(field => {
          if (!field.checkValidity()) {
            isValid = false;
            const feedback = field.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
              feedback.classList.remove('d-none');
            }
          }
        });

        if (isValid) {
          resolve({
            name: form.name.value,
          });
        } else {
          Swal.showValidationMessage('Please correct the errors in the form.');
        }
      });
    },
    willOpen: () => {
      const form = document.getElementById('add-category');
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();
        document.querySelectorAll('.invalid-feedback').forEach(feedback => {
          feedback.classList.add('d-none');
        });
        let isValid = true;
        form.querySelectorAll('.form-control, .form-select').forEach(field => {
          if (!field.checkValidity()) {
            isValid = false;
            const feedback = field.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
              feedback.classList.remove('d-none');
            }
          }
        });
        if (isValid) {
          Swal.getConfirmButton().click();
        } else {
          Swal.showValidationMessage('Please correct the errors in the form.');
        }
      });
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const data = result.value;
      let category = {
        name: data.name,
      }
      const requestOptions = {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(category),
      }

      fetch(api+'/admin/inventory/category/new', requestOptions)
        .then(response => response.json())
        .then(data => {
          if (data.error === true) {
            showErrorMessage(data.message)
          } else {
            showSuccessMessage(data.message);
            if (page === "purchase") {
              categories.push(data.result);
              updateCategoriesDiv();
            } else {
              setTimeout(() => {
                location.reload();
              }, 2000);
            }
          }
        });
    }
  });
}
//updateCategory show a popup form and then make an api call to update category data to the database table
function updateCategory(category, btnIndex) {
  Swal.fire({
    title: 'Update Category',
    width: 450,
    html: `
        <div class="x_panel">
            <div class="x_content text-left">
                <form autocomplete="off" id="edit-brand" class="needs-validation" novalidate>
                    <!-- Brand Name -->
                    <div class="col-6 form-group has-feedback">
                      <label for="name">Category Name:</label>
                        <input type="text" class="form-control has-feedback-left" id="name" name="name" value="${category.name}" autocomplete="off" autofocus required>
                        <div class="invalid-feedback d-none text-danger">Please enter the brand name.</div>
                        <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon glyphicon-tags" aria-hidden="true"></span>
                    </div>
                    <div class="col-6 form-group">
                      <div class="toggle-wrapper">
                        <label for="" style="color:#5F5454;background:white">Category Status:</label>
                        <input type="radio" id="status_active" name="role" ${category.status === 'true' ? 'checked' : ''} autocomplete="off" >
                        <label for="status_active">Active</label>
                        <input type="radio" id="status_inactive" name="role" ${category.status === 'true' ? '' : 'checked'} autocomplete="off" >
                        <label for="status_inactive">Inactive</label>
                      </div>
                    </div>
                        <div class="form-group">
                      <div id="btns" class="col-4">
                          <br>
                          <button type="submit" class="btn btn-sm btn-dark">Submit</button>
                      </div>
                    </div>
                </form>
            </div>
        </div>
          `,
    showCloseButton: true,
    showConfirmButton: false,
    showCancelButton: false,
    allowOutsideClick: false,
    preConfirm: () => {
      return new Promise((resolve) => {
        const form = document.getElementById('edit-brand');
        const formFields = form.querySelectorAll('.form-control, .form-select');
        let isValid = true;

        // Reset all feedback messages
        form.querySelectorAll('.invalid-feedback').forEach(feedback => {
          feedback.classList.add('d-none');
        });

        // Check each field
        formFields.forEach(field => {
          if (!field.checkValidity()) {
            isValid = false;
            const feedback = field.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
              feedback.classList.remove('d-none');
            }
          }
        });

        if (isValid) {
          resolve({
            name: form.name.value,
            status: form.status_active.checked,
          });
        } else {
          Swal.showValidationMessage('Please correct the errors in the form.');
        }
      });
    },
    willOpen: () => {
      const form = document.getElementById('edit-brand');
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();
        document.querySelectorAll('.invalid-feedback').forEach(feedback => {
          feedback.classList.add('d-none');
        });
        let isValid = true;
        form.querySelectorAll('.form-control, .form-select').forEach(field => {
          if (!field.checkValidity()) {
            isValid = false;
            const feedback = field.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
              feedback.classList.remove('d-none');
            }
          }
        });
        if (isValid) {
          Swal.getConfirmButton().click();
        } else {
          Swal.showValidationMessage('Please correct the errors in the form.');
        }
      });
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const data = result.value;

      category.name = data.name
      if (data.status) {
        category.status = "Active"
      }
      console.log("Updated:", category)
      const requestOptions = {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(category),
      }

      let btn = document.getElementById('edit-btn-' + btnIndex);
      btn.innerHTML = 'processing <i class="fa fa-spinner fa-spin"></i>'
      btn.disabled = true;
      fetch(api+'/admin/inventory/category/update', requestOptions)
        .then(response => response.json())
        .then(data => {
          if (data.error === true) {
            alertQuestion(data.message)
            btn.innerHTML = 'Error!'
            btn.classList.remove('btn-primary')
            btn.classList.add('btn-danger')
          } else {
            location.reload()
          }
        });
    }
  });
}
//AddNewService show a popup form and then make an api call to insert service data to the database table
function addNewService(src, services) {
  Swal.fire({
    title: 'Add Service',
    width: 450,
    html: `
      <div class="x_panel">
          <div class="x_content">
              <form id="add-service" class="needs-validation" novalidate autocomplete="off">
                  <!-- Service Name -->
                  <div class="col-4 form-group has-feedback">
                      <input type="text" class="form-control has-feedback-left" id="name" name="name"
                          placeholder="Service Name" autocomplete="new-name" autofocus required>
                      <div class="invalid-feedback d-none text-danger">Please enter the service name.</div>
                      <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon  glyphicon-tag" aria-hidden="true"></span>
                  </div>

                  <!-- Description -->
                  <div class="col-4 form-group has-feedback">
                      <input type="text" class="form-control has-feedback-left" id="description" name="description"
                          placeholder="Description" autocomplete="off">
                      <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon glyphicon-comment" aria-hidden="true"></span>
                  </div>

                  <!-- Base Fee -->
                  <div class="col-4 form-group has-feedback">
                      <input type="number" class="form-control has-feedback-left" id="base_fee" name="base_fee"
                          placeholder="Base Fee" autocomplete="off" required>
                      <div class="invalid-feedback d-none text-danger">Please enter a valid base_fee amount.</div>
                      <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon glyphicon-question-sign" aria-hidden="true"></span>
                  </div>
                  <div class="form-group">
                    <div id="btns" class="col-4">
                        <br>
                        <button type="submit" class="btn btn-sm btn-dark">Submit</button>
                    </div>
                  </div>
              </form>
          </div>
      </div>
    `,
    showCloseButton: true,
    showConfirmButton: false,
    showCancelButton: false,
    allowOutsideClick: false,
    preConfirm: () => {
      return new Promise((resolve) => {
        const form = document.getElementById('add-service');
        const formFields = form.querySelectorAll('.form-control, .form-select');
        let isValid = true;

        // Reset all feedback messages
        form.querySelectorAll('.invalid-feedback').forEach(feedback => {
          feedback.classList.add('d-none');
        });

        // Check each field
        formFields.forEach(field => {
          if (!field.checkValidity()) {
            isValid = false;
            const feedback = field.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
              feedback.classList.remove('d-none');
            }
          }
        });

        if (isValid) {
          resolve({
            name: form.name.value,
            description: form.description.value,
            base_fee: form.base_fee.value,
          });
        } else {
          Swal.showValidationMessage('Please correct the errors in the form.');
        }
      });
    },
    willOpen: () => {
      const form = document.getElementById('add-service');
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();
        document.querySelectorAll('.invalid-feedback').forEach(feedback => {
          feedback.classList.add('d-none');
        });
        let isValid = true;
        form.querySelectorAll('.form-control, .form-select').forEach(field => {
          if (!field.checkValidity()) {
            isValid = false;
            const feedback = field.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
              feedback.classList.remove('d-none');
            }
          }
        });
        if (isValid) {
          Swal.getConfirmButton().click();
        } else {
          Swal.showValidationMessage('Please correct the errors in the form.');
        }
      });
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const data = result.value;
      let service = {
        name: data.name,
        description: data.description,
        base_fee: parseInt(data.base_fee)
      }
      const requestOptions = {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(service),
      }

      fetch(api+'/admin/inventory/service/new', requestOptions)
        .then(response => response.json())
        .then(data => {
          if (data.error === true) {
            showErrorMessage(data.message)
          } else {
            showSuccessMessage(data.message);
            if (src === 'service') {
              selectedServiceItem = data.service;
              services.push(selectedServiceItem)
              updateServicesDiv();
              addRow(data.service)
            } else {
              setTimeout(function () {
                location.reload();
              }, 3000); // Adjust the delay as needed 
            }
          }
        });
    }
  });
}
function updateService(serviceInfo, btnIndex) {
  Swal.fire({
    title: 'Update Service Account',
    width: 450,
    html: `
      <div class="x_panel">
          <div class="x_content">
              <form autocomplete="off" id="update-service" class="needs-validation" novalidate>
                  <!-- Service Name -->
                  <div class="col-4 form-group has-feedback">
                      <input type="text" class="form-control has-feedback-left" id="name" name="name"
                        value="${serviceInfo.name}" placeholder="Service Name" autofocus autocomplete="off" required>
                      <div class="invalid-feedback d-none text-danger">Please enter the service name.</div>
                      <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon  glyphicon-tag" aria-hidden="true"></span>
                  </div>

                  <!-- Description -->
                  <div class="col-4 form-group has-feedback">
                      <input type="text" class="form-control has-feedback-left" id="description" name="description"
                        value="${serviceInfo.description}" placeholder="Description" autocomplete="off">
                      <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon glyphicon-comment" aria-hidden="true"></span>
                  </div>

                  <!-- Base Fee -->
                  <div class="col-4 form-group has-feedback">
                      <input type="number" class="form-control has-feedback-left" id="base_fee" name="base_fee"
                        value="${serviceInfo.base_fee}" placeholder="Base Fee" autocomplete="off" required>
                      <div class="invalid-feedback d-none text-danger">Please enter a valid base_fee amount.</div>
                      <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon glyphicon-question-sign" aria-hidden="true"></span>
                  </div>
                  <div class="col-4">
                    <div class="toggle-wrapper">
                      <label for="status" style="color:#5F5454;background:white">Service Status:</label>
                      <input type="radio" id="status_active" name="status" ${serviceInfo.status ? 'checked' : ''} autocomplete="off" >
                      <label for="status_active">Active</label>
                      <input type="radio" id="status_inactive" name="status" ${serviceInfo.status ? '' : 'checked'} autocomplete="off" >
                      <label for="status_inactive">Inactive</label>
                    </div>
                  </div>
                  <div class="form-group">
                    <div id="btns" class="col-4">
                        <br>
                        <button type="submit" class="btn btn-sm btn-dark">Save Changes</button>
                    </div>
                  </div>
              </form>
          </div>
      </div>
          `,
    showCloseButton: true,
    showConfirmButton: false,
    showCancelButton: false,
    allowOutsideClick: false,
    preConfirm: () => {
      return new Promise((resolve) => {
        const form = document.getElementById('update-service');
        const formFields = form.querySelectorAll('.form-control, .form-select');
        let isValid = true;

        // Reset all feedback messages
        form.querySelectorAll('.invalid-feedback').forEach(feedback => {
          feedback.classList.add('d-none');
        });

        // Check each field
        formFields.forEach(field => {
          if (!field.checkValidity()) {
            isValid = false;
            const feedback = field.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
              feedback.classList.remove('d-none');
            }
          }
        });

        if (isValid) {
          resolve({
            name: form.name.value,
            description: form.description.value,
            base_fee: form.base_fee.value,
            status: form.status_active.checked,
          });
        } else {
          Swal.showValidationMessage('Please correct the errors in the form.');
        }
      });
    },
    willOpen: () => {
      const form = document.getElementById('update-service');
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();
        document.querySelectorAll('.invalid-feedback').forEach(feedback => {
          feedback.classList.add('d-none');
        });
        let isValid = true;
        form.querySelectorAll('.form-control, .form-select').forEach(field => {
          if (!field.checkValidity()) {
            isValid = false;
            const feedback = field.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
              feedback.classList.remove('d-none');
            }
          }
        });
        if (isValid) {
          Swal.getConfirmButton().click();
        } else {
          Swal.showValidationMessage('Please correct the errors in the form.');
        }
      });
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const data = result.value;
      let service = {
        id: serviceInfo.id,
        name: data.name,
        description: data.description,
        base_fee: parseInt(data.base_fee),
        status: data.status,
      }
      const requestOptions = {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(service),
      }
      let btn = document.getElementById('edit-btn-' + btnIndex);
      btn.innerHTML = 'processing <i class="fa fa-spinner fa-spin"></i>'
      btn.disabled = true;

      fetch(api+'/admin/inventory/service/update', requestOptions)
        .then(response => response.json())
        .then(data => {
          if (data.error === true) {
            alertQuestion(data.message)
          } else {
            setTimeout(() => {
              btn.innerHTML = 'Saved'
            }, 1500);
            setTimeout(() => {
              location.reload()
            }, 1500);
          }
        });
    }
  });
}
//addNewCustomer show a popup form and then make an api call to insert customer data to the database table
function addNewCustomer(page, customers) {
  Swal.fire({
    title: 'Add Customer',
    width: 450,
    html: `
      <div class="x_panel">
          <div class="x_content">
              <form autocomplete="off" id="add-customer" class="needs-validation" novalidate>
                  <!-- Account Name -->
                  <div class="col-4 form-group has-feedback">
                      <input type="text" class="form-control has-feedback-left" id="account_name" name="account_name"
                          placeholder="Account Name" autocomplete="off" autofocus required>
                      <div class="invalid-feedback d-none text-danger">Please enter the account name.</div>
                      <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon  glyphicon-user" aria-hidden="true"></span>
                  </div>

                  <!-- Contact Person Name -->
                  <div class="col-4 form-group has-feedback">
                      <input type="text" class="form-control has-feedback-left" id="contact_person" name="contact_person"
                          placeholder="Contact Person Name" autocomplete="off">
                      <div class="invalid-feedback d-none text-danger">Please enter the contact person name.</div>
                      <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon  glyphicon-user" aria-hidden="true"></span>
                  </div>

                  <!-- Mobile Number -->
                  <div class="col-4 form-group has-feedback">
                      <input type="tel" class="form-control has-feedback-left" id="mobile" name="mobile"
                          placeholder="Mobile Number" autocomplete="off" required>
                      <div class="invalid-feedback d-none text-danger">Please enter a valid mobile number.</div>
                      <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon  glyphicon-phone" aria-hidden="true"></span>
                  </div>

                  <!-- Email -->
                  <div class="col-4 form-group has-feedback">
                      <input type="email" class="form-control has-feedback-left" id="email" name="email"
                          placeholder="Email" autocomplete="off">
                      <div class="invalid-feedback d-none text-danger">Please enter a valid email address.</div>
                      <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon  glyphicon-envelope" aria-hidden="true"></span>
                  </div>
                  <!-- Area -->
                  <div class="col-4 form-group has-feedback">
                      <input type="text" class="form-control has-feedback-left" id="area" name="area"
                          placeholder="Road/House No.(Optional)" autocomplete="off">
                      <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon glyphicon-home" aria-hidden="true"></span>
                  </div>
                  <div class="form-group">
                    <div id="btns" class="col-4">
                        <br>
                        <button type="submit" class="btn btn-sm btn-dark">Submit</button>
                    </div>
                  </div>
              </form>
          </div>
      </div>
    `,
    showCloseButton: true,
    showConfirmButton: false,
    showCancelButton: false,
    allowOutsideClick: false,
    preConfirm: () => {
      return new Promise((resolve) => {
        const form = document.getElementById('add-customer');
        const formFields = form.querySelectorAll('.form-control, .form-select');
        let isValid = true;

        // Reset all feedback messages
        form.querySelectorAll('.invalid-feedback').forEach(feedback => {
          feedback.classList.add('d-none');
        });

        // Check each field
        formFields.forEach(field => {
          if (!field.checkValidity()) {
            isValid = false;
            const feedback = field.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
              feedback.classList.remove('d-none');
            }
          }
        });

        if (isValid) {
          resolve({
            account_name: form.account_name.value,
            contact_person: form.contact_person.value,
            mobile: form.mobile.value,
            email: form.email.value,
            area: form.area.value
          });
        } else {
          Swal.showValidationMessage('Please correct the errors in the form.');
        }
      });
    },
    willOpen: () => {
      const form = document.getElementById('add-customer');
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();
        document.querySelectorAll('.invalid-feedback').forEach(feedback => {
          feedback.classList.add('d-none');
        });
        let isValid = true;
        form.querySelectorAll('.form-control, .form-select').forEach(field => {
          if (!field.checkValidity()) {
            isValid = false;
            const feedback = field.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
              feedback.classList.remove('d-none');
            }
          }
        });
        if (isValid) {
          Swal.getConfirmButton().click();
        } else {
          Swal.showValidationMessage('Please correct the errors in the form.');
        }
      });
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const data = result.value;
      dis = parseInt(data.discount, 10);
      opBalance = parseInt(data.opening_balance, 10);
      let customer = {
        account_name: data.account_name,
        contact_person: data.contact_person,
        mobile: data.mobile,
        email: data.email,
        area: data.area
      }
      const requestOptions = {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customer),
      }

      fetch(api+'/admin/mis/customer/new', requestOptions)
        .then(response => response.json())
        .then(data => {
          if (data.error === true) {
            showErrorMessage(data.message)
          } else {
            showSuccessMessage(data.message);
            if (page === "sale") {
              customers.push(data.result)
              selectedCustomer = data.result;
              document.getElementById("customer").value = selectedCustomer.account_name;
            } else {
              setTimeout(function () {
                location.reload();
              }, 3000); // Adjust the delay as needed 
            }
          }
        });
    }
  });
}
function updateCustomer(cusInfo, btnIndex) {
  Swal.fire({
    title: 'Update Customer Account',
    width: 450,
    html: `
      <div class="x_panel">
          <div class="x_content">
              <form autocomplete="off" id="update-customer" class="needs-validation" novalidate>
                  <!-- Account Name -->
                  <div class="col-4 form-group has-feedback">
                      <input type="text" class="form-control has-feedback-left" id="account_name" name="account_name"
                        value="${cusInfo.account_name || ""}" autofocus placeholder="Account Name" autocomplete="off" required>
                      <div class="invalid-feedback d-none text-danger">Please enter the account name.</div>
                      <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon  glyphicon-user" aria-hidden="true"></span>
                  </div>

                  <!-- Contact Person Name -->
                  <div class="col-4 form-group has-feedback">
                      <input type="text" class="form-control has-feedback-left" id="contact_person" name="contact_person"
                        value="${cusInfo.contact_person || ""}"  placeholder="Contact Person Name" autocomplete="off">
                      <div class="invalid-feedback d-none text-danger">Please enter the contact person name.</div>
                      <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon  glyphicon-user" aria-hidden="true"></span>
                  </div>

                  <!-- Mobile Number -->
                  <div class="col-4 form-group has-feedback">
                      <input type="tel" class="form-control has-feedback-left" id="mobile" name="mobile"
                        value="${cusInfo.mobile || ""}"  placeholder="Mobile Number" autocomplete="off" required>
                      <div class="invalid-feedback d-none text-danger">Please enter a valid mobile number.</div>
                      <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon  glyphicon-phone" aria-hidden="true"></span>
                  </div>

                  <!-- Email -->
                  <div class="col-4 form-group has-feedback">
                      <input type="email" class="form-control has-feedback-left" id="email" name="email"
                        value="${cusInfo.email || ""}"  placeholder="Email" autocomplete="off">
                      <div class="invalid-feedback d-none text-danger">Please enter a valid email address.</div>
                      <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon  glyphicon-envelope" aria-hidden="true"></span>
                  </div>

                  <!-- Area -->
                  <div class="col-4 form-group has-feedback">
                      <input type="text" class="form-control has-feedback-left" id="area" name="area"
                        value="${cusInfo.area || ""}"  placeholder="Road/House No." autocomplete="off">
                      <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon glyphicon-home" aria-hidden="true"></span>
                  </div>
                  <div class="col-4">
                    <div class="toggle-wrapper">
                      <label for="account_status" style="color:#5F5454;background:white">Account Status:</label>
                      <input type="radio" id="status_active" name="account_status" ${cusInfo.account_status ? 'checked' : ''} autocomplete="off" >
                      <label for="status_active">Active</label>
                      <input type="radio" id="status_inactive" name="account_status" ${cusInfo.account_status ? '' : 'checked'} autocomplete="off" >
                      <label for="status_inactive">Inactive</label>
                    </div>
                  </div>
                  <div class="form-group">
                    <div id="btns" class="col-4">
                        <br>
                        <button type="submit" class="btn btn-sm btn-dark">Save Changes</button>
                    </div>
                  </div>
              </form>
          </div>
      </div>
          `,
    showCloseButton: true,
    showConfirmButton: false,
    showCancelButton: false,
    allowOutsideClick: false,
    preConfirm: () => {
      return new Promise((resolve) => {
        const form = document.getElementById('update-customer');
        const formFields = form.querySelectorAll('.form-control, .form-select');
        let isValid = true;

        // Reset all feedback messages
        form.querySelectorAll('.invalid-feedback').forEach(feedback => {
          feedback.classList.add('d-none');
        });

        // Check each field
        formFields.forEach(field => {
          if (!field.checkValidity()) {
            isValid = false;
            const feedback = field.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
              feedback.classList.remove('d-none');
            }
          }
        });

        if (isValid) {
          resolve({
            account_name: form.account_name.value,
            contact_person: form.contact_person.value,
            mobile: form.mobile.value,
            email: form.email.value,
            area: form.area.value,
            status: form.status_active.checked,
          });
        } else {
          Swal.showValidationMessage('Please correct the errors in the form.');
        }
      });
    },
    willOpen: () => {
      const form = document.getElementById('update-customer');
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();
        document.querySelectorAll('.invalid-feedback').forEach(feedback => {
          feedback.classList.add('d-none');
        });
        let isValid = true;
        form.querySelectorAll('.form-control, .form-select').forEach(field => {
          if (!field.checkValidity()) {
            isValid = false;
            const feedback = field.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
              feedback.classList.remove('d-none');
            }
          }
        });
        if (isValid) {
          Swal.getConfirmButton().click();
        } else {
          Swal.showValidationMessage('Please correct the errors in the form.');
        }
      });
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const data = result.value;
      let customer = {
        id: cusInfo.id,
        account_name: data.account_name,
        contact_person: data.contact_person,
        mobile: data.mobile,
        email: data.email,
        area: data.area,
        account_status: data.status,
      }
      const requestOptions = {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(customer),
      }
      let btn = document.getElementById('edit-btn-' + btnIndex);
      btn.innerHTML = 'processing <i class="fa fa-spinner fa-spin"></i>'
      btn.disabled = true;

      fetch(api+'/admin/mis/customer/update', requestOptions)
        .then(response => response.json())
        .then(data => {
          if (data.error === true) {
            alertQuestion(data.message)
          } else {
            setTimeout(() => {
              btn.innerHTML = 'Saved'
            }, 1500);
            setTimeout(() => {
              location.reload()
            }, 1500);
          }
        });
    }
  });
}

function addNewEmployee(page, employees) {
  Swal.fire({
    title: 'Add Employee',
    width: 450,
    html: `
      <div class="x_panel">
          <div class="x_content">
              <form autocomplete="off" id="add-employee" class="needs-validation" novalidate>
                  <!-- Account Name -->
                  <div class="col-4 form-group has-feedback">
                      <input type="text" class="form-control has-feedback-left" id="account_name" name="account_name"
                          placeholder="Account Name" autocomplete="off" autofocus required>
                      <div class="invalid-feedback d-none text-danger">Please enter the account name.</div>
                      <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon  glyphicon-user" aria-hidden="true"></span>
                  </div>

                  <!-- Contact Person Name -->
                  <div class="col-4 form-group has-feedback">
                      <input type="text" class="form-control has-feedback-left" id="contact_person" name="contact_person"
                          placeholder="Contact Person Name" autocomplete="off">
                      <div class="invalid-feedback d-none text-danger">Please enter the contact person name.</div>
                      <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon  glyphicon-user" aria-hidden="true"></span>
                  </div>

                  <!-- Mobile Number -->
                  <div class="col-4 form-group has-feedback">
                      <input type="tel" class="form-control has-feedback-left" id="mobile" name="mobile"
                          placeholder="Mobile Number" autocomplete="off" required>
                      <div class="invalid-feedback d-none text-danger">Please enter a valid mobile number.</div>
                      <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon  glyphicon-phone" aria-hidden="true"></span>
                  </div>

                  <!-- Email -->
                  <div class="col-4 form-group has-feedback">
                      <input type="email" class="form-control has-feedback-left" id="email" name="email"
                          placeholder="Email" autocomplete="off">
                      <div class="invalid-feedback d-none text-danger">Please enter a valid email address.</div>
                      <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon  glyphicon-envelope" aria-hidden="true"></span>
                  </div>

                  <!-- Monthly Salary -->
                  <div class="col-4 form-group has-feedback">
                      <input type="number" class="form-control has-feedback-left" id="monthly_salary" name="monthly_salary"
                          placeholder="Monthly Salary" autocomplete="off" required>
                      <div class="invalid-feedback d-none text-danger">Please enter the monthly salary.</div>
                      <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon  glyphicon-gift" aria-hidden="true"></span>
                  </div>

                  <!-- Area -->
                  <div class="col-4 form-group has-feedback">
                      <input type="text" class="form-control has-feedback-left" id="area" name="area"
                          placeholder="Road/House No." autocomplete="off">
                      <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon glyphicon-home" aria-hidden="true"></span>
                  </div>
                  <div class="form-group">
                    <div id="btns" class="col-4">
                        <br>
                        <button type="submit" class="btn btn-sm btn-dark">Submit</button>
                    </div>
                  </div>
              </form>
          </div>
      </div>
          `,
    showCloseButton: true,
    showConfirmButton: false,
    showCancelButton: false,
    allowOutsideClick: false,
    preConfirm: () => {
      return new Promise((resolve) => {
        const form = document.getElementById('add-employee');
        const formFields = form.querySelectorAll('.form-control, .form-select');
        let isValid = true;

        // Reset all feedback messages
        form.querySelectorAll('.invalid-feedback').forEach(feedback => {
          feedback.classList.add('d-none');
        });

        // Check each field
        formFields.forEach(field => {
          if (!field.checkValidity()) {
            isValid = false;
            const feedback = field.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
              feedback.classList.remove('d-none');
            }
          }
        });

        if (isValid) {
          resolve({
            account_name: form.account_name.value,
            contact_person: form.contact_person.value,
            mobile: form.mobile.value,
            email: form.email.value,
            monthly_salary: form.monthly_salary.value,
            area: form.area.value
          });
        } else {
          Swal.showValidationMessage('Please correct the errors in the form.');
        }
      });
    },
    willOpen: () => {
      const form = document.getElementById('add-employee');
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();
        document.querySelectorAll('.invalid-feedback').forEach(feedback => {
          feedback.classList.add('d-none');
        });
        let isValid = true;
        form.querySelectorAll('.form-control, .form-select').forEach(field => {
          if (!field.checkValidity()) {
            isValid = false;
            const feedback = field.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
              feedback.classList.remove('d-none');
            }
          }
        });
        if (isValid) {
          Swal.getConfirmButton().click();
        } else {
          Swal.showValidationMessage('Please correct the errors in the form.');
        }
      });
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const data = result.value;
      salary = parseInt(data.monthly_salary, 10);
      opBalance = parseInt(data.opening_balance, 10);
      let employee = {
        account_name: data.account_name,
        contact_person: data.contact_person,
        mobile: data.mobile,
        email: data.email,
        monthly_salary: salary,
        area: data.area
      }
      const requestOptions = {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employee),
      }

      fetch(api+'/admin/hr/employee/new', requestOptions)
        .then(response => response.json())
        .then(data => {
          if (page === "") {
            setTimeout(function () {
              location.reload();
            }, 3000); // Adjust the delay as needed 
          }
          if (data.error === true) {
            showErrorMessage(data.message)
          } else {
            employees.push(data.result)
            showSuccessMessage(data.message);
          }
        });
    }
  });
}
function updateEmployee(empInfo, btnIndex) {
  Swal.fire({
    title: 'Update Employee Account',
    width: 450,
    html: `
      <div class="x_panel">
          <div class="x_content">
              <form autocomplete="off" id="update-employee" class="needs-validation" novalidate>
                  <!-- Account Name -->
                  <div class="col-4 form-group has-feedback">
                      <input type="text" class="form-control has-feedback-left" id="account_name" name="account_name" value="${empInfo.account_name || ""}"
                          placeholder="Account Name" autocomplete="off" autofocus required>
                      <div class="invalid-feedback d-none text-danger">Please enter the account name.</div>
                      <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon  glyphicon-user" aria-hidden="true"></span>
                  </div>

                  <!-- Contact Person Name -->
                  <div class="col-4 form-group has-feedback">
                      <input type="text" class="form-control has-feedback-left" id="contact_person" name="contact_person"
                        value="${empInfo.contact_person || ""}"  placeholder="Contact Person Name" autocomplete="off">
                      <div class="invalid-feedback d-none text-danger">Please enter the contact person name.</div>
                      <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon  glyphicon-user" aria-hidden="true"></span>
                  </div>

                  <!-- Mobile Number -->
                  <div class="col-4 form-group has-feedback">
                      <input type="tel" class="form-control has-feedback-left" id="mobile" name="mobile"
                        value="${empInfo.mobile || ""}"  placeholder="Mobile Number" autocomplete="off" required>
                      <div class="invalid-feedback d-none text-danger">Please enter a valid mobile number.</div>
                      <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon  glyphicon-phone" aria-hidden="true"></span>
                  </div>

                  <!-- Email -->
                  <div class="col-4 form-group has-feedback">
                      <input type="email" class="form-control has-feedback-left" id="email" name="email"
                        value="${empInfo.email || ""}"  placeholder="Email" autocomplete="off">
                      <div class="invalid-feedback d-none text-danger">Please enter a valid email address.</div>
                      <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon  glyphicon-envelope" aria-hidden="true"></span>
                  </div>

                  <!-- Monthly Salary -->
                  <div class="col-4 form-group has-feedback">
                      <input type="number" class="form-control has-feedback-left" id="monthly_salary" name="monthly_salary"
                        value="${empInfo.monthly_salary || ""}"  placeholder="Monthly Salary" autocomplete="off" required>
                      <div class="invalid-feedback d-none text-danger">Please enter the monthly salary.</div>
                      <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon  glyphicon-gift" aria-hidden="true"></span>
                  </div>

                  <!-- Area -->
                  <div class="col-4 form-group has-feedback">
                      <input type="text" class="form-control has-feedback-left" id="area" name="area"
                        value="${empInfo.area || ""}"  placeholder="Road/House No." autocomplete="off">
                      <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon glyphicon-home" aria-hidden="true"></span>
                  </div>
                  <div class="col-4">
                    <div class="toggle-wrapper">
                      <label for="account_status" style="color:#5F5454;background:white">Account Status:</label>
                      <input type="radio" id="status_active" name="account_status" ${empInfo.account_status ? 'checked' : ''} autocomplete="off" >
                      <label for="status_active">Active</label>
                      <input type="radio" id="status_inactive" name="account_status" ${empInfo.account_status ? '' : 'checked'} autocomplete="off" >
                      <label for="status_inactive">Inactive</label>
                    </div>
                  </div>
                  <div class="form-group">
                    <div id="btns" class="col-4">
                        <br>
                        <button type="submit" class="btn btn-sm btn-dark">Save Changes</button>
                    </div>
                  </div>
              </form>
          </div>
      </div>
          `,
    showCloseButton: true,
    showConfirmButton: false,
    showCancelButton: false,
    allowOutsideClick: false,
    preConfirm: () => {
      return new Promise((resolve) => {
        const form = document.getElementById('update-employee');
        const formFields = form.querySelectorAll('.form-control, .form-select');
        let isValid = true;

        // Reset all feedback messages
        form.querySelectorAll('.invalid-feedback').forEach(feedback => {
          feedback.classList.add('d-none');
        });

        // Check each field
        formFields.forEach(field => {
          if (!field.checkValidity()) {
            isValid = false;
            const feedback = field.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
              feedback.classList.remove('d-none');
            }
          }
        });

        if (isValid) {
          resolve({
            account_name: form.account_name.value,
            contact_person: form.contact_person.value,
            mobile: form.mobile.value,
            email: form.email.value,
            monthly_salary: form.monthly_salary.value,
            area: form.area.value,
            status: form.status_active.checked,
          });
        } else {
          Swal.showValidationMessage('Please correct the errors in the form.');
        }
      });
    },
    willOpen: () => {
      const form = document.getElementById('update-employee');
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();
        document.querySelectorAll('.invalid-feedback').forEach(feedback => {
          feedback.classList.add('d-none');
        });
        let isValid = true;
        form.querySelectorAll('.form-control, .form-select').forEach(field => {
          if (!field.checkValidity()) {
            isValid = false;
            const feedback = field.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
              feedback.classList.remove('d-none');
            }
          }
        });
        if (isValid) {
          Swal.getConfirmButton().click();
        } else {
          Swal.showValidationMessage('Please correct the errors in the form.');
        }
      });
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const data = result.value;
      salary = parseInt(data.monthly_salary, 10);
      opBalance = parseInt(data.opening_balance, 10);
      let employee = {
        id: empInfo.id,
        account_name: data.account_name,
        contact_person: data.contact_person,
        mobile: data.mobile,
        email: data.email,
        monthly_salary: salary,
        area: data.area,
        account_status: data.status,
      }
      const requestOptions = {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(employee),
      }
      let btn = document.getElementById('edit-btn-' + btnIndex);
      btn.innerHTML = 'processing <i class="fa fa-spinner fa-spin"></i>'
      btn.disabled = true;

      fetch(api+'/admin/hr/employee/update', requestOptions)
        .then(response => response.json())
        .then(data => {
          if (data.error === true) {
            alertQuestion(data.message)
          } else {
            setTimeout(() => {
              btn.innerHTML = 'Saved'
            }, 1500);
            setTimeout(() => {
              location.reload()
            }, 1500);
          }
        });
    }
  });
}
//addNewSupplier show a popup form and then make an api call to insert supplier data to the database table
function addNewSupplier(page, suppliers) {
  Swal.fire({
    title: 'Add Supplier',
    width: 450,
    html: `
      <div class="x_panel">
          <div class="x_content">
              <form autocomplete="off" id="add-supplier" class="needs-validation" novalidate>
                  <!-- Account Name -->
                  <div class="col-4 form-group has-feedback">
                      <input type="text" class="form-control has-feedback-left" id="account_name" name="account_name"
                          placeholder="Account Name" autocomplete="off" autofocus required>
                      <div class="invalid-feedback d-none text-danger">Please enter the account name.</div>
                      <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon  glyphicon-user" aria-hidden="true"></span>
                  </div>

                  <!-- Contact Person Name -->
                  <div class="col-4 form-group has-feedback">
                      <input type="text" class="form-control has-feedback-left" id="contact_person" name="contact_person"
                          placeholder="Contact Person Name" autocomplete="off">
                      <div class="invalid-feedback d-none text-danger">Please enter the contact person name.</div>
                      <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon  glyphicon-user" aria-hidden="true"></span>
                  </div>

                  <!-- Mobile Number -->
                  <div class="col-4 form-group has-feedback">
                      <input type="tel" class="form-control has-feedback-left" id="mobile" name="mobile"
                          placeholder="Mobile Number" autocomplete="off" required>
                      <div class="invalid-feedback d-none text-danger">Please enter a valid mobile number.</div>
                      <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon  glyphicon-phone" aria-hidden="true"></span>
                  </div>

                  <!-- Email -->
                  <div class="col-4 form-group has-feedback">
                      <input type="email" class="form-control has-feedback-left" id="email" name="email"
                          placeholder="Email" autocomplete="off">
                      <div class="invalid-feedback d-none text-danger">Please enter a valid email address.</div>
                      <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon  glyphicon-envelope" aria-hidden="true"></span>
                  </div>

                  <!-- Area -->
                  <div class="col-4 form-group has-feedback">
                      <input type="text" class="form-control has-feedback-left" id="area" name="area"
                          placeholder="Road/House No.(Optional)" autocomplete="off">
                      <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon glyphicon-home" aria-hidden="true"></span>
                  </div>
                  <div class="form-group">
                    <div id="btns" class="col-4">
                        <br>
                        <button type="submit" class="btn btn-sm btn-dark">Submit</button>
                    </div>
                  </div>
              </form>
          </div>
      </div>
    `,
    showCloseButton: true,
    showConfirmButton: false,
    showCancelButton: false,
    allowOutsideClick: false,
    preConfirm: () => {
      return new Promise((resolve) => {
        const form = document.getElementById('add-supplier');
        const formFields = form.querySelectorAll('.form-control, .form-select');
        let isValid = true;

        // Reset all feedback messages
        form.querySelectorAll('.invalid-feedback').forEach(feedback => {
          feedback.classList.add('d-none');
        });

        // Check each field
        formFields.forEach(field => {
          if (!field.checkValidity()) {
            isValid = false;
            const feedback = field.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
              feedback.classList.remove('d-none');
            }
          }
        });

        if (isValid) {
          resolve({
            account_name: form.account_name.value,
            contact_person: form.contact_person.value,
            mobile: form.mobile.value,
            email: form.email.value,
            area: form.area.value
          });
        } else {
          Swal.showValidationMessage('Please correct the errors in the form.');
        }
      });
    },
    willOpen: () => {
      const form = document.getElementById('add-supplier');
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();
        document.querySelectorAll('.invalid-feedback').forEach(feedback => {
          feedback.classList.add('d-none');
        });
        let isValid = true;
        form.querySelectorAll('.form-control, .form-select').forEach(field => {
          if (!field.checkValidity()) {
            isValid = false;
            const feedback = field.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
              feedback.classList.remove('d-none');
            }
          }
        });
        if (isValid) {
          Swal.getConfirmButton().click();
        } else {
          Swal.showValidationMessage('Please correct the errors in the form.');
        }
      });
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const data = result.value;
      dis = parseInt(data.discount, 10);
      let supplier = {
        account_name: data.account_name,
        contact_person: data.contact_person,
        mobile: data.mobile,
        email: data.email,
        area: data.area
      }
      const requestOptions = {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(supplier),
      }

      fetch(api+'/admin/mis/supplier/new', requestOptions)
        .then(response => response.json())
        .then(data => {
          if (data.error === true) {
            showErrorMessage(data.message)
          } else {
            showSuccessMessage(data.message);
            if (page === "purchase") {
              suppliers.push(data.result);
              selectedSupplier = data.result || null;
              document.getElementById("supplier").value = selectedSupplier.account_name;
            } else {
              setTimeout(function () {
                location.reload();
              }, 3000); // Adjust the delay as needed 
            }
          }
        });
    }
  });
}
function updateSupplier(supInfo, btnIndex) {
  Swal.fire({
    title: 'Update Supplier Account',
    width: 450,
    html: `
      <div class="x_panel">
          <div class="x_content">
              <form autocomplete="off" id="update-supplier" class="needs-validation" novalidate>
                  <!-- Account Name -->
                  <div class="col-4 form-group has-feedback">
                      <input type="text" class="form-control has-feedback-left" id="account_name" name="account_name"
                        value="${supInfo.account_name || ""}"
                          placeholder="Account Name" autocomplete="off" autofocus required>
                      <div class="invalid-feedback d-none text-danger">Please enter the account name.</div>
                      <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon  glyphicon-user" aria-hidden="true"></span>
                  </div>

                  <!-- Contact Person Name -->
                  <div class="col-4 form-group has-feedback">
                      <input type="text" class="form-control has-feedback-left" id="contact_person" name="contact_person"
                        value="${supInfo.contact_person || ""}"  placeholder="Contact Person Name" autocomplete="off">
                      <div class="invalid-feedback d-none text-danger">Please enter the contact person name.</div>
                      <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon  glyphicon-user" aria-hidden="true"></span>
                  </div>

                  <!-- Mobile Number -->
                  <div class="col-4 form-group has-feedback">
                      <input type="tel" class="form-control has-feedback-left" id="mobile" name="mobile"
                        value="${supInfo.mobile || ""}"  placeholder="Mobile Number" autocomplete="off" required>
                      <div class="invalid-feedback d-none text-danger">Please enter a valid mobile number.</div>
                      <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon  glyphicon-phone" aria-hidden="true"></span>
                  </div>

                  <!-- Email -->
                  <div class="col-4 form-group has-feedback">
                      <input type="email" class="form-control has-feedback-left" id="email" name="email"
                        value="${supInfo.email || ""}"  placeholder="Email" autocomplete="off">
                      <div class="invalid-feedback d-none text-danger">Please enter a valid email address.</div>
                      <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon  glyphicon-envelope" aria-hidden="true"></span>
                  </div>

                  <!-- Area -->
                  <div class="col-4 form-group has-feedback">
                      <input type="text" class="form-control has-feedback-left" id="area" name="area"
                        value="${supInfo.area || ""}"  placeholder="Road/House No." autocomplete="off">
                      <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon glyphicon-home" aria-hidden="true"></span>
                  </div>
                  <div class="col-4">
                    <div class="toggle-wrapper">
                      <label for="account_status" style="color:#5F5454;background:white">Account Status:</label>
                      <input type="radio" id="status_active" name="account_status" ${supInfo.account_status ? 'checked' : ''} autocomplete="off" >
                      <label for="status_active">Active</label>
                      <input type="radio" id="status_inactive" name="account_status" ${supInfo.account_status ? '' : 'checked'} autocomplete="off" >
                      <label for="status_inactive">Inactive</label>
                    </div>
                  </div>
                  <div class="form-group">
                    <div id="btns" class="col-4">
                        <br>
                        <button type="submit" class="btn btn-sm btn-dark">Save Changes</button>
                    </div>
                  </div>
              </form>
          </div>
      </div>`,
    showCloseButton: true,
    showConfirmButton: false,
    showCancelButton: false,
    allowOutsideClick: false,
    preConfirm: () => {
      return new Promise((resolve) => {
        const form = document.getElementById('update-supplier');
        const formFields = form.querySelectorAll('.form-control, .form-select');
        let isValid = true;

        // Reset all feedback messages
        form.querySelectorAll('.invalid-feedback').forEach(feedback => {
          feedback.classList.add('d-none');
        });

        // Check each field
        formFields.forEach(field => {
          if (!field.checkValidity()) {
            isValid = false;
            const feedback = field.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
              feedback.classList.remove('d-none');
            }
          }
        });

        if (isValid) {
          resolve({
            account_name: form.account_name.value,
            contact_person: form.contact_person.value,
            mobile: form.mobile.value,
            email: form.email.value,
            area: form.area.value,
            status: form.status_active.checked,
          });
        } else {
          Swal.showValidationMessage('Please correct the errors in the form.');
        }
      });
    },
    willOpen: () => {
      const form = document.getElementById('update-supplier');
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();
        document.querySelectorAll('.invalid-feedback').forEach(feedback => {
          feedback.classList.add('d-none');
        });
        let isValid = true;
        form.querySelectorAll('.form-control, .form-select').forEach(field => {
          if (!field.checkValidity()) {
            isValid = false;
            const feedback = field.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
              feedback.classList.remove('d-none');
            }
          }
        });
        if (isValid) {
          Swal.getConfirmButton().click();
        } else {
          Swal.showValidationMessage('Please correct the errors in the form.');
        }
      });
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const data = result.value;
      let supplier = {
        id: supInfo.id,
        account_name: data.account_name,
        contact_person: data.contact_person,
        mobile: data.mobile,
        email: data.email,
        area: data.area,
        account_status: data.status,
      }
      const requestOptions = {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(supplier),
      }
      let btn = document.getElementById('edit-btn-' + btnIndex);
      btn.innerHTML = 'processing <i class="fa fa-spinner fa-spin"></i>'
      btn.disabled = true;

      fetch(api+'/admin/mis/supplier/update', requestOptions)
        .then(response => response.json())
        .then(data => {
          if (data.error === true) {
            alertQuestion(data.message)
          } else {
            setTimeout(() => {
              btn.innerHTML = 'Saved'
            }, 1500);
            setTimeout(() => {
              location.reload()
            }, 1500);
          }
        });
    }
  });
}

//addNewStakeHolder show a popup form and then make an api call to insert stakeholder data to the database table
function addNewStakeHolder() {
  Swal.fire({
    title: 'Add Stakeholder',
    width: 450,
    html: `
      <div class="x_panel">
          <div class="x_content">
              <form autocomplete="off" id="add-stake-holder" class="needs-validation" novalidate>
                  <!-- Account Type -->
                  <div class="col-4 form-group has-feedback">
                      <select id="account_type" class="form-control form-select has-feedback-left" autofocus required>
                          <option value="" selected disabled>Select Type</option>
                          <option value="Owner">Owner</option>
                          <option value="Investor">Investor</option>
                      </select>
                      <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)"
                        class="form-control-feedback left glyphicon glyphicon-home" aria-hidden="true"></span>
                      <div class="invalid-feedback d-none text-danger">please select account type</div>
                  </div>

                  <!-- Account Name -->
                  <div class="col-4 form-group has-feedback">
                      <input type="text" class="form-control has-feedback-left" id="account_name" name="account_name"
                          placeholder="Account Name" autocomplete="off" required>
                      <div class="invalid-feedback d-none text-danger">Please enter the account name.</div>
                      <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon  glyphicon-user" aria-hidden="true"></span>
                  </div>

                  <!-- Contact Person Name -->
                  <div class="col-4 form-group has-feedback">
                      <input type="text" class="form-control has-feedback-left" id="contact_person" name="contact_person"
                          placeholder="Contact Person Name" autocomplete="off">
                      <div class="invalid-feedback d-none text-danger">Please enter the contact person name.</div>
                      <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon  glyphicon-user" aria-hidden="true"></span>
                  </div>

                  <!-- Mobile Number -->
                  <div class="col-4 form-group has-feedback">
                      <input type="tel" class="form-control has-feedback-left" id="mobile" name="mobile"
                          placeholder="Mobile Number" autocomplete="off" required>
                      <div class="invalid-feedback d-none text-danger">Please enter a valid mobile number.</div>
                      <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon  glyphicon-phone" aria-hidden="true"></span>
                  </div>

                  <!-- Email -->
                  <div class="col-4 form-group has-feedback">
                      <input type="email" class="form-control has-feedback-left" id="email" name="email"
                          placeholder="Email" autocomplete="off">
                      <div class="invalid-feedback d-none text-danger">Please enter a valid email address.</div>
                      <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon  glyphicon-envelope" aria-hidden="true"></span>
                  </div>

                  <!-- Area -->
                  <div class="col-4 form-group has-feedback">
                      <input type="text" class="form-control has-feedback-left" id="area" name="area"
                          placeholder="Road/House No.(Optional)" autocomplete="off">
                      <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon glyphicon-home" aria-hidden="true"></span>
                  </div>
                  <div class="form-group">
                    <div id="btns" class="col-4">
                        <br>
                        <button type="submit" class="btn btn-sm btn-dark">Submit</button>
                    </div>
                  </div>
              </form>
          </div>
      </div>
    `,
    showCloseButton: true,
    showConfirmButton: false,
    showCancelButton: false,
    allowOutsideClick: false,
    preConfirm: () => {
      return new Promise((resolve) => {
        const form = document.getElementById('add-stake-holder');
        const formFields = form.querySelectorAll('.form-control, .form-select');
        let isValid = true;

        // Reset all feedback messages
        form.querySelectorAll('.invalid-feedback').forEach(feedback => {
          feedback.classList.add('d-none');
        });

        // Check each field
        formFields.forEach(field => {
          if (!field.checkValidity()) {
            isValid = false;
            const feedback = field.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
              feedback.classList.remove('d-none');
            }
          }
        });

        if (isValid) {
          resolve({
            account_type: form.account_type.value,
            account_name: form.account_name.value,
            contact_person: form.contact_person.value,
            mobile: form.mobile.value,
            email: form.email.value,
            area: form.area.value
          });
        } else {
          Swal.showValidationMessage('Please correct the errors in the form.');
        }
      });
    },
    willOpen: () => {
      const form = document.getElementById('add-stake-holder');
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();
        document.querySelectorAll('.invalid-feedback').forEach(feedback => {
          feedback.classList.add('d-none');
        });
        let isValid = true;
        form.querySelectorAll('.form-control, .form-select').forEach(field => {
          if (!field.checkValidity()) {
            isValid = false;
            const feedback = field.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
              feedback.classList.remove('d-none');
            }
          }
        });
        if (isValid) {
          Swal.getConfirmButton().click();
        } else {
          Swal.showValidationMessage('Please correct the errors in the form.');
        }
      });
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const data = result.value;
      dis = parseInt(data.discount, 10);
      let proprietor = {
        account_type: data.account_type,
        account_name: data.account_name,
        contact_person: data.contact_person,
        mobile: data.mobile,
        email: data.email,
        area: data.area
      }
      const requestOptions = {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(proprietor),
      }

      fetch(api+'/admin/add-stake-holder', requestOptions)
        .then(response => response.json())
        .then(data => {
          console.log(data)
          if (data.error === true) {
            showErrorMessage(data.message)
          } else {
            showSuccessMessage(data.message);
            setTimeout(() => {
              location.reload()
            }, 2000);
          }
        });
    }
  });
}
//checkoutWarrantyProducts show a popup checkout warranty for and make an api call to update database table for checkout process
function checkoutWarrantyProducts(warrantyHistoryID, productSerialNo, productSerialID) {

  let htmlContent = `
        <div class="x_panel">
            <div class="x_content">
                <form autocomplete="off" id="checkout-wp" class="needs-validation" novalidate>
                    <!-- Arrival Date -->
                    <div class="col-6 form-group has-feedback">
                        <input type="text" class="form-control has-feedback-left"  id="arrival_date" name="arrival_date"
                            placeholder="Enter date(mm-dd-yyyy)" autofocus autocomplete="off" required>
                        <div class="invalid-feedback d-none text-danger">Please correct date.</div>
                        <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon glyphicon-calendar" aria-hidden="true"></span>
                    </div>
                    <!-- New SN Name -->
                    <div class="col-6 form-group has-feedback">
                        <input type="text" class="form-control has-feedback-left" id="new_sn" name="new_sn"
                            placeholder="New S/N (enter previous S/N if warranty repair)" autocomplete="off" required>
                        <div class="invalid-feedback d-none text-danger">For old items, enter previous serial; for new, enter a new serial."</div>
                        <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon glyphicon-barcode" aria-hidden="true"></span>
                    </div>
                    <div class="col-6 form-group has-feedback">
                        <input type="text" class="form-control has-feedback-left" id="comment" name="comment"
                            placeholder="Comment" autocomplete="off">
                        <div class="invalid-feedback d-none text-danger">Please enter the product name.</div>
                        <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left fa fa-file-text-o" aria-hidden="true"></span>
                    </div>
                    <div class="form-group">
                      <div id="btns" class="col-4">
                          <br>
                          <button type="submit" class="btn btn-sm btn-danger">Submit</button>
                      </div>
                    </div>
                </form>
            </div>
        </div>
          `;
  Swal.fire({
    title: 'Checkout Warranty',
    width: 450,
    html: htmlContent,
    showCloseButton: true,
    showConfirmButton: false,
    showCancelButton: false,
    allowOutsideClick: false,
    preConfirm: () => {
      return new Promise((resolve) => {
        const form = document.getElementById('checkout-wp');
        const formFields = form.querySelectorAll('.form-control, .form-select');
        let isValid = true;

        // Reset all feedback messages
        form.querySelectorAll('.invalid-feedback').forEach(feedback => {
          feedback.classList.add('d-none');
        });

        // Check each field
        formFields.forEach(field => {
          if (!field.checkValidity()) {
            isValid = false;
            const feedback = field.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
              feedback.classList.remove('d-none');
            }
          }
        });

        if (isValid) {
          resolve({
            arrival_date: form.arrival_date.value,
            new_s_n: form.new_sn.value,
            comment: form.comment.value,
          });
        } else {
          Swal.showValidationMessage('Please correct the errors in the form.');
        }
      });
    },
    willOpen: () => {
      const form = document.getElementById('checkout-wp');
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();
        document.querySelectorAll('.invalid-feedback').forEach(feedback => {
          feedback.classList.add('d-none');
        });
        let isValid = true;
        form.querySelectorAll('.form-control, .form-select').forEach(field => {
          if (!field.checkValidity()) {
            isValid = false;
            const feedback = field.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
              feedback.classList.remove('d-none');
            }
          }
        });
        if (isValid) {
          Swal.getConfirmButton().click();
        } else {
          Swal.showValidationMessage('Please correct the errors in the form.');
        }
      });
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const data = result.value;
      let wpData = {
        warranty_history_id: warrantyHistoryID,
        product_serial_id: productSerialID,
        old_serial_number: productSerialNo,
        checkout_date: data.arrival_date,
        new_serial_number: data.new_s_n,
        comment: data.comment,
      }
      const requestOptions = {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(wpData),
      }
      console.log(wpData)

      fetch(api+'/admin/inventory/products/warranty/checkout', requestOptions)
        .then(response => response.json())
        .then(data => {
          console.log(data)
          if (data.error === true) {
            showErrorMessage(data.message)
          } else {
            showSuccessMessage(data.message);
          }
        });
    }
  });
  initSingleDatePicker("#arrival_date")
}
//Function to show SweetAlert2 prompt and handle the delivery process for a warranty product
function confirmWarrantyDeliveryProcess(warrantyHistoryID, productSerialID) {
  // Display a SweetAlert2 confirmation prompt to proceed with delivery
  Swal.fire({
    title: 'Proceed with delivery?',   // Prompt message
    showCancelButton: true,            // Show the cancel button
    confirmButtonText: 'Yes',          // Text for the confirm button
    cancelButtonText: 'Cancel',        // Text for the cancel button
    icon: 'warning',                   // Icon type to indicate a warning action
  }).then((result) => {
    // Check if the user confirmed by clicking "Yes"
    if (result.isConfirmed) {
      // Data object containing warranty history ID and product serial ID
      let wpData = {
        warranty_history_id: warrantyHistoryID,
        product_serial_id: productSerialID,
      };

      // Fetch API request options, including method, headers, and body (as JSON)
      const requestOptions = {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(wpData),  // Convert data object to a JSON string
      };

      // Log the data being sent to the API (for debugging purposes)
      console.log(wpData);

      // Send a POST request to the API endpoint for warranty delivery
      fetch(api+'/admin/inventory/products/warranty/delivery', requestOptions)
        .then(response => response.json())  // Parse the response as JSON
        .then(data => {
          // Check if the API returned an error
          if (data.error === true) {
            showErrorMessage(data.message);  // Show error message if there's an issue
          } else {
            showSuccessMessage(data.message);  // Show success message on success
            setTimeout(function () {
              location.reload();
            }, 3000); // Adjust the delay as needed 
          }
        })
        .catch(error => {
          // Handle any errors that occur during the fetch request
          console.error('Error during the request:', error);
          showErrorMessage('An error occurred during the delivery process.');
        });
    }
  });
}
//viewWarrantyHistory shows warranty history
function viewWarrantyHistory(warrantyHistory) {
  let mm = warrantyHistory.memo_no.split("-").pop() //get the last part of the memo
  // Display a SweetAlert2 confirmation prompt to proceed with delivery
  Swal.fire({
    width: 720,
    title: 'Warranty Information',   // Prompt message
    showCancelButton: false,            // Show the cancel button
    confirmButtonText: 'Ok',          // Text for the confirm button
    // cancelButtonText: 'Cancel',        // Text for the cancel button
    allowOutsideClick: false,          //disable outside click

    html: `<div class="row">
          <div class="col-md-6 col-sm-6 col-xs-12">
            <!-- Table row -->
            <table class="table table-striped">
              <caption>Product Reception</caption>
              <tbody>
                <tr>
                  <td>Invoice No:</td>
                  <td>
                    <b>MM-WC-${mm}</b>
                  </td>
                </tr>
                <tr>
                  <td>Old S/N:</td>
                  <td><b>${warrantyHistory.previous_serial_no}</b></td>
                </tr>
                <tr>
                  <td>Received By:</td>
                  <td><b>${warrantyHistory.received_by ? warrantyHistory.received_by : ""}</b></td>
                </tr>
                <tr>
                  <td>Receiption Date:</td>
                  <td><b>${formatDate(warrantyHistory.requested_date, "date", "-")}</b></td>
                </tr>
                <tr>
                  <td>Complain:</td>
                  <td><b>${warrantyHistory.reported_problem}</b></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
  
          <div class="col-md-6 col-sm-6 col-xs-12">
            <!-- Table row -->
            <table class="table table-striped">
              <caption>Delivery Information</caption>
              <tbody>
                <tr>
                  <td>Invoice No:</td>
                  <td>
                    <b>MM-WD-${mm}</b>
                  </td>
                </tr>
                 <tr>
                  <td>New S/N:</td>
                  <td><b>${warrantyHistory.new_serial_no}</b></td>
                </tr>
                <tr>
                  <td>Delivered By:</td>
                  <td><b>${warrantyHistory.delivered_by ? warrantyHistory.delivered_by : ""}</td>
                </tr>
                <tr>
                  <td>Delivery Date:</td>
                  <td><b>${formatDate(warrantyHistory.delivery_date, "date", "-")}</b></td>
                </tr>
                <tr>
                  <td>Comment:</td>
                  <td><b>${warrantyHistory.comment}</b></td>
                </tr>
                
                <tr>
                  <td></td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      `
  }).then((result) => {
  });
}
// Function to initialize the SweetAlert2 form with date range picker
function showDateRangePickerPopup() {
  Swal.fire({
    title: 'Select Date Range',
    html: '<div id="daterange-container" style="cursor: pointer; padding: 5px; border: 1px solid #ccc; width: 100%;">' +
      '<span>Click to select date range</span> <i class="fa fa-calendar"></i></div>',
    showCancelButton: true,
    confirmButtonText: 'Submit',
    width: 450,
    preConfirm: () => {
      const daterangepicker = $('#daterange-container').data('daterangepicker');
      const startDate = daterangepicker.startDate.format('MM/DD/YYYY');
      const endDate = daterangepicker.endDate.format('MM/DD/YYYY');
      return { startDate, endDate };
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const { startDate, endDate } = result.value;
      console.log("Pop:", startDate, endDate)
      showFilteredReport(startDate, endDate);
    }
  });

  // Initialize the date range picker in the SweetAlert popup
  DateRangePicker_Cal('daterange-container');
}
// function cancelService(id) {
//   let btn = document.getElementById(`cancel-btn-${id}`);
//   btn.innerHTML = `Processing <i class="fa fa-spinner fa-spin"></i>`;
//   btn.disabled = true;

// }

//cancelService show a popup Cancel service for and make an api call to update database table for cancel service process
function cancelService(id) {
  let htmlContent = `
        <div class="x_panel">
            <div class="x_content">
                <form autocomplete="off" id="cancel-service" class="needs-validation" novalidate>
                    <!-- Delivery Date -->
                    <div class="col-6 form-group has-feedback">
                        <input type="text" class="form-control has-feedback-left"  id="delivery_date" name="delivery_date"
                            placeholder="Enter date(mm-dd-yyyy)" autofocus autocomplete="off" required>
                        <div class="invalid-feedback d-none text-danger">Please correct date.</div>
                        <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon glyphicon-calendar" aria-hidden="true"></span>
                    </div>
                    <!-- Comment -->
                    <div class="col-6 form-group has-feedback">
                        <input type="text" class="form-control has-feedback-left" id="note" name="note"
                            placeholder="Reason for cancellation" autocomplete="off">
                        <div class="invalid-feedback d-none text-danger">Please refer to the reason"</div>
                        <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon glyphicon-barcode" aria-hidden="true"></span>
                    </div>
                    <div class="col-6 form-group has-feedback">
                        <input type="text" class="form-control has-feedback-left" id="delivered_by" name="delivered_by"
                            placeholder="Delivered by" autocomplete="off">
                        <div class="invalid-feedback d-none text-danger">Please enter the employee name.</div>
                        <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left fa fa-user" aria-hidden="true"></span>
                    </div>
                    <div class="form-group">
                      <div id="btns" class="col-4">
                          <br>
                          <button type="submit" class="btn btn-sm btn-danger">Submit</button>
                      </div>
                    </div>
                </form>
            </div>
        </div>
          `;
  Swal.fire({
    title: 'Cancel Service',
    width: 450,
    html: htmlContent,
    showCloseButton: true,
    showConfirmButton: false,
    showCancelButton: false,
    allowOutsideClick: false,
    preConfirm: () => {

      return new Promise((resolve) => {
        const form = document.getElementById('cancel-service');
        const formFields = form.querySelectorAll('.form-control, .form-select');
        let isValid = true;

        // Reset all feedback messages
        form.querySelectorAll('.invalid-feedback').forEach(feedback => {
          feedback.classList.add('d-none');
        });

        // Check each field
        formFields.forEach(field => {
          if (!field.checkValidity()) {
            isValid = false;
            const feedback = field.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
              feedback.classList.remove('d-none');
            }
          }
        });

        if (isValid) {
          resolve({
            delivery_date: form.delivery_date.value,
            note: form.note.value,
            delivered_by: form.delivered_by.value,
          });
        } else {
          Swal.showValidationMessage('Please correct the errors in the form.');
        }
      });
    },
    willOpen: () => {
      const form = document.getElementById('cancel-service');
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();
        document.querySelectorAll('.invalid-feedback').forEach(feedback => {
          feedback.classList.add('d-none');
        });
        let isValid = true;
        form.querySelectorAll('.form-control, .form-select').forEach(field => {
          if (!field.checkValidity()) {
            isValid = false;
            const feedback = field.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
              feedback.classList.remove('d-none');
            }
          }
        });
        if (isValid) {
          Swal.getConfirmButton().click();
        } else {
          Swal.showValidationMessage('Please correct the errors in the form.');
        }
      });
    }

  }).then((result) => {
    if (result.isConfirmed) {
      const data = result.value;
      const reqBody = {
        id: parseInt(id),
        delivery_date: data.delivery_date,
        note: data.note,
        delivered_by: data.delivered_by,
      }
      const requestOptions = {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reqBody),
      }
      fetch(api+'/admin/inventory/services/purchase/cancel', requestOptions)
        .then(response => response.json())
        .then(function (data) {
          if (data.error === true) {
            alertQuestion(data.message)
          } else {
            setTimeout(() => {
              btn.innerHTML = 'Saved'
            }, 1000);
          }
          // setTimeout(() => {
          //   location.reload();
          // }, 2000);
        })
        .catch(function (error) {
          console.error('Error fetching data:', error);
        });
    }
  });
  initSingleDatePicker("#delivery_date")
}


//addNewExpenseType show a popup form and then make an api call to insert expense data to the database table
function addNewExpenseType(page, expenses) {
  Swal.fire({
    title: 'Add New Expense',
    width: 450,
    html: `
      <div class="x_panel">
          <div class="x_content">
              <form autocomplete="off" id="add-expense" class="needs-validation" novalidate>
                  <!-- Expense Name -->
                  <div class="col-6 form-group has-feedback">
                      <input type="text" class="form-control has-feedback-left" id="name" name="name"
                          placeholder="Expense Name" autocomplete="off" autofocus required>
                      <div class="invalid-feedback d-none text-danger">Please enter the expense name.</div>
                      <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon glyphicon-tags" aria-hidden="true"></span>
                  </div>
                  <div class="form-group">
                    <div id="btns" class="col-4">
                        <br>
                        <button type="submit" class="btn btn-sm btn-dark">Submit</button>
                    </div>
                  </div>
              </form>
          </div>
      </div>
    `,
    showCloseButton: true,
    showConfirmButton: false,
    showCancelButton: false,
    allowOutsideClick: false,
    preConfirm: () => {
      return new Promise((resolve) => {
        const form = document.getElementById('add-expense');
        const formFields = form.querySelectorAll('.form-control, .form-select');
        let isValid = true;

        // Reset all feedback messages
        form.querySelectorAll('.invalid-feedback').forEach(feedback => {
          feedback.classList.add('d-none');
        });

        // Check each field
        formFields.forEach(field => {
          if (!field.checkValidity()) {
            isValid = false;
            const feedback = field.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
              feedback.classList.remove('d-none');
            }
          }
        });

        if (isValid) {
          resolve({
            name: form.name.value,
          });
        } else {
          Swal.showValidationMessage('Please correct the errors in the form.');
        }
      });
    },
    willOpen: () => {
      const form = document.getElementById('add-expense');
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();
        document.querySelectorAll('.invalid-feedback').forEach(feedback => {
          feedback.classList.add('d-none');
        });
        let isValid = true;
        form.querySelectorAll('.form-control, .form-select').forEach(field => {
          if (!field.checkValidity()) {
            isValid = false;
            const feedback = field.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
              feedback.classList.remove('d-none');
            }
          }
        });
        if (isValid) {
          Swal.getConfirmButton().click();
        } else {
          Swal.showValidationMessage('Please correct the errors in the form.');
        }
      });
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const data = result.value;
      let expense_type = {
        expense_name: data.name,
      }
      const requestOptions = {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expense_type),
      }

      fetch(api+'/admin/inventory/expenses/type/new', requestOptions)
        .then(response => response.json())
        .then(data => {
          console.log(data);
          if (data.error === true) {
            alertQuestion(data.message)

          } else {
            if (page === "expense") {
              expenses.push(data.result)
              showSuccessMessage(data.message)
            }
            //else {
            // location.reload()
            //}
          }
        });
    }
  });
}

//updateExpense show a popup form and then make an api call to update expense data to the database table
function updateExpense(expenseType, btnIndex) {
  Swal.fire({
    title: 'Update Expense',
    width: 450,
    html: `
      <div class="x_panel">
          <div class="x_content">
              <form autocomplete="off" id="update-expense" class="needs-validation" novalidate>
                  <!-- Expense Name -->
                  <div class="col-6 form-group has-feedback">
                      <input type="text" class="form-control has-feedback-left" id="name" name="name" value="${expenseType.expense_name}"
                          placeholder="Expense Name" autocomplete="off" autofocus required>
                      <div class="invalid-feedback d-none text-danger">Please enter the expense name.</div>
                      <span style="color: rgba(0, 0, 0, 1); transform:translate(-40%,-10%)" class="form-control-feedback left glyphicon glyphicon-tags" aria-hidden="true"></span>
                  </div>
                  <div class="form-group">
                    <div id="btns" class="col-4">
                        <br>
                        <button type="submit" class="btn btn-sm btn-dark">Submit</button>
                    </div>
                  </div>
              </form>
          </div>
      </div>
    `,
    showCloseButton: true,
    showConfirmButton: false,
    showCancelButton: false,
    allowOutsideClick: false,
    preConfirm: () => {
      return new Promise((resolve) => {
        const form = document.getElementById('update-expense');
        const formFields = form.querySelectorAll('.form-control, .form-select');
        let isValid = true;

        // Reset all feedback messages
        form.querySelectorAll('.invalid-feedback').forEach(feedback => {
          feedback.classList.add('d-none');
        });

        // Check each field
        formFields.forEach(field => {
          if (!field.checkValidity()) {
            isValid = false;
            const feedback = field.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
              feedback.classList.remove('d-none');
            }
          }
        });

        if (isValid) {
          resolve({
            new_name: form.name.value,
          });
        } else {
          Swal.showValidationMessage('Please correct the errors in the form.');
        }
      });
    },
    willOpen: () => {
      const form = document.getElementById('update-expense');
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        event.stopPropagation();
        document.querySelectorAll('.invalid-feedback').forEach(feedback => {
          feedback.classList.add('d-none');
        });
        let isValid = true;
        form.querySelectorAll('.form-control, .form-select').forEach(field => {
          if (!field.checkValidity()) {
            isValid = false;
            const feedback = field.nextElementSibling;
            if (feedback && feedback.classList.contains('invalid-feedback')) {
              feedback.classList.remove('d-none');
            }
          }
        });
        if (isValid) {
          Swal.getConfirmButton().click();
        } else {
          Swal.showValidationMessage('Please correct the errors in the form.');
        }
      });
    }
  }).then((result) => {
    if (result.isConfirmed) {
      const data = result.value;
      let payload = {
        exp_id: expenseType.id,
        old_name: expenseType.expense_name,
        new_name: data.new_name,
      }
      let btn = document.getElementById('edit-btn-' + btnIndex);
      btn.innerHTML = 'processing <i class="fa fa-spinner fa-spin"></i>'
      const requestOptions = {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      }
      console.log("Payload:", payload)
      fetch(api+'/admin/inventory/expenses/type/update', requestOptions)
        .then(response => response.json())
        .then(data => {
          console.log("Response:", data)
          setInterval(() => {
            let btn = document.getElementById('edit-btn-' + btnIndex);
            btn.innerHTML = 'Saved'
          }, 1000);
          if (data.error === true) {
            alertQuestion(data.message)
          } else if (btnIndex >= 0) {
            setInterval(() => {
              location.reload()
            }, 1000);
          }
        });
    }
  });
}

