const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require("mongoose");
const roomBookingRouter = require("./routes/roomBooking");

require("dotenv").config();

const app = express();
app.use(bodyparser.json());
const PORT = process.env.PORT;

app.use("/api", roomBookingRouter);

mongoose.connect(process.env.MONGODB).then(() => {
    console.log("MongoDB conneted");
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })
}).catch(error => {
    console.log("Connection was failed ", error);
})