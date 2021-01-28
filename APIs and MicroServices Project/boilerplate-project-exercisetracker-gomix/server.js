const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const router = express.Router();
const userController = require("./userController");


app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});



// add middleware to parse the json
app.use(bodyParser.json());
// app.use(expressValidator());
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);

//connect the database

process.env.MONGO_URI = 'mongodb+srv://murtaza_multan-10p:murtaza_multan-10p@mongodb-and-mongoose-ch.fm7sf.mongodb.net/MongoDB-and-Mongoose-Challenges?retryWrites=true&w=majority';

const uri = process.env.MONGO_URI;

mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.use("/api/exercise", userController)
  })
  .catch((err) => console.log("not connected to db because ", err));




const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})




// const express = require('express')
// const app = express()
// const cors = require('cors')
// const mongodb = require('mongodb');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const shortId = require('shortid');

// require('dotenv').config()

// app.use(cors())
// app.use(express.static('public'))
// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/views/index.html')
// });

// app.use(bodyParser.urlencoded({
//   extended: false
// }));


// const users=[];
// const excercises=[];

// const getUserById = (idToSearch) => users.find(user=> user._id === idToSearch);

// const getExcerciseById = (idToSearch) => excercises.filter(exercise=> exercise._id === idToSearch);

// app.post('/api/exercise/new-user', (req,res,next)=>{
//     const {username} = req.body;

//     const newUser = {
//       username,
//       _id: shortId.generate()
//     }
//     users.push(newUser);
//     res.json(newUser);
// }) 

// app.get('/api/exercise/users', (req,res)=>{
//     res.json(users);
// })

// app.post('/api/exercise/add', (req,res)=>{
//   const {userId, description, duration, date} = req.body;

//   const dateObj = date === ''? new Date() : new Date(date);
//   const userById = getUserById(userId);

//   if(userById === undefined){
//     return res.send(`Cast to ObjectId failed for value \"${userId}\" at path "_id" for model "Users"`);
//   }

//   const usernam = userById.username;

//   let newExcercise = {
//     _id: userId,
//     username: usernam,
//     date: dateObj.toString().slice(0,15),
//     duration: duration,
//     description: description,
//   }

//   excercises.push(newExcercise)
//   res.json(newExcercise)

// })

// app.get('/api/exercise/log', (req,res)=>{
//   const {userId} = req.body;
//   const allExcercise = getExcerciseById(userId);

//   console.log(userId);

//   res.send('Z37iqzJBs');

// })




// // app.use((req,res,next)=>{
// //   next({
// //     status: 404,
// //     message: 'not found'
// //   });
// // })

// // app.use((err, req,res,next)=>{
// //   let errCode, errMessage

// //   if(err.errors){
// //     errCode = 400
// //     const keys = Object.keys(err.errors)

// //     errMessage = err.errors[keys[0]].message
// //   }
// //   else{
// //     errCode = err.status || 500
// //     errMessage = err.message || 'Internal Server Error'
// //   }

// //   res.status(errCode).type('txt')
// //   .send(errMessage)
// // });

// const listener = app.listen(process.env.PORT || 3000, () => {
//   console.log('Your app is listening on port ' + listener.address().port)
// })