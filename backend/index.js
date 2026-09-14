const express = require("express");
const cors = require("cors");
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());
app.use(express.json());

//routes
const productRoutes = require("./routes/product.routes");
app.use("/api/products", productRoutes);

app.get('/',(req, res)=>{
    res.send("Server is running");
})

app.listen(PORT, ()=>{
    console.log(`Server is running on port http://localhost:${PORT}`);
})