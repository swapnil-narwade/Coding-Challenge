const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt =require('bcryptjs');

    let userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: true,
        minlength: 8,
        maxlength: 50
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        maxlength: 20
    },
    tokens:[{
        access:{
            type: String,
            required: true
        },
        token:{
            type: String,
            required: true
        }
    }]
});

userSchema.methods.toJSON = function() {
    let user =this;
    let userObject = user.toObject();
    return _.pick(userObject,['_id', 'username']);
};

userSchema.methods.generateAuthToken = function() {
    let user = this;
    let access = 'auth';
    let token = jwt.sign({_id:user._id.toHexString(), access:access }, 'swapnilSalt').toString();

    user.tokens = user.tokens.concat([{access: access, token:token}]);
    return user.save().then(()=>{
        return token;
    });
};

userSchema.statics.findByToken = function (token) {
    let User = this;
    let decoded;

    try {
        decoded = jwt.verify(token,'123abc');
    }
    catch (e) {
        return Promise.reject();
    }
    return User.findOne({
        '_id': decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    });
};


userSchema.statics.findByCredentials= function(username, password){
    let user = this;
    return user.findOne({username}).then((user)=>{
        if (!user){
            return Promise.reject();
        }
        return new Promise((resolve,reject)=>{
            bcrypt.compare(password, user.password, (err, result)=>{
                if (result){
                    resolve(user);
                } else {
                    reject();
                }
            });
        });
    });
};

userSchema.pre('save', function (next) {
    let user = this;
    if (user.isModified('password')){
        bcrypt.genSalt(10, (err, salt)=>{
            bcrypt.hash(user.password, salt, (err, hash)=>{
                user.password = hash;
                next();
            });
        });
    } else
        next();
});


let Users= mongoose.model('user', userSchema);

module.exports = {
    Users
};


