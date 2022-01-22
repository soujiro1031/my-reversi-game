"use strict";

const Board = require("./public/board");
const { constant } = require("./public/constant");

let winBlack = 0;
let winWhite = 0;
let drow = 0;
function randomPlayer(board, color) {
  const dataList = board.getUsableCell(color);
  if (dataList.length > 0) {
    const data = dataList[Math.floor(Math.random() * dataList.length)];
    // console.log(dataList);
    board.setStone(data.line, data.row, color);
    board.searchUsableCell();
    // board.printTable();
  }
}
function maxPlayer(board, color) {
  const dataList = board.getUsableCell(color);
  let max = 0;
  if (dataList.length > 0) {
    let trueList = [];
    for (let i = 0; i < dataList.length; i++) {
      const count = board.getReverseStoneCount(
        dataList[i].line,
        dataList[i].row,
        color
      );
      // console.log(
      //  `line: ${dataList[i].line}, row: ${dataList[i].row}, count: ${count}`
      // );
      if (count > 0) {
        if (count === max) {
          trueList.push({ line: dataList[i].line, row: dataList[i].row });
        }
        if (count > max) {
          trueList = [];
          trueList.push({ line: dataList[i].line, row: dataList[i].row });
          max = count;
        }
      }
    }
    if (trueList.length > 0) {
      // console.log(trueList);
      const data = trueList[Math.floor(Math.random() * trueList.length)];
      board.setStone(data.line, data.row, color);
      board.searchUsableCell();
      // board.printTable();
    }
  }
  return max;
}

function LookAheadPlayer(board, color) {
  const dataList = board.getUsableCell(color);
  if (dataList.length > 0) {
    let maxDiff = -64;
    let maxDiffList = [];
    for (let i = 0; i < dataList.length; i++) {
      const newBoard = board.deepcopyBoard();
      for (let j = 0; j < dataList.length; j++) {
        const data = dataList[j];
        const myCount = newBoard.getReverseStoneCount(
          data.line,
          data.row,
          color
        );
        newBoard.setStone(data.line, data.row, color);
        newBoard.searchUsableCell();
        let opponentCount = 0;
        if (color === constant.Black) {
          opponentCount = maxPlayer(newBoard.deepcopyBoard(), constant.White);
        } else {
          opponentCount = maxPlayer(newBoard.deepcopyBoard(), constant.White);
        }
        if (maxDiff === myCount - opponentCount) {
          maxDiffList.push({ line: data.line, row: data.row });
        } else if (maxDiff < myCount - opponentCount) {
          maxDiffList = [];
          maxDiffList.push({ line: data.line, row: data.row });
          maxDiff = myCount - opponentCount;
        }
      }
    }
    if (maxDiffList.length > 0) {
      // console.log(trueList);
      const data = maxDiffList[Math.floor(Math.random() * maxDiffList.length)];
      board.setStone(data.line, data.row, color);
      board.searchUsableCell();
      // board.printTable();
    }
  }
}

function blackPlayer(board) {
  // console.log("Black Turn");
  randomPlayer(board, constant.Black);
}

function whitePlayer(board) {
  // console.log("White Turn");
  LookAheadPlayer(board, constant.White);
}

function main() {
  const board = new Board();
  board.initialize();
  board.searchUsableCell();
  // board.printTable();
  for (let i = 0; i < 64; i++) {
    // console.log(`Turn: ${i + 1}`);
    blackPlayer(board);
    whitePlayer(board);
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

const time = performance.now();
for (let i = 0; i < 10000; i++) {
  main();
}
console.log(`time: ${performance.now - time}`);
console.log(`black win: ${winBlack}`);
console.log(`white win: ${winWhite}`);
console.log(`drow: ${drow}`);
