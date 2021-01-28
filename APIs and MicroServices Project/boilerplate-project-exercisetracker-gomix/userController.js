const express = require('express')
const router = express.Router();
const mongoose = require("mongoose");
const dateTime = require("date-time");
const humanizeDuration = require("humanize-duration");
const moment = require('moment');
const userSchema = new mongoose.Schema({
  username: String,
  "date-created": { type: String, default: Date.now },
  "time-created": { type: String, default: Date.now },
  exercise: [
    {
      description: { type: String, required: true },
      duration: { type: Number, required: true },
      date: { type: Date, required: false }
    }
  ]
});

let User = mongoose.model("User", userSchema);

router.post("/new-user", async (req, res) => {

  // await User.remove()

  const { username } = req.body;
  let dateTimeArray = dateTime().split(" ");
  let date = dateTimeArray[0];
  let time = dateTimeArray[1];

  let user = await User.findOne({ username });

  if (!user) {
    user = new User({
      username,
      "date-created": date,
      "time-created": time
    });

    user.save().then(() => {
      User.findOne({ username }).then((data) => {
        console.log(data)
        res.json({
          username: data.username,
          _id: data._id
        });
      }).catch((err) => {
        console.log("error catch =====", err)
      })
    }).catch((err) => { console.log(err, "save err==>") });



  } else {
    res.json({
      "Error Message": "Username taken. Try a different username",
      "Go back to homepage": "https://sameers-exercise-tracker.herokuapp.com/",
      "Log an Exercise":
        "https://sameers-exercise-tracker.herokuapp.com/add-exercise"
    });
  }
});




router.get("/users", (req, res) => {
  User.find().then((data) => {
    console.log(data)
    res.json(data);
  }).catch((err) => {
    console.log("error catch =====", err)
  })

});



router.post("/add", function(req, res) {
  let dateInsert = req.body.date;

  if (req.body.date == "") {
    dateInsert = new Date();
    dateInsert = dateInsert.toDateString();
    //     console.log(dateInsert)
  } else if (req.body.date == null) {
    dateInsert = new Date();
    dateInsert = dateInsert.toDateString();
  } else {
  
    dateInsert = new Date(req.body.date).toDateString();
  }


  if (req.body.description) {
    if (req.body.duration) {
      if (req.body.userId) {
        User.findOneAndUpdate(
          { _id: req.body.userId },
          {
            $push: {
              exercise: {
                description: req.body.description,
                duration: parseInt(req.body.duration),
                date: dateInsert
              }
            }
          },
          { new: true, upsert: true },
          (err, data) => {
            if (err) return res.send(err);
            res.send({
              username: data.username,
              description: req.body.description,
              duration: parseInt(req.body.duration),
              _id: data._id,
              date: dateInsert
            });
          }
        );
      } else {
        res.send({ error: "userId is required" });
      }
    } else {
      res.send({ error: "duration is required" });
    }
  } else {
    res.send({ error: "description is required" });
  }
});


router.get("/log/", (req, res) => {
  var { userId, from, to, limit } = req.query;


  //console.log("from",fromDate);
  User.findById({ _id: userId }, (err, data) => {
    if (err) return res.send(err);
    let userTest = userId;
    // console.log(userTest);
    var exercises = data.exercise;
    var log = exercises.map(item => {
      return {
        description: item.description,
        duration: item.duration,
        date: item.date.toDateString()

      }
    })

    if (from) {
      var fromDate = new Date(from);
      log = log.filter(item => new Date(item.date) >= fromDate);
      fromDate = fromDate.toDateString();


    }

    if (to) {
      var toDate = new Date(to);
      log = log.filter(item => new Date(item.date) <= toDate);
      toDate = toDate.toDateString();
    }

    if (limit) {
      log = log.slice(0, +limit);
    }
    //console.log(exercises.length);
    let fromRep = new Date(from).toDateString();


    //  console.log("fromDate", fromDate)

    res.json({
      _id: data._id,
      username: data.username,
      from: fromDate,
      to: toDate,
      count: log.length,
      log: log
    })

  })

});

module.exports = router;