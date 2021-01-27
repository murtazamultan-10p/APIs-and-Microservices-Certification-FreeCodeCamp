var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var multer = require('multer');

var app = express();

var upload = multer({dest: __dirname + '/uploads'})

app.use(cors());
app.use(bodyParser.json());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
     res.sendFile(process.cwd() + '/views/index.html');
  });


app.post('/api/fileanalyse', upload.single('upfile'), (req, res, next)=>{
  res.json({
    name: req.file.originalname,
    type: req.file.mimetype,
    size: req.file.size,
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Node.js listening ...');
});