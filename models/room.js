const mongoose = require("mongoose");

const roomShema = new mongoose.Schema({
    roomName: { type: String, required: true },
    seats: { type: Number, required: true },
    amenities: [String],
    price: { type: Number }
})

module.exports = mongoose.model("Room", roomShema)