const mongoose = require('mongoose'); // Erase if already required
const bcrypt = require("bcrypt");

// Declare the Schema of the Mongo model
var adminSchema = new mongoose.Schema({
    
    //the admin have an email, password and the type.
    admin_email:{
        type:String,
        required:true,
        unique:true,
    },
    admin_password:{
        type:String,
        required:true,
    },

    //the type of admin is usefull to define what page the administrator see when he works
    admin_type:{

        type:String,
        enum : ['callCenter', 'moderator', 'tecnicalSupport'],
        default : 'tecnicalSupport',
    }, 
});

//crypt the password
adminSchema.pre("save", async function (next) {
    const salt = await bcrypt.genSaltSync(10);
    this.admin_password = await bcrypt.hash(this.admin_password, salt);

});

//verufy if the admin password is correct
adminSchema.methods.isPasswordMatched = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.admin_password);
    //if password is crypted, it will return true, otherwise false.
}

//Export the model
module.exports = mongoose.model('Admin', adminSchema);
