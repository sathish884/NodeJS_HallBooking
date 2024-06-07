const express = require("express");
const RoomBooking = require("../models/bookingRoom");

const router = express.Router();

router.post("/bookingRoom", async (req, res) => {
    try {
        const bookedRoom = new RoomBooking(req.body);
        await bookedRoom.save();
        res.status(200).json({
            message: "Room was succefully booked",
        })
    } catch (error) {
        res.status(500).json({
            errorMsg: error
        })
    }
});

module.express = router;