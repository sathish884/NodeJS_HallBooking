const mongoose = require("mongoose");

const bookedRoomShema = new mongoose.Schema({
    cutomerName: {
        type: String,
        required: true
    },
    date: {

    },
    startTime: {

    },
    endTime: {

    },
    roomId: {

    }
});

const BookedRoom = mongoose.model("bookedRooms", bookedRoomShema);

module.exports = BookedRoom;