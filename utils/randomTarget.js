const { v4 } = require('uuid');
var _ = require('lodash');

function randomTarget() {
  let size = _.random(100, 400);
  const result = {
    _id: v4(),
    x: _.random(0, 600),
    y: _.random(0, 600),
    size: size,
    score: 40 - Math.floor(size / 10),
  };

  return result;
}

module.exports.randomTarget = randomTarget;
