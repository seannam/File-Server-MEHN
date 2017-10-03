//var uploader = require('../uploader');

var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');
var multer = require('multer');
var path = require('path');
var fs = require('fs');

var url = 'mongodb://localhost:27017/test';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/get-data', function(req, res, next) {
  var resultArray = [];
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    var cursor = db.collection('user-data').find();
    cursor.forEach(function(doc, err) {
      assert.equal(null, err);
      resultArray.push(doc);
    }, function() {
      db.close();
      res.render('index', {items: resultArray});
    });
  });
});

router.get('/get-data/:id', function(req, res, next) {
    var resultArray = [];
    var id = req.params.id;
    console.log('Retrieving item: ' + id);

    mongo.connect(url, function(err, db) {
        // assert.equal(null, err);
        // db.collection('user-data', function(err, collection) {
        //     collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
        //         res.render('index', item);
        //     });
        // });
        // db.close();

        // var cursor = collection.findOne({'_id':new BSON.ObjectID(id)});
        // cursor.forEach(function(doc, err) {
        //     assert.equal(null, err);
        //     resultArray.push(doc);
        // }, function() {
        //     db.close();
        //     res.render('index', {items: resultArray});
        // });
    });
});

var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './uploads')
    },
    filename: function(req, file, callback) {
        console.log("file: ");
        console.log(file);

        filename = file.fieldname + '-' + Date.now() + path.extname(file.originalname);
        //filename = file.fieldname + '-' + file.originalname;
        console.log("filename");
        console.log(filename);

        callback(null, filename);
    }
});
var upload = multer({
    storage: storage,
    //fileFilter is function label
    fileFilter: function(req, file, callback) {
        var ext = path.extname(file.originalname)
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
            //return callback(res.end('Only images are allowed'), null)
            console.log("Not a image file ");
        }
        callback(null, true)
    }
}).single('userImage');

//router.post('/insert', , multer({storage: storage, dest: './uploads/'}).single('userImage'), function(req, res, next) {
router.post('/insert', upload, function(req, res, next) {

    // var item = {
    //     title: req.body.fieldname,
    //     content: req.file.path,
    //     author: req.file.destination,
    //     filename: req.file.filename
    // };
  var item = {
    title: req.body.title,
    content: req.body.content,
    author: req.body.author,
    image: req.file.path
  };

  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('user-data').insertOne(item, function(err, result) {
      assert.equal(null, err);
      console.log('Item inserted');
      console.log(item);
      db.close();
    });
  });

  res.redirect('/get-data');
});

router.post('/update', function(req, res, next) {
  var item = {
    title: req.body.title,
    content: req.body.content,
    author: req.body.author
  };
  var id = req.body.id;

  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('user-data').updateOne({"_id": objectId(id)}, {$set: item}, function(err, result) {
      assert.equal(null, err);
      console.log('Item updated');
      console.log(item);
      db.close();
    });
  });

  res.redirect('/get-data');
});

router.post('/delete', function(req, res, next) {
  var id = req.body.id;

  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    db.collection('user-data').deleteOne({"_id": objectId(id)}, function(err, result) {
      assert.equal(null, err);
      console.log('Item deleted');
      db.close();
    });
  });
  res.redirect('/get-data');
});

router.post('/deleteAll', function(req, res, next) {
  mongo.connect(url, function(err, db) {
    assert.equal(null, err);
    console.log("deleteAll post");
    db.collection('user-data').remove({}, function(err, numberRemoved) {
      assert.equal(null, err);
      console.log("all data removed");
      db.close();
    });
  });

  res.redirect('/');
});

module.exports = router;
