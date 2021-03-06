const express = require('express')
const mongoose = require('mongoose')
require('dotenv/config')
const env = process.env
const app = express()
const bodyParser = require('body-parser')
const userSchema = require('./models/userSchema')

// MongoDB connection
mongoose.connect('mongodb+srv://' + env.MONGOOSE_USERNAME + ':' + env.MONGOOSE_PASSWORD + '@cluster0.qwe3x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
   useNewUrlParser: true,
   useUnifiedTopology: true
})

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
//app.use(express.static(__dirname + '/public'))
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

// Get methods
app.get('/', function(req, res) {
   res.render('index.ejs')
})

app.get('/page/userlist', function(req, res) {
   userSchema.find({}, function (err, users) {
      if (err) {
         console.log(err)
      } else {
         res.render('listUsers.ejs', {users})
      }
   })
})

app.get('/page/userdelete', function(req, res) {
   res.render('deleteUser.ejs')
})

app.get('/page/userupdate', function(req, res) {
   res.render('updateUser.ejs')
})

// Post methods
app.post('/user/register', function(req, res) {
   let userData = {
      username: req.body.username,
      firstname: req.body.fname,
      lastname: req.body.lname,
      email: req.body.email,
      password: req.body.password
   }
   let doHaveAnyData = false
   for (const [key, value] of Object.entries(userData)) {
      if (value == '') {
         let text = 'No record created. All blanks must be filled!'
         res.render('index.ejs', {notificationText: text})
         doHaveAnyData = true
      }
   }
   if (doHaveAnyData == false) {
      userSchema.create({
         username: userData.username,
         firstname: userData.firstname,
         lastname: userData.lastname,
         email: userData.email,
         password: userData.password
      })
      let text = 'Successfully registered'
      res.render('index.ejs', {notificationText: text})
   }
})

app.post('/user/delete', function(req, res) {
   userSchema.findById(req.body.id, function (err, user) {
      if (err) {
         console.log(err)
         let text = 'There was a problem deleting the user, try again later.'
         res.render('updateUser.ejs', {notificationText: text})
      } else {
         const userPassword = user.password
         if (userPassword == req.body.password) {
            userSchema.findByIdAndRemove(req.body.id, function(err){
               if(err) {
                  let text = 'An error occurred or the id and password entered was not found'
                  res.render('deleteUser.ejs', {notificationText: text})
               } else {
                  let text = 'Successfully deleted record with id ' + req.body.id
                  res.render('deleteUser.ejs', {notificationText: text})
               }
            })
         } else {
            let text = 'Password is not correct!'
            res.render('deleteUser.ejs', {notificationText: text})
         }
      }
   })
})

function updateRecord(req, res) {
   let userNewData = {
      username: req.body.username,
      firstname: req.body.fname,
      lastname: req.body.lname,
      email: req.body.email,
      password: req.body.newpassword
   }
   userSchema.findById(req.body.recordIdBeUpdate, function (err, user) {
      if (err) {
         console.log(err)
         let text = 'There was a problem updating the user, try again later.'
         res.render('updateUser.ejs', {notificationText: text})
      } else {
         const userPassword = user.password
         if (userPassword == req.body.beforepassword) {
            userSchema.findByIdAndUpdate(req.body.recordIdBeUpdate, userNewData, function (err, docs) {
               if (err) {
                  console.log(err)
                  let text = 'There was a problem updating the user, try again later.'
                  res.render('updateUser.ejs', {notificationText: text})
               } else {
                  let text = 'Record updated successfully.'
                  res.render('updateUser.ejs', {notificationText: text})
               }
            })
         } else {
            let text = 'Password is not correct!'
            res.render('updateUser.ejs', {notificationText: text})
         }
      }
   })
}

app.post('/user/update', function(req, res) {
   if (req.body.username == '') {
      let text = 'Something went wrong! New information was not entered. try again.'
      res.render('updateUser.ejs', {notificationText: text})
   } else {
      update = updateRecord(req, res)
   }
})

let PORT = env.APP_PORT || env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
   console.log(`[OK] Listening on port ${PORT}!`)
})