const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.get('/',(req, res)=>{
    res.send("Server is running");
})

app.listen(3000, ()=>{
    console.log("Server is running on port http://localhost:3000");
})