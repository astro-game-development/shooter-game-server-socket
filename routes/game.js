const express = require('express');
const { CreateGame, getRoom } = require('../helpers/game');
const router = express.Router();

router.get('/creategame', async (req, res) => {
  const game = CreateGame();
  res.json(game);
});

router.post('/joingame', (req, res) => {
  const Allroom = getRoom();
  console.log(Allroom);
  let i = Allroom.findIndex((e) => e === req.body.room);
  console.log('index', i);
  if (i !== -1) {
    console.log('true');
    res.status(200).json({ room: i });
  } else {
    res.status(400).send('Dont have room');
  }
});

module.exports = router;
