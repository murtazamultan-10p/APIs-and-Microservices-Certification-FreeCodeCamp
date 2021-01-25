// server.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get("/api/timestamp/:date?", (req,res)=>{
  

  if(req.params.date.includes("-"))
  {
    res.json({
      "unix": new Date('2015.12.25').getTime() / 1000,
      "utc": new Date('2015-12-25').toUTCString()
    });
  }
  else
  {
    var date = new Date(1451001600000).toLocaleDateString("en-US");

    res.json({
      "unix": 1451001600000,
      "utc": new Date(convertDate(date)).toUTCString()
    });
  }
});


function convertDate (userDate) {
    return userDate.substr(6,4) + "-" + userDate.substr(0,2) + "-" +  userDate.substr(3,2);
}

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
