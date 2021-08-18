const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const http = require('http');
const socketio = require('socket.io');
const mongoose = require('mongoose');
const fs = require('fs');
const bodyParser = require('body-parser');
const {
  AddUser,
  GetTargets,
  Shooting,
  removeUser,
  GetUser,
} = require('./helpers/game');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
const server = http.createServer(app);

const PORT = process.env.PORT;
const URL = process.env.URL || 'http://localhost:8000';

// db
mongoose
  .connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`DB Connect to ${process.env.DATABASE}`))
  .catch((err) => console.log('DB connection err:', err));

// route middleware
fs.readdirSync('./routes').map((r) =>
  // console.log("./routes/"+r);
  app.use('/api', require('./routes/' + r))
);

server.listen(PORT, () => console.log(`server is running on ${PORT}`));

// Websocket
const io = socketio(server, {
  cors: {
    origin: URL,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

io.on('connection', (socket) => {
  console.log('we have a new Connection');

  // emit
  socket.on('join', ({ name, room }, callback) => {
    console.log(name, room);
    const { error, user } = AddUser({ id: socket.id, name, room });
    if (error) return callback(error);
    socket.join(user.room);
    console.log(user);

    io.to(user.room).emit('gameTargetsData', {
      room: user.room,
      targets: GetTargets(user.room),
      user: GetUser(user.room),
    });

    callback();
  });

  socket.on('shooting', ({ name, room, _id }, callback) => {
    const game = Shooting(name, room, _id);
    io.to(room).emit('shootingDone', game);
    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);
    console.log('user has left', user);
    if (user) {
      io.to(user.room).emit('gameTargetsData', {
        room: user.room,
        targets: GetTargets(user.room),
        user: GetUser(user.room),
      });
    }
  });
});
