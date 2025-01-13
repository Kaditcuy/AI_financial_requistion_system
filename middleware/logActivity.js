
const db = require('../db');

const logActivity = async (req, res, next) => {
    const userId = req.user?.id; //Assuming user info is available in req.user from JWT or session
    const action = req.action || req.originalUrl; //captures the route the uset is accessing
    const ipAddress = req.ip; //captures users ip
    const userAgent = req.headers["user-agent"]; // Captures users broswer and device

    if (userId) {
        try {
            //log the activity to the datatabse
            await db.query(
                "INSERT INTO activities (user_id, action, ip_address, user_agent) VALUES (?, ?, ?, ?)",
                [userId, action, ipAddress, userAgent]
            );
        } catch (error) {
            console.error('Failed to log activity:', error);
        }
    }
    next(); //proceed to next midddleware
};

module.exports = logActivity;