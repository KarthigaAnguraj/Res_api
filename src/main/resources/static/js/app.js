// ========================================
// GLOBAL DATA
// ========================================

let tables = [];


// ========================================
// HELPER FUNCTIONS
// ========================================

function getElementValue(id) {

    const element = document.getElementById(id);

    if (!element) {
        return "";
    }

    return element.value;
}


function formatDateTime(value) {

    if (!value) {
        return "-";
    }

    const date = new Date(value);

    if (isNaN(date.getTime())) {
        return value;
    }

    return date.toLocaleString();
}


function formatMoney(value) {

    if (value === null || value === undefined) {
        return "₹0.00";
    }

    return "₹" + Number(value).toFixed(2);
}


async function getErrorMessage(response) {

    try {

        const data = await response.json();

        if (data.message) {
            return data.message;
        }

        if (data.error) {
            return data.error;
        }

        return "Something went wrong";

    } catch (error) {

        return "Something went wrong";

    }
}


// ========================================
// PAGE NAVIGATION
// ========================================

function showPage(page) {

    const pages = [
        "dashboardPage",
        "tablesPage",
        "reservationsPage",
        "ordersPage",
        "billsPage"
    ];


    pages.forEach(pageId => {

        const element = document.getElementById(pageId);

        if (element) {
            element.classList.add("hidden");
        }

    });


    const navItems =
        document.querySelectorAll(".nav-item");


    navItems.forEach(item => {

        item.classList.remove("active");

    });


    if (page === "dashboard") {

        document
            .getElementById("dashboardPage")
            .classList.remove("hidden");

        document.getElementById("pageTitle").innerText =
            "Dashboard";

        document.getElementById("pageSubtitle").innerText =
            "Welcome to Table Turn";

        if (navItems[0]) {
            navItems[0].classList.add("active");
        }

        loadDashboard();
    }


    if (page === "tables") {

        document
            .getElementById("tablesPage")
            .classList.remove("hidden");

        document.getElementById("pageTitle").innerText =
            "Restaurant Tables";

        document.getElementById("pageSubtitle").innerText =
            "Manage all restaurant tables";

        if (navItems[1]) {
            navItems[1].classList.add("active");
        }

        getTables();
    }


    if (page === "reservations") {

        document
            .getElementById("reservationsPage")
            .classList.remove("hidden");

        document.getElementById("pageTitle").innerText =
            "Reservations";

        document.getElementById("pageSubtitle").innerText =
            "Manage restaurant reservations";

        if (navItems[2]) {
            navItems[2].classList.add("active");
        }

        loadReservations();
    }


    if (page === "orders") {

        document
            .getElementById("ordersPage")
            .classList.remove("hidden");

        document.getElementById("pageTitle").innerText =
            "Orders";

        document.getElementById("pageSubtitle").innerText =
            "Manage customer orders";

        if (navItems[3]) {
            navItems[3].classList.add("active");
        }

        loadOrders();
    }


    if (page === "bills") {

        document
            .getElementById("billsPage")
            .classList.remove("hidden");

        document.getElementById("pageTitle").innerText =
            "Billing";

        document.getElementById("pageSubtitle").innerText =
            "Generate bills and view billing history";

        if (navItems[4]) {
            navItems[4].classList.add("active");
        }

        loadBillingPage();
    }

}


// ========================================
// DASHBOARD
// ========================================

function updateDashboardCards(data) {

    const total = data.length;


    const available =
        data.filter(
            table =>
                String(table.status).toUpperCase() === "FREE"
        ).length;


    const reserved =
        data.filter(
            table =>
                String(table.status).toUpperCase() === "RESERVED"
        ).length;


    const occupied =
        data.filter(
            table =>
                String(table.status).toUpperCase() === "OCCUPIED"
        ).length;


    const totalElement =
        document.getElementById("totalTables");

    const availableElement =
        document.getElementById("availableTables");

    const reservedElement =
        document.getElementById("reservedTables");

    const occupiedElement =
        document.getElementById("occupiedTables");


    if (totalElement) {
        totalElement.innerText = total;
    }

    if (availableElement) {
        availableElement.innerText = available;
    }

    if (reservedElement) {
        reservedElement.innerText = reserved;
    }

    if (occupiedElement) {
        occupiedElement.innerText = occupied;
    }

}


function loadDashboard() {

    fetch("/api/tables/getAll")

        .then(response => {

            if (!response.ok) {
                throw new Error("Unable to load dashboard");
            }

            return response.json();

        })

        .then(data => {

            tables = data;

            updateDashboardCards(data);

        })

        .catch(error => {

            console.error(error);

        });

}


// ========================================
// TABLES
// ========================================

function getTables() {

    fetch("/api/tables/getAll")

        .then(response => {

            if (!response.ok) {
                throw new Error("Unable to get tables");
            }

            return response.json();

        })

        .then(data => {

            tables = data;

            displayTables(data);

            updateDashboardCards(data);

        })

        .catch(error => {

            console.error(error);

            alert("Unable to load tables");

        });

}


function displayTables(data) {

    const tableBody =
        document.getElementById("tableBody");


    if (!tableBody) {
        return;
    }


    tableBody.innerHTML = "";


    if (data.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="5" style="text-align:center;">
                    No tables found
                </td>
            </tr>
        `;

        return;
    }


    data.forEach(table => {

        let statusClass = "status-free";

        const status =
            String(table.status || "FREE").toUpperCase();


        if (status === "RESERVED") {
            statusClass = "status-reserved";
        }


        if (status === "OCCUPIED") {
            statusClass = "status-occupied";
        }


        tableBody.innerHTML += `

            <tr>

                <td>
                    #${table.id}
                </td>

                <td>
                    <strong>
                        Table ${table.tableNumber}
                    </strong>
                </td>

                <td>
                    ${table.capacity} People
                </td>

                <td>

                    <span class="status ${statusClass}">
                        ${status}
                    </span>

                </td>

                <td>

                    <button
                        class="edit-btn"
                        onclick="openEditModal(${table.id})">

                        Edit

                    </button>

                    <button
                        class="delete-btn"
                        onclick="deleteTable(${table.id})">

                        Delete

                    </button>

                </td>

            </tr>

        `;

    });

}


// ========================================
// TABLE CREATE
// ========================================

function openAddModal() {

    document
        .getElementById("addModal")
        .classList.remove("hidden");

}


function closeAddModal() {

    document
        .getElementById("addModal")
        .classList.add("hidden");

}


function createTable() {

    const tableNumber =
        getElementValue("tableNumber");

    const capacity =
        getElementValue("capacity");


    if (tableNumber === "" || capacity === "") {

        alert(
            "Please enter table number and capacity"
        );

        return;
    }


    if (Number(tableNumber) <= 0) {

        alert("Table number must be greater than 0");

        return;
    }


    if (Number(capacity) <= 0) {

        alert("Capacity must be greater than 0");

        return;
    }


    const duplicate =
        tables.some(
            table =>
                Number(table.tableNumber) ===
                Number(tableNumber)
        );


    if (duplicate) {

        alert(
            "This table number already exists"
        );

        return;
    }


    const table = {

        tableNumber:
            Number(tableNumber),

        capacity:
            Number(capacity)

    };


    fetch("/api/tables/create", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(table)

    })

        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "Unable to create table"
                );
            }

            return response.json();

        })

        .then(data => {

            alert(
                "Table created successfully"
            );

            closeAddModal();

            getTables();

        })

        .catch(error => {

            console.error(error);

            alert(
                "Unable to create table"
            );

        });

}


// ========================================
// TABLE UPDATE
// ========================================

function openEditModal(id) {

    const table =
        tables.find(item => item.id === id);


    if (!table) {

        alert("Table not found");

        return;
    }


    document.getElementById("editId").value =
        table.id;

    document.getElementById("editTableNumber").value =
        table.tableNumber;

    document.getElementById("editCapacity").value =
        table.capacity;

    document.getElementById("editStatus").value =
        table.status;


    document
        .getElementById("editModal")
        .classList.remove("hidden");

}


function closeEditModal() {

    document
        .getElementById("editModal")
        .classList.add("hidden");

}


function saveUpdate() {

    const id =
        document.getElementById("editId").value;


    const tableNumber =
        document.getElementById(
            "editTableNumber"
        ).value;


    const capacity =
        document.getElementById(
            "editCapacity"
        ).value;


    const status =
        document.getElementById(
            "editStatus"
        ).value;


    if (
        tableNumber === "" ||
        capacity === ""
    ) {

        alert(
            "Please fill all table details"
        );

        return;
    }


    const table = {

        tableNumber:
            Number(tableNumber),

        capacity:
            Number(capacity),

        status:
            status

    };


    fetch("/api/tables/update/" + id, {

        method: "PUT",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(table)

    })

        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "Unable to update table"
                );
            }

            return response.json();

        })

        .then(data => {

            alert(
                "Table updated successfully"
            );

            closeEditModal();

            getTables();

        })

        .catch(error => {

            console.error(error);

            alert(
                "Unable to update table"
            );

        });

}


// ========================================
// TABLE DELETE
// ========================================

function deleteTable(id) {

    if (!confirm(
        "Are you sure you want to delete this table?"
    )) {

        return;
    }


    fetch(
        "/api/tables/delete/" + id,
        {
            method: "DELETE"
        }
    )

        .then(async response => {

            if (!response.ok) {

                const message =
                    await getErrorMessage(response);

                throw new Error(message);
            }

            return response.text();

        })

        .then(data => {

            alert(
                "Table deleted successfully"
            );

            getTables();

        })

        .catch(error => {

            console.error(error);

            alert(
                error.message ||
                "Unable to delete table"
            );

        });

}


// ========================================
// RESERVATIONS
// ========================================

function loadReservations() {

    fetch("/api/reservations/getAll")

        .then(response => {

            if (!response.ok) {
                throw new Error(
                    "Unable to load reservations"
                );
            }

            return response.json();

        })

        .then(data => {

            displayReservations(data);

        })

        .catch(error => {

            console.error(error);

            alert(
                "Unable to load reservations"
            );

        });

}


function displayReservations(data) {

    const body =
        document.getElementById(
            "reservationBody"
        );


    if (!body) {
        return;
    }


    body.innerHTML = "";


    if (data.length === 0) {

        body.innerHTML = `

            <tr>

                <td colspan="8"
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


        const startTime =
            formatDateTime(
                reservation.startTime
            );


        const endTime =
            formatDateTime(
                reservation.endTime
            );


        const status =
            reservation.status || "CONFIRMED";


        body.innerHTML += `

            <tr>

                <td>
                    #${reservation.id}
                </td>

                <td>
                    <strong>
                        ${reservation.customerName || "-"}
                    </strong>
                </td>

                <td>
                    Table ${tableNumber}
                </td>

                <td>
                    ${startTime}
                </td>

                <td>
                    ${endTime}
                </td>

                <td>
                    ${reservation.partySize || "-"}
                </td>

                <td>

                    <span class="status status-reserved">
                        ${status}
                    </span>

                </td>

                <td>

                    <button
                        class="delete-btn"
                        onclick="deleteReservation(${reservation.id})">

                        Delete

                    </button>

                </td>

            </tr>

        `;

    });

}


// ========================================
// RESERVATION MODAL
// ========================================

function openReservationModal() {

    document
        .getElementById("reservationModal")
        .classList.remove("hidden");

}


function closeReservationModal() {

    document
        .getElementById("reservationModal")
        .classList.add("hidden");

}


// ========================================
// CREATE RESERVATION
// ========================================

function createReservation() {

    const tableId =
        getElementValue(
            "reservationTableId"
        );


    const customerName =
        getElementValue(
            "customerName"
        );


    const partySize =
        getElementValue(
            "partySize"
        );


    /*
     * We support the new start/end field names.
     *
     * If your HTML uses reservationStartTime /
     * reservationEndTime, those are also supported.
     */

    let startTime =
        getElementValue("startTime");


    let endTime =
        getElementValue("endTime");


    if (startTime === "") {

        startTime =
            getElementValue(
                "reservationStartTime"
            );
    }


    if (endTime === "") {

        endTime =
            getElementValue(
                "reservationEndTime"
            );
    }


    if (tableId === "") {

        alert(
            "Please enter table ID"
        );

        return;
    }


    if (customerName.trim() === "") {

        alert(
            "Please enter customer name"
        );

        return;
    }


    if (
        partySize === "" ||
        Number(partySize) <= 0
    ) {

        alert(
            "Please enter a valid party size"
        );

        return;
    }


    if (startTime === "" || endTime === "") {

        alert(
            "Please enter start time and end time"
        );

        return;
    }


    const reservation = {

        customerName:
            customerName.trim(),

        partySize:
            Number(partySize),

        startTime:
            startTime,

        endTime:
            endTime,

        table: {

            id:
                Number(tableId)

        }

    };


    fetch("/api/reservations/create", {

        method: "POST",

        headers: {

            "Content-Type":
                "application/json"

        },

        body:
            JSON.stringify(reservation)

    })

        .then(async response => {

            if (!response.ok) {

                const message =
                    await getErrorMessage(response);

                throw new Error(message);
            }

            return response.json();

        })

        .then(data => {

            alert(
                "Reservation created successfully"
            );

            closeReservationModal();

            loadReservations();

        })

        .catch(error => {

            console.error(error);

            alert(
                error.message ||
                "Unable to create reservation"
            );

        });

}


// ========================================
// DELETE RESERVATION
// ========================================

function deleteReservation(id) {

    if (!confirm(
        "Are you sure you want to delete this reservation?"
    )) {

        return;
    }


    fetch(
        "/api/reservations/delete/" + id,
        {
            method: "DELETE"
        }
    )

        .then(async response => {

            if (!response.ok) {

                const message =
                    await getErrorMessage(response);

                throw new Error(message);
            }

            return response.text();

        })

        .then(data => {

            alert(
                "Reservation deleted successfully"
            );

            loadReservations();

        })

        .catch(error => {

            console.error(error);

            alert(
                error.message ||
                "Unable to delete reservation"
            );

        });

}


// ========================================
// ORDERS
// ========================================

function loadOrders() {

    fetch("/api/orders/getAll")

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Unable to load orders"
                );
            }

            return response.json();

        })

        .then(data => {

            displayOrders(data);

        })

        .catch(error => {

            console.error(error);

            alert(
                "Unable to load orders"
            );

        });

}


// ========================================
// DISPLAY ORDERS
// ========================================

function displayOrders(data) {

    const body =
        document.getElementById(
            "orderBody"
        );


    if (!body) {
        return;
    }


    body.innerHTML = "";


    if (data.length === 0) {

        body.innerHTML = `

            <tr>

                <td colspan="6"
                    style="text-align:center;">

                    No orders found

                </td>

            </tr>

        `;

        return;
    }


    data.forEach(order => {

        const items =
            order.items || [];


        let itemText = "";


        items.forEach(item => {

            itemText +=
                `${item.itemName} (${item.quantity}), `;

        });


        itemText =
            itemText.replace(/, $/, "");


        const tableNumber =
            order.table
                ? order.table.tableNumber
                : "-";


        const orderTime =
            formatDateTime(
                order.orderTime
            );


        const status =
            order.status || "-";


        body.innerHTML += `

            <tr>

                <td>
                    #${order.id}
                </td>

                <td>
                    Table ${tableNumber}
                </td>

                <td>
                    ${orderTime}
                </td>

                <td>
                    ${itemText || "-"}
                </td>

                <td>

                    <span class="status status-order">
                        ${status}
                    </span>

                </td>

                <td>

                    <button
                        class="delete-btn"
                        onclick="deleteOrder(${order.id})">

                        Delete

                    </button>

                </td>

            </tr>

        `;

    });

}


// ========================================
// OPEN ORDER MODAL
// ========================================

function openOrderModal() {

    document
        .getElementById("orderModal")
        .classList.remove("hidden");


    const orderItems =
        document.getElementById(
            "orderItems"
        );


    orderItems.innerHTML = `

        <div class="order-item">

            <input
                type="text"
                class="item-name"
                placeholder="Item name">

            <input
                type="number"
                class="item-quantity"
                placeholder="Qty"
                min="1">

            <input
                type="number"
                class="item-price"
                placeholder="Price"
                min="0"
                step="0.01">

            <button
                class="remove-item"
                onclick="removeOrderItem(this)">

                ×

            </button>

        </div>

    `;

}


// ========================================
// CLOSE ORDER MODAL
// ========================================

function closeOrderModal() {

    document
        .getElementById("orderModal")
        .classList.add("hidden");


    const tableInput =
        document.getElementById(
            "orderTableId"
        );


    if (tableInput) {
        tableInput.value = "";
    }


    const items =
        document.getElementById(
            "orderItems"
        );


    if (items) {
        items.innerHTML = "";
    }

}


// ========================================
// ADD ORDER ITEM
// ========================================

function addOrderItem() {

    const container =
        document.getElementById(
            "orderItems"
        );


    const item =
        document.createElement("div");


    item.className =
        "order-item";


    item.innerHTML = `

        <input
            type="text"
            class="item-name"
            placeholder="Item name">

        <input
            type="number"
            class="item-quantity"
            placeholder="Qty"
            min="1">

        <input
            type="number"
            class="item-price"
            placeholder="Price"
            min="0"
            step="0.01">

        <button
            class="remove-item"
            onclick="removeOrderItem(this)">

            ×

        </button>

    `;


    container.appendChild(item);

}


// ========================================
// REMOVE ORDER ITEM
// ========================================

function removeOrderItem(button) {

    const items =
        document.querySelectorAll(
            ".order-item"
        );


    if (items.length === 1) {

        alert(
            "At least one item is required"
        );

        return;
    }


    button.parentElement.remove();

}


// ========================================
// CREATE ORDER
// ========================================

function createOrder() {

    const tableId =
        getElementValue(
            "orderTableId"
        );


    if (tableId === "") {

        alert(
            "Please enter table ID"
        );

        return;
    }


    const itemElements =
        document.querySelectorAll(
            ".order-item"
        );


    if (itemElements.length === 0) {

        alert(
            "Please add at least one item"
        );

        return;
    }


    const orderItems = [];


    for (const element of itemElements) {

        const itemName =
            element.querySelector(
                ".item-name"
            ).value.trim();


        const quantity =
            element.querySelector(
                ".item-quantity"
            ).value;


        const price =
            element.querySelector(
                ".item-price"
            ).value;


        if (
            itemName === "" ||
            quantity === "" ||
            price === ""
        ) {

            alert(
                "Please fill all item details"
            );

            return;
        }


        const qty =
            Number(quantity);


        const itemPrice =
            Number(price);


        if (qty <= 0) {

            alert(
                "Quantity must be greater than 0"
            );

            return;
        }


        if (itemPrice < 0) {

            alert(
                "Price cannot be negative"
            );

            return;
        }


        /*
         * IMPORTANT:
         *
         * Backend expects:
         *
         * itemName
         * quantity
         * price
         *
         * NOT:
         *
         * unitPrice
         * subtotal
         */

        orderItems.push({

            itemName:
                itemName,

            quantity:
                qty,

            price:
                itemPrice

        });

    }


    /*
     * Backend expects:
     *
     * table: { id: tableId }
     * items: [...]
     *
     * Backend automatically sets:
     *
     * status = OPEN
     * orderTime = current time
     */

    const order = {

        table: {

            id:
                Number(tableId)

        },

        items:
            orderItems

    };


    fetch("/api/orders/create", {

        method: "POST",

        headers: {

            "Content-Type":
                "application/json"

        },

        body:
            JSON.stringify(order)

    })

        .then(async response => {

            if (!response.ok) {

                const message =
                    await getErrorMessage(response);

                throw new Error(message);
            }

            return response.json();

        })

        .then(data => {

            alert(
                "Order created successfully"
            );

            closeOrderModal();

            loadOrders();

            getTables();

            loadDashboard();

        })

        .catch(error => {

            console.error(error);

            alert(
                error.message ||
                "Unable to create order"
            );

        });

}


// ========================================
// DELETE ORDER
// ========================================

function deleteOrder(id) {

    if (!confirm(
        "Are you sure you want to delete this order?"
    )) {

        return;
    }


    fetch(
        "/api/orders/delete/" + id,
        {
            method: "DELETE"
        }
    )

        .then(async response => {

            if (!response.ok) {

                const message =
                    await getErrorMessage(response);

                throw new Error(message);
            }

            return response.text();

        })

        .then(data => {

            alert(
                "Order deleted successfully"
            );

            loadOrders();

            getTables();

            loadDashboard();

        })

        .catch(error => {

            console.error(error);

            alert(
                error.message ||
                "Unable to delete order"
            );

        });

}


// ========================================
// BILLING PAGE
// ========================================

function loadBillingPage() {

    loadBillingTables();

    loadBills();

}


// ========================================
// LOAD TABLES READY FOR BILLING
// ========================================

function loadBillingTables() {

    fetch("/api/tables/getAll")

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Unable to load billing tables"
                );
            }

            return response.json();

        })

        .then(data => {

            tables = data;

            displayBillingTables(data);

        })

        .catch(error => {

            console.error(error);

            const container =
                document.getElementById(
                    "billingTables"
                );


            if (container) {

                container.innerHTML = `

                    <div class="empty-state">

                        <h3>
                            Unable to load tables
                        </h3>

                    </div>

                `;

            }

        });

}


// ========================================
// DISPLAY TABLES READY FOR BILLING
// ========================================

function displayBillingTables(data) {

    const container =
        document.getElementById(
            "billingTables"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    const occupiedTables =
        data.filter(
            table =>
                String(table.status).toUpperCase()
                === "OCCUPIED"
        );


    if (occupiedTables.length === 0) {

        container.innerHTML = `

            <div class="empty-state">

                <h3>
                    No Tables Ready for Billing
                </h3>

                <p>
                    There are currently no occupied tables.
                </p>

            </div>

        `;

        return;
    }


    occupiedTables.forEach(table => {

        container.innerHTML += `

            <div class="billing-card">

                <div>

                    <h3>
                        Table ${table.tableNumber}
                    </h3>

                    <p>
                        Capacity: ${table.capacity}
                    </p>

                    <span class="status status-occupied">
                        OCCUPIED
                    </span>

                </div>

                <div>

                    <button
                        class="primary-btn"
                        onclick="generateBill(${table.id})">

                        Generate Bill

                    </button>

                </div>

            </div>

        `;

    });

}


// ========================================
// GENERATE BILL
// ========================================

function generateBill(tableId) {

    if (!confirm(
        "Generate bill for this table?"
    )) {

        return;
    }


    fetch(
        "/api/bills/generate/" + tableId,
        {
            method: "POST"
        }
    )

        .then(async response => {

            if (!response.ok) {

                const message =
                    await getErrorMessage(response);

                throw new Error(message);
            }

            return response.json();

        })

        .then(data => {

            alert(
                "Bill generated successfully\n\n" +
                "Bill ID: #" + data.id +
                "\nTotal: " +
                formatMoney(data.totalAmount)
            );


            loadBillingPage();

            getTables();

            loadDashboard();

            loadOrders();

        })

        .catch(error => {

            console.error(error);

            alert(
                error.message ||
                "Unable to generate bill"
            );

        });

}


// ========================================
// LOAD BILL HISTORY
// ========================================

function loadBills() {

    fetch("/api/bills/getAll")

        .then(response => {

            if (!response.ok) {

                throw new Error(
                    "Unable to load bills"
                );
            }

            return response.json();

        })

        .then(data => {

            displayBills(data);

        })

        .catch(error => {

            console.error(error);

            const body =
                document.getElementById(
                    "billBody"
                );


            if (body) {

                body.innerHTML = `

                    <tr>

                        <td
                            colspan="4"
                            style="text-align:center;">

                            Unable to load bills

                        </td>

                    </tr>

                `;

            }

        });

}


// ========================================
// DISPLAY BILL HISTORY
// ========================================

function displayBills(data) {

    const body =
        document.getElementById(
            "billBody"
        );


    if (!body) {
        return;
    }


    body.innerHTML = "";


    if (data.length === 0) {

        body.innerHTML = `

            <tr>

                <td
                    colspan="4"
                    style="text-align:center;">

                    No bills found

                </td>

            </tr>

        `;

        return;
    }


    data.forEach(bill => {

        const tableNumber =
            bill.table
                ? bill.table.tableNumber
                : "-";


        const billTime =
            formatDateTime(
                bill.billTime
            );


        body.innerHTML += `

            <tr>

                <td>
                    #${bill.id}
                </td>

                <td>
                    Table ${tableNumber}
                </td>

                <td>
                    <strong>
                        ${formatMoney(
                            bill.totalAmount
                        )}
                    </strong>
                </td>

                <td>
                    ${billTime}
                </td>

            </tr>

        `;

    });

}


// ========================================
// INITIAL LOAD
// ========================================

window.onload = function () {

    loadDashboard();

};