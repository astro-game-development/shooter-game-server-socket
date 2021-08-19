const { randomString } = require('../utils/randomString');
const { randomTarget } = require('../utils/randomTarget');
const { v4 } = require('uuid');
var _ = require('lodash');

const testdata = {
  room: 'XSDWD',
  target: [],
  users: [
    {
      id: 'xxx',
      name: 'xxx',
      room: 'ddd',
    },
  ],
};

let games = {};

const CreateGame = () => {
  const room = randomString(5).toUpperCase();
  let targets = [];
  for (let i = 0; i < 5; i++) {
    targets.push(randomTarget());
  }
  games[room] = {
    room: room,
    targets: targets,
    users: [],
  };
  return {
    room: room,
    targets: targets,
    users: [],
  };
};

const AddUser = ({ id, name, room }) => {
  name = name.trim();
  room = room.trim();

  const existingUser = games[room].users.find((user) => user.id === id);

  if (existingUser) {
    return { error: 'Username is taken' };
  }

  let score = 0;

  const user = { id, name, room, score };
  games[room].users.push(user);
  return { user };
};

const GetTargets = (room) => {
  return games[room].targets;
};

const GetUser = (room) => {
  return games[room].users;
};

const Shooting = (name, room, _id) => {
  const i = games[room].targets.findIndex((target) => _id === target._id);
  const userI = games[room].users.findIndex((user) => name === user.name);
  if (i !== -1 && userI !== -1) {
    let newScore = games[room].users[userI].score;
    console.log(i);
    const score = games[room].targets[i].score;
    if (score) {
      newScore += score;
      games[room].users[userI].score = newScore;
    }
    games[room].targets.splice(i, 1);
  }
  games[room].targets.push(randomTarget());
  return games[room];
};

const removeUser = (id) => {
  const gameRoomAll = Object.keys(games);

  let index;

  for (let i = 0; i < gameRoomAll.length; i++) {
    index = games[gameRoomAll[i]].users.findIndex((user) => user.id === id);
    if (index !== -1) {
      return games[gameRoomAll[i]].users.splice(index, 1)[0];
    }
  }
};

const getRoom = () => Object.keys(games);

module.exports = {
  getRoom,
  CreateGame,
  AddUser,
  GetTargets,
  Shooting,
  GetUser,
  removeUser,
};
