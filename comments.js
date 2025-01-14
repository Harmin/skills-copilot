// Create web server
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var multer  = require('multer');
var fs = require('fs');
var path = require('path');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + '.jpg');
    }
});
var upload = multer({ storage: storage });
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/comments');
var Schema = mongoose.Schema;
var commentSchema = new Schema({
    name: String,
    comment: String,
    date: Date,
    image: String
});
var Comment = mongoose.model('Comment', commentSchema);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/comments', function (req, res) {
    Comment.find(function (err, comments) {
        if (err) {
            res.send(err);
            return;
        }
        res.json(comments);
    });
});

app.post('/comments', upload.single('image'), function (req, res) {
    var comment = new Comment({
        name: req.body.name,
        comment: req.body.comment,
        date: new Date(),
        image: req.file ? req.file.filename : ''
    });
    comment.save(function (err) {
        if (err) {
            res.send(err);
            return;
        }
        res.json(comment);
    });
});

app.listen(3000, function () {
    console.log('Server is running at http://localhost:3000/');
});