const mongoose = require("mongoose");

const bookedRoomShema = new mongoose.Schema({
    cutomerName: { type: String, required: true },
    bookingDate: { type: Date, default: Date.now() },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'canceled'],
        default: 'pending'
    }
});

const BookedRoom = mongoose.model("BookedRooms", bookedRoomShema);

module.exports = BookedRoom;