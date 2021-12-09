"use strict";

const constant = Object.freeze({
  lineLength: 8,
  rowLength: 8,
  Blank: 1,
  Black: 2,
  White: 3
});

const usableStoneStatus = Object.freeze({
  None: 0,
  Black: 1,
  White: 2,
  Both: 3
});

const vector = Object.freeze({
  BottomLeft: 1,
  BottomCenter: 2,
  BottomRight: 3,
  Left: 4,
  Center: 5,
  Right: 6,
  TopLeft: 7,
  TopCenter: 8,
  TopRight: 9
});

module.exports = {
  constant, usableStoneStatus, vector
};
