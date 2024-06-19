const mongoose = require("mongoose");

const roomShema = new mongoose.Schema({
    seats: { type: Number, required: true },
    amenities: [String],
    price: { type: Number }
})

module.exports = mongoose.model("Room", roomShema)