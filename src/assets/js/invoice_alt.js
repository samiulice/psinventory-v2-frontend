//printPurchaseInvoice prints the current invoice
function printPurchaseInvoice() {
    // Step 1: Generate the QR code as a data URL in a hidden element
    const tempDiv = document.createElement("div");
    tempDiv.style.display = "none";
    document.body.appendChild(tempDiv);
    
    // The QRCode library needs a DOM element to render into
    new QRCode(tempDiv, {
        text: `https://its.pssoft.xyz/memo-list.html?print=${InvoiceData.memo_no}`,
        width: 72,
        height: 72,
        correctLevel: QRCode.CorrectLevel.H
    });

    // Extract the base64-encoded image source from the generated canvas/img tag
    const qrCodeImageSrc = tempDiv.querySelector("img")?.src || tempDiv.querySelector("canvas")?.toDataURL();

    // Step 2: Remove the temporary element
    document.body.removeChild(tempDiv);

    // Step 3: Open a new window to write the invoice content
    const newWindow = window.open("", "_blank");

    // Build the item rows HTML
    let tableRows = '';
    InvoiceData.purchased_product.forEach((p, i) => {
        tableRows += `<div class="item-row">
                         <div class="item-cell sr-no">${i + 1}</div>
                         <div class="item-cell description">
                             <div class="product-name">${p.item.product_name}</div>
                             <div>${p.item.product_name == p.item.product_description ? "" : (p.item.product_description || "")}</div>
                         </div>
                         <div class="item-cell unit">PCS</div>
                         <div class="item-cell quantity">${p.quantity}</div>
                         <div class="item-cell price">${p.rate}</div>
                         <div class="item-cell total">${p.quantity * p.rate}</div>
                     </div>`;
    });
    
    // Split company name
    let nameParts = company.name.split(":::").filter(p => p.trim() !== "");
    const companyFName = nameParts[0] || "";
    const companyLName = nameParts[1] || "";

    const content = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>ITS Purchase Invoice</title>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"></script>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                html, body { height: 100%; }
                body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
                .invoice-container {
                    margin: 0 auto;
                    max-width: 800px;
                    background: white;
                    display: flex;
                    flex-direction: column;
                    min-height: 100%;
                }
                .header-section { padding: 2px; }
                .header-content { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
                .company-info { flex: 1; padding: 10px; }
                .company-info div { font-size: 12px; margin-bottom: 5px; }
                .company-info .company-name { font-weight: bold; font-size: 13px; }
                .logo-section { flex-shrink: 0; }
                .logo { height: 72px; width: 72px; object-fit: contain; display: flex; align-items: center; justify-content: center; position: relative; }
                .arabic-info { padding: 10px; flex: 1; text-align: right; direction: rtl; }
                .arabic-info div { font-size: 12px; margin-bottom: 3px; }
                .arabic-info .company-name { font-weight: bold; font-size: 13px; }
                .tax-invoice-label { text-align: center; }
                .tax-invoice-box { display: inline-block; padding: 5px 5px; }
                .tax-invoice-box span { font-size: 12px; font-weight: bold; }
                .tax-invoice-english { font-size: 10px; }
                .invoice-header { background-color: white; margin: 10px; max-width: 800px; }
                .header-row { width: 100%; border-collapse: separate; }
                .field-cell {
                    border: 2px solid #333; border-radius: 25px; padding: 4px 10px;
                    background-color: white; font-size: 14px; font-weight: bold; white-space: nowrap;
                }
                .field-label, .field-value, .arabic-text { color: #333; }
                .field-value { margin-left: 10px; }
                .arabic-text { direction: rtl; text-align: right; }
                .full-width { width: 100%; }
                .three-col { width: 33.33%; }
                .two-col { width: 50%; }
                .items-table {
                    margin: 0 15px;
                    border: 2px solid black;
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                }
                .table-header, .item-row {
                    display: flex;
                    align-items: center;
                    border-bottom: 1px solid black;
                    font-weight: bold;
                    min-height: 40px;
                }
                .items-body { flex-grow: 1; display: flex; flex-direction: column; }
                .items-body > .item-row:last-child { border-bottom: none; }
                .table-header { background-color: #f0f0f0; flex-shrink: 0; }
                .header-cell, .item-cell { padding: 8px; font-size: 11px; }
                .sr-no { width: 50px; text-align: center; }
                .description { flex: 1; text-align: left; }
                .unit { width: 60px; text-align: center; }
                .quantity { width: 80px; text-align: center; }
                .price { width: 80px; text-align: center; }
                .total { width: 100px; text-align: center; }
                .item-cell .product-name { font-weight: bold; margin-bottom: 5px; }
                .separator-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; }
                .separator-line { position: absolute; top: 0; bottom: 0; width: 1px; background-color: black; }
                .totals-section { margin: 0 15px; border: 2px solid black; border-top: none; }
                .total-row { display: flex; border-bottom: 1px solid black; }
                .total-row:last-child { border-bottom: none; background-color: #f0f0f0; }
                .total-label { flex: 1; border-right: 1px solid black; padding: 8px; font-size: 11px; text-align: right; }
                .total-amount { width: 100px; padding: 8px; font-size: 11px; text-align: right; font-weight: bold; }
                .footer-section { padding: 20px; }
                .footer-content { display: flex; justify-content: space-between; align-items: flex-end; }
                .qr-section { flex-shrink: 0; }
                .qr-code { width: 72px; height: 72px; border: 1px solid black; margin-bottom: 5px; }
                .signature-section { display: flex; gap: 80px; }
                .signature-box { text-align: center; }
                .signature-label { font-size: 11px; font-weight: bold; margin-bottom: 60px; }
                .signature-line { width: 120px; border-bottom: 1px solid black; margin-bottom: 5px; }
                .signature-arabic { font-size: 10px; }
            </style>
        </head>
        <body>
            <div class="invoice-container">
                <div class="header-section">
                    <div class="header-content">
                        <div class="company-info"><div class="company-name">${companyFName} ${companyLName}</div><div>VAT No : 310189726000003</div><div>OLAYA COMPUTER MARKET</div><div>L1 - Showroom No - 40</div></div>
                        <div class="logo-section"><div class="logo"><img class="logo" src="https://api.pssoft.xyz/api/v2/images/logo/logo.png" alt="Company Logo"></div><div class="tax-invoice-label"><div class="tax-invoice-box"><span>فاتورة ضريبية</span></div><div class="tax-invoice-english">Tax Invoice</div></div></div>
                        <div class="arabic-info"><div class="company-name">مؤسسة قرناس التقنية للاتصالات</div><div>و تقنية المعلومات</div><div>الرقم الضريبي : 310189726000003</div><div>سوق العليا للكمبيوتر - L1 - معرض رقم - 40</div></div>
                    </div>
                </div>
                <div class="invoice-details">
                    <div class="invoice-header">
                        <table class="header-row"><tbody><tr><td class="field-cell full-width"><span class="field-label">P.O No:</span><span class="field-value"></span><span class="arabic-text" style="float: right;">رقم طلب الشراء:</span></td></tr></tbody></table>
                        <table class="header-row"><tbody><tr><td class="field-cell three-col"><span class="field-label">Invoice Type:</span><span class="field-value">cash</span><span class="arabic-text" style="float: right;">نوع الفاتورة:</span></td><td class="field-cell three-col"><span class="field-label">Invoice No:</span><span class="field-value">${InvoiceData.memo_no}</span><span class="arabic-text" style="float: right;">رقم الفاتورة:</span></td><td class="field-cell three-col"><span class="field-label">Date:</span><span class="field-value">${moment(InvoiceData.purchase_date).format("DD/MM/YYYY")} ${moment(InvoiceData.created_at).format("hh:mm A")}</span></td></tr></tbody></table>
                        <table class="header-row"><tbody><tr><td class="field-cell two-col"><span class="field-label">Supplier Mob No:</span><span class="field-value">${InvoiceData.supplier.mobile}</span><span class="arabic-text" style="float: right;">رقم هاتف المورد:</span></td><td class="field-cell two-col"><span class="field-label">Supplier Vat No:</span><span class="field-value"></span><span class="arabic-text" style="float: right;">الرقم الضريبي للمورد:</span></td></tr></tbody></table>
                        <table class="header-row"><tbody><tr><td class="field-cell full-width"><span class="field-label">Supplier Name:</span><span class="field-value">${InvoiceData.supplier.account_name.toUpperCase()}</span><span class="arabic-text" style="float: right;">اسم المورد:</span></td></tr></tbody></table>
                        <table class="header-row"><tbody><tr><td class="field-cell full-width"><span class="field-label">Supplier Address:</span><span class="field-value">${InvoiceData.supplier.area || '-'}</span><span class="arabic-text" style="float: right;">عنوان المورد:</span></td></tr></tbody></table>
                    </div>
                </div>
                <div class="items-table">
                    <div class="table-header">
                        <div class="header-cell sr-no">مقرلا<br>Sr.No</div>
                        <div class="header-cell description" style="text-align:center;">نايبلا<br>Description</div>
                        <div class="header-cell unit">ةدحولا<br>Unit</div>
                        <div class="header-cell quantity">هيمكلا<br>Quantity</div>
                        <div class="header-cell price">ةدحولا رعس<br>U.Price</div>
                        <div class="header-cell total">يلامجلا غلبملا<br>Total Amount</div>
                    </div>
                    <div class="items-body">${tableRows}</div>
                    <div class="separator-overlay">
                        <div class="separator-line" style="left: 50px;"></div>
                        <div class="separator-line" style="right: 320px;"></div>
                        <div class="separator-line" style="right: 260px;"></div>
                        <div class="separator-line" style="right: 180px;"></div>
                        <div class="separator-line" style="right: 100px;"></div>
                    </div>
                </div>
                <div class="totals-section">
                    <div class="total-row"><div class="total-label">SubTotal / يعرفلا عومجملا</div><div class="total-amount">${InvoiceData.bill_amount}</div></div>
                    <div class="total-row"><div class="total-label">Discount / مصخ</div><div class="total-amount">${InvoiceData.discount}</div></div>
                    <div class="total-row"><div class="total-label">Net Amount / غلبملا يفاص</div><div class="total-amount">${InvoiceData.total_amount}</div></div>
                    <div class="total-row"><div class="total-label">VAT (15%) / ةبيرضلا</div><div class="total-amount">${Math.ceil(InvoiceData.total_amount * 0.15)}</div></div>
                    <div class="total-row"><div class="total-label" style="font-weight:bold;"><span>${numberToArabicWords(Math.ceil(InvoiceData.total_amount * 1.15))}<br>
                    ${numberToWords(Math.ceil(InvoiceData.total_amount * 1.15)) + " " + company.currency} Only.</span></div>
                    <div class="total-label" style="font-weight:bold; max-width:100px">Total / يلامجلا غلبملا</div><div class="total-amount" style="font-size: 14px;">${Math.ceil(InvoiceData.total_amount * 1.15)}</div></div>
                </div>
                <div class="footer-section">
                    <div class="footer-content">
                        <div class="qr-section">
                            <img class="qr-code" src="${qrCodeImageSrc}" alt="QR Code">
                        </div>
                        <div class="signature-section">
                            <div class="signature-box"><div class="signature-label">Signature</div><div class="signature-line"></div><div class="signature-arabic">توقيع</div></div>
                            <div class="signature-box"><div class="signature-label">Stamp</div><div class="signature-line"></div><div class="signature-arabic">ختم</div></div>
                        </div>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;

    newWindow.document.write(content);
    newWindow.document.close();
    
    // Wait for the new window content to fully render before printing
    setTimeout(() => {
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
        members_of += `<img src=${api}/images/${association}" alt="${association}">`
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
                                    <img src="https://api.pssoft.xyz/api/v2/images/logo/logo.png" alt="">
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
                              <div class="detail-value">: ${window.appUser.username}</div>
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
    // Step 1: Generate the QR code as a data URL in a hidden element
    const tempDiv = document.createElement("div");
    tempDiv.style.display = "none";
    document.body.appendChild(tempDiv);
    
    // The QRCode library needs a DOM element to render into
    new QRCode(tempDiv, {
        text: `https://its.pssoft.xyz/memo-list.html?print=${InvoiceData.memo_no}`,
        width: 72,
        height: 72,
        correctLevel: QRCode.CorrectLevel.H
    });

    // Extract the base64-encoded image source from the generated canvas/img tag
    const qrCodeImageSrc = tempDiv.querySelector("img")?.src || tempDiv.querySelector("canvas")?.toDataURL();

    // Step 2: Remove the temporary element
    document.body.removeChild(tempDiv);

    // Step 3: Create the print iframe
    let printFrame = document.getElementById("printFrame");
    if (!printFrame) {
        printFrame = document.createElement("iframe");
        printFrame.id = "printFrame";
        printFrame.style.position = "absolute";
        printFrame.style.top = "-10000px";
        printFrame.style.left = "-10000px";
        document.body.appendChild(printFrame);
    }

    let tableRows = '';
    InvoiceData.sold_products.forEach((p, i) => {
        tableRows += `<div class="item-row">
                         <div class="item-cell sr-no">${i + 1}</div>
                         <div class="item-cell description">
                             <div class="product-name">${p.item.product_name}</div>
                             <div>${p.item.product_name == p.item.product_description ? "" : (p.item.product_description || "")}</div>
                         </div>
                         <div class="item-cell unit">PCS</div>
                         <div class="item-cell quantity">${p.quantity}</div>
                         <div class="item-cell price">${p.rate}</div>
                         <div class="item-cell total">${p.quantity * p.rate}</div>
                      </div>`;
    });
    
    let nameParts = company.name.split(":::").filter(p => p.trim() !== "");
    const companyFName = nameParts[0] || "";
    const companyLName = nameParts[1] || "";

    const content = `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <title>ITS Invoice</title>
            <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.29.1/moment.min.js"></script>
            <style>
                * { margin: 0; padding: 0; box-sizing: border-box; }
                html, body { height: 100%; }
                body { font-family: Arial, sans-serif; background-color: #f5f5f5; }
                .invoice-container {
                    margin: 0 auto;
                    max-width: 800px;
                    background: white;
                    display: flex;
                    flex-direction: column;
                    min-height: 100%;
                }
                .header-section { padding: 2px; }
                .header-content { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
                .company-info { flex: 1; padding: 10px; }
                .company-info div { font-size: 12px; margin-bottom: 5px; }
                .company-info .company-name { font-weight: bold; font-size: 13px; }
                .logo-section { flex-shrink: 0; }
                .logo { height: 72px; width: 72px; object-fit: contain; display: flex; align-items: center; justify-content: center; position: relative; }
                .arabic-info { padding: 10px; flex: 1; text-align: right; direction: rtl; }
                .arabic-info div { font-size: 12px; margin-bottom: 3px; }
                .arabic-info .company-name { font-weight: bold; font-size: 13px; }
                .tax-invoice-label { text-align: center; }
                .tax-invoice-box { display: inline-block; padding: 5px 5px; }
                .tax-invoice-box span { font-size: 12px; font-weight: bold; }
                .tax-invoice-english { font-size: 10px; }
                .invoice-header { background-color: white; margin: 10px; max-width: 800px; }
                .header-row { width: 100%; border-collapse: separate; }
                .field-cell {
                    border: 2px solid #333; border-radius: 25px; padding: 4px 10px;
                    background-color: white; font-size: 14px; font-weight: bold; white-space: nowrap;
                }
                .field-label, .field-value, .arabic-text { color: #333; }
                .field-value { margin-left: 10px; }
                .arabic-text { direction: rtl; text-align: right; }
                .full-width { width: 100%; }
                .three-col { width: 33.33%; }
                .two-col { width: 50%; }
                .items-table {
                    margin: 0 15px;
                    border: 2px solid black;
                    flex-grow: 1;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                }
                .table-header, .item-row {
                    display: flex;
                    align-items: center;
                    border-bottom: 1px solid black;
                    font-weight: bold;
                    min-height: 40px;
                }
                .items-body { flex-grow: 1; display: flex; flex-direction: column; }
                .items-body > .item-row:last-child { border-bottom: none; }
                .table-header { background-color: #f0f0f0; flex-shrink: 0; }
                .header-cell, .item-cell { padding: 8px; font-size: 11px; }
                .sr-no { width: 50px; text-align: center; }
                .description { flex: 1; text-align: left; }
                .unit { width: 60px; text-align: center; }
                .quantity { width: 80px; text-align: center; }
                .price { width: 80px; text-align: center; }
                .total { width: 100px; text-align: center; }
                .item-cell .product-name { font-weight: bold; margin-bottom: 5px; }
                .separator-overlay { position: absolute; top: 0; left: 0; right: 0; bottom: 0; pointer-events: none; }
                .separator-line { position: absolute; top: 0; bottom: 0; width: 1px; background-color: black; }
                .totals-section { margin: 0 15px; border: 2px solid black; border-top: none; }
                .total-row { display: flex; border-bottom: 1px solid black; }
                .total-row:last-child { border-bottom: none; background-color: #f0f0f0; }
                .total-label { flex: 1; border-right: 1px solid black; padding: 8px; font-size: 11px; text-align: right; }
                .total-amount { width: 100px; padding: 8px; font-size: 11px; text-align: right; font-weight: bold; }
                .footer-section { padding: 20px; }
                .footer-content { display: flex; justify-content: space-between; align-items: flex-end; }
                .qr-section { flex-shrink: 0; }
                .qr-code { width: 72px; height: 72px; border: 1px solid black; margin-bottom: 5px; }
                .signature-section { display: flex; gap: 80px; }
                .signature-box { text-align: center; }
                .signature-label { font-size: 11px; font-weight: bold; margin-bottom: 60px; }
                .signature-line { width: 120px; border-bottom: 1px solid black; margin-bottom: 5px; }
                .signature-arabic { font-size: 10px; }
            </style>
        </head>
        <body>
            <div class="invoice-container">
                <div class="header-section">
                    <div class="header-content">
                        <div class="company-info"><div class="company-name">${companyFName} ${companyLName}</div><div>VAT No : 310189726000003</div><div>OLAYA COMPUTER MARKET</div><div>L1 - Showroom No - 40</div></div>
                        <div class="logo-section"><div class="logo"><img class="logo" src="https://api.pssoft.xyz/api/v2/images/logo/logo.png" alt="Company Logo"></div><div class="tax-invoice-label"><div class="tax-invoice-box"><span>فاتورة ضريبية</span></div><div class="tax-invoice-english">Tax Invoice</div></div></div>
                        <div class="arabic-info"><div class="company-name">مؤسسة قرناس التقنية للاتصالات</div><div>و تقنية المعلومات</div><div>الرقم الضريبي : 310189726000003</div><div>سوق العليا للكمبيوتر - L1 - معرض رقم - 40</div></div>
                    </div>
                </div>
                <div class="invoice-details">
                    <div class="invoice-header">
                        <table class="header-row"><tbody><tr><td class="field-cell full-width"><span class="field-label">P.O No:</span><span class="field-value"></span><span class="arabic-text" style="float: right;">رقم طلب الشراء:</span></td></tr></tbody></table>
                        <table class="header-row"><tbody><tr><td class="field-cell three-col"><span class="field-label">Invoice Type:</span><span class="field-value">cash</span><span class="arabic-text" style="float: right;">نوع الفاتورة:</span></td><td class="field-cell three-col"><span class="field-label">Invoice No:</span><span class="field-value">${InvoiceData.memo_no}</span><span class="arabic-text" style="float: right;">رقم الفاتورة:</span></td><td class="field-cell three-col"><span class="field-label">Date:</span><span class="field-value">${moment(InvoiceData.sale_date).format("DD/MM/YYYY")} ${moment(InvoiceData.created_at).format("hh:mm A")}</span></td></tr></tbody></table>
                        <table class="header-row"><tbody><tr><td class="field-cell two-col"><span class="field-label">Customer Mob No:</span><span class="field-value">${InvoiceData.customer.mobile}</span><span class="arabic-text" style="float: right;">رقم هاتف العميل:</span></td><td class="field-cell two-col"><span class="field-label">Customer Vat No:</span><span class="field-value"></span><span class="arabic-text" style="float: right;">الرقم الضريبي للعميل:</span></td></tr></tbody></table>
                        <table class="header-row"><tbody><tr><td class="field-cell full-width"><span class="field-label">Customer Name:</span><span class="field-value">${InvoiceData.customer.account_name.toUpperCase()}</span><span class="arabic-text" style="float: right;">اسم العميل:</span></td></tr></tbody></table>
                        <table class="header-row"><tbody><tr><td class="field-cell full-width"><span class="field-label">Customer Address:</span><span class="field-value">${InvoiceData.customer.area || '-'}</span><span class="arabic-text" style="float: right;">عنوان العميل:</span></td></tr></tbody></table>
                    </div>
                </div>
                <div class="items-table">
                    <div class="table-header">
                        <div class="header-cell sr-no">مقرلا<br>Sr.No</div>
                        <div class="header-cell description" style="text-align:center;">نايبلا<br>Description</div>
                        <div class="header-cell unit">ةدحولا<br>Unit</div>
                        <div class="header-cell quantity">هيمكلا<br>Quantity</div>
                        <div class="header-cell price">ةدحولا رعس<br>U.Price</div>
                        <div class="header-cell total">يلامجلا غلبملا<br>Total Amount</div>
                    </div>
                    <div class="items-body">${tableRows}</div>
                    <div class="separator-overlay">
                        <div class="separator-line" style="left: 50px;"></div>
                        <div class="separator-line" style="right: 320px;"></div>
                        <div class="separator-line" style="right: 260px;"></div>
                        <div class="separator-line" style="right: 180px;"></div>
                        <div class="separator-line" style="right: 100px;"></div>
                    </div>
                </div>
                <div class="totals-section">
                    <div class="total-row"><div class="total-label">SubTotal / يعرفلا عومجملا</div><div class="total-amount">${InvoiceData.bill_amount}</div></div>
                    <div class="total-row"><div class="total-label">Discount / مصخ</div><div class="total-amount">${InvoiceData.discount}</div></div>
                    <div class="total-row"><div class="total-label">Net Amount / غلبملا يفاص</div><div class="total-amount">${InvoiceData.total_amount}</div></div>
                    <div class="total-row"><div class="total-label">VAT (15%) / ةبيرضلا</div><div class="total-amount">${Math.ceil(InvoiceData.total_amount * 0.15)}</div></div>
                    <div class="total-row"><div class="total-label" style="font-weight:bold;"><span>${numberToArabicWords(Math.ceil(InvoiceData.total_amount * 1.15))}<br>
                    ${numberToWords(Math.ceil(InvoiceData.total_amount * 1.15)) + " " + company.currency} Only.</span></div>
                    <div class="total-label" style="font-weight:bold; max-width:100px">Total / يلامجلا غلبملا</div><div class="total-amount" style="font-size: 14px;">${Math.ceil(InvoiceData.total_amount * 1.15)}</div></div>
                </div>
                <div class="footer-section">
                    <div class="footer-content">
                        <div class="qr-section">
                            <img class="qr-code" src="${qrCodeImageSrc}" alt="QR Code">
                        </div>
                        <div class="signature-section">
                            <div class="signature-box"><div class="signature-label">Signature</div><div class="signature-line"></div><div class="signature-arabic">توقيع</div></div>
                            <div class="signature-box"><div class="signature-label">Stamp</div><div class="signature-line"></div><div class="signature-arabic">ختم</div></div>
                        </div>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;

    // Step 4: Write to the iframe document and print
    const frameDoc = printFrame.contentWindow || printFrame.contentDocument;
    frameDoc.document.open();
    frameDoc.document.write(content);
    frameDoc.document.close();

    // Wait for the iframe content to fully render before printing
    setTimeout(() => {
        frameDoc.focus();
        frameDoc.print();
    }, 500);
}

function printSaleChallan() {
    const newWindow = window.open("", "_blank");
    // //product list table
    let tBody = ""
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
            </tr>
          `
    }
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
                                  <img src="https://api.pssoft.xyz/api/v2/images/logo/logo.png" alt="">
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
                  <div class="invoice-title">Challan</div>

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
                              <div class="detail-label">Challan No.</div>
                              <div class="detail-value">: ${InvoiceData.memo_no}</div>
                          </div>
                          <div class="detail-row">
                              <div class="detail-label">Date & Time</div>
                              <div class="detail-value">: ${moment(InvoiceData.sale_date).format("DD-MMMM-YYYY")}</div>
                          </div>
                          <div class="detail-row">
                              <div class="detail-label">Prepared By</div>
                              <div class="detail-value">: ${window.appUser.username}</div>
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
                          </tr>
                      </thead>
                      <tbody id="product-items">
                          <!-- will be updated by JS -->
                          ${tBody}
                      </tbody>
                  </table>
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
        members_of += `<img src="${api}/images/${association}" alt="${association}">`
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
                                  <img src="https://api.pssoft.xyz/api/v2/images/logo/logo.png" alt="">
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
                              <div class="detail-value">: ${window.appUser.username}</div>
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


function printQuotation() {
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
        tBody += `
            <tr class="item-row">
              <td>${i + 1}</td>
              <td class="item-name">
                ${items.item.product_name} <br>
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
                                  <img src="https://api.pssoft.xyz/api/v2/images/logo/logo.png" alt="">
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
                  <div class="invoice-title">Quotation</div>

                  <div class="details">
                      <div class="left-details">
                          <div class="detail-row">
                              <div class="detail-label">Quotation To</div>
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
                              <div class="detail-label">Quotation No.</div>
                              <div class="detail-value">: ${InvoiceData.memo_no}</div>
                          </div>
                          <div class="detail-row">
                              <div class="detail-label">Date & Time</div>
                              <div class="detail-value">: ${moment(InvoiceData.sale_date).format("DD-MMMM-YYYY")}</div>
                          </div>
                          <div class="detail-row">
                              <div class="detail-label">Prepared By</div>
                              <div class="detail-value">: ${window.appUser.username}</div>
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
              </div>

              <div class="invoice-footer-fixed" id="invoice-footer">
                  <div class="dotted-line"></div>
                  <div class="invoice-footer-info">
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

function printEmployeeQuotation() {
    const newWindow = window.open("", "_blank");
    // //product list table
    let tBody = ""
    let name = window.company.name.split(":::").filter(p => p.trim() !== "")
    const companyFName = name[0]
    const companyLName = name[1] || ""
    let pLn = InvoiceData.sold_products.length
    for (let i = 0; i < pLn; i++) {
        const items = InvoiceData.sold_products[i]
        let serialNumbers = ""

        items.serial_numbers.forEach((sn) => {
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
                    width: 250px;
                    font-size: 10px;
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
                                  <img src="https://api.pssoft.xyz/api/v2/images/logo/logo.png" alt="">
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
                  <div class="invoice-title">Product Reservation for Employee </div>

                  <div class="details">
                      <div class="left-details">
                          <div class="detail-row">
                              <div class="detail-label">Quotation To</div>
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
                              <div class="detail-label">Quotation No.</div>
                              <div class="detail-value">: ${InvoiceData.memo_no}</div>
                          </div>
                          <div class="detail-row">
                              <div class="detail-label">Date & Time</div>
                              <div class="detail-value">: ${moment(InvoiceData.sale_date).format("DD-MMMM-YYYY")}</div>
                          </div>
                          <div class="detail-row">
                              <div class="detail-label">Prepared By</div>
                              <div class="detail-value">: ${window.appUser.username}</div>
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
              </div>

              <div class="invoice-footer-fixed" id="invoice-footer">
                  <div class="dotted-line"></div>
                  <div class="invoice-footer-info">
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