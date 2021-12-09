"use strict";

const Board = require("./board");
const { constant } = require("./constant");

let winBlack = 0;
let winWhite = 0;
let drow = 0;
function main () {
  const board = new Board();
  board.initialize();
  board.searchUsableCell();
  // board.printTable();
  for (let i = 0; i < 64; i++) {
    // console.log(`Turn: ${i + 1}`);
    let dataList = board.getUsableCell(constant.Black);
    if (dataList.length > 0) {
      const data = dataList[Math.floor(Math.random() * dataList.length)];
      // console.log(`Put Black: (${data.line}, ${data.row})`);
      board.setStone(data.line, data.row, constant.Black);
      board.searchUsableCell();
      // board.printTable();
    } else {
      // console.log("Pass Black");
    }
    dataList = board.getUsableCell(constant.White);
    if (dataList.length > 0) {
      const data = dataList[Math.floor(Math.random() * dataList.length)];
      // console.log(`Put White: (${data.line}, ${data.row})`);
      board.setStone(data.line, data.row, constant.White);
      board.searchUsableCell();
      // board.printTable();
    } else {
      // console.log("Pass White");
    }
  }
  const winner = board.getWinner();
  if (winner === constant.Black) {
    winBlack++;
  } else if (winner === constant.White) {
    winWhite++;
  } else if (winner === constant.Blank) {
    drow++;
  }
}
for (let i = 0; i < 10000; i++) {
  main();
}
console.log(`black win: ${winBlack}`);
console.log(`white win: ${winWhite}`);
console.log(`drow: ${drow}`);
