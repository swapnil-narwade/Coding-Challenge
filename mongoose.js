const mongoose = require('mongoose');       //this is a mongodb Library

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/UserDB', { useNewUrlParser: true });   //connecting to the UserDb database
                            // { useNewUrlParser: true } is for body-parser library
                            //its been deprecated from previous library so we have to use it
module.exports= {mongoose};