require('dotenv').config()
const express = require('express');
const router = express.Router();
const dotenv = require('dotenv').config();
const User = require('./models/user'); // get our mongoose model
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens


// ---------------------------------------------------------
// route to authenticate and get a new token
// ---------------------------------------------------------
router.post('', async function(req, res) {
		// find the user
		let user = await User.findOne({
			email: req.body.email
		}); 

		
		// user not found
		if (!user) {
			res.json({ success: false, message: 'Authentication failed. User not found.' });
			console.log("user not found");
			return;
		}

		const password = await user.isPasswordMatched(req.body.password);

		// check if password matches
		if (!password) {
			console.log("wrong password");
			res.json({ success: false, message: 'Authentication failed. Wrong password.' });
			return;
		}

		//console.log(process.env.SUPER_SECRET);
		
		// if user is found and password is right create a token
		var payload = {
			email: user.email,
			id: user._id
			// other data encrypted in the token	
		}
		var options = {
			expiresIn: 86400 // expires in 24 hours
		}
		var token = jwt.sign(payload, process.env.SUPER_SECRET, options);

		//console.log("user authenticated correctly!");
		//console.log(token);
		//user.LogIn = true; //l'utente ha appena effettuato l'accesso

		await User.updateOne({ _id: user._id }, { logIn: true } );


		res.json({
			success: true,
			message: 'Enjoy your token!',
			token: token,
			email: user.email,
			id: user._id,
			self: "api/v1/users" + user._id
		});
	
});



module.exports = router;
