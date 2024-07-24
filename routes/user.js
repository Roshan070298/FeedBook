const express = require('express');
const router = express.Router();
const User = require('../models/user');


// Create a new user
router.post('/', async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

    // Check if email already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
    }

    // Create the user
    const user = new User({
      username,
      email,
      password,
      role
    });

    user.save();

    // Remove password before sending response
    const userResponse = user.toJSON();
    delete userResponse.password;

    res.status(201).json(userResponse);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update a user by ID
router.put('/:id', async (req, res) => {
    try {
        const { password, role } = req.body;
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Use the update() method to set new values
        const updatedUser = await user.update({
            password: password || user.password,
            role: role || user.role
        });

        // Remove password before sending response
        const userResponse = updatedUser.toJSON();
        delete userResponse.password;

        res.json(userResponse);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});


// Delete a user by ID
router.delete('/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        await user.destroy();
        res.status(200).json('User deleted successfully' );
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
