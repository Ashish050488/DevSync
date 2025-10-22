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



// profile.js

profileRouter.patch('/profile/edit', userAuth, async (req, res) => {
    try {
        console.log("🧪 PATCH /profile/edit — BODY:", req.body);

        // --- THIS IS THE FIX ---
        // Just call the function. It will throw an error if invalid.
        ValidateEditProfileData(req);
        // -----------------------

        const LoggedInUser = req.user;
        Object.keys(req.body).forEach((key) => {
            if (req.body[key] !== undefined) {
                LoggedInUser[key] = req.body[key];
            }
        });

        await LoggedInUser.save();

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