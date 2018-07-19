const express = require('express');
const mongoose = require('mongoose');       //this is a mongodb Library
const bodyParser = require('body-parser');

let { Users } = require('./Users');
let { Todos } = require('./Todos');
let {ObjectID} = require('mongodb');
let path = require('path');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/UserDB', { useNewUrlParser: true });   //connecting to the UserDb database

let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));     //this is a middleware to parse the json and we give it to express


app.get('/',(req,res)=>{
    res.sendFile(path.join(__dirname + '/login.html'));
});
app.get('/login.css',(req,res)=>{
    res.sendFile(path.join(__dirname + '/login.css'));
});
app.get('/Pointy-head-boss.jpg',(req,res)=>{
    res.sendFile(path.join(__dirname + '/Pointy-head-boss.jpg'));
});


app.post('/loginPage',(req, res)=> {
    let username = req.body.user;
    let password = req.body.pass;

    let user = new Users({
        username: username,
        password: password
    });
    user.save().then(()=>{
        return user.generateAuthToken();
    }).then((token)=>{
        res.header('x-auth', token).send(user);
    }).catch((error)=>{res.status(400).send(`${error} occurred`)});
        res.send("User is authenticated");
});


 // Creating Todos API
app.post('/todos', (req, res) => {
    let todo = new Todos({
        EmpName: req.body.EmpName,
        jobTitle: req.body.jobTitle,
        salary: req.body.salary,
        location: req.body.location
    });
    todo.save().then((doc) => {
        res.send(doc);
    }, (e) => {
        res.status(400).send(e);
    });
});

// Read all the todos
app.get('/todos', (req, res) => {
    Todo.find().then((todos) => {
        res.send({todos});
    }, (e) => {
        res.status(400).send(e);
    });
});

// Read the todos by its _id

app.get('/todos/:id', (req, res) => {       //in here you have to mannually enter the _id to search the todos
    let id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findById(id).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }

        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    });
});


// Delete the todos by finding one or many

app.delete('/todos/:id', (req, res) => {
    let id = req.params.id;

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findByIdAndRemove(id).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }
        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    });
});

//upading the todos with id
pp.patch('/todos/:id', (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['EmpName']);   //in this array you can add properties which you want to display here i am only displaying EmpName

    if (!ObjectID.isValid(id)) {
        return res.status(404).send();
    }

    Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
        if (!todo) {
            return res.status(404).send();
        }

        res.send({todo});
    }).catch((e) => {
        res.status(400).send();
    })
});


app.listen(3000, ()=>{
    console.log("connected");
});
