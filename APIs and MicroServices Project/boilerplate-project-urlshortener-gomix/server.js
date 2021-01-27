require('dotenv').config();
const express = require('express');
const mongodb = require('mongodb');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cors());
app.use(express.json());
app.use('/public', express.static(`${process.cwd()}/public`));


process.env.MONGO_URI='mongodb+srv://murtaza_multan-10p:murtaza_multan-10p@mongodb-and-mongoose-ch.fm7sf.mongodb.net/MongoDB-and-Mongoose-Challenges?retryWrites=true&w=majority';

const uri=process.env.MONGO_URI;

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
});

const connection = mongoose.connection;

connection.on('error', console.error.bind(console, 'connection error'));

connection.once('open', ()=>{
console.log("MongoDB database connection estabished successfully");
});


const {Schema} = mongoose;

const urlSchema = new Schema({
  original_url: String,
  short_url: Number
});

const URLModel= mongoose.model("URL", urlSchema);

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.get('/api/shorturl/:short_url?',  (req,res)=>{
  const urlCode = parseInt(req.params.short_url);
  // console.log(req.params.short_url)

  URLModel.findOne({short_url: urlCode}, (err, data) => {
    if(!err && data != undefined){
      console.log("\n/Short-URL route called\nCode: "+ String(urlCode) + " Link: "+ data.original_url);    
      res.redirect(data.original_url)
    }
    else{
      console.log(data)
      res.json({error: 'URL Not Found'})
    }
  });
});

 let responseObject = {}

app.post('/api/shorturl/new', (req,res)=>{
  
  const url = req.body['url'];
  
  let matchUrl1=url.replace(/^((https?):\/\/)/,'');
  let matchUrl= matchUrl1.split('/')[0];


  dns.lookup(matchUrl, (err, addresses, family)=>{  
    if(err){
      return res.json({error: "invalid url"})
    }
    else{
      responseObject['original_url'] = url;
  
      let urlCode = 1;
      
      URLModel.find({original_url:url}, (err, dataFound)=>
      {
        URLModel.findOne({})
        .sort({short_url: 'desc'})
        .exec((error, data)=>{
          if(!error && data != undefined){
            
            if(dataFound.length<1)
              urlCode = data.short_url + 1;
            else
              urlCode = dataFound[0]['short_url'];
          }
          if (!error) {
            URLModel.findOneAndUpdate(
              {original_url: url}, 
              {original_url: url, short_url: urlCode},
              { new: true, upsert: true },
              (error, data) => {
                if (!error) {
                  responseObject["short_url"] = data.short_url;
                  res.json(responseObject);
                  console.log("\n/New route called\nCode: "+ String(responseObject["short_url"]) + " Link: "+ responseObject["original_url"]);    

                  data.save();
                }
              }
            );
          }
        });
      });
    }
  });
});



app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
