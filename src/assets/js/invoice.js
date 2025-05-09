//printPurchaseInvoice prints the current invoice
function printPurchaseInvoice() {
    // product list table
    const newWindow = window.open("", "_blank");
    let tBody = ""
    let company_info = ""
    let name = company.name.split(":::").filter(p => p.trim() !== "")
    const companyFName = name[0]
    const companyLName = name[1] || ""

    let pLn = InvoiceData.purchased_product.length
    for (let i = 0; i < pLn; i++) {
        const items = InvoiceData.purchased_product[i]
        let serialNumbers = ""

        items.serial_numbers.forEach((sn, j) => {
            if (sn !== 'unmarked') {
                serialNumbers += `S/N:&nbsp;&nbsp;${sn}    `
            }
        })
        tBody += `            
            <tr class="item-row">
                <td>${i + 1}</td>
                <td class="item-name">
                  ${items.item.product_name} <br>
                  <small> ${serialNumbers} </small>
                </td>
                <td class="item-warranty text-center">${items.warranty}</td>
                <td class="item-quantity text-center">${items.quantity}</td>
                <td class="item-price text-right">${items.rate}</td>
                <td class="item-total text-right">${items.quantity * items.rate}</td>
              </tr>
            `
    }
    tBody += `
          <tr class="item-row">
            <td rowspan="4" colspan="4" style="border: none; text-align:left; font-weight:bold;">
              Amount ${InvoiceData.total_amount < 0 ? "Receivable" : "Payable"} (In Words): 
              <span style="padding:5px; font-weight:normal; text-transform: capitalize;" id="total-amount-in-words">
                ${company.currency === "Taka" ? numberToWordsBDT(InvoiceData.total_amount) : numberToWords(InvoiceData.total_amount) + " " + company.currency} Only.
              </span>
            </td>
            <td class="text-right item-total">Subtotal</td>
            <td id="subtotal" class="text-right item-total">${InvoiceData.bill_amount}</td>
          </tr>
          <tr class="item-row">
            <td class="text-right item-total">Shipment Charge</td>
            <td id="subtotal" class="text-right item-total">${InvoiceData.shipment_cost}</td>
          </tr>
          <!-- <tr class="item-row">
              <td id="tax-percentage" class="text-right item-total">Tax(%)</td>
              <td id="tax-total" class="text-right item-total">10</td>
          </tr> -->
          <tr class="item-row">
              <td id="discount-percentage" class="text-right item-total">Discount(${InvoiceData.discount}%)</td>
              <td id="discount-total" class="text-right item-total">${InvoiceData.total_amount - InvoiceData.bill_amount}</td>
          </tr>
          <tr class="item-row">
              <td class="text-right total">Total</td>
              <td id="total" class="text-right total">${InvoiceData.total_amount}</td>
          </tr>
        `
    //terms and conditions
    let terms = "";
    const terms_conditions = company.terms_conditions.split(":::").filter(term => term.trim() !== "")
    terms_conditions.forEach(term => {
        terms += `<li>${term}</li>`
    });

    //member of associations
    let members_of = "";
    const associations = company.associations_logo_links.split(":::").filter(association => association.trim() !== "")
    associations.forEach(association => {
        members_of += `<img src="https://psinventory-v2.onrender.com/images/${association}" alt="${association}">`
    });

    const content = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Invoice</title>
            <style>
              :root {
                  --primary-color: #6ab023;
                  --black-color: #000000;
                  --dark-color: #282b30;
                  --light-gray: #f2f2f2;
                  --border-color: #bfbebe;
                  --white-color: #ffffff;
              }

              body {
                  font-family: Arial, Helvetica, sans-serif;
                  font-weight: normal;
                  margin: 0;
                  padding: 10px;
                  color: var(--black-color);
                  font-size: 11px;
                  line-height: 1.3;
              }

              .container {
                  max-width: 800px;
                  margin: 0 auto;
              }

              .header {
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 5px;
              }

              .logo-section {
                  display: flex;
                  align-items: center;
              }

              .logo {
                  width: 48px;
                  height: 42px;
                  margin-right: 0px;
              }

              .logo img {
                  width: 100%;
                  height: 100%;
                  object-fit: contain;
                  background-color: var(--white-color);
              }

              .company-name {
                  color: var(--primary-color);
                  font-weight: bold;
                  font-size: 26px;
                  line-height: 0.8;
                  padding-left: 2px;
                  text-transform: uppercase;
              }

              .enterprise {
                  color: var(--black-color);
                  font-size: 20px;
                  letter-spacing: 1.5px;
              }

              .company-address {
                  font-size: 9px;
                  max-width: 400px;
                  margin-top: 4px;
                  line-height: 1.2;
                  font-weight: bold;
              }

              .contact-info {
                  text-align: right;
                  font-size: 10px;
                  font-weight: bold;
                  font-weight: 500;
              }

              .contact-info a {
                  color: var(--primary-color);
                  text-decoration: none;
                  font-weight: bold;
              }

              .invoice-title {
                  background-color: white;
                  color: var(--dark-color);
                  text-align: center;
                  padding: 3px;
                  margin: 5px auto;
                  width: 150px;
                  font-size: 12px;
                  font-weight: bold;
                  border: 1px solid var(--black-color);
                  border-radius: 2px;
                  box-shadow: 1px 1px 0px 1px var(--black-color);
              }

              .dotted-line {
                  border-top: 1px dotted #999;
                  margin: 5px 0;
              }

              .details {
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 10px;
              }

              .left-details {
                  width: 60%;
              }

              .right-details {
                  width: 35%;
              }

              .detail-row {
                  display: flex;
                  margin-bottom: 2px;
              }

              .detail-label {
                  width: 80px;
                  font-weight: bold;
                  font-size: 11px;
              }

              .detail-value {
                  flex: 1;
                  font-size: 11px;
              }

              table {
                  width: 100%;
                  border-collapse: collapse;
              }

              th {
                  background-color: var(--light-gray);
                  color: var(--black-color);
                  text-transform: capitalize;
                  font-weight: bolder;
                  text-align: center;
                  padding: 5px 5px;
                  font-size: 10px;
                  border: 1px solid var(--dark-color);
              }

              td {
                  padding: 1px 5px;
                  font-size: 10px;
                  color: var(--black-color);
                  font-weight: 500;
                  border: 1px solid var(--dark-color);
                  border-top: none;
              }

              .item-row .item-name {
                  font-size: 10px;
                  font-weight: 600;
                  color: var(--black-color);
                  max-width: 45% !important;
              }

              .item-row .item-name small {
                  max-width: 45% !important;
                  width: 45% !important;
                  font-size: 9px;
                  font-weight: 400;
                  color: var(--black-color);
                  white-space: normal;
                  word-break: break-word;
                  overflow-wrap: anywhere;
              }

              .empty-row td {
                  padding: 4px 8px;
                  border-bottom: 1px solid var(--border-color);
              }

              .item-total {
                  padding: 3px 5px;
              }

              .total {
                  background-color: var(--light-gray);
                  font-weight: bold;
                  padding: 3px 5px;
              }

              .text-right {
                  text-align: right;
              }

              .text-center {
                  text-align: center;
              }

              /* Payment info section */
              .payment-section {
                  font-size: 9px;
                  margin: 10px 0;
              }

              .payment-section h4 {
                  margin-bottom: 3px;
                  margin-top: 0;
                  font-size: 10px;
                  text-decoration: underline;
              }

              .payment-section .detail-label,
              .payment-section .detail-value {
                  font-size: 9px;
              }

              .terms {
                  font-size: 9px;
                  margin: 10px 0;
              }

              .terms h4 {
                  margin-bottom: 3px;
                  margin-top: 0;
                  font-size: 10px;
                  text-decoration: underline;
              }

              .terms ul {
                  margin: 0;
                  padding-left: 15px;
                  line-height: 1.2;
              }

              .terms ul ul {
                  padding-left: 10px;
              }

              .terms li {
                  margin-bottom: 1px;
              }


              .invoice-footer-fixed {
                  position: absolute;
                  bottom: 0;
                  left: 50%;
                  transform: translate(-50%);
                  width: 100%;
                  max-width: 800px;
                  padding: 10px;
                  box-sizing: border-box;
                  background: #fff;
                  break-inside: avoid;
              }

              .invoice-footer-scroll {
                  width: 100%;
                  max-width: 800px;
                  padding: 40px;
                  box-sizing: border-box;
                  background: #fff;
                  break-inside: avoid;
              }

              .signature-section {
                  display: flex;
                  justify-content: space-around;
                  padding-bottom: 8px;
                  margin-bottom: 8px;
              }

              .signature-box {
                  width: 180px;
                  text-align: center;
                  border-top: 1px solid #000;
                  padding-top: 3px;
                  font-size: 10px;
              }

              .remark {
                  font-size: 8px;
                  margin-top: 2px;
              }

              .invoice-footer-info {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  font-size: 9px;
              }

              .member-logos {
                  display: flex;
                  align-items: center;
                  font-weight:bold;
                  gap: 6px;
              }

              .member-logos img {
                  height: 40px;
              }

              .print-info {
                  text-align: right;
                  font-weight: 500;
              }

              .footer-remark{
                  font-size: 8px;
                  text-align:center;
                  color: rgb(0, 94, 255);
              }

              .watermark-container {
                  position: fixed;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  z-index: 0;
                  pointer-events: none;
                  /* Allow clicks through the watermark */
              }

              .watermark {
                  opacity: 0.1;
                  width: 400px;
                  /* adjust as needed */
                  height: auto;
              }
            </style>
        </head>

        <body>
          
          ${company.watermark === "" ? "" :
            `<div class="watermark-container">
              <img src="${company.watermark}" alt="Watermark" class="watermark">
            </div>`
        }
            <div class="container">
              <div id="invoice-content">
                  <div class="header">
                      <div>
                          <div class="logo-section">
                               ${company.logo_link === "" ? "" :
            `<div class="logo">
                                    <img src="${company.logo_link}" alt="">
                                </div>`}
                              <div>
                                  <div class="company-name">
                                    ${companyFName}
                                    ${companyLName === "" ? "" : `<br>
                                    <span class="enterprise">${companyLName}</span>`}
                                  </div>
                              </div>
                          </div>
                          <div class="company-address">
                              ${company.area} <br>
                             ${company.mobile === "" ? "" : ' Hotline: ' + company.mobile}
                          </div>
                      </div>
                      <div class="contact-info">
                          ${company.website === "" ? "" : `<a href="${company.website}">${company.website}</a>`} <br>
                          ${company.email === "" ? "" : `<a href="mailto:${company.email}">${company.email}</a>`}
                      </div>
                  </div>

                  <div class="dotted-line"></div>
                  <div class="invoice-title">Purchase Invoice</div>

                  <div class="details">
                      <div class="left-details">
                          <div class="detail-row">
                              <div class="detail-label">Supplier</div>
                              <div class="detail-value">: ${InvoiceData.supplier.account_name.toUpperCase()}</div>
                          </div>
                          <div class="detail-row">
                              <div class="detail-label">Address</div>
                              <div class="detail-value">: ${InvoiceData.supplier.area === "" ? "" : InvoiceData.supplier.area}</div>
                          </div>
                          <div class="detail-row">
                              <div class="detail-label">Mobile</div>
                              <div class="detail-value">: ${InvoiceData.supplier.mobile}</div>
                          </div>
                      </div>
                      <div class="right-details">
                          <div class="detail-row">
                              <div class="detail-label">Invoice No.</div>
                              <div class="detail-value">: ${InvoiceData.memo_no}</div>
                          </div>
                          <div class="detail-row">
                              <div class="detail-label">Date & Time</div>
                              <div class="detail-value">: ${moment(InvoiceData.purchase_date).format("DD-MMMM-YYYY")}</div>
                          </div>
                          <div class="detail-row">
                              <div class="detail-label">Prepared By</div>
                              <div class="detail-value">: ${appUser.username}</div>
                          </div>
                      </div>
                  </div>

                  <table id="invoice-items">
                      <thead>
                          <tr>
                              <th style="width: 5%;">No</th>
                              <th style="width: 45%;max-width: 45%;">Item Description</th>
                              <th style="width: 12%;">Warranty</th>
                              <th style="width: 10%;">Qty</th>
                              <th style="width: 13%;">Price</th>
                              <th style="width: 15%;">Total</th>
                          </tr>
                      </thead>
                      <tbody id="product-items">
                          <!-- will be updated by JS -->
                          ${tBody}
                      </tbody>
                  </table>
                  <div class="payment-section">
                      <h4>Payment Information</h4>
                      <div class="details">
                          <div class="left-details">
                              <div class="detail-row">
                                  <div class="detail-label">Payment Method</div>
                                  <div class="detail-value">: ${InvoiceData.challan_no === "" ? "Cash Payment" : "Bank Payment"}</div>
                              </div>
                              <div class="detail-row">
                                  <div class="detail-label">Payment Type</div>
                                  <div class="detail-value">: ${InvoiceData.total_amount - InvoiceData.paid_amount > 0 ? "Partial Payment" : "Full Payment"}  ${!InvoiceData.Note || InvoiceData.Note === "" ? "" : `<b> (${InvoiceData.Note})</b>`}</div>
                              </div>
                              ${InvoiceData.challan_no && InvoiceData.challan_no !== "" ? `<div class="detail-row">
                                  <div class="detail-label">Cheque No.</div>
                                  <div class="detail-value">: ${InvoiceData.challan_no} </div>
                              </div>`  : ""}
                              
                              <div class="detail-row">
                                  <div class="detail-label">Paid Amount</div>
                                  <div class="detail-value" style="text-transform: capitalize;">: ${InvoiceData.paid_amount} <b>(In Words:${company.currency === "Taka" ? numberToWordsBDT(InvoiceData.paid_amount) : numberToWords(InvoiceData.paid_amount) + " " + company.currency} Only)</b></div>
                              </div>
                              <div class="detail-row">
                                  <div class="detail-label">Note</div>
                                  <div class="detail-value">: ${!InvoiceData.Note || InvoiceData.Note === "" ? "" : `<b> (${InvoiceData.Note})</b>`}</div>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div class="dotted-line"></div>
                  <div class="terms">
                      <h4>Remarks:</h4>
                      <ul>
                        This invoice is generated electronically. The company reserves the right to make changes in case of any inconsistencies or mistakes.
                      </ul>
                  </div>
              </div>

              <div class="invoice-footer-fixed" id="invoice-footer">
                  <div class="signature-section">
                      <div class="signature-box">
                          Supplier Signature
                      </div>
                      <div class="signature-box">
                          Authorized Signature
                      </div>
                  </div>
                  <div class="dotted-line"></div>
                  <div class="invoice-footer-info">
                    <div class="member-logos">
                      ${members_of === "" ? "" : `<span>Member of:</span>${members_of}`}
                    </div>
                      <div class="print-info">
                          <div class="print-date">
                              Print Date &amp; Time : <span id="currentDateTime">${moment().format("DD-MMMM-YYYY hh:mm:ssA")}</span>
                          </div>
                      </div>
                  </div>
              </div>
            </div>
        </body>
        </html>
        `

    // Write content to the new window
    newWindow.document.write(content);
    newWindow.document.close();
    // Add a slight delay before printing to ensure content is fully loaded
    setTimeout(() => {
        const invoiceContentDiv = newWindow.document.getElementById('invoice-content');
        const invoiceFooterDiv = newWindow.document.getElementById('invoice-footer');
        if (!invoiceContentDiv || !invoiceFooterDiv) return;

        const rect1 = invoiceContentDiv.getBoundingClientRect();
        const rect2 = invoiceFooterDiv.getBoundingClientRect();

        // Check if elements overlap
        const noOverlap =
            rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom;

        if (!noOverlap) {
            invoiceFooterDiv.classList.remove('invoice-footer-fixed');
            invoiceFooterDiv.classList.add('invoice-footer-scroll');
        }
        newWindow.print();
    }, 500);

}

//printPurchaseChallan prints the current challan
function printPurchaseChallan() {
    // product list table
    const newWindow = window.open("", "_blank");
    let tBody = ""
    let company_info = ""
    let name = company.name.split(":::").filter(p => p.trim() !== "")
    const companyFName = name[0]
    const companyLName = name[1] || ""
    // if (name.length === 2) {
    //   companyLName = name[1]
    // }

    let pLn = InvoiceData.purchased_product.length
    for (let i = 0; i < pLn; i++) {
        const items = InvoiceData.purchased_product[i]
        let serialNumbers = ""

        items.serial_numbers.forEach((sn, j) => {
            if (sn !== 'unmarked') {
                serialNumbers += `S/N:&nbsp;&nbsp;${sn}    `
            }
        })
        tBody += `            
        <tr class="item-row">
            <td>${i + 1}</td>
            <td class="item-name">
              ${items.item.product_name} <br>
              <small> ${serialNumbers} </small>
            </td>
            <td class="item-warranty text-center">${items.warranty}</td>
            <td class="item-quantity text-center">${items.quantity}</td>
          </tr>
        `
    }
    //terms and conditions
    let terms = "";
    const terms_conditions = company.terms_conditions.split("#").filter(term => term.trim() !== "")
    terms_conditions.forEach(term => {
        terms += `<li>${term}.</li>`
    });

    //member of associations
    let members_of = "";
    members_of += `<span>Member of:</span>`
    const associations = company.associations_logo_links.split("#").filter(association => association.trim() !== "")
    associations.forEach(association => {
        members_of += `<img src="${association}" alt="${association}">`
    });

    const content = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice</title>
        <style>
          :root {
              --primary-color: #6ab023;
              --black-color: #000000;
              --dark-color: #282b30;
              --light-gray: #f2f2f2;
              --border-color: #bfbebe;
              --white-color: #ffffff;
          }

          body {
              font-family: Arial, Helvetica, sans-serif;
              font-weight: normal;
              margin: 0;
              padding: 10px;
              color: var(--black-color);
              font-size: 11px;
              line-height: 1.3;
          }

          .container {
              max-width: 800px;
              margin: 0 auto;
          }

          .header {
              display: flex;
              justify-content: space-between;
              margin-bottom: 5px;
          }

          .logo-section {
              display: flex;
              align-items: center;
          }

          .logo {
              width: 48px;
              height: 42px;
              margin-right: 0px;
          }

          .logo img {
              width: 100%;
              height: 100%;
              object-fit: contain;
              background-color: var(--white-color);
          }

          .company-name {
              color: var(--primary-color);
              font-weight: bold;
              font-size: 26px;
              line-height: 0.8;
              padding-left: 2px;
              text-transform: uppercase;
          }

          .enterprise {
              color: var(--black-color);
              font-size: 20px;
              letter-spacing: 1.5px;
          }

          .company-address {
              font-size: 9px;
              max-width: 400px;
              margin-top: 4px;
              line-height: 1.2;
              font-weight: bold;
          }

          .contact-info {
              text-align: right;
              font-size: 10px;
              font-weight: bold;
              font-weight: 500;
          }

          .contact-info a {
              color: var(--primary-color);
              text-decoration: none;
              font-weight: bold;
          }

          .invoice-title {
              background-color: white;
              color: var(--dark-color);
              text-align: center;
              padding: 3px;
              margin: 5px auto;
              width: 150px;
              font-size: 12px;
              font-weight: bold;
              border: 1px solid var(--black-color);
              border-radius: 2px;
              box-shadow: 1px 1px 0px 1px var(--black-color);
          }

          .dotted-line {
              border-top: 1px dotted #999;
              margin: 5px 0;
          }

          .details {
              display: flex;
              justify-content: space-between;
              margin-bottom: 10px;
          }

          .left-details {
              width: 60%;
          }

          .right-details {
              width: 35%;
          }

          .detail-row {
              display: flex;
              margin-bottom: 2px;
          }

          .detail-label {
              width: 80px;
              font-weight: bold;
              font-size: 11px;
          }

          .detail-value {
              flex: 1;
              font-size: 11px;
          }

          table {
              width: 100%;
              border-collapse: collapse;
          }

          th {
              background-color: var(--light-gray);
              color: var(--black-color);
              text-transform: capitalize;
              font-weight: bolder;
              text-align: center;
              padding: 5px 5px;
              font-size: 10px;
              border: 1px solid var(--dark-color);
          }

          td {
              padding: 1px 5px;
              font-size: 10px;
              color: var(--black-color);
              font-weight: 500;
              border: 1px solid var(--dark-color);
              border-top: none;
          }

          .item-row .item-name {
              font-size: 10px;
              font-weight: 600;
              color: var(--black-color);
              max-width: 55% !important;
          }

          .item-row .item-name small {
              font-size: 9px;
              font-weight: 400;
              color: var(--black-color);
              white-space: normal;
              word-break: break-word;
              overflow-wrap: anywhere;
          }

          .empty-row td {
              padding: 4px 8px;
              border-bottom: 1px solid var(--border-color);
          }

          .item-total {
              padding: 3px 5px;
          }

          .total {
              background-color: var(--light-gray);
              font-weight: bold;
              padding: 3px 5px;
          }

          .text-right {
              text-align: right;
          }

          .text-center {
              text-align: center;
          }

          /* Payment info section */
          .payment-section {
              font-size: 9px;
              margin: 10px 0;
          }

          .payment-section h4 {
              margin-bottom: 3px;
              margin-top: 0;
              font-size: 10px;
              text-decoration: underline;
          }

          .payment-section .detail-label,
          .payment-section .detail-value {
              font-size: 9px;
          }

          .terms {
              font-size: 9px;
              margin: 10px 0;
          }

          .terms h4 {
              margin-bottom: 3px;
              margin-top: 0;
              font-size: 10px;
              text-decoration: underline;
          }

          .terms ul {
              margin: 0;
              padding-left: 15px;
              line-height: 1.2;
          }

          .terms ul ul {
              padding-left: 10px;
          }

          .terms li {
              margin-bottom: 1px;
          }


          .invoice-footer-fixed {
              position: absolute;
              bottom: 0;
              left: 50%;
              transform: translate(-50%);
              width: 100%;
              max-width: 800px;
              padding: 10px;
              box-sizing: border-box;
              background: #fff;
              break-inside: avoid;
          }

          .invoice-footer-scroll {
              width: 100%;
              max-width: 800px;
              padding: 40px;
              box-sizing: border-box;
              background: #fff;
              break-inside: avoid;
          }

          .signature-section {
              display: flex;
              justify-content: space-around;
              padding-bottom: 8px;
              margin-bottom: 8px;
          }

          .signature-box {
              width: 180px;
              text-align: center;
              border-top: 1px solid #000;
              padding-top: 3px;
              font-size: 10px;
          }

          .remark {
              font-size: 8px;
              margin-top: 2px;
          }

          .invoice-footer-info {
              display: flex;
              justify-content: space-between;
              align-items: center;
              font-size: 9px;
          }

          .member-logos {
              display: flex;
              align-items: center;
              font-weight:bold;
              gap: 6px;
          }

          .member-logos img {
              height: 24px;
          }

          .print-info {
              text-align: right;
              font-weight: 500;
          }

          .footer-remark{
              font-size: 8px;
              text-align:center;
              color: rgb(0, 94, 255);
          }

          .watermark-container {
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              z-index: 0;
              pointer-events: none;
              /* Allow clicks through the watermark */
          }

          .watermark {
              opacity: 0.1;
              width: 400px;
              /* adjust as needed */
              height: auto;
          }
        </style>
    </head>

    <body>
      
      ${company.watermark === "" ? "" :
            `<div class="watermark-container">
          <img src="${company.watermark}" alt="Watermark" class="watermark">
        </div>`
        }
        <div class="container">
          <div id="invoice-content">
              <div class="header">
                  <div>
                      <div class="logo-section">
                         ${company.logo_link === "" ? "" :
            `<div class="logo">
                                <img src="${company.logo_link}" alt="">
                            </div>`
        }
                          <div>
                              <div class="company-name">
                                ${companyFName}
                                ${companyLName === "" ? "" : `<br>
                                <span class="enterprise">${companyLName}</span>`}
                              </div>
                          </div>
                      </div>
                      <div class="company-address">
                          ${company.area} <br>
                         ${company.mobile === "" ? "" : ' Hotline: ' + company.mobile}
                      </div>
                  </div>
                  <div class="contact-info">
                      ${company.website === "" ? "" : `<a href="${company.website}">${company.website}</a>`} <br>
                      ${company.email === "" ? "" : `<a href="mailto:${company.email}">${company.email}</a>`}
                  </div>
              </div>

              <div class="dotted-line"></div>
              <div class="invoice-title">Challan</div>

              <div class="details">
                  <div class="left-details">
                      <div class="detail-row">
                          <div class="detail-label">Supplier</div>
                          <div class="detail-value">: ${InvoiceData.supplier.account_name.toUpperCase()}</div>
                      </div>
                      <div class="detail-row">
                          <div class="detail-label">Address</div>
                          <div class="detail-value">: ${InvoiceData.supplier.area === "" ? "" : InvoiceData.supplier.area}</div>
                      </div>
                      <div class="detail-row">
                          <div class="detail-label">Mobile</div>
                          <div class="detail-value">: ${InvoiceData.supplier.mobile}</div>
                      </div>
                  </div>
                  <div class="right-details">
                      <div class="detail-row">
                          <div class="detail-label">Invoice No.</div>
                          <div class="detail-value">: ${InvoiceData.memo_no}</div>
                      </div>
                      <div class="detail-row">
                          <div class="detail-label">Date & Time</div>
                          <div class="detail-value">: ${moment(InvoiceData.purchase_date).format("DD-MMMM-YYYY")}</div>
                      </div>
                      <div class="detail-row">
                          <div class="detail-label">Prepared By</div>
                          <div class="detail-value">: ${appUser.username}</div>
                      </div>
                  </div>
              </div>

              <table id="invoice-items">
                  <thead>
                      <tr>
                          <th style="width: 5%;">No</th>
                          <th style="width: 60%;max-width: 60%;">Item Description</th>
                          <th style="width: 20%;">Warranty</th>
                          <th style="width: 15%;">Qty</th>
                      </tr>
                  </thead>
                  <tbody id="product-items">
                      <!-- will be updated by JS -->
                      ${tBody}
                  </tbody>
              </table>
              <div class="terms">
                  <h4>Remarks:</h4>
                  <ul>
                    This challan is generated electronically. The company reserves the right to make changes in case of any inconsistencies or mistakes.
                  </ul>
              </div>
          </div>

          <div class="invoice-footer-fixed" id="invoice-footer">
              <div class="signature-section">
                  <div class="signature-box">
                      Supplier Signature
                  </div>
                  <div class="signature-box">
                      Authorized Signature
                  </div>
              </div>
              <div class="dotted-line"></div>
              <div class="invoice-footer-info">
                <div class="member-logos">
                  ${members_of === "" ? "" : `<span>Member of:</span>${members_of}`}
                </div>
                  <div class="print-info">
                      <div class="print-date">
                          Print Date &amp; Time : <span id="currentDateTime">${moment().format("DD-MMMM-YYYY hh:mm:ssA")}</span>
                      </div>
                  </div>
              </div>
          </div>
        </div>
    </body>
    </html>
    `

    // Write content to the new window
    newWindow.document.write(content);
    newWindow.document.close();
    // Add a slight delay before printing to ensure content is fully loaded
    setTimeout(() => {
        const invoiceContentDiv = newWindow.document.getElementById('invoice-content');
        const invoiceFooterDiv = newWindow.document.getElementById('invoice-footer');
        if (!invoiceContentDiv || !invoiceFooterDiv) return;

        const rect1 = invoiceContentDiv.getBoundingClientRect();
        const rect2 = invoiceFooterDiv.getBoundingClientRect();

        // Check if elements overlap
        const noOverlap =
            rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom;

        if (!noOverlap) {
            invoiceFooterDiv.classList.remove('invoice-footer-fixed');
            invoiceFooterDiv.classList.add('invoice-footer-scroll');
        }
        newWindow.print();
    }, 500);

}

function printPurchaseReturnInvoice() {
    const newWindow = window.open("", "_blank");
    let tBody = ""
    let company_info = ""
    let name = company.name.split(":::").filter(p => p.trim() !== "")
    const companyFName = name[0]
    const companyLName = name[1] || ""
    let pLn = InvoiceData.returned_products.length
    for (let i = 0; i < pLn; i++) {
        const items = InvoiceData.returned_products[i]
        let serialNumbers = ""
        let quantity = 0;
        items.product_metadata.forEach((sn, j) => {
            quantity++
            if (sn !== 'unmarked') {
                serialNumbers += `S/N:&nbsp;&nbsp;${sn.serial_number}    `
            }
        })
        tBody += `            
            <tr class="item-row">
                <td>${i + 1}</td>
                <td class="item-name">
                  ${items.product_name} <br>
                  <small> ${serialNumbers} </small>
                </td>
                <td class="item-quantity text-center">${quantity}</td>
                <td class="item-price text-right">${items.product_metadata[0].purchase_rate - items.product_metadata[0].purchase_discount}</td>
                <td class="item-total text-right">${quantity * (items.product_metadata[0].purchase_rate - items.product_metadata[0].purchase_discount)}</td>
              </tr>
            `
    }
    let amount_receivable = company.currency === "Taka" ? numberToWordsBDT(InvoiceData.total_prices + InvoiceData.supplier_info.due_amount) : numberToWords(InvoiceData.total_prices + InvoiceData.supplier_info.due_amount) + " " + company.currency
    tBody += `
          <tr class="item-row">
            <td rowspan="3" colspan="3" style="border: none; text-align:left; font-weight:bold;">
              Amount Receivable (In Words): 
              <span style="padding:5px; font-weight:normal; text-transform: capitalize;" id="total-amount-in-words">
                ${company.currency === "Taka" ? amount_receivable : amount_receivable + " Only"}.
              </span>
            </td>
            <td class="text-right item-total">Subtotal</td>
            <td id="subtotal" class="text-right item-total">${InvoiceData.total_prices}</td>
          </tr>
          <tr class="item-row">
            <td class="text-right item-total">Supplier's Due</td>
            <td id="subtotal" class="text-right item-total">${InvoiceData.supplier_info.due_amount}</td>
          </tr>
          <!-- <tr class="item-row">
              <td id="tax-percentage" class="text-right item-total">Tax(%)</td>
              <td id="tax-total" class="text-right item-total">10</td>
          </tr> -->

          <tr class="item-row">
              <td class="text-right total">Total</td>
              <td id="total" class="text-right total">${InvoiceData.total_prices + InvoiceData.supplier_info.due_amount}</td>
          </tr>
        `
    //terms and conditions
    let terms = "This invoice is generated electronically. The company reserves the right to make changes in case of any inconsistencies or mistakes."
    const terms_conditions = company.terms_conditions.split(":::").filter(term => term.trim() !== "")
    terms_conditions.forEach(term => {
        terms += `<li>${term}</li>`
    });

    //member of associations
    let members_of = "";
    const associations = company.associations_logo_links.split(":::").filter(association => association.trim() !== "")
    associations.forEach(association => {
        members_of += `<img src="https://psinventory-v2.onrender.com/images/${association}" alt="${association}">`
    });


    const content = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Invoice</title>
            <style>
              :root {
                  --primary-color: #6ab023;
                  --black-color: #000000;
                  --dark-color: #282b30;
                  --light-gray: #f2f2f2;
                  --border-color: #bfbebe;
                  --white-color: #ffffff;
              }

              body {
                  font-family: Arial, Helvetica, sans-serif;
                  font-weight: normal;
                  margin: 0;
                  padding: 10px;
                  color: var(--black-color);
                  font-size: 11px;
                  line-height: 1.3;
              }

              .container {
                  max-width: 800px;
                  margin: 0 auto;
              }

              .header {
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 5px;
              }

              .logo-section {
                  display: flex;
                  align-items: center;
              }

              .logo {
                  width: 48px;
                  height: 42px;
                  margin-right: 0px;
              }

              .logo img {
                  width: 100%;
                  height: 100%;
                  object-fit: contain;
                  background-color: var(--white-color);
              }

              .company-name {
                  color: var(--primary-color);
                  font-weight: bold;
                  font-size: 26px;
                  line-height: 0.8;
                  padding-left: 2px;
                  text-transform: uppercase;
              }

              .enterprise {
                  color: var(--black-color);
                  font-size: 20px;
                  letter-spacing: 1.5px;
              }

              .company-address {
                  font-size: 9px;
                  max-width: 400px;
                  margin-top: 4px;
                  line-height: 1.2;
                  font-weight: bold;
              }

              .contact-info {
                  text-align: right;
                  font-size: 10px;
                  font-weight: bold;
                  font-weight: 500;
              }

              .contact-info a {
                  color: var(--primary-color);
                  text-decoration: none;
                  font-weight: bold;
              }

              .invoice-title {
                  background-color: white;
                  color: var(--dark-color);
                  text-align: center;
                  padding: 3px;
                  margin: 5px auto;
                  width: 150px;
                  font-size: 12px;
                  font-weight: bold;
                  border: 1px solid var(--black-color);
                  border-radius: 2px;
                  box-shadow: 1px 1px 0px 1px var(--black-color);
              }

              .dotted-line {
                  border-top: 1px dotted #999;
                  margin: 5px 0;
              }

              .details {
                  display: flex;
                  justify-content: space-between;
                  margin-bottom: 10px;
              }

              .left-details {
                  width: 60%;
              }

              .right-details {
                  width: 35%;
              }

              .detail-row {
                  display: flex;
                  margin-bottom: 2px;
              }

              .detail-label {
                  width: 80px;
                  font-weight: bold;
                  font-size: 11px;
              }

              .detail-value {
                  flex: 1;
                  font-size: 11px;
              }

              table {
                  width: 100%;
                  border-collapse: collapse;
              }

              th {
                  background-color: var(--light-gray);
                  color: var(--black-color);
                  text-transform: capitalize;
                  font-weight: bolder;
                  text-align: center;
                  padding: 5px 5px;
                  font-size: 10px;
                  border: 1px solid var(--dark-color);
              }

              td {
                  padding: 1px 5px;
                  font-size: 10px;
                  color: var(--black-color);
                  font-weight: 500;
                  border: 1px solid var(--dark-color);
                  border-top: none;
              }

              .item-row .item-name {
                  font-size: 10px;
                  font-weight: 600;
                  color: var(--black-color);
                  max-width: 55% !important;
              }

              .item-row .item-name small {
                  font-size: 9px;
                  font-weight: 400;
                  color: var(--black-color);
                  white-space: normal;
                  word-break: break-word;
                  overflow-wrap: anywhere;
              }

              .empty-row td {
                  padding: 4px 8px;
                  border-bottom: 1px solid var(--border-color);
              }

              .item-total {
                  padding: 3px 5px;
              }

              .total {
                  background-color: var(--light-gray);
                  font-weight: bold;
                  padding: 3px 5px;
              }

              .text-right {
                  text-align: right;
              }

              .text-center {
                  text-align: center;
              }

              /* Payment info section */
              .payment-section {
                  font-size: 9px;
                  margin: 10px 0;
              }

              .payment-section h4 {
                  margin-bottom: 3px;
                  margin-top: 0;
                  font-size: 10px;
                  text-decoration: underline;
              }

              .payment-section .detail-label,
              .payment-section .detail-value {
                  font-size: 9px;
              }

              .terms {
                  font-size: 9px;
                  margin: 10px 0;
              }

              .terms h4 {
                  margin-bottom: 3px;
                  margin-top: 0;
                  font-size: 10px;
                  text-decoration: underline;
              }

              .terms ul {
                  margin: 0;
                  padding-left: 15px;
                  line-height: 1.2;
              }

              .terms ul ul {
                  padding-left: 10px;
              }

              .terms li {
                  margin-bottom: 1px;
              }


              .invoice-footer-fixed {
                  position: absolute;
                  bottom: 0;
                  left: 50%;
                  transform: translate(-50%);
                  width: 100%;
                  max-width: 800px;
                  padding: 10px;
                  box-sizing: border-box;
                  background: #fff;
                  break-inside: avoid;
              }

              .invoice-footer-scroll {
                  width: 100%;
                  max-width: 800px;
                  padding: 40px;
                  box-sizing: border-box;
                  background: #fff;
                  break-inside: avoid;
              }

              .signature-section {
                  display: flex;
                  justify-content: space-around;
                  padding-bottom: 8px;
                  margin-bottom: 8px;
              }

              .signature-box {
                  width: 180px;
                  text-align: center;
                  border-top: 1px solid #000;
                  padding-top: 3px;
                  font-size: 10px;
              }

              .remark {
                  font-size: 8px;
                  margin-top: 2px;
              }

              .invoice-footer-info {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  font-size: 9px;
              }

              .member-logos {
                  display: flex;
                  align-items: center;
                  font-weight:bold;
                  gap: 6px;
              }

              .member-logos img {
                  height: 40px;
              }

              .print-info {
                  text-align: right;
                  font-weight: 500;
              }

              .footer-remark{
                  font-size: 8px;
                  text-align:center;
                  color: rgb(0, 94, 255);
              }

              .watermark-container {
                  position: fixed;
                  top: 50%;
                  left: 50%;
                  transform: translate(-50%, -50%);
                  z-index: 0;
                  pointer-events: none;
                  /* Allow clicks through the watermark */
              }

              .watermark {
                  opacity: 0.1;
                  width: 400px;
                  /* adjust as needed */
                  height: auto;
              }
            </style>
        </head>

        <body>
          
          ${company.watermark === "" ? "" :
            `<div class="watermark-container">
              <img src="${company.watermark}" alt="Watermark" class="watermark">
            </div>`
        }
            <div class="container">
              <div id="invoice-content">
                  <div class="header">
                      <div>
                          <div class="logo-section">
                               ${company.logo_link === "" ? "" :
            `<div class="logo">
                                    <img src="${company.logo_link}" alt="">
                                </div>`}
                              <div>
                                  <div class="company-name">
                                    ${companyFName}
                                    ${companyLName === "" ? "" : `<br>
                                    <span class="enterprise">${companyLName}</span>`}
                                  </div>
                              </div>
                          </div>
                          <div class="company-address">
                              ${company.area} <br>
                             ${company.mobile === "" ? "" : ' Hotline: ' + company.mobile}
                          </div>
                      </div>
                      <div class="contact-info">
                          ${company.website === "" ? "" : `<a href="${company.website}">${company.website}</a>`} <br>
                          ${company.email === "" ? "" : `<a href="mailto:${company.email}">${company.email}</a>`}
                      </div>
                  </div>

                  <div class="dotted-line"></div>
                  <div class="invoice-title">Purchase Return Invoice</div>

                  <div class="details">
                      <div class="left-details">
                          <div class="detail-row">
                              <div class="detail-label">Supplier</div>
                              <div class="detail-value">: ${InvoiceData.supplier_info.account_name.toUpperCase()}</div>
                          </div>
                          <div class="detail-row">
                              <div class="detail-label">Address</div>
                              <div class="detail-value">: ${InvoiceData.supplier_info.area === "" ? "" : InvoiceData.supplier_info.area}</div>
                          </div>
                          <div class="detail-row">
                              <div class="detail-label">Mobile</div>
                              <div class="detail-value">: ${InvoiceData.supplier_info.mobile}</div>
                          </div>
                      </div>
                      <div class="right-details">
                          <div class="detail-row">
                              <div class="detail-label">Invoice No.</div>
                              <div class="detail-value">: ${InvoiceData.memo_no}</div>
                          </div>
                          <div class="detail-row">
                              <div class="detail-label">Date & Time</div>
                              <div class="detail-value">: ${moment(InvoiceData.returned_date).format("DD-MMMM-YYYY")}</div>
                          </div>
                          <div class="detail-row">
                              <div class="detail-label">Prepared By</div>
                              <div class="detail-value">: ${appUser.username}</div>
                          </div>
                      </div>
                  </div>

                  <table id="invoice-items">
                      <thead>
                          <tr>
                              <th style="width: 5%;">No</th>
                              <th style="width: 55%;max-width: 55%;">Item Description</th>
                              <th style="width: 12%;">Qty</th>
                              <th style="width: 13%;">Price</th>
                              <th style="width: 15%;">Total</th>
                          </tr>
                      </thead>
                      <tbody id="product-items">
                          <!-- will be updated by JS -->
                          ${tBody}
                      </tbody>
                  </table>

                  <div class="dotted-line"></div>
                  <div class="terms">
                      <h4>Remarks:</h4>
                      <ul>
                        This invoice is generated electronically. The company reserves the right to make changes in case of any inconsistencies or mistakes.
                      </ul>
                  </div>
              </div>

              <div class="invoice-footer-fixed" id="invoice-footer">
                  <div class="signature-section">
                      <div class="signature-box">
                          Supplier Signature
                      </div>
                      <div class="signature-box">
                          Authorized Signature
                      </div>
                  </div>
                  <div class="dotted-line"></div>
                  <div class="invoice-footer-info">
                    <div class="member-logos">
                      ${members_of === "" ? "" : `<span>Member of:</span>${members_of}`}
                    </div>
                      <div class="print-info">
                          <div class="print-date">
                              Print Date &amp; Time : <span id="currentDateTime">${moment().format("DD-MMMM-YYYY hh:mm:ssA")}</span>
                          </div>
                      </div>
                  </div>
              </div>
            </div>
        </body>
        </html>
        `

    // Write content to the new window
    newWindow.document.write(content);
    newWindow.document.close();
    // Add a slight delay before printing to ensure content is fully loaded
    setTimeout(() => {
        const invoiceContentDiv = newWindow.document.getElementById('invoice-content');
        const invoiceFooterDiv = newWindow.document.getElementById('invoice-footer');
        if (!invoiceContentDiv || !invoiceFooterDiv) return;

        const rect1 = invoiceContentDiv.getBoundingClientRect();
        const rect2 = invoiceFooterDiv.getBoundingClientRect();

        // Check if elements overlap
        const noOverlap =
            rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom;

        if (!noOverlap) {
            invoiceFooterDiv.classList.remove('invoice-footer-fixed');
            invoiceFooterDiv.classList.add('invoice-footer-scroll');
        }
        newWindow.print();
    }, 500);

}

function printSaleInvoice() {
    const newWindow = window.open("", "_blank");
    // //product list table
    let tBody = ""
    let company_info = ""
    let name = company.name.split(":::").filter(p => p.trim() !== "")
    const companyFName = name[0]
    const companyLName = name[1] || ""
    let pLn = InvoiceData.sold_products.length
    for (let i = 0; i < pLn; i++) {
        const items = InvoiceData.sold_products[i]
        let serialNumbers = ""

        items.serial_numbers.forEach((sn, j) => {
            if (sn !== 'unmarked') {
                serialNumbers += `S/N:&nbsp;&nbsp;${sn}    `
            }
        })
        tBody += `
            <tr class="item-row">
              <td>${i + 1}</td>
              <td class="item-name">
                ${items.item.product_name} <br>
                <small> ${serialNumbers} </small>
              </td>
              <td class="item-warranty text-center">${items.warranty}</td>
              <td class="item-quantity text-center">${items.quantity}</td>
              <td class="item-price text-right">${items.rate}</td>
              <td class="item-total text-right">${items.quantity * items.rate}</td>
            </tr>
          `
    }

    tBody += `
          <tr class="item-row">
            <td rowspan="4" colspan="4" style="border: none; text-align:left; font-weight:bold">
              Amount Chargeable (In Words): 
              <span style="padding:5px; font-weight:normal; text-transform: capitalize;" id="total-amount-in-words">
                ${company.currency === "Taka" ? numberToWordsBDT(InvoiceData.total_amount) : numberToWords(InvoiceData.total_amount) + " " + company.currency} Only.
              </span>
            </td>
            <td class="text-right item-total">Subtotal</td>
            <td id="subtotal" class="text-right item-total">${InvoiceData.bill_amount}</td>
          </tr>
          <tr class="item-row">
            <td class="text-right item-total">Shipment Charge</td>
            <td id="subtotal" class="text-right item-total">${InvoiceData.shipment_cost}</td>
          </tr>
          <!-- <tr class="item-row">
              <td id="tax-percentage" class="text-right item-total">Tax(%)</td>
              <td id="tax-total" class="text-right item-total">10</td>
          </tr> -->
          <tr class="item-row">
              <td id="discount-percentage" class="text-right item-total">Discount(${InvoiceData.discount}%)</td>
              <td id="discount-total" class="text-right item-total">${InvoiceData.total_amount - InvoiceData.bill_amount - InvoiceData.shipment_cost}</td>
          </tr>
          <tr class="item-row">
              <td class="text-right total">Total</td>
              <td id="total" class="text-right total">${InvoiceData.total_amount}</td>
          </tr>
        `
    //terms and conditions
    let terms = "";
    const terms_conditions = company.terms_conditions.split(":::").filter(term => term.trim() !== "")
    terms_conditions.forEach(term => {
        terms += `<li>${term}</li>`
    });

    //member of associations
    let members_of = "";
    const associations = company.associations_logo_links.split(":::").filter(association => association.trim() !== "")
    associations.forEach(association => {
        members_of += `<img src="https://psinventory-v2.onrender.com/images/${association}" alt="${association}">`
    });

    const content = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Invoice</title>
            <style>
                :root {
                    --primary-color: #6ab023;
                    --black-color: #000000;
                    --dark-color: #282b30;
                    --light-gray: #f2f2f2;
                    --border-color: #bfbebe;
                    --white-color: #ffffff;
                }

                body {
                    font-family: Arial, Helvetica, sans-serif;
                    font-weight: normal;
                    margin: 0;
                    padding: 10px;
                    color: var(--black-color);
                    font-size: 11px;
                    line-height: 1.3;
                }

                .container {
                    max-width: 800px;
                    margin: 0 auto;
                }

                .header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 5px;
                }

                .logo-section {
                    display: flex;
                    align-items: center;
                }

                .logo {
                    width: 48px;
                    height: 42px;
                    margin-right: 0px;
                }

                .logo img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    background-color: var(--white-color);
                }

                .company-name {
                    color: var(--primary-color);
                    font-weight: bold;
                    font-size: 26px;
                    line-height: 0.8;
                    padding-left: 2px;
                    text-transform: uppercase;
                }

                .enterprise {
                    color: var(--black-color);
                    font-size: 20px;
                    letter-spacing: 1.5px;
                }

                .company-address {
                    font-size: 9px;
                    max-width: 400px;
                    margin-top: 4px;
                    line-height: 1.2;
                    font-weight: bold;
                }

                .contact-info {
                    text-align: right;
                    font-size: 10px;
                    font-weight: bold;
                    font-weight: 500;
                }

                .contact-info a {
                    color: var(--primary-color);
                    text-decoration: none;
                    font-weight: bold;
                }

                .invoice-title {
                    background-color: white;
                    color: var(--dark-color);
                    text-align: center;
                    padding: 3px;
                    margin: 5px auto;
                    width: 90px;
                    font-size: 12px;
                    font-weight: bold;
                    border: 1px solid var(--black-color);
                    border-radius: 2px;
                    box-shadow: 1px 1px 0px 1px var(--black-color);
                }

                .dotted-line {
                    border-top: 1px dotted #999;
                    margin: 5px 0;
                }

                .details {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10px;
                }

                .left-details {
                    width: 60%;
                }

                .right-details {
                    width: 35%;
                }

                .detail-row {
                    display: flex;
                    margin-bottom: 2px;
                }

                .detail-label {
                    width: 80px;
                    font-weight: bold;
                    font-size: 11px;
                }

                .detail-value {
                    flex: 1;
                    font-size: 11px;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                }

                th {
                    background-color: var(--light-gray);
                    color: var(--black-color);
                    text-transform: capitalize;
                    font-weight: bolder;
                    text-align: center;
                    padding: 5px 5px;
                    font-size: 10px;
                    border: 1px solid var(--dark-color);
                }

                td {
                    padding: 1px 5px;
                    font-size: 10px;
                    color: var(--black-color);
                    font-weight: 500;
                    border: 1px solid var(--dark-color);
                    border-top: none;
                }

                .item-row .item-name {
                    font-size: 10px;
                    font-weight: 600;
                    color: var(--black-color);
                    max-width: 45% !important;
                }

                .item-row .item-name small {
                  font-size: 9px;
                  font-weight: 400;
                  color: var(--black-color);
                  white-space: normal;
                  word-break: break-word;
                  overflow-wrap: anywhere;
              }

                .empty-row td {
                    padding: 4px 8px;
                    border-bottom: 1px solid var(--border-color);
                }

                .item-total {
                    padding: 3px 5px;
                }

                .total {
                    background-color: var(--light-gray);
                    font-weight: bold;
                    padding: 3px 5px;
                }

                .text-right {
                    text-align: right;
                }

                .text-center {
                    text-align: center;
                }

                /* Payment info section */
                .payment-section {
                    font-size: 9px;
                    margin: 10px 0;
                }

                .payment-section h4 {
                    margin-bottom: 3px;
                    margin-top: 0;
                    font-size: 10px;
                    text-decoration: underline;
                }

                .payment-section .detail-label,
                .payment-section .detail-value {
                    font-size: 9px;
                }

                .terms {
                    font-size: 9px;
                    margin: 10px 0;
                }

                .terms h4 {
                    margin-bottom: 3px;
                    margin-top: 0;
                    font-size: 10px;
                    text-decoration: underline;
                }

                .terms ul {
                    margin: 0;
                    padding-left: 15px;
                    line-height: 1.2;
                }

                .terms ul ul {
                    padding-left: 10px;
                }

                .terms li {
                    margin-bottom: 1px;
                }


                .invoice-footer-fixed {
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translate(-50%);
                    width: 100%;
                    max-width: 800px;
                    padding: 10px;
                    box-sizing: border-box;
                    background: #fff;
                    break-inside: avoid;
                }

                .invoice-footer-scroll {
                    width: 100%;
                    max-width: 800px;
                    padding: 40px;
                    box-sizing: border-box;
                    background: #fff;
                    break-inside: avoid;
                }

                .signature-section {
                    display: flex;
                    justify-content: space-around;
                    padding-bottom: 8px;
                    margin-bottom: 8px;
                }

                .signature-box {
                    width: 180px;
                    text-align: center;
                    border-top: 1px solid #000;
                    padding-top: 3px;
                    font-size: 10px;
                }

                .remark {
                    font-size: 8px;
                    margin-top: 2px;
                }

                .invoice-footer-info {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 9px;
                }

                .member-logos {
                    display: flex;
                    align-items: center;
                    font-weight:bold;
                    gap: 6px;
                }

                .member-logos img {
                    height: 40px;
                }

                .print-info {
                    text-align: right;
                    font-weight: 500;
                }

                .footer-remark{
                    font-size: 8px;
                    text-align:center;
                    color: rgb(0, 94, 255);
                }

                .watermark-container {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 0;
                    pointer-events: none;
                    /* Allow clicks through the watermark */
                }

                .watermark {
                    opacity: 0.1;
                    width: 400px;
                    /* adjust as needed */
                    height: auto;
                }
            </style>
        </head>

        <body>
          
          ${company.watermark === "" ? "" :
            `<div class="watermark-container">
              <img src="${company.watermark}" alt="Watermark" class="watermark">
            </div>`
        }
            <div class="container">
              <div id="invoice-content">
                  <div class="header">
                      <div>
                          <div class="logo-section">
                            ${company.logo_link === "" ? "" :
            `<div class="logo">
                                  <img src="${company.logo_link}" alt="">
                              </div>`}
                              <div>
                                  <div class="company-name">
                                    ${companyFName}
                                    ${companyLName === "" ? "" : `<br>
                                    <span class="enterprise">${companyLName}</span>`}
                                  </div>
                              </div>
                          </div>
                          <div class="company-address">
                              ${company.area} <br>
                             ${company.mobile === "" ? "" : ' Hotline: ' + company.mobile}
                          </div>
                      </div>
                      <div class="contact-info">
                          ${company.website === "" ? "" : `<a href="${company.website}">${company.website}</a>`} <br>
                          ${company.email === "" ? "" : `<a href="mailto:${company.email}">${company.email}</a>`}
                      </div>
                  </div>

                  <div class="dotted-line"></div>
                  <div class="invoice-title">Invoice/Bill</div>

                  <div class="details">
                      <div class="left-details">
                          <div class="detail-row">
                              <div class="detail-label">Invoice To</div>
                              <div class="detail-value">: ${InvoiceData.customer.account_name.toUpperCase()}</div>
                          </div>
                          <div class="detail-row">
                              <div class="detail-label">Address</div>
                              <div class="detail-value">: ${InvoiceData.customer.area === "" ? "-" : InvoiceData.customer.area}</div>
                          </div>
                          <div class="detail-row">
                              <div class="detail-label">Mobile</div>
                              <div class="detail-value">: ${InvoiceData.customer.mobile}</div>
                          </div>
                      </div>
                      <div class="right-details">
                          <div class="detail-row">
                              <div class="detail-label">Invoice No.</div>
                              <div class="detail-value">: ${InvoiceData.memo_no}</div>
                          </div>
                          <div class="detail-row">
                              <div class="detail-label">Date & Time</div>
                              <div class="detail-value">: ${moment(InvoiceData.sale_date).format("DD-MMMM-YYYY")}</div>
                          </div>
                          <div class="detail-row">
                              <div class="detail-label">Prepared By</div>
                              <div class="detail-value">: ${appUser.username}</div>
                          </div>
                      </div>
                  </div>

                  <table id="invoice-items">
                      <thead>
                          <tr>
                              <th style="width: 5%;">No</th>
                              <th style="width: 45%;max-width: 45%;">Item Description</th>
                              <th style="width: 12%;">Warranty</th>
                              <th style="width: 10%;">Qty</th>
                              <th style="width: 13%;">Price</th>
                              <th style="width: 15%;">Total</th>
                          </tr>
                      </thead>
                      <tbody id="product-items">
                          <!-- will be updated by JS -->
                          ${tBody}
                      </tbody>
                  </table>
                  <div class="payment-section">
                      <h4>Payment Information</h4>
                      <div class="details">
                          <div class="left-details">
                              <div class="detail-row">
                                  <div class="detail-label">Payment Method</div>
                                  <div class="detail-value">: ${InvoiceData.challan_no === "" ? "Cash Received" : "Bank Payment"}</div>
                              </div>
                              <div class="detail-row">
                                  <div class="detail-label">Payment Type</div>
                                  <div class="detail-value">: ${InvoiceData.total_amount - InvoiceData.paid_amount > 0 ? "Partial Payment" : "Full Payment"}  ${!InvoiceData.Note || InvoiceData.Note === "" ? "" : `<b> (${InvoiceData.Note})</b>`}</div>
                              </div>
                              ${InvoiceData.challan_no && InvoiceData.challan_no !== "" ? `<div class="detail-row">
                                  <div class="detail-label">Cheque No.</div>
                                  <div class="detail-value">: ${InvoiceData.challan_no} </div>
                              </div>`  : ""}
                              
                              <div class="detail-row">
                                  <div class="detail-label">Paid Amount</div>
                                  <div class="detail-value">: ${InvoiceData.paid_amount} <b>(In Words: ${company.currency === "Taka" ? numberToWordsBDT(InvoiceData.paid_amount) : numberToWords(InvoiceData.paid_amount) + " " + company.currency} Only)</b></div>
                              </div>
                              <div class="detail-row">
                                  <div class="detail-label">Note</div>
                                  <div class="detail-value">: ${!InvoiceData.Note || InvoiceData.Note === "" ? "" : `<b> (${InvoiceData.Note})</b>`}</div>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div class="dotted-line"></div>
                  <div class="terms">
                      <h4>Terms & Condition</h4>
                      <ul>
                        ${terms}
                      </ul>
                  </div>
              </div>

              <div class="invoice-footer-fixed" id="invoice-footer">
                  <div class="signature-section">
                      <div class="signature-box">
                          Customer Signature
                          <div class="remark">(Received the above goods in good condition)</div>
                      </div>
                      <div class="signature-box">
                          Authorized Signature
                      </div>
                  </div>
                  <div class="dotted-line"></div>
                  <div class="invoice-footer-info">
                    <div class="member-logos">
                      ${members_of === "" ? "" : `<span>Member of:</span>${members_of}`}
                    </div>
                      <div class="print-info">
                          <div class="print-date">
                              Print Date &amp; Time : <span id="currentDateTime">${moment().format("DD-MMMM-YYYY hh:mm:ssA")}</span>
                          </div>
                      </div>
                  </div>
              </div>
            </div>
        </body>
        </html>
        `

    // Write content to the new window
    newWindow.document.write(content);
    newWindow.document.close();
    // Add a slight delay before printing to ensure content is fully loaded
    setTimeout(() => {
        const invoiceContentDiv = newWindow.document.getElementById('invoice-content');
        const invoiceFooterDiv = newWindow.document.getElementById('invoice-footer');
        if (!invoiceContentDiv || !invoiceFooterDiv) return;

        const rect1 = invoiceContentDiv.getBoundingClientRect();
        const rect2 = invoiceFooterDiv.getBoundingClientRect();

        // Check if elements overlap
        const noOverlap =
            rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom;

        if (!noOverlap) {
            invoiceFooterDiv.classList.remove('invoice-footer-fixed');
            invoiceFooterDiv.classList.add('invoice-footer-scroll');
        }
        newWindow.print();
    }, 500);

}

function printSaleReturnInvoice() {
    const newWindow = window.open("", "_blank");
    // //product list table
    let tBody = ""
    let company_info = ""
    let name = company.name.split(":::").filter(p => p.trim() !== "")
    const companyFName = name[0]
    const companyLName = name[1] || ""
    let pLn = InvoiceData.product_Items.length
    let totalReturnAmount = 0
    for (let i = 0; i < pLn; i++) {
        const items = InvoiceData.product_Items[i]
        let serialNumbers = ""
        let quantity = 0;
        items.product_metadata.forEach((s, j) => {
            quantity++;
            if (s.serial_number !== 'unmarked') {
                serialNumbers += `S/N:&nbsp;&nbsp;${s.serial_number}    `
            }
            //Increment totalReturnAmount
            totalReturnAmount += (s.sold_rate - s.sold_discount)
        })
        tBody += `
            <tr class="item-row">
              <td>${i + 1}</td>
              <td class="item-name">
                ${items.product_name} <br>
                <small> ${serialNumbers} </small>
              </td>
              <td class="item-quantity text-center">${quantity}</td>
              <td class="item-price text-right">${items.product_metadata[0].sold_rate - items.product_metadata[0].sold_discount}</td>
              <td class="item-total text-right">${quantity * (items.product_metadata[0].sold_rate - items.product_metadata[0].sold_discount)}</td>
            </tr>
          `
    }
    let amount_payable = company.currency === "Taka" ? numberToWordsBDT(totalReturnAmount + InvoiceData.customer_info.due_amount) : numberToWords(totalReturnAmount + InvoiceData.customer_info.due_amount) + " " + company.currency

    tBody += `
          <tr class="item-row">
            <td rowspan="3" colspan="3" style="border: none; text-align:left; font-weight:bold">
              Amount Payable (In Words): 
              <span style="padding:5px; font-weight:normal; text-transform: capitalize;" id="total-amount-in-words">
                ${amount_payable.trim() === "Taka" ? "" : amount_payable + " Only"}.
              </span>
            </td>
            <td class="text-right item-total">Subtotal</td>
            <td id="subtotal" class="text-right item-total">${totalReturnAmount}</td>
          </tr>
          <tr class="item-row">
            <td class="text-right item-total">Customer's Due</td>
            <td id="subtotal" class="text-right item-total">${InvoiceData.customer_info.due_amount}</td>
          </tr>
          <!-- <tr class="item-row">
              <td id="tax-percentage" class="text-right item-total">Tax(%)</td>
              <td id="tax-total" class="text-right item-total">10</td>
          </tr> -->

          <tr class="item-row">
              <td class="text-right total">Total</td>
              <td id="total" class="text-right total">${totalReturnAmount - InvoiceData.customer_info.due_amount}</td>
          </tr>
        `
    //terms and conditions
    let terms = "This invoice is generated electronically. The company reserves the right to make changes in case of any inconsistencies or mistakes";


    //member of associations
    let members_of = "";
    const associations = company.associations_logo_links.split(":::").filter(association => association.trim() !== "")
    associations.forEach(association => {
        members_of += `<img src="https://psinventory-v2.onrender.com/images/${association}" alt="${association}">`
    });
    const content = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Invoice</title>
            <style>
                :root {
                    --primary-color: #6ab023;
                    --black-color: #000000;
                    --dark-color: #282b30;
                    --light-gray: #f2f2f2;
                    --border-color: #bfbebe;
                    --white-color: #ffffff;
                }

                body {
                    font-family: Arial, Helvetica, sans-serif;
                    font-weight: normal;
                    margin: 0;
                    padding: 10px;
                    color: var(--black-color);
                    font-size: 11px;
                    line-height: 1.3;
                }

                .container {
                    max-width: 800px;
                    margin: 0 auto;
                }

                .header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 5px;
                }

                .logo-section {
                    display: flex;
                    align-items: center;
                }

                .logo {
                    width: 48px;
                    height: 42px;
                    margin-right: 0px;
                }

                .logo img {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    background-color: var(--white-color);
                }

                .company-name {
                    color: var(--primary-color);
                    font-weight: bold;
                    font-size: 26px;
                    line-height: 0.8;
                    padding-left: 2px;
                    text-transform: uppercase;
                }

                .enterprise {
                    color: var(--black-color);
                    font-size: 20px;
                    letter-spacing: 1.5px;
                }

                .company-address {
                    font-size: 9px;
                    max-width: 400px;
                    margin-top: 4px;
                    line-height: 1.2;
                    font-weight: bold;
                }

                .contact-info {
                    text-align: right;
                    font-size: 10px;
                    font-weight: bold;
                    font-weight: 500;
                }

                .contact-info a {
                    color: var(--primary-color);
                    text-decoration: none;
                    font-weight: bold;
                }

                .invoice-title {
                    background-color: white;
                    color: var(--dark-color);
                    text-align: center;
                    padding: 3px;
                    margin: 5px auto;
                    width: 150px;
                    font-size: 12px;
                    font-weight: bold;
                    border: 1px solid var(--black-color);
                    border-radius: 2px;
                    box-shadow: 1px 1px 0px 1px var(--black-color);
                }

                .dotted-line {
                    border-top: 1px dotted #999;
                    margin: 5px 0;
                }

                .details {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 10px;
                }

                .left-details {
                    width: 60%;
                }

                .right-details {
                    width: 35%;
                }

                .detail-row {
                    display: flex;
                    margin-bottom: 2px;
                }

                .detail-label {
                    width: 80px;
                    font-weight: bold;
                    font-size: 11px;
                }

                .detail-value {
                    flex: 1;
                    font-size: 11px;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                }

                th {
                    background-color: var(--light-gray);
                    color: var(--black-color);
                    text-transform: capitalize;
                    font-weight: bolder;
                    text-align: center;
                    padding: 5px 5px;
                    font-size: 10px;
                    border: 1px solid var(--dark-color);
                }

                td {
                    padding: 1px 5px;
                    font-size: 10px;
                    color: var(--black-color);
                    font-weight: 500;
                    border: 1px solid var(--dark-color);
                    border-top: none;
                }

                .item-row .item-name {
                    font-size: 10px;
                    font-weight: 600;
                    color: var(--black-color);
                    max-width: 55% !important;
                }

                .item-row .item-name small {
                  font-size: 9px;
                  font-weight: 400;
                  color: var(--black-color);
                  white-space: normal;
                  word-break: break-word;
                  overflow-wrap: anywhere;
              }

                .empty-row td {
                    padding: 4px 8px;
                    border-bottom: 1px solid var(--border-color);
                }

                .item-total {
                    padding: 3px 5px;
                }

                .total {
                    background-color: var(--light-gray);
                    font-weight: bold;
                    padding: 3px 5px;
                }

                .text-right {
                    text-align: right;
                }

                .text-center {
                    text-align: center;
                }

                /* Payment info section */
                .payment-section {
                    font-size: 9px;
                    margin: 10px 0;
                }

                .payment-section h4 {
                    margin-bottom: 3px;
                    margin-top: 0;
                    font-size: 10px;
                    text-decoration: underline;
                }

                .payment-section .detail-label,
                .payment-section .detail-value {
                    font-size: 9px;
                }

                .terms {
                    font-size: 9px;
                    margin: 10px 0;
                }

                .terms h4 {
                    margin-bottom: 3px;
                    margin-top: 0;
                    font-size: 10px;
                    text-decoration: underline;
                }

                .terms ul {
                    margin: 0;
                    padding-left: 15px;
                    line-height: 1.2;
                }

                .terms ul ul {
                    padding-left: 10px;
                }

                .terms li {
                    margin-bottom: 1px;
                }


                .invoice-footer-fixed {
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translate(-50%);
                    width: 100%;
                    max-width: 800px;
                    padding: 10px;
                    box-sizing: border-box;
                    background: #fff;
                    break-inside: avoid;
                }

                .invoice-footer-scroll {
                    width: 100%;
                    max-width: 800px;
                    padding: 40px;
                    box-sizing: border-box;
                    background: #fff;
                    break-inside: avoid;
                }

                .signature-section {
                    display: flex;
                    justify-content: space-around;
                    padding-bottom: 8px;
                    margin-bottom: 8px;
                }

                .signature-box {
                    width: 180px;
                    text-align: center;
                    border-top: 1px solid #000;
                    padding-top: 3px;
                    font-size: 10px;
                }

                .remark {
                    font-size: 8px;
                    margin-top: 2px;
                }

                .invoice-footer-info {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 9px;
                }

                .member-logos {
                    display: flex;
                    align-items: center;
                    font-weight:bold;
                    gap: 6px;
                }

                .member-logos img {
                    height: 40px;
                }

                .print-info {
                    text-align: right;
                    font-weight: 500;
                }

                .footer-remark{
                    font-size: 8px;
                    text-align:center;
                    color: rgb(0, 94, 255);
                }

                .watermark-container {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    z-index: 0;
                    pointer-events: none;
                    /* Allow clicks through the watermark */
                }

                .watermark {
                    opacity: 0.1;
                    width: 400px;
                    /* adjust as needed */
                    height: auto;
                }
            </style>
        </head>

        <body>
          
          ${company.watermark === "" ? "" :
            `<div class="watermark-container">
              <img src="${company.watermark}" alt="Watermark" class="watermark">
            </div>`
        }
            <div class="container">
              <div id="invoice-content">
                  <div class="header">
                      <div>
                          <div class="logo-section">
                               ${company.logo_link === "" ? "" :
            `<div class="logo">
                                  <img src="${company.logo_link}" alt="">
                                </div>`}
                              <div>
                                  <div class="company-name">
                                    ${companyFName}
                                    ${companyLName === "" ? "" : `<br>
                                    <span class="enterprise">${companyLName}</span>`}
                                  </div>
                              </div>
                          </div>
                          <div class="company-address">
                              ${company.area} <br>
                             ${company.mobile === "" ? "" : ' Hotline: ' + company.mobile}
                          </div>
                      </div>
                      <div class="contact-info">
                          ${company.website === "" ? "" : `<a href="${company.website}">${company.website}</a>`} <br>
                          ${company.email === "" ? "" : `<a href="mailto:${company.email}">${company.email}</a>`}
                      </div>
                  </div>

                  <div class="dotted-line"></div>
                  <div class="invoice-title">Sale Return Invoice</div>

                  <div class="details">
                      <div class="left-details">
                          <div class="detail-row">
                              <div class="detail-label">Invoice To</div>
                              <div class="detail-value">: ${InvoiceData.customer_info.account_name.toUpperCase()}</div>
                          </div>
                          <div class="detail-row">
                              <div class="detail-label">Address</div>
                              <div class="detail-value">: ${InvoiceData.customer_info.area === "" ? "-" : InvoiceData.customer_info.area}</div>
                          </div>
                          <div class="detail-row">
                              <div class="detail-label">Mobile</div>
                              <div class="detail-value">: ${InvoiceData.customer_info.mobile}</div>
                          </div>
                      </div>
                      <div class="right-details">
                          <div class="detail-row">
                              <div class="detail-label">Invoice No.</div>
                              <div class="detail-value">: ${InvoiceData.memo_no}</div>
                          </div>
                          <div class="detail-row">
                              <div class="detail-label">Date & Time</div>
                              <div class="detail-value">: ${moment(InvoiceData.sale_return_date).format("DD-MMMM-YYYY")}</div>
                          </div>
                          <div class="detail-row">
                              <div class="detail-label">Prepared By</div>
                              <div class="detail-value">: ${appUser.username}</div>
                          </div>
                      </div>
                  </div>

                  <table id="invoice-items">
                      <thead>
                          <tr>
                              <th style="width: 5%;">No</th>
                              <th style="width: 55%;max-width: 45%;">Item Description</th>
                              <th style="width: 10%;">Qty</th>
                              <th style="width: 15%;">Price</th>
                              <th style="width: 15%;">Total</th>
                          </tr>
                      </thead>
                      <tbody id="product-items">
                          <!-- will be updated by JS -->
                          ${tBody}
                      </tbody>
                  </table>
                  <div class="dotted-line"></div>
                  <div class="terms">
                      <h4>Terms & Condition</h4>
                      <ul>
                        ${terms}
                      </ul>
                  </div>
              </div>

              <div class="invoice-footer-fixed" id="invoice-footer">
                  <div class="signature-section">
                      <div class="signature-box">
                          Customer Signature
                          <div class="remark">(Received the above goods in good condition)</div>
                      </div>
                      <div class="signature-box">
                          Authorized Signature
                      </div>
                  </div>
                  <div class="dotted-line"></div>
                  <div class="invoice-footer-info">
                    <div class="member-logos">
                      ${members_of === "" ? "" : `<span>Member of:</span>${members_of}`}
                    </div>
                      <div class="print-info">
                          <div class="print-date">
                              Print Date &amp; Time : <span id="currentDateTime">${moment().format("DD-MMMM-YYYY hh:mm:ssA")}</span>
                          </div>
                      </div>
                  </div>
              </div>
            </div>
        </body>
        </html>
        `

    // Write content to the new window
    newWindow.document.write(content);
    newWindow.document.close();
    // Add a slight delay before printing to ensure content is fully loaded
    setTimeout(() => {
        const invoiceContentDiv = newWindow.document.getElementById('invoice-content');
        const invoiceFooterDiv = newWindow.document.getElementById('invoice-footer');
        if (!invoiceContentDiv || !invoiceFooterDiv) return;

        const rect1 = invoiceContentDiv.getBoundingClientRect();
        const rect2 = invoiceFooterDiv.getBoundingClientRect();

        // Check if elements overlap
        const noOverlap =
            rect1.right < rect2.left ||
            rect1.left > rect2.right ||
            rect1.bottom < rect2.top ||
            rect1.top > rect2.bottom;

        if (!noOverlap) {
            invoiceFooterDiv.classList.remove('invoice-footer-fixed');
            invoiceFooterDiv.classList.add('invoice-footer-scroll');
        }
        newWindow.print();
    }, 500);

}
