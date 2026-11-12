// A quick end-to-end check of the whole shopping flow.
//
// 1. Start MongoDB and the server (`npm run dev`) and run `npm run seed`
// 2. In another terminal run:  npm run smoke
//
// It creates a throw-away user, then registers -> adds to cart -> checks out
// -> pays -> cancels, and prints a tick for every step that works.
// (Run it against a development database, it leaves the test user behind.)

const BASE = process.env.API_URL || "http://localhost:3000/api";

let failed = 0;

const check = (name, condition) => {
    console.log(`${condition ? "PASS" : "FAIL"}  ${name}`);
    if (!condition) failed++;
};

// Small helper: calls the API and returns { status, data }
const call = async (method, path, body, token) => {
    const response = await fetch(BASE + path, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
    });
    return { status: response.status, data: await response.json() };
};

const run = async () => {
    // Auth
    const email = `smoke-${Date.now()}@example.com`;
    const registered = await call("POST", "/auth/register", { name: "Smoke Tester", email, password: "secret123" });
    check("register returns 201 and a token", registered.status === 201 && !!registered.data.token);
    const token = registered.data.token;

    const duplicate = await call("POST", "/auth/register", { name: "Again", email, password: "secret123" });
    check("registering the same email twice is rejected", duplicate.status === 400);

    const badLogin = await call("POST", "/auth/login", { email, password: "wrong-password" });
    check("login with a wrong password is rejected", badLogin.status === 400);

    const login = await call("POST", "/auth/login", { email, password: "secret123" });
    check("login works", login.status === 200 && !!login.data.token);

    // Protected routes need a token
    const noToken = await call("GET", "/cart");
    check("cart without a token gives 401", noToken.status === 401);

    // Products
    const list = await call("GET", "/products");
    const product = list.data.products.find((p) => p.stock >= 3);
    check("products are listed (did you run `npm run seed`?)", list.status === 200 && !!product);
    if (!product) return;

    // Cart
    const added = await call("POST", "/cart/items", { productId: product._id, quantity: 2 }, token);
    check("add to cart", added.status === 200 && added.data.items.length === 1 && added.data.items[0].quantity === 2);

    const tooMany = await call("POST", "/cart/items", { productId: product._id, quantity: product.stock + 1 }, token);
    check("can not add more than the stock", tooMany.status === 400);

    const updated = await call("PUT", `/cart/items/${product._id}`, { quantity: 3 }, token);
    check("update quantity, total is price x 3", updated.status === 200 && Math.abs(updated.data.total - product.price * 3) < 0.01);

    // Checkout
    const emptyAddress = await call("POST", "/orders", { shippingAddress: {} }, token);
    check("checkout without an address is rejected", emptyAddress.status === 400);

    const address = { fullName: "Smoke Tester", phone: "9999999999", address: "1 Test Street", city: "Pune", postalCode: "411001" };
    const order = await call("POST", "/orders", { shippingAddress: address }, token);
    check("checkout creates an order", order.status === 201 && order.data.status === "processing" && order.data.paymentStatus === "pending");

    const cartAfter = await call("GET", "/cart", null, token);
    check("cart is empty after checkout", cartAfter.data.items.length === 0);

    const stockAfter = await call("GET", `/products/${product._id}`);
    check("stock went down by 3", stockAfter.data.stock === product.stock - 3);

    const emptyCheckout = await call("POST", "/orders", { shippingAddress: address }, token);
    check("checking out an empty cart is rejected", emptyCheckout.status === 400);

    // Payment
    const paid = await call("POST", `/orders/${order.data._id}/pay`, { method: "card" }, token);
    check("pay by card marks the order paid", paid.status === 200 && paid.data.paymentStatus === "paid");

    const paidTwice = await call("POST", `/orders/${order.data._id}/pay`, { method: "card" }, token);
    check("paying twice is rejected", paidTwice.status === 400);

    // Orders list + cancel
    const orders = await call("GET", "/orders", null, token);
    check("order shows up in My Orders", orders.status === 200 && orders.data.length === 1);

    const cancelled = await call("PATCH", `/orders/${order.data._id}/cancel`, null, token);
    check("cancel works and refunds a paid order", cancelled.status === 200 && cancelled.data.status === "cancelled" && cancelled.data.paymentStatus === "refunded");

    const stockBack = await call("GET", `/products/${product._id}`);
    check("stock is back after cancelling", stockBack.data.stock === product.stock);

    const cancelTwice = await call("PATCH", `/orders/${order.data._id}/cancel`, null, token);
    check("cancelling twice is rejected", cancelTwice.status === 400);
};

run()
    .catch((error) => {
        console.error("Could not run the test. Is the server running?", error.message);
        failed++;
    })
    .finally(() => {
        console.log(failed === 0 ? "\nAll checks passed." : `\n${failed} check(s) failed.`);
        process.exitCode = failed === 0 ? 0 : 1;
    });
