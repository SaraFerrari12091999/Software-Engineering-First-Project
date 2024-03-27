const express = require('express');
const router = express.Router();
const Admin = require('./models/admin'); // get our mongoose model



router.get('/me', async (req, res) => {
    if(!req.loggedUser) {
        return;
    }

    // https://mongoosejs.com/docs/api.html#model_Model.find
    let admin = await Admin.findOne({email: req.loggedUser.email});

    res.status(200).json({
        self: '/api/v1/admin/' + admin.id,
        admin_email: admin.admin_email,
        admin_type: admin.admin_type
    });
});

router.get('', async (req, res) => {
    let admin;

    if (req.query.email)
        // https://mongoosejs.com/docs/api.html#model_Model.find
        admin = await Admin.find({email: req.query.email}).exec();
    else
        admin = await Admin.find().exec();

        admin = admin.map( (entry) => {
        return {
            self: '/api/v1/admin/' + entry.id,
            admin_email: entry.admin_email,
            admin_type: entry.admin_type
        }
    });

    res.status(200).json(admin);
});

router.post('', async (req, res) => {
    
    let admin = new Admin({        email: req.body.email,
        password: req.body.password    });
    if (!admin.email || typeof admin.email != 'string' || !checkIfEmailInString(admin.email)) {
        res.status(400).json({ error: 'The field "email" must be a non-empty string, in email format' });
        return;
    }
    
    admin = await admin.save();    
    let adminId = admin.id;
    /**     * Link to the newly created resource is returned in the Location header
     * https://www.restapitutorial.com/lessons/httpmethods.html
     */
    res.location("/api/v1/admin/" + adminId).status(201).send();
});



// https://stackoverflow.com/questions/46155/how-to-validate-an-email-address-in-javascript
function checkIfEmailInString(text) {
    // eslint-disable-next-line
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(text);
}



module.exports = router;
