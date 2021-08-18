const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const gameSchema = new mongoose.Schema({
  room: {
    type: String,
    unique: true,
  },
  target: [
    {
      _id: {
        type: mongoose.Schema.Types.ObjectId,
        index: true,
        required: true,
        auto: true,
      },
      x: Number,
      y: Number,
      size: Number,
    },
  ],
});

module.exports = mongoose.model('Game', gameSchema);
