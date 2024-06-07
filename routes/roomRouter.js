const express = require("express");
const Room = require("../models/room");

const router = express.Router();

router.post("/createdRoom", async (req, res) => {
    try {
        const room = new Room(req.body);
        await room.save();
        res.status(200).json({
            message: "Successfully created",
            data: room
        })
    } catch (error) {
        res.status(500).json({ errorMsg: error });
    }
});

module.express = router;