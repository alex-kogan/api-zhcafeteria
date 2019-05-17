const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt-nodejs');
// const knex = require('knex');
const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

//Set up default mongoose connection
// local
const mongoDB = 'mongodb://127.0.0.1/ZHCafeteria';

mongoose.connect(mongoDB, (error) => {
    if(error) console.log(error);   
    console.log("Database connection successful"); 
});

// Get the default connection
const mdb = mongoose.connection;
//Bind connection to error event (to get notification of connection errors)
mdb.on('error', console.error.bind(console, 'MongoDB connection error:'));

const User = require('./Database/Users.js')
const Password = require('./Database/Passwords.js')
const Transaction = require('./Database/Transactions.js')


const register = require('./Controllers/register')
const signin = require('./Controllers/signin')
const transaction = require('./Controllers/transaction')
const profile = require('./Controllers/profile')
const admin = require('./Controllers/admin')
const stats = require('./Controllers/stats')


const server = express();

server.use(bodyParser.json())
server.use(cors());

server.get('/', (req, res) => {
	res.json('running')
});

server.post('/signin', (req, res) => signin.handleSignin(req, res, mdb, bcrypt))
server.post('/register', (req, res) => register.handleRegister(req, res, mdb, bcrypt))
server.get('/profile/:id', (req, res) => profile.handleProfile(req, res, mdb))
server.put('/transaction/:id', (req, res) => transaction.handleTransaction(req, res, mdb))
server.get('/stats/:id', (req, res) => stats.handleStats(req, res, mdb))
server.post('/admin', (req, res) => admin.handleAdminActions(req, res, mdb))

server.listen(process.env.PORT || 3000, () => {
	if (process.env.PORT)
		console.log(`app is running on port ${process.env.PORT}`)
	else
		console.log(`app is running on port 3000`)
});
