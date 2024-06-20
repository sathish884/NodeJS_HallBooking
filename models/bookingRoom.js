const mongoose = require("mongoose");

const roomBookingSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: [true, 'Customer name is required']
    },
    room: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Room',
        required: [true, 'Room ID is required']
    },
    bookingDate: {
        type: Date,
        required: [true, 'Booking date is required']
    },
    startTime: {
        type: Date,
        required: [true, 'Start time is required']
    },
    endTime: {
        type: Date,
        required: [true, 'End time is required']
    },
    status: {
        type: String,
        enum: ['confirmed', 'pending', 'cancelled'],
        default: 'confirmed'
    }
}, {
    timestamps: true
});

const BookedRoom = mongoose.model("BookedRooms", roomBookingSchema);

module.exports = BookedRoom;