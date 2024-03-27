const mongoose = require('mongoose');


// Declare the Schema of the Mongo model
var dangerSchema = new mongoose.Schema({
    
    //the admin have an email, password and the type.
    type:{
        type:String,
        enum : ['orso', 'incendio', 'valanga', 'zona di caccia']
    },
    latitude:{
        type:String,
        required:true
    },
    longitude:{
        type:String,
        required:true
    },
    segnalazioni:{
        type: Number,
        default: 0
    },
    onMap:{
        type:Boolean,
        default:false
    },
});

module.exports = mongoose.model('Danger', dangerSchema);
