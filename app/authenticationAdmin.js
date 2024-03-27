const express = require('express');
const router = express.Router();
const dotenv = require('dotenv').config();
const Admin = require('./models/admin'); // get our mongoose model
const jwt = require('jsonwebtoken'); // used to create, sign, and verify tokens


// ---------------------------------------------------------
// route to authenticate and get a new token
// ---------------------------------------------------------
router.post('', async function(req, res) {
		// find the admin
		let admin = await Admin.findOne({
			admin_email: req.body.admin_email
		});  //.exec()
		
		// admin not found
		if (!admin) {
			//res.json({ success: false, message: 'Authentication failed. Admin not found.' });
			return res.status(404).json({error: 'Admin name wrong.' });
			
		}

		// check if password matches
	if (admin.admin_password !== req.body.admin_password) {
		//res.json({ success: false, message: 'Authentication failed. Wrong password.' });
		return res.status(400).json({ error: 'Password wrong.' });
		
	}

	//console.log(process.env.SUPER_SECRET);
	
	// if admin is found and password is right create a token
	var payload = {
		admin_email: admin.admin_email,
		id: admin._id
		// other data encrypted in the token	
		
	}
	var options = {
		expiresIn: 86400 // expires in 24 hours
	}
	var token = jwt.sign(payload, 'your-secret-key', options);

	res.json({
		success: true,
		message: 'Enjoy your token!',
		token: token,
		admin_email: admin.admin_email,
		id: admin._id,
		self: "api/v1/" + admin._id,
		admin_type : admin.admin_type
	});


});



module.exports = router;