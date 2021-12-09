"use strict";

const Board = require("./board");
const { constant } = require("./constant");
const $ = require("jquery");

let gameCount = 1;

function result (board) {
  for (let i = 0; i < constant.lineLength; i++) {
    for (let j = 0; j < constant.rowLength; j++) {
      let str = "";
      if (board.cells[i][j].getStatus() === constant.Black) {
        str = "<p>黒</p>";
      } else if (board.cells[i][j].getStatus() === constant.White) {
        str = "<p>白</p>";
      } else {
        str = "<p>　</p>";
      }
      const tableTd = $(`#table_td__${i}__${j}`);
      tableTd.empty();
      tableTd.append(str);
    }
  }
  const winner = board.getWinner();
  $("#message_id").empty();
  if (winner === constant.Black) {
    $("#message_id").append("<p>黒の勝ち！</p>");
  } else if (winner === constant.White) {
    $("#message_id").append("<p>白の勝ち！</p>");
  } else if (winner === constant.Blank) {
    $("#message_id").append("<p>引き分け！</p>");
  }
}

function showTable (board) {
  let blankCount = 0;
  for (let i = 0; i < constant.lineLength; i++) {
    for (let j = 0; j < constant.rowLength; j++) {
      let str = "";
      if (board.cells[i][j].getStatus() === constant.Black) {
        str = `<button id="button__${i}__${j}">黒</button>`;
      } else if (board.cells[i][j].getStatus() === constant.White) {
        str = `<button id="button__${i}__${j}">白</button>`;
      } else {
        str = `<button id="button__${i}__${j}">　</button>`;
        blankCount++;
      }
      const tableTd = $(`#table_td__${i}__${j}`);
      tableTd.empty();
      tableTd.append(str);
      $(`#button__${i}__${j}`).on("click", () => {
        if (gameCount % 2 !== 0 && board.setStone(i, j, constant.Black)) {
          $("#message_id").empty();
          $("#message_id").append("<p>白のターン</p>");
          gameCount++;
        } else if (gameCount % 2 === 0 && board.setStone(i, j, constant.White)) {
          $("#message_id").empty();
          $("#message_id").append("<p>黒のターン</p>");
          gameCount++;
        }
        board.searchUsableCell();
        showTable(board);
        board.printTable();
      });
    }
  }
  if (blankCount <= 0) {
    result(board);
  }
}

$(() => {
  const tableDiv = $("#table_div");
  tableDiv.append("<table id=\"table_table\"></table>");
  const tableTable = $("#table_table");
  for (let i = 0; i < constant.lineLength; i++) {
    tableTable.append(`<tr id="table_tr${i}"></tr>`);
    const tableTr = $(`#table_tr${i}`);
    for (let j = 0; j < constant.rowLength; j++) {
      tableTr.append(`<td id="table_td__${i}__${j}"></td>`);
    }
  }
  const board = new Board();
  board.initialize();
  board.searchUsableCell();
  showTable(board);
  board.printTable();
  $("#message_id").append("<p>黒のターン</p>");
});
