const express = require("express");
const cors = require("cors");
const app = express();
const port = 8000;
const connection = require('./database/db');
const router = require('./Routes/route');
const bodyParser = require("body-parser");

app.use(express.json());
app.use(cors());
app.use(router);
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

connection();


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})