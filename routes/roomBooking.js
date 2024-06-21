const express = require("express");
const Room = require("../models/room");
const RoomBooking = require("../models/bookingRoom");

const router = express.Router();

// room created
router.post("/createdRoom", async (req, res) => {
    try {
        const room = new Room(req.body);
        await room.save();
        res.status(200).json({ message: "Successfully room created", });
    } catch (error) {
        res.status(500).json({ errorMsg: error });
    }
});

// booking room
router.post("/bookingRoom", async (req, res) => {
    try {
        const { customer, roomIds, startTimes, endTimes, bookingDate } = req.body;

        const exisitingBookings = await RoomBooking.find({
            room: roomIds,
            $or: [
                { startTime: { $lt: endTimes, $gte: startTimes } },
                { endTime: { $lte: endTimes, gt: startTimes } }
            ]
        });
        if (exisitingBookings.length > 0) {
            res.status(400).json({ message: 'Room is already booked for the selected time.' });
        }
        const bookedRoom = new RoomBooking({
            customerName: customer,
            room: roomIds,
            bookingDate: new Date.now(bookingDate).toString(),
            startTime: new Date.now(startTimes),
            endTime: new Date.now(endTimes),
            status: 'confirmed'
        });
        await bookedRoom.save();
        res.status(200).json({ message: "Room was succefully booked" })
    } catch (error) {
        res.status(500).json({ errorMsg: error.message })
    }
});

// List all booked rooms
router.get('/bookingroom-list', async (req, res) => {
    try {
        const bookingRooms = await Booking.find({}).populate('room');
        res.status(200).json({ data: bookingRooms });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// List out specific room booked lists 
router.get("/rooms/:roomId/bookings", async (req, res) => {
    try {
        const roomId = req.params.roomId;
        const bookings = await RoomBooking.find({ room: roomId }).populate("room");
        res.status(200).json({ data: bookings })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// List out cutomer wise room booked lists 
router.get("/bookingRoom/:cutomerName/bookings", async (req, res) => {
    try {
        const cutomerName = req.params.cutomerName;
        const bookings = await RoomBooking.find({ cutomerName }).populate("room");
        const formattedBookings = bookings.map((data) => ({
            bookingId: data._id,
            customerName: data.customerName,
            roomName: data.room.name,
            bookingDate: data.bookingDate.toISOString(),
            startTime: data.startTime.toISOString(),
            endTime: data.endTime.toISOString(),
            status: data.status,
        }));
        res.status(200).json({ data: formattedBookings })
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// status updated 
router.put("/bookingRoom/:bookingId/status", async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        // The new status should be passed in the request body
        const { status } = req.body;
        // Check if the status is valid
        if (!['pending', 'confirmed', 'canceled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }
        // Find the booking and update the status
        const updatedBooking = await BookedRoom.findByIdAndUpdate(bookingId, status, {
            // Return the updated document
            new: true,
            runValidators: true
        });
        if (!updatedBooking) {
            return res.status(404).json({ message: 'Booking not found' });
        }
        res.status(200).json({ data: updatedBooking });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

module.express = router;