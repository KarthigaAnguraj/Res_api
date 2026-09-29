// ========================================
// CUSTOMER PAGE
// ========================================

let customerTables = [];


// ========================================
// HELPER FUNCTIONS
// ========================================

function formatCustomerDateTime(value) {

    if (!value) {
        return "-";
    }

    const date = new Date(value);

    if (isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString();
}


function formatCustomerMoney(value) {

    if (value === null || value === undefined) {
        return "₹0.00";
    }

    return "₹" + Number(value).toFixed(2);
}


async function customerError(response) {

    try {

        const data = await response.json();

        return data.message ||
               data.error ||
               "Something went wrong";

    } catch (error) {

        return "Something went wrong";
    }
}


// ========================================
// PAGE NAVIGATION
// ========================================

function showCustomerPage(page) {

    const pages = [
        "homePage",
        "reservePage",
        "reservationsPage",
        "orderPage",
        "ordersPage"
    ];

    pages.forEach(pageId => {

        const element =
            document.getElementById(pageId);

        if (element) {
            element.classList.add("hidden");
        }
    });


    const navItems =
        document.querySelectorAll(".nav-item");

    navItems.forEach(item => {
        item.classList.remove("active");
    });


    // ====================================
    // HOME
    // ====================================

    if (page === "home") {

        const homePage =
            document.getElementById("homePage");

        if (homePage) {
            homePage.classList.remove("hidden");
        }

        const pageTitle =
            document.getElementById("pageTitle");

        if (pageTitle) {
            pageTitle.innerText = "Welcome";
        }

        const pageSubtitle =
            document.getElementById("pageSubtitle");

        if (pageSubtitle) {
            pageSubtitle.innerText =
                "Welcome to Table Turn";
        }

        if (navItems[0]) {
            navItems[0].classList.add("active");
        }
    }


    // ====================================
    // RESERVE
    // ====================================

    if (page === "reserve") {

        const reservePage =
            document.getElementById("reservePage");

        if (reservePage) {
            reservePage.classList.remove("hidden");
        }

        const pageTitle =
            document.getElementById("pageTitle");

        if (pageTitle) {
            pageTitle.innerText =
                "Reserve a Table";
        }

        const pageSubtitle =
            document.getElementById("pageSubtitle");

        if (pageSubtitle) {
            pageSubtitle.innerText =
                "Book your table at Table Turn";
        }

        if (navItems[1]) {
            navItems[1].classList.add("active");
        }

        loadCustomerTables();
    }


    // ====================================
    // RESERVATIONS
    // ====================================

    if (page === "reservations") {

        const reservationsPage =
            document.getElementById(
                "reservationsPage"
            );

        if (reservationsPage) {
            reservationsPage.classList.remove("hidden");
        }

        const pageTitle =
            document.getElementById("pageTitle");

        if (pageTitle) {
            pageTitle.innerText =
                "My Reservations";
        }

        const pageSubtitle =
            document.getElementById("pageSubtitle");

        if (pageSubtitle) {
            pageSubtitle.innerText =
                "View your restaurant reservations";
        }

        if (navItems[2]) {
            navItems[2].classList.add("active");
        }

        loadCustomerReservations();
    }


    // ====================================
    // ORDER
    // ====================================

    if (page === "order") {

        const orderPage =
            document.getElementById("orderPage");

        if (orderPage) {
            orderPage.classList.remove("hidden");
        }

        const pageTitle =
            document.getElementById("pageTitle");

        if (pageTitle) {
            pageTitle.innerText =
                "Order Food";
        }

        const pageSubtitle =
            document.getElementById("pageSubtitle");

        if (pageSubtitle) {
            pageSubtitle.innerText =
                "Place an order for your table";
        }

        if (navItems[3]) {
            navItems[3].classList.add("active");
        }

        loadOccupiedTables();
    }


    // ====================================
    // ORDERS
    // ====================================

    if (page === "orders") {

        const ordersPage =
            document.getElementById("ordersPage");

        if (ordersPage) {
            ordersPage.classList.remove("hidden");
        }

        const pageTitle =
            document.getElementById("pageTitle");

        if (pageTitle) {
            pageTitle.innerText =
                "My Orders";
        }

        const pageSubtitle =
            document.getElementById("pageSubtitle");

        if (pageSubtitle) {
            pageSubtitle.innerText =
                "View your food orders";
        }

        if (navItems[4]) {
            navItems[4].classList.add("active");
        }

        loadCustomerOrders();
    }
}


// ========================================
// LOAD TABLES FOR RESERVATION
// ========================================

async function loadCustomerTables() {

    console.log(
        "Loading restaurant tables..."
    );

    try {

        const response =
            await fetch(
                "/api/tables/getAll"
            );

        console.log(
            "Table API status:",
            response.status
        );


        if (!response.ok) {

            throw new Error(
                "Unable to load tables"
            );
        }


        const data =
            await response.json();


        console.log(
            "LATEST TABLE DATA:",
            data
        );


        if (!Array.isArray(data)) {

            console.error(
                "Invalid table response:",
                data
            );

            customerTables = [];

            displayReservationTables([]);

            return;
        }


        customerTables = data;


        displayReservationTables(
            customerTables
        );

    } catch (error) {

        console.error(
            "TABLE LOAD ERROR:",
            error
        );

        alert(
            "Unable to load restaurant tables"
        );
    }
}


// ========================================
// DISPLAY AVAILABLE TABLES
// ========================================

function displayReservationTables(data) {

    console.log(
        "Displaying tables:",
        data
    );


    const select =
        document.getElementById(
            "reservationTableId"
        );


    if (!select) {

        console.error(
            "ERROR: reservationTableId not found"
        );

        return;
    }


    // Clear dropdown
    select.innerHTML = "";


    // Default option
    const defaultOption =
        document.createElement("option");

    defaultOption.value = "";

    defaultOption.textContent =
        "Select your table";

    defaultOption.disabled = true;

    defaultOption.selected = true;

    select.appendChild(
        defaultOption
    );


    if (!Array.isArray(data)) {

        console.error(
            "Table data is not an array:",
            data
        );

        return;
    }


    let freeTableCount = 0;


    data.forEach(table => {

        console.log(
            "Checking table:",
            table
        );


        const status =
            String(
                table.status || ""
            )
            .trim()
            .toUpperCase();


        console.log(
            "Table ID:",
            table.id,
            "Status:",
            status,
            "Capacity:",
            table.capacity
        );


        // ONLY FREE TABLES
        if (status !== "FREE") {
            return;
        }


        freeTableCount++;


        const option =
            document.createElement("option");


        option.value =
            String(table.id);


        option.textContent =
            "Table " +
            table.tableNumber +
            " - " +
            table.capacity +
            " people";


        select.appendChild(
            option
        );
    });


    console.log(
        "FREE TABLE COUNT:",
        freeTableCount
    );


    // No FREE tables
    if (freeTableCount === 0) {

        const noTableOption =
            document.createElement("option");

        noTableOption.value = "";

        noTableOption.textContent =
            "No tables available";

        noTableOption.disabled = true;

        select.appendChild(
            noTableOption
        );
    }
}


// ========================================
// CREATE RESERVATION
// ========================================

function createCustomerReservation() {

    const customerNameElement =
        document.getElementById(
            "customerName"
        );

    const partySizeElement =
        document.getElementById(
            "partySize"
        );

    const tableElement =
        document.getElementById(
            "reservationTableId"
        );

    const startTimeElement =
        document.getElementById(
            "startTime"
        );

    const endTimeElement =
        document.getElementById(
            "endTime"
        );


    if (
        !customerNameElement ||
        !partySizeElement ||
        !tableElement ||
        !startTimeElement ||
        !endTimeElement
    ) {

        alert(
            "Reservation form fields not found"
        );

        return;
    }


    const customerName =
        customerNameElement.value.trim();


    const partySize =
        partySizeElement.value;


    const tableId =
        tableElement.value;


    const startTime =
        startTimeElement.value;


    const endTime =
        endTimeElement.value;


    // ====================================
    // VALIDATION
    // ====================================

    if (customerName === "") {

        alert(
            "Please enter your name"
        );

        return;
    }


    if (
        partySize === "" ||
        Number(partySize) <= 0
    ) {

        alert(
            "Please enter number of people"
        );

        return;
    }


    if (tableId === "") {

        alert(
            "Please select a table"
        );

        return;
    }


    if (startTime === "") {

        alert(
            "Please select start time"
        );

        return;
    }


    if (endTime === "") {

        alert(
            "Please select end time"
        );

        return;
    }


    // ====================================
    // CHECK TIME
    // ====================================

    if (
        new Date(endTime) <=
        new Date(startTime)
    ) {

        alert(
            "End time must be after start time"
        );

        return;
    }


    // ====================================
    // FIND TABLE
    // ====================================

    const selectedTable =
        customerTables.find(
            table =>
                Number(table.id) ===
                Number(tableId)
        );


    console.log(
        "SELECTED TABLE ID:",
        tableId
    );

    console.log(
        "SELECTED TABLE:",
        selectedTable
    );


    if (!selectedTable) {

        alert(
            "Selected table not found"
        );

        loadCustomerTables();

        return;
    }


    // ====================================
    // CHECK STATUS
    // ====================================

    if (
        String(
            selectedTable.status || ""
        )
        .trim()
        .toUpperCase() !== "FREE"
    ) {

        alert(
            "This table is no longer available"
        );

        loadCustomerTables();

        return;
    }


    // ====================================
    // CHECK CAPACITY
    // ====================================

    if (
        Number(partySize) >
        Number(selectedTable.capacity)
    ) {

        alert(
            "This table can accommodate only " +
            selectedTable.capacity +
            " people"
        );

        return;
    }


    // ====================================
    // DATE AND TIME
    // ====================================

    const reservationDate =
        startTime.substring(
            0,
            10
        );


    const startOnly =
        startTime.substring(
            11,
            16
        );


    const endOnly =
        endTime.substring(
            11,
            16
        );


    // ====================================
    // REQUEST
    // ====================================

    const reservation = {

        customerName:
            customerName,

        partySize:
            Number(partySize),

        reservationDate:
            reservationDate,

        startTime:
            startOnly,

        endTime:
            endOnly,

        table: {

            id:
                Number(tableId)
        }
    };


    console.log(
        "Reservation Request:",
        reservation
    );


    // ====================================
    // SEND REQUEST
    // ====================================

    fetch(
        "/api/reservations/create",
        {

            method: "POST",

            headers: {

                "Content-Type":
                    "application/json"
            },

            body:
                JSON.stringify(
                    reservation
                )
        }
    )

    .then(async response => {

        if (!response.ok) {

            const message =
                await customerError(
                    response
                );

            throw new Error(
                message
            );
        }

        return response.json();
    })

    .then(data => {

        console.log(
            "Reservation created:",
            data
        );


        alert(
            "Table reserved successfully!"
        );


        // Clear form
        customerNameElement.value = "";

        partySizeElement.value = "";

        tableElement.value = "";

        startTimeElement.value = "";

        endTimeElement.value = "";


        showCustomerPage(
            "reservations"
        );
    })

    .catch(error => {

        console.error(
            "Reservation error:",
            error
        );


        alert(
            error.message ||
            "Unable to reserve table"
        );
    });
}


// ========================================
// LOAD CUSTOMER RESERVATIONS
// ========================================

function loadCustomerReservations() {

    fetch(
        "/api/reservations/getAll"
    )

    .then(response => {

        if (!response.ok) {

            throw new Error(
                "Unable to load reservations"
            );
        }

        return response.json();
    })

    .then(data => {

        displayCustomerReservations(
            data
        );
    })

    .catch(error => {

        console.error(
            error
        );

        alert(
            error.message ||
            "Unable to load reservations"
        );
    });
}


// ========================================
// DISPLAY RESERVATIONS
// ========================================

function displayCustomerReservations(data) {

    const body =
        document.getElementById(
            "customerReservationBody"
        );


    if (!body) {
        return;
    }


    body.innerHTML = "";


    if (
        !data ||
        data.length === 0
    ) {

        body.innerHTML = `
            <tr>
                <td
                    colspan="9"
                    style="text-align:center;">
                    No reservations found
                </td>
            </tr>
        `;

        return;
    }


    data.forEach(reservation => {

        const tableNumber =
            reservation.table
                ? reservation.table.tableNumber
                : "-";


        const status =
            reservation.status ||
            "RESERVED";


        body.innerHTML += `

            <tr>

                <td>
                    #${reservation.id}
                </td>

                <td>
                    ${reservation.customerName || "-"}
                </td>

                <td>
                    Table ${tableNumber}
                </td>

                <td>
                    ${reservation.reservationDate || "-"}
                </td>

                <td>
                    ${reservation.startTime || "-"}
                </td>

                <td>
                    ${reservation.endTime || "-"}
                </td>

                <td>
                    ${reservation.partySize || "-"}
                </td>

                <td>

                    <span
                        class="status status-reserved">

                        ${status}

                    </span>

                </td>

                <td>

                    ${
                        String(status).toUpperCase()
                        === "CANCELLED"

                        ? "-"

                        : `
                            <button
                                class="delete-btn"
                                onclick="cancelCustomerReservation(${reservation.id})">

                                Cancel

                            </button>
                        `
                    }

                </td>

            </tr>
        `;
    });
}


// ========================================
// CANCEL RESERVATION
// ========================================

function cancelCustomerReservation(id) {

    if (
        !confirm(
            "Cancel this reservation?"
        )
    ) {
        return;
    }


    fetch(
        "/api/reservations/cancel/" + id,
        {
            method: "PUT"
        }
    )

    .then(async response => {

        if (!response.ok) {

            const message =
                await customerError(
                    response
                );

            throw new Error(
                message
            );
        }

        return response.text();
    })

    .then(data => {

        alert(
            "Reservation cancelled successfully"
        );


        loadCustomerReservations();

        loadCustomerTables();
    })

    .catch(error => {

        console.error(
            "Cancel reservation error:",
            error
        );


        alert(
            error.message ||
            "Unable to cancel reservation"
        );
    });
}


// ========================================
// LOAD OCCUPIED TABLES FOR ORDER
// ========================================
function loadOccupiedTables() {

    fetch("/api/tables/getAll")

        .then(response => {

            if (!response.ok) {
                throw new Error("Unable to load tables");
            }

            return response.json();
        })

        .then(data => {

            console.log("ORDER TABLE DATA:", data);

            const select =
                document.getElementById("orderTableId");

            if (!select) {
                return;
            }

            select.innerHTML = `
                <option value="" selected disabled>
                    Select your table
                </option>
            `;


            let freeTableCount = 0;


            data.forEach(table => {

                const status =
                    String(table.status || "")
                        .trim()
                        .toUpperCase();


                // ORDER ONLY FROM FREE TABLES
                if (status !== "FREE") {
                    return;
                }


                freeTableCount++;


                const option =
                    document.createElement("option");


                option.value = table.id;


                option.textContent =
                    `Table ${table.tableNumber} - ${table.capacity} people`;


                select.appendChild(option);
            });


            console.log(
                "FREE TABLES FOR ORDER:",
                freeTableCount
            );


            if (freeTableCount === 0) {

                const option =
                    document.createElement("option");

                option.value = "";

                option.textContent =
                    "No tables available";

                option.disabled = true;

                select.appendChild(option);
            }
        })

        .catch(error => {

            console.error(
                "Order table error:",
                error
            );

            alert(
                "Unable to load tables"
            );
        });
}

// ========================================
// ADD ORDER ITEM
// ========================================

function addCustomerOrderItem() {

    const container =
        document.getElementById(
            "customerOrderItems"
        );


    if (!container) {
        return;
    }


    const item =
        document.createElement(
            "div"
        );


    item.className =
        "customer-order-item";


    item.innerHTML = `

        <input
            type="text"
            class="customer-item-name"
            placeholder="Food name">


        <input
            type="number"
            class="customer-item-quantity"
            min="1"
            placeholder="Qty">


        <input
            type="number"
            class="customer-item-price"
            min="0"
            step="0.01"
            placeholder="Price">


        <button
            type="button"
            class="remove-item-btn"
            onclick="removeCustomerOrderItem(this)">

            ×

        </button>

    `;


    container.appendChild(
        item
    );


    updateCustomerOrderTotal();
}


// ========================================
// REMOVE ORDER ITEM
// ========================================

function removeCustomerOrderItem(button) {

    const items =
        document.querySelectorAll(
            ".customer-order-item"
        );


    if (
        items.length === 1
    ) {

        alert(
            "At least one item is required"
        );

        return;
    }


    button.parentElement.remove();


    updateCustomerOrderTotal();
}


// ========================================
// CALCULATE ORDER TOTAL
// ========================================

function updateCustomerOrderTotal() {

    const items =
        document.querySelectorAll(
            ".customer-order-item"
        );


    let total = 0;


    items.forEach(item => {

        const quantityElement =
            item.querySelector(
                ".customer-item-quantity"
            );


        const priceElement =
            item.querySelector(
                ".customer-item-price"
            );


        const quantity =
            Number(
                quantityElement.value
            ) || 0;


        const price =
            Number(
                priceElement.value
            ) || 0;


        total +=
            quantity * price;
    });


    const totalElement =
        document.getElementById(
            "customerOrderTotal"
        );


    if (totalElement) {

        totalElement.innerText =
            formatCustomerMoney(
                total
            );
    }
}


// ========================================
// CREATE CUSTOMER ORDER
// ========================================

function createCustomerOrder() {

    const tableElement =
        document.getElementById(
            "orderTableId"
        );


    if (!tableElement) {

        alert(
            "Order table field not found"
        );

        return;
    }


    const tableId =
        tableElement.value;


    if (tableId === "") {

        alert(
            "Please select your table"
        );

        return;
    }


    const elements =
        document.querySelectorAll(
            ".customer-order-item"
        );


    const items = [];


    for (
        const element of elements
    ) {

        const itemName =
            element.querySelector(
                ".customer-item-name"
            ).value.trim();


        const quantity =
            Number(
                element.querySelector(
                    ".customer-item-quantity"
                ).value
            );


        const price =
            Number(
                element.querySelector(
                    ".customer-item-price"
                ).value
            );


        if (
            itemName === ""
        ) {

            alert(
                "Please enter food name"
            );

            return;
        }


        if (
            quantity <= 0 ||
            isNaN(quantity)
        ) {

            alert(
                "Quantity must be greater than 0"
            );

            return;
        }


        if (
            price < 0 ||
            isNaN(price)
        ) {

            alert(
                "Price cannot be negative"
            );

            return;
        }


        items.push({

            itemName:
                itemName,

            quantity:
                quantity,

            price:
                price
        });
    }


    if (items.length === 0) {

        alert(
            "Please add at least one food item"
        );

        return;
    }


    const order = {

        table: {

            id:
                Number(tableId)
        },

        items:
            items
    };


    console.log(
        "Order Request:",
        order
    );


    fetch(
        "/api/orders/create",
        {

            method: "POST",

            headers: {

                "Content-Type":
                    "application/json"
            },

            body:
                JSON.stringify(order)
        }
    )

    .then(async response => {

        if (!response.ok) {

            const message =
                await customerError(
                    response
                );

            throw new Error(
                message
            );
        }

        return response.json();
    })

    .then(data => {

        console.log(
            "Order created:",
            data
        );


        alert(
            "Order placed successfully!"
        );


        showCustomerPage(
            "orders"
        );
    })

    .catch(error => {

        console.error(
            "Order error:",
            error
        );


        alert(
            error.message ||
            "Unable to place order"
        );
    });
}


// ========================================
// LOAD CUSTOMER ORDERS
// ========================================

function loadCustomerOrders() {

    fetch(
        "/api/orders/getAll"
    )

    .then(response => {

        if (!response.ok) {

            throw new Error(
                "Unable to load orders"
            );
        }

        return response.json();
    })

    .then(data => {

        displayCustomerOrders(
            data
        );
    })

    .catch(error => {

        console.error(
            error
        );

        alert(
            error.message ||
            "Unable to load orders"
        );
    });
}


// ========================================
// DISPLAY CUSTOMER ORDERS
// ========================================

function displayCustomerOrders(data) {

    const body =
        document.getElementById(
            "customerOrderBody"
        );


    if (!body) {
        return;
    }


    body.innerHTML = "";


    if (
        !data ||
        data.length === 0
    ) {

        body.innerHTML = `
            <tr>

                <td
                    colspan="5"
                    style="text-align:center;">

                    No orders found

                </td>

            </tr>
        `;

        return;
    }


    data.forEach(order => {

        const tableNumber =
            order.table
                ? order.table.tableNumber
                : "-";


        const items =
            order.items || [];


        let itemText = "";


        items.forEach(item => {

            itemText +=
                `${item.itemName} (${item.quantity}), `;
        });


        itemText =
            itemText.replace(
                /, $/,
                ""
            );


        body.innerHTML += `

            <tr>

                <td>
                    #${order.id}
                </td>

                <td>
                    Table ${tableNumber}
                </td>

                <td>
                    ${formatCustomerDateTime(
                        order.orderTime
                    )}
                </td>

                <td>
                    ${itemText || "-"}
                </td>

                <td>

                    <span
                        class="status status-order">

                        ${order.status || "-"}

                    </span>

                </td>

            </tr>
        `;
    });
}


// ========================================
// UPDATE ORDER TOTAL WHILE TYPING
// ========================================

document.addEventListener(
    "input",
    function(event) {

        if (
            event.target.classList.contains(
                "customer-item-quantity"
            )
            ||
            event.target.classList.contains(
                "customer-item-price"
            )
        ) {

            updateCustomerOrderTotal();
        }
    }
);


// ========================================
// TABLE CHANGE - SHOW CAPACITY
// ========================================

document.addEventListener(
    "change",
    function(event) {

        if (
            event.target.id !==
            "reservationTableId"
        ) {
            return;
        }


        const tableId =
            event.target.value;


        const partyInput =
            document.getElementById(
                "partySize"
            );


        if (
            !tableId ||
            !partyInput
        ) {
            return;
        }


        const selectedTable =
            customerTables.find(
                table =>
                    Number(table.id) ===
                    Number(tableId)
            );


        if (!selectedTable) {
            return;
        }


        partyInput.max =
            selectedTable.capacity;


        if (
            Number(partyInput.value) >
            Number(selectedTable.capacity)
        ) {

            partyInput.value =
                selectedTable.capacity;
        }
    }
);


// ========================================
// INITIAL PAGE
// ========================================

window.onload = function() {

    showCustomerPage(
        "home"
    );

};