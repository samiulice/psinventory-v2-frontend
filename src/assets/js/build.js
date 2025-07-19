function buildUserPage() {
  document.getElementById("profile-name").innerHTML = appUser.username;
  if (window.appUser.role == "operator") {
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

function populateSidebarMenu() {
  let menuData = [
    {
      icon: 'fa-home',
      title: 'Home',
      children: [
        { name: 'Dashboard', link: 'index.html' }
      ]
    },
    {
      icon: 'fa-cogs',
      title: 'MIS',
      children: [
        { name: 'Customer List', link: 'customer-list.html' },
        { name: 'Supplier List', link: 'supplier-list.html' },
        { name: 'Employee List', link: 'employee-list.html' }
      ]
    },{
      icon: 'fa-bookmark',
      title: 'Pre-Sell',
      children: [
        { name: 'Product On Hold(Employee)', link: 'product-on-hold-employee.html' },
        { name: 'Quotation', link: 'quotation-for-customer.html' }
      ]
    },
    {
      icon: 'fa-shopping-cart',
      title: 'Inventory',
      children: [
        { name: 'Sale', link: 'sale.html' },
        { name: 'Sale Return', link: 'sale-return.html' },
        { name: 'Purchase', link: 'purchase.html' },
        { name: 'Purchase Return', link: 'purchase-return.html' },
        { name: 'Warranty', link: 'warranty.html' },
        { name: 'Service', link: 'service.html' },
        { name: 'Memo List', link: 'memo-list.html' },
        { name: 'Transaction Posting', link: 'transaction-posting.html' }
      ]
    },
    {
      icon: 'fa-bar-chart-o',
      title: 'Accounts',
      children: [
        { name: 'Receive & Collection', link: 'receive-collection.html' },
        { name: 'Payment', link: 'payment.html' },
        { name: 'Expenses', link: 'expenses.html' },
        { name: 'Investment', link: 'investment.html' }
      ]
    },
    {
      icon: 'fa-cubes',
      title: 'Warehouse',
      children: [
        { name: 'Add Warehouse', link: 'add-warehouse.html' },
        { name: 'Warehouse List', link: 'warehouse-list.html' },
        { name: 'Add Cabinet', link: 'add-cabinets.html' },
        { name: 'Cabinet List', link: 'cabinets-list.html' },
        { name: 'Assign Items', link: 'assign-items.html' },
        { name: 'Transfer Items', link: 'transfer-items.html' },
        { name: 'Warehouse Report', link: 'warehouse-reports.html' }
      ]
    },
    {
      icon: 'fa-file-text',
      title: 'Inventory Reports',
      children: [
        { name: 'Stock Report', link: 'stock-report.html' },
        { name: 'Items History Report', link: 'items-history-report.html' },
        { name: 'Stock Alert Report', link: 'stock-alert-report.html' },
        { name: 'Purchase History', link: 'purchase-history.html' },
        { name: 'Sales History', link: 'sales-history.html' },
        { name: 'Product List', link: 'product-list.html' },
        { name: 'Brand List', link: 'brand-list.html' },
        { name: 'Category List', link: 'category-list.html' },
        { name: 'Service List', link: 'service-list.html' }
      ]
    },
    {
      icon: 'fa-file-text',
      title: 'Accounts Reports',
      children: [
        { name: 'Transaction History', link: 'transaction-history.html' },
        { name: 'Customer Due Report', link: 'customer-due-report.html' },
        { name: 'Supplier Due Report', link: 'supplier-due-report.html' },
        { name: 'Ledger Book(SUMMARY)', link: 'ledger-book-summary.html' },
        { name: 'Ledger Book(DETAILS)', link: 'ledger-book-details.html' },
        { name: 'Expenses Category', link: 'expense-categories.html' },
        { name: 'Expenses History', link: 'expense-history.html' },
        { name: 'Income Statement', link: 'income-statement.html' },
        { name: 'TOP Sheet', link: 'top-sheet.html' },
        { name: 'Trial Balance', link: 'trial-balance.html' },
        { name: 'Balance Sheet', link: 'balance-sheet.html' }
      ]
    }
  ];
  if (window.appUser.role == "operator") {
    // MIS - remove indexes 1 and 2
    menuData[1].children = menuData[1].children.filter((_, index) => index !== 1 && index !== 2);

    // Inventory - remove indexes 3,4,6,7
    menuData[2].children = menuData[2].children.filter((_, index) => ![3, 4, 6, 7].includes(index));

    // Accounts - remove index 3
    menuData[3].children = menuData[3].children.filter((_, index) => index !== 3);

    // Warehouse - remove indexes 0,2,4,5
    menuData[4].children = menuData[4].children.filter((_, index) => ![0, 2, 4, 5].includes(index));

    // Inventory Reports - remove indexes 2,3,4
    menuData[5].children = menuData[5].children.filter((_, index) => ![2, 3, 4].includes(index));

    // Accounts Reports - remove indexes 4,8,10
    menuData[6].children = menuData[6].children.filter((_, index) => ![4, 8, 10].includes(index));

  }


  const sidebar = document.getElementById("sidebar-menu");
  const menuSection = document.createElement("div");
  menuSection.className = "menu_section";

  const ul = document.createElement("ul");
  ul.className = "nav side-menu";

  menuData.forEach(item => {
    const li = document.createElement("li");

    const a = document.createElement("a");
    a.innerHTML = `<i class="fa ${item.icon}"></i> ${item.title} <span class="fa fa-chevron-down"></span>`;
    li.appendChild(a);

    const childUl = document.createElement("ul");
    childUl.className = "nav child_menu";

    item.children.forEach(subItem => {
      const subLi = document.createElement("li");
      const subA = document.createElement("a");
      subA.href = subItem.link;
      subA.textContent = subItem.name;
      subLi.appendChild(subA);
      childUl.appendChild(subLi);
    });

    li.appendChild(childUl);
    ul.appendChild(li);
  });

  menuSection.appendChild(ul);
  sidebar.innerHTML = ""; // Clear existing menu
  sidebar.appendChild(menuSection);
}

populateSidebarMenu()