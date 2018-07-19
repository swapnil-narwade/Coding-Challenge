const mongoose = require('mongoose');
let Todos = mongoose.model('todos',{              //this is the Pointy-head-boss User model
    EmpName:{
        type: String,
        required: true,
        minlength: 8,
        maxlength: 50
    },
    jobTitle: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 20
    },
    salary :{
        type: Number,
        required: true
    },
    location: {
        type: String,
        required : false    }
});

module.exports = { Todos };
