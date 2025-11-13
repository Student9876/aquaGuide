
import User from '../models/user.model.js'; // Adjust the path to your User model

// Helper function to send status messages (like Flask's flash)
const sendResponseAndRedirect = (res, success, message, redirectPath = '/admin/manage-users') => {
    // In a REST API, you'd usually just send JSON. 
    // Since the original code redirects, we'll send a message and tell the client where to go.
    return res.status(success ? 200 : 400).json({ 
        success, 
        message, 
        redirect: redirectPath 
    });
};

// GET /manage-users
export const manageUsers = async (req, res, next) => {
    try {
        const statusFilter = req.query.status;
        const validStatuses = ['active', 'inactive', 'locked'];
        
        // Sequelize query object
        let queryOptions = {
            order: [['createdAt', 'ASC']],
            where: {}
        };
        
        let pageTitle = "Manage All Users";

        if (validStatuses.includes(statusFilter)) {
            // Filter by the 'status' column (assuming your User model has a 'status' column)
            queryOptions.where.status = statusFilter;
            pageTitle = `Manage ${statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)} Users`;
        }
        
        const usersToDisplay = await User.findAll(queryOptions);

        // In a real Express application rendering HTML, you'd use:
        // return res.render('admin/manage_users.html', { users: usersToDisplay, title: pageTitle });
        
        // For a JSON API, we return the data:
        return res.json({ title: pageTitle, users: usersToDisplay });

    } catch (error) {
        next(error); // Pass the error to the Express error handler
    }
};

// POST /user/:id/activate
export const activateUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user.id; // From the authenticateUser middleware

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Prevent admin from modifying their own account status
        if (user.id === currentUserId) {
            return sendResponseAndRedirect(res, false, "You cannot activate your own account.");
        }

        user.status = 'active';
        // Assuming 'failed_login_attempts' is a column to reset on activation
        user.failed_login_attempts = 0; 
        await user.save(); // Sequelize saves the changes

        sendResponseAndRedirect(res, true, `User '${user.username || user.email}' has been activated.`);
    } catch (error) {
        next(error);
    }
};

// POST /user/:id/deactivate
export const deactivateUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user.id;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (user.id === currentUserId) {
            return sendResponseAndRedirect(res, false, "You cannot deactivate your own account.");
        }

        user.status = 'inactive';
        await user.save();

        sendResponseAndRedirect(res, true, `User '${user.username || user.email}' has been deactivated.`);
    } catch (error) {
        next(error);
    }
};

// POST /user/:id/unlock
export const unlockUser = async (req, res, next) => {
    try {
        const { userId } = req.params;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (user.status === 'locked') {
            user.status = 'active';
            user.failed_login_attempts = 0;
            await user.save();
            sendResponseAndRedirect(res, true, `User '${user.username || user.email}' has been unlocked.`);
        } else {
            sendResponseAndRedirect(res, false, `User '${user.username || user.email}' was not locked.`);
        }
    } catch (error) {
        next(error);
    }
};

// POST /user/:id/toggle_admin
export const toggleAdmin = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user.id;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        // Prevent self-modification
        if (user.id === currentUserId) {
            return sendResponseAndRedirect(res, false, "You can't change your own admin rights.");
        }

        // Optional safety: prevent removing the last admin
        if (user.role === 'admin') {
            const remainingAdminsCount = await User.count({ where: { role: 'admin' } });
            if (remainingAdminsCount <= 1) {
                return sendResponseAndRedirect(res, false, "You can't remove the last remaining admin.");
            }
        }

        // Toggle logic (assuming 'role' is an ENUM 'user'/'admin'/'support')
        user.role = user.role === 'admin' ? 'user' : 'admin';
        await user.save();

        sendResponseAndRedirect(res, true, `Admin status for ${user.username || user.email} set to ${user.role === 'admin'}.`);
    } catch (error) {
        next(error);
    }
};


// POST /user/:id/toggle_support
export const toggleSupport = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user.id;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (user.id === currentUserId) {
            return sendResponseAndRedirect(res, false, "You can't change your own support rights.");
        }

        // Assuming support is toggled between 'support' and 'user' role
        user.role = user.role === 'support' ? 'user' : 'support';
        await user.save();
        
        sendResponseAndRedirect(res, true, `Support Agent status for ${user.username || user.email} set to ${user.role === 'support'}.`);
    } catch (error) {
        next(error);
    }
};

// POST /user/:id/delete
export const deleteUser = async (req, res, next) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user.id;

        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }

        if (user.id === currentUserId) {
            return sendResponseAndRedirect(res, false, "You can't delete your own account.");
        }

        // Sequelize method to delete a record
        await user.destroy(); 

        sendResponseAndRedirect(res, true, `User '${user.username || user.email}' has been deleted.`);
    } catch (error) {
        next(error);
    }
};