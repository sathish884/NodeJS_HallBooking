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
        const { customer, bookingDate, startTimes, endTimes, roomIds } = req.body;

        // Validate required fields
        if (!customer || !bookingDate || !startTimes || !endTimes || !roomIds) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        // Parse bookingDate to a valid Date object
        const parsedBookingDate = new Date(bookingDate);
        const parsedStartTime = new Date(startTimes);
        const parsedEndTime = new Date(endTimes);

        if (isNaN(parsedBookingDate.getTime()) || isNaN(parsedStartTime.getTime()) || isNaN(parsedEndTime.getTime())) {
            return res.status(400).json({ message: 'Invalid date format. Use ISO 8601 format for dates.' });
        }

        // Check for existing bookings that overlap with the requested times
        const existingBookings = await RoomBooking.find({
            room: { $in: roomIds },
            $or: [
                { startTime: { $lt: parsedEndTime, $gte: parsedStartTime } },
                { endTime: { $gt: parsedStartTime, $lte: parsedEndTime } }
            ]
        });

        if (existingBookings.length > 0) {
            return res.status(400).json({ message: 'Room is already booked for the selected time.' });
        }

        // Create a new booking
        const bookedRoom = new RoomBooking({
            customerName: customer,
            room: roomIds,
            bookingDate: parsedBookingDate,
            startTime: parsedStartTime,
            endTime: parsedEndTime,
            status: 'confirmed'
        });

        await bookedRoom.save();

        res.status(200).json({ message: "Room was successfully booked" });
    } catch (error) {
        res.status(500).json({ errorMsg: error.message });
    }
});

// List all booked rooms
router.get('/bookingroomList', async (req, res) => {
    try {
        const bookingRooms = await RoomBooking.find({}).populate("room");
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

// List out customer-wise room booked lists
router.get("/bookingRoom/:customerName/bookings", async (req, res) => {
    try {
        const customerName = req.params.customerName;
        const bookings = await RoomBooking.find({ customerName }).populate("room");
        
        const formattedBookings = bookings.map((data) => ({
            bookingId: data._id,
            customerName: data.customerName,
            roomName: data.room.name,
            bookingDate: data.bookingDate.toISOString(),
            startTime: data.startTime.toISOString(),
            endTime: data.endTime.toISOString(),
            status: data.status,
        }));

        res.status(200).json({ data: formattedBookings });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// status updated 
router.put("/bookingRoom/:bookingId/status", async (req, res) => {
    try {
        const bookingId = req.params.bookingId;
        const { status } = req.body; // The new status should be passed in the request body

        // Check if the status is valid
        if (!['pending', 'confirmed', 'canceled'].includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        // Find the booking and update the status
        const updatedBooking = await RoomBooking.findByIdAndUpdate( bookingId, req.body, {
            new: true, // Return the updated document
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

module.exports = router;