const bookingService = require('../services/bookingService');

class BookingController {
    // Get available time slots for a service
    async getAvailableTimeSlots(req, res) {
        try {
            const { serviceId, date } = req.query;
            
            if (!serviceId || !date) {
                return res.status(400).json({
                    success: false,
                    message: 'Service ID and date are required'
                });
            }
            // Validate date format
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(date)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid date format. Use YYYY-MM-DD'
                });
            }

            const timeSlots = await bookingService.getAvailableTimeSlots(serviceId, date);
            
            res.json({
                success: true,
                data: timeSlots
            });
        } catch (error) {
            console.error('Error in getAvailableTimeSlots:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching available time slots'
            });
        }
    }

    // Create a new booking
    async createBooking(req, res) {
        try {
            const { doctorId, serviceId, bookingDate, startTime } = req.body;
            const userId = req.user.id; // Assuming user is authenticated

            if (!doctorId || !serviceId || !bookingDate || !startTime) {
                return res.status(400).json({
                    success: false,
                    message: 'All fields are required'
                });
            }

            // Validate date format
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dateRegex.test(bookingDate)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid date format. Use YYYY-MM-DD'
                });
            }

            // Validate time format
            const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
            if (!timeRegex.test(startTime)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid time format. Use HH:mm'
                });
            }

            const booking = await bookingService.createBooking(
                userId,
                doctorId,
                serviceId,
                bookingDate,
                startTime
            );

            res.status(201).json({
                success: true,
                data: booking
            });
        } catch (error) {
            console.error('Error in createBooking:', error);
            res.status(500).json({
                success: false,
                message: error.message || 'Error creating booking'
            });
        }
    }

    // Get user's bookings
    async getUserBookings(req, res) {
        try {
            const userId = req.user.id; // Assuming user is authenticated
            const bookings = await bookingService.getUserBookings(userId);

            res.json({
                success: true,
                data: bookings
            });
        } catch (error) {
            console.error('Error in getUserBookings:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching user bookings'
            });
        }
    }

    // Cancel a booking
    async cancelBooking(req, res) {
        try {
            const { bookingId } = req.params;
            const userId = req.user.id; // Assuming user is authenticated

            const cancelledBooking = await bookingService.cancelBooking(bookingId, userId);

            if (!cancelledBooking) {
                return res.status(404).json({
                    success: false,
                    message: 'Booking not found or unauthorized'
                });
            }

            res.json({
                success: true,
                data: cancelledBooking
            });
        } catch (error) {
            console.error('Error in cancelBooking:', error);
            res.status(500).json({
                success: false,
                message: 'Error cancelling booking'
            });
        }
    }

    // Get booking details
    async getBookingDetails(req, res) {
        try {
            const { bookingId } = req.params;
            const booking = await bookingService.getBookingDetails(bookingId);

            if (!booking) {
                return res.status(404).json({
                    success: false,
                    message: 'Booking not found'
                });
            }

            res.json({
                success: true,
                data: booking
            });
        } catch (error) {
            console.error('Error in getBookingDetails:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching booking details'
            });
        }
    }
}

module.exports = new BookingController(); 