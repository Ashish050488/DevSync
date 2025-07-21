const express = require('express');



const { userAuth } = require('../middlewares/Auth');
const { ValidateEditProfileData } = require('../utils/validation');
const profileRouter = express.Router();




profileRouter.get('/profile/view', userAuth, async (req, res) => {

    try {
        const user = req.user
        if (!user) throw new Error('No User Found')
        res.send(user)
    }
    catch (err) {
        res.status(400).send('Error ' + err.message)
    }

})



profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        console.log("🧪 PATCH /profile/edit — BODY:", req.body);
        if (!ValidateEditProfileData(req)) {
            throw new Error('Invalid edit request');
        }
        const LoggedInUser = req.user;
        Object.keys(req.body).forEach((key) => {
            if (req.body[key] !== undefined) {
                LoggedInUser[key] = req.body[key];
            }
        });

        await LoggedInUser.save();

        // Send JSON response with updated user data
        res.json({
            message: `${LoggedInUser.firstName} your data has been updated successfully`,
            user: LoggedInUser
        });

    } catch (err) {
        console.error("🚨 /profile/edit Error:", err);
        res.status(400).json({ message: err.message });
    }
});




module.exports = profileRouter