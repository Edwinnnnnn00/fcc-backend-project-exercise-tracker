const express = require('express')
const app = express()
const cors = require('cors')
const crypto = require('crypto');
require('dotenv').config()

const userlist = [];
const userinfo = [];
let user = {};

app.use(cors())
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});

app.get("/api/users", (req, res) => {
  res.json(userinfo);
})

app.post("/api/users", (req, res) => {
  user._id = crypto.randomBytes(16).toString('hex');
  user.username = req.body.username;
  user.count = 0;
  user.log = [];
  userlist.push({_id: user._id, username: user.username});
  userinfo.push(user);
  res.json({username: user.username, _id: user._id});
});

app.post("/api/users/:_id/exercises", (req, res) => {
  const userId = req.params._id;
  const userIndex = userinfo.findIndex(user => user._id === userId);
  const duration = parseInt(req.body.duration);
  
  let date = new Date(req.body.date);
  if (isNaN(date.getTime())) {
    date = new Date();
  }
  date = date.toDateString();
  
  userinfo[userIndex].log.push(
    {
      description: req.body.description,
      duration: duration,
      date: date,
    }
  )

  userinfo[userIndex].count += 1;
  res.json({
    _id: userId,
    username: userinfo[userIndex].username,
    date: date,
    duration: duration,
    description: req.body.description
  })
});

app.get("/api/users/:_id/logs", (req, res) => {

  const from = req.query.from ? new Date(req.query.from).getTime() : new Date(0).getTime();
  const to = req.query.to ? new Date(req.query.to).getTime() : new Date().getTime();
  const limit = parseInt(req.query.limit) || 10;
  const userId = req.params._id;
  const userIndex = userinfo.findIndex(user => user._id === userId);
  
  const logs = userinfo[userIndex].log
  .sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
  console.log(logs);
  
  let filteredLogs = logs.filter(
    (log) => Date.parse(log.date) >= from && Date.parse(log.date) <= to
  );

  if (limit < filteredLogs.length) {
    filteredLogs = filteredLogs.slice(0, limit);
  } 

  res.json({
    _id: userId,
    username: userinfo[userIndex].username,
    count: filteredLogs.length,
    log: filteredLogs
  })
})

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
