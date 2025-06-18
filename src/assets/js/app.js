// terminateSession terminates the current session
async function terminateSession() {
  localStorage.removeItem("psitoken");
  localStorage.removeItem("psiuser");
  localStorage.removeItem("psiuserrole");

  window.appUser = null; // Clear the global appUser object
  // Redirect to login page
  window.location.href = "login.html";
}
const api = 'https://psinventory-v2.onrender.com'
// const api = 'http://localhost:8080'
function checkAuth() {
  console.log('Checking access level...');
  const token = localStorage.getItem("psitoken");
  const username = localStorage.getItem("psiuser");
  const role = localStorage.getItem("psiuserrole");

  if (token && username && role) {
    console.log("User is authenticated.");
    // Set the appUser object globally for use in other functions
    window.appUser = { username, token, role }; // Make appUser globally accessible 
  } else{
    console.log("User is not authenticated.");
    // Redirect to login page if no user data found
    window.appUser = null; // Ensure appUser is set to null if not authenticated
    window.location.href = "login.html";
  }
}

// Initialize appUser with the authenticated user data
checkAuth();

function buildUserPage() {
  document.getElementById("profile-name").innerHTML = window.appUser.username;
  if (window.appUser.role == "operator") {
    const options = new Set([
      "supplier-list.html", "employee-list.html", "memo-list.html",
      "transaction-posting.html", "investment.html",
      "stock-report.html", "purchase-history.html", "sales-history.html",
      "income-statement.html", "top-sheet.html",
      "trial-balance.html", "balance-sheet.html"
    ]);

    const links = document.querySelectorAll("#sidebar-menu a[href]");

    // Removing <li> elements based on options set
    links.forEach(link => {
      const href = link.getAttribute("href");

      if (options.has(href)) {
        link.parentElement.remove(); // Remove <li> that contains the link
      }
    });

    // Check if the current page is "settings.html" and apply the overlay to tab-content inside page-content div
    // if (window.location.href.includes("settings.html")) {
    // Find the div with id="page-content"
    const pageContent = document.getElementById("page-content");

    if (pageContent) {
      // Find all elements with the class "tab-content"
      const adminAccess = pageContent.querySelectorAll(".admin-access");
      adminAccess.forEach(elem => {
        // Disable interaction with this div
        elem.style.pointerEvents = "none";
        elem.style.opacity = "0.9"; // Optional visual feedback (dim the page-content)
      });
      const adminAccessShow = pageContent.querySelectorAll(".admin-access-show");
      adminAccessShow.forEach(elem => {
        elem.remove();
      });
    }
    // }
  }


}
buildUserPage()
/**
 * Converts a given string to title case format.
 * Title case format means the first letter of each word is capitalized.
 * 
 * @param {string} str - The input string to be converted.
 * @returns {string} - The string in title case format.
 */
function toTitleCase(str, sep = ' ') {
  return str
    .toLowerCase() // Convert the entire string to lowercase for uniformity.
    .split(sep) // Split the string into an array of words using spaces as delimiters.
    .map(word =>
      word.charAt(0).toUpperCase() + word.slice(1) // Capitalize the first letter of each word and append the rest of the word.
    )
    .join(' '); // Join the array of words back into a single string with spaces between them.
}

/**
 * Converts a number into its word representation based on the Indian numbering system.
 * Supports numbers up to 99,99,99,999 (99 crores).
 *
 * param {number} num - The number to be converted into words.
 * returns {string} - The word representation of the given number.
 *
 * The function handles the following:
 * - Converts numbers below 20 and multiples of 10 using predefined word arrays.
 * - Utilizes place values specific to the Indian numbering system: thousand, lakh, and crore.
 * - Recursively breaks down the number into groups (hundreds, thousands, lakhs, crores)
 *   and converts each group to words.
 * - Combines each group's word representation with the corresponding place value.
 *
 * Example:
 *   numberToWords(12345678) returns "one crore twenty-three lakh forty-five thousand six hundred seventy-eight"
 */

function numberToWords(num) {
  if (isNaN(num)) return 'Invalid number';
  if (num === 0) return 'Zero';
  if (num < 0) num *= -1
  const [integerPart, fractionalPart] = num.toString().split('.').map(part => {
    const cleanPart = part.replace(/^0+/, '') || '0';
    return cleanPart === '' ? '0' : cleanPart;
  });

  let words = [];

  // Helper arrays
  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven',
    'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen',
    'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', 'Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty',
    'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const scales = ['', 'Thousand', 'Lakh', 'Crore', 'Arab', 'Kharab'];

  // Convert chunk of numbers (3-digit or 2-digit based on scale)
  function convertChunk(n, isThreeDigit) {
    let chunkWords = [];
    const maxSize = isThreeDigit ? 100 : 100;

    if (n >= 100 && isThreeDigit) {
      chunkWords.push(units[Math.floor(n / 100)] + ' Hundred');
      n %= 100;
    }

    if (n >= 20) {
      chunkWords.push(tens[Math.floor(n / 10)]);
      n %= 10;
    }

    if (n > 0) chunkWords.push(units[n]);
    return chunkWords.join(' ');
  }

  // Process integer part with South Asian grouping
  let amount = parseInt(integerPart, 10);
  if (amount >= 1e14) return 'Number too large';

  let scaleIndex = 0;
  while (amount > 0) {
    const chunkSize = scaleIndex === 0 ? 1000 : 100;
    const chunk = amount % chunkSize;

    if (chunk !== 0) {
      words.unshift(
        convertChunk(chunk, scaleIndex === 0) +
        (scales[scaleIndex] ? ` ${scales[scaleIndex]}` : '')
      );
    }

    amount = Math.floor(amount / chunkSize);
    scaleIndex++;
  }

  // Process fractional part
  let fractionalWords = [];
  if (fractionalPart) {
    fractionalWords.push('Point');
    for (let digit of fractionalPart) {
      fractionalWords.push(units[digit] || 'Zero');
    }
  }

  // Combine results
  const main = words.filter(x => x).join(' ') || 'Zero';
  const fraction = fractionalWords.join(' ');

  return [main, fraction].filter(x => x).join(' ').replace(/\s+/g, ' ');
}


function numberToWordsBDT(num) {
  // Validate input
  if (isNaN(num) || num >= 1000000000000) return 'Amount too large';
  if (num === 0) return 'Zero Taka';
  if (num < 0) num *= -1

  // Split into integer and fractional parts
  const [integerPart, fractionalPart] = num.toFixed(2).split('.').map(Number);
  let words = [];

  // Helper arrays
  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven',
    'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen',
    'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', 'Ten', 'Twenty', 'Thirty', 'Forty', 'Fifty',
    'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  const scales = ['', 'Thousand', 'Lakh', 'Crore'];

  // Convert integer part
  function convertChunk(n) {
    let chunkWords = [];
    if (n >= 100) {
      chunkWords.push(units[Math.floor(n / 100)] + ' Hundred');
      n %= 100;
    }
    if (n >= 20) {
      chunkWords.push(tens[Math.floor(n / 10)]);
      n %= 10;
    }
    if (n > 0) chunkWords.push(units[n]);
    return chunkWords.join(' ');
  }

  let amount = integerPart;
  let scaleIndex = 0;
  while (amount > 0) {
    const chunk = amount % (scaleIndex === 0 ? 1000 : 100);
    if (chunk !== 0) {
      words.unshift(convertChunk(chunk) + (scales[scaleIndex] ? ' ' + scales[scaleIndex] : ''));
    }
    amount = Math.floor(amount / (scaleIndex === 0 ? 1000 : 100));
    scaleIndex++;
  }

  // Build final string
  let result = words.join(' ') + ' Taka';

  // Add poisha if needed
  if (fractionalPart > 0) {
    let poishaWords = [];
    if (fractionalPart >= 20) {
      poishaWords.push(tens[Math.floor(fractionalPart / 10)]);
      poishaWords.push(units[fractionalPart % 10]);
    } else if (fractionalPart > 0) {
      poishaWords.push(units[fractionalPart]);
    }
    result += ` and ${poishaWords.join(' ')} Poisha`;
  }

  return result;
}

// GenerateRandomAlphanumericCode generates a random alphanumeric string of the specified length.
function generateRandomAlphanumericCode(length) {
  const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const charsetLength = charset.length;
  let randomCode = '';

  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * charsetLength);
    randomCode += charset[index];
  }

  return randomCode;
}


function paginator(currPageIndex, pageSize, totalRecords) {
  let pNav = document.getElementById("paginate_nav");
  let pInfo = document.getElementById("paginator_info");
  if (pNav && pInfo) {
    let startID = (currPageIndex - 1) * pageSize + 1;
    let endID = Math.min(startID + pageSize - 1, totalRecords);
    pInfo.innerHTML = `Showing <strong>${startID}</strong> to <strong>${endID}</strong> of <strong>${totalRecords}</strong> entries`;

    let htmlTmpl = ``;


    if (currPageIndex > 1) {
      htmlTmpl += `<li class="page-product"><a class="page-link" href="#" onclick="updatePage(${pageSize}, ${currPageIndex - 1})">Previous</a></li>`;
    } else {
      htmlTmpl += `<li class="page-product disabled"><a class="page-link" href="#">Previous</a></li>`;
    }
    pages = Math.ceil(totalRecords / pageSize)
    for (let i = 1; i <= pages; i++) {
      htmlTmpl += `<li class="page-product ${i === currPageIndex ? 'active' : ''}"><a class="page-link" href="#" onclick="updatePage(${pageSize}, ${i})">${i}</a></li>`;
    }

    if (currPageIndex == pages) {
      htmlTmpl += `<li class="page-product disabled"><a class="page-link" href="#">Next</a></li>`;
    } else {
      htmlTmpl += `<li class="page-product"><a class="page-link" href="#" onclick="updatePage(${pageSize}, ${currPageIndex + 1})">Next</a></li>`;
    }

    pNav.innerHTML = htmlTmpl;
  }
}
//initSingleDatePicker initialize single date selector calender, date formatted "DD-MMM-YYYY"
//parameter 'elementID' is the the date input field id
function initSingleDatePicker(elementID) {
  $(elementID).daterangepicker({
    singleDatePicker: true,
    singleClasses: "picker_4",
    locale: {
      format: 'DD-MMM-YYYY'
    }
  });
}
// calenders
// calenders
function DateRangePicker_Cal(id) {

  if (typeof ($.fn.daterangepicker) === 'undefined') { return; }
  console.log('dateRangePicker');

  var cb = function (start, end, label) {
    console.log(start.toISOString(), end.toISOString(), label);
    // Use the format 'DD-MMM-YYYY' for display
    $('#' + id + ' span').html(start.format('DD-MMM-YYYY') + ' - ' + end.format('DD-MMM-YYYY'));
  };

  var optionSet1 = {
    startDate: moment('01/01/2012', 'MM/DD/YYYY'),
    endDate: moment(),
    minDate: '01/01/2012',
    maxDate: moment(),
    dateLimit: {
      days: 7300
    },
    showDropdowns: true,
    showWeekNumbers: true,
    timePicker: false,
    timePickerIncrement: 1,
    timePicker12Hour: true,
    ranges: {
      'Till Date': [moment('01/01/2012', 'MM/DD/YYYY'), moment()], // Added Till Date option
      'Today': [moment(), moment()],
      'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
      'Last 7 Days': [moment().subtract(6, 'days'), moment()],
      'Last 30 Days': [moment().subtract(29, 'days'), moment()],
      'This Month': [moment().startOf('month'), moment().endOf('month')],
      'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
    },
    opens: 'right',
    buttonClasses: ['btn btn-default'],
    applyClass: 'btn-small btn-primary',
    cancelClass: 'btn-small',
    format: 'DD-MMM-YYYY', // Update format to 'DD-MMM-YYYY'
    separator: ' to ',
    locale: {
      applyLabel: 'Submit',
      cancelLabel: 'Clear',
      fromLabel: 'From',
      toLabel: 'To',
      customRangeLabel: 'Custom',
      daysOfWeek: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
      firstDay: 1
    }
  };

  // Set the default display format to '01-Jan-2012 - Current date'
  $('#' + id + ' span').html(moment('01/01/2012', 'MM/DD/YYYY').format('DD-MMM-YYYY') + ' - ' + moment().format('DD-MMM-YYYY'));

  // Initialize the daterangepicker with the updated optionSet1
  $('#' + id).daterangepicker(optionSet1, cb);

  $('#' + id).on('show.daterangepicker', function () {
    console.log("show event fired");
  });
  $('#' + id).on('hide.daterangepicker', function () {
    console.log("hide event fired");
  });
  $('#' + id).on('apply.daterangepicker', function (ev, picker) {
    // Resolve the promise with formatted dates
    // document.getElementById("startDateField").innerText = picker.startDate.format('MMMM D, YYYY');
    // document.getElementById("endDateField").innerText =picker.endDate.format('MMMM D, YYYY');
    // showFilteredReport(picker.startDate, picker.endDate)
  });
  $('#' + id).on('cancel.daterangepicker', function (ev, picker) {
    console.log("cancel event fired");
  });

  $('#options1').click(function () {
    $('#' + id).data('daterangepicker').setOptions(optionSet1, cb);
  });

  $('#options2').click(function () {
    $('#' + id).data('daterangepicker').setOptions(optionSet2, cb);
  });

  $('#destroy').click(function () {
    $('#' + id).data('daterangepicker').remove();
  });

}

/* DATA TABLES */

function init_DataTables() {

  console.log('run_datatables');

  if (typeof ($.fn.DataTable) === 'undefined') { return; }
  console.log('init_DataTables');

  var handleDataTableButtons = function () {
    if ($("#datatable-buttons").length) {
      $("#datatable-buttons").DataTable({
        dom: "Bfrtip",
        buttons: [
          {
            extend: "copy",
            className: "btn-sm"
          },
          {
            extend: "excel",
            className: "btn-sm"
          },
          {
            extend: "excel",
            className: "btn-sm"
          },
          {
            extend: "pdfHtml5",
            className: "btn-sm"
          },
          {
            extend: "print",
            className: "btn-sm"
          },
        ],
        responsive: true
      });
    }
  };

  TableManageButtons = function () {
    "use strict";
    return {
      init: function () {
        handleDataTableButtons();
      }
    };
  }();

  $('#datatable').dataTable();

  $('#datatable-keytable').DataTable({
    keys: true
  });

  $('#datatable-responsive').DataTable();

  // $('#warranty-inprogress-table').DataTable();

  $('#datatable-scroller').DataTable({
    ajax: "js/datatables/json/scroller-demo.json",
    deferRender: true,
    scrollY: 380,
    scrollCollapse: true,
    scroller: true
  });

  $('#datatable-fixed-header').DataTable({
    fixedHeader: true
  });

  var $datatable = $('#datatable-checkbox');

  $datatable.dataTable({
    'order': [[1, 'asc']],
    'columnDefs': [
      { orderable: false, targets: [0] }
    ]
  });
  $datatable.on('draw.dt', function () {
    $('checkbox input').iCheck({
      checkboxClass: 'icheckbox_flat-green'
    });
  });

  TableManageButtons.init();

};

function changeISODateToMMDDYYYY(isoDate) {
  const date = new Date(isoDate);

  // Get month, day, and year, adding leading zeros if necessary
  const formattedDate = [
    ('0' + (date.getMonth() + 1)).slice(-2), // Months are zero-based
    ('0' + date.getDate()).slice(-2),
    date.getFullYear()
  ].join('/');

  return formattedDate; // Output: 11/14/2024
}

/**
 * Parses a date string in the "mm/dd/yyyy" format and returns a JavaScript Date object.
 *
 * @param {string} dateStr - The date string in "mm/dd/yyyy" format.
 * @param {string} separator - specify the separator used in the string.
 * @returns {Date} - A JavaScript Date object representing the parsed date.
 */
function parseDate(dateStr, separator) {
  // Split the date string by "/" to get [month, day, year] as strings, then convert to numbers
  const [month, day, year] = dateStr.split(separator).map(Number);

  // Create a new Date object with the parsed values
  // Note: In JavaScript Date, months are zero-indexed (0 = January, 11 = December)
  return new Date(year, month - 1, day);
}


/*formatDate returns formattedDate for the given time, 
if format = "date", returns date only, 
if format = "time", returns time only 
and returns both date and time for format = "" */
function formatDate(time, format, separator) {
  // Parse the input string into a Date object
  const date = new Date(time);

  // Define arrays for month names and zero-padding for formatting
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const pad = (num) => num.toString().padStart(2, '0');

  // Extract date components
  const day = pad(date.getDate());
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = pad(date.getHours());
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());

  //fix separator
  if (separator === "") {
    separator = `/`
  }
  // Format the date
  let formattedDate
  if (format === "") {
    formattedDate = `${day}${separator}${month}${separator}${year} ${hours}:${minutes}:${seconds}`;
  } else if (format == "date") {
    formattedDate = `${day}${separator}${month}${separator}${year}`
  } else if (format == "time") {
    formattedDate = `${hours}:${minutes}:${seconds}`
  }
  return formattedDate
}

function stringToDate(dateString, separator = '-', format = 'mm-dd-yyyy') {
  // Split the date string using the specified separator
  const parts = dateString.split(separator);

  let day, month, year;

  // Assign values based on the specified format
  if (format === 'mm-dd-yyyy') {
    month = parseInt(parts[0]) - 1; // Month (0-based)
    day = parseInt(parts[1]);
    year = parseInt(parts[2]);
  } else if (format === 'dd-mm-yyyy') {
    day = parseInt(parts[0]);
    month = parseInt(parts[1]) - 1; // Month (0-based)
    year = parseInt(parts[2]);
  } else if (format === 'yyyy-mm-dd') {
    year = parseInt(parts[0]);
    month = parseInt(parts[1]) - 1; // Month (0-based)
    day = parseInt(parts[2]);
  } else {
    throw new Error('Unsupported date format. Use mm-dd-yyyy, dd-mm-yyyy, or yyyy-mm-dd.');
  }

  // Create and return a Date object
  return new Date(year, month, day);
}

// setCurrentDate sets current date(mm-dd-yyyy) to the date input by its id
function setCurrentDate(dateInputField) {
  document.getElementById(dateInputField).value = getCurrentDate(); // Set value of the input
}
// getCurrentDate returns current date(mm-dd-yyyy) 
function getCurrentDate() {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(today.getDate()).padStart(2, '0');
  const year = today.getFullYear();

  return `${month}-${day}-${year}`; // Format as MM-DD-YYYY
}

//getShortDate returns current date in 25-Jun-2024 format
function getShortDate() {
  const options = { day: '2-digit', month: 'short', year: 'numeric' };
  return new Date().toLocaleDateString('en-GB', options).replace(/ /g, '-');
}
//getLongDate returns current date in 25-June-2024 format
function getLongDate() {
  const options = { day: '2-digit', month: 'long', year: 'numeric' };
  return new Date().toLocaleDateString('en-GB', options).replace(/ /g, '-');
}

// Example usage:
// const soldDate = '01-10-2022'; // mm-dd-yyyy format
// const warrantyPeriod = 365; // 1 year warranty
// const result = checkWarranty(soldDate, warrantyPeriod, '-', 'mm-dd-yyyy');
// console.log(result);
function checkWarranty(soldDate, warrantyPeriodInDays, separator = '-', format = 'mm-dd-yyyy') {
  // Convert the sold date string to a Date object
  const parts = soldDate.split(separator);
  let day, month, year;

  // Assign values based on the specified format
  if (format === 'mm-dd-yyyy') {
    month = parseInt(parts[0]) - 1; // Month (0-based)
    day = parseInt(parts[1]);
    year = parseInt(parts[2]);
  } else if (format === 'dd-mm-yyyy') {
    day = parseInt(parts[0]);
    month = parseInt(parts[1]) - 1; // Month (0-based)
    year = parseInt(parts[2]);
  } else if (format === 'yyyy-mm-dd') {
    year = parseInt(parts[0]);
    month = parseInt(parts[1]) - 1; // Month (0-based)
    day = parseInt(parts[2]);
  } else {
    throw new Error('Unsupported date format. Use mm-dd-yyyy, dd-mm-yyyy, or yyyy-mm-dd.');
  }

  const soldDateObj = new Date(year, month, day);

  // Calculate warranty expiration date
  const warrantyExpirationDate = new Date(soldDateObj);
  warrantyExpirationDate.setDate(soldDateObj.getDate() + warrantyPeriodInDays);

  // Get today's date at midnight
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set time to midnight

  // Calculate the difference in milliseconds
  const differenceInTime = warrantyExpirationDate - today;
  const differenceInDays = Math.ceil(differenceInTime / (1000 * 3600 * 24));

  warrantyAvailability = false;
  // Check if warranty is available
  if (differenceInDays > 0) {
    warrantyAvailability = true;
  }
  return [warrantyAvailability, differenceInDays]
}

/**
 * Check if a warranty is still valid
 * @param {string} purchaseDate - The purchase date in ISO format (e.g. "2019-05-03T00:00:00Z")
 * @param {number} warrantyDays - Number of days the warranty is valid
 * @returns {boolean} true if warranty is still valid, false if expired
 */
function isWarrantyValid(purchaseDate, warrantyDays) {
  const expiryDate = moment(purchaseDate).add(warrantyDays, 'days');
  const today = moment();
  return expiryDate.isSameOrAfter(today, 'day'); // Compare by date only
}
// Show success message function
function showSuccessMessage(message) {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });
  Toast.fire({
    icon: "success",
    title: message,
    width: 360,
  });
}

// Show error message function
function showErrorMessage(message) {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });
  Toast.fire({
    icon: "error",
    title: message,
    width: 360,
  });
}

function alertQuestion(text, callback) {
  Swal.fire({
    title: text,
    icon: "question",
    width: 360,
  }).then((result) => {
    if (result.isConfirmed && typeof callback === 'function') {
      callback(); // Run the callback function
    }
  });
}
function alertError(text, callback) {
  Swal.fire({
    title: text,
    icon: "error",
    width: 360,
  }).then((result) => {
    if (result.isConfirmed && typeof callback === 'function') {
      callback(); // Run the callback function
    }
  });
}

function alertSuccess(text, callback) {
  Swal.fire({
    title: text,
    icon: "success",
    width: 360,
  }).then((result) => {
    if (result.isConfirmed && typeof callback === 'function') {
      callback(); // Run the callback function
    }
  });
}

function reloadUI() {
  location.reload()
}


