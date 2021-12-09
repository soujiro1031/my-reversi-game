"use strict";

const { constant, usableStoneStatus } = require("./constant");

module.exports = class Cell {
  constructor() {
    this.status = constant.Blank;
    this.usable = usableStoneStatus.None;
  }

  getStatus() {
    return this.status;
  }

  getUsable() {
    return this.usable;
  }

  setStatus(status) {
    this.status = status;
  }

  setStone(stone) {
    if (!(constant.Black === stone || constant.White === stone)) {
      throw new Error("Invalid Stone");
    }
    this.status = stone;
  }

  setUsable(usable) {
    if (
      !(
        usableStoneStatus.None === usable ||
        usableStoneStatus.Black === usable ||
        usableStoneStatus.White === usable ||
        usableStoneStatus.Both === usable
      )
    ) {
      throw new Error("Error");
    }
    this.usable = usable;
  }
};
