"use strict";

const Cell = require("./cell");
const { constant, usableStoneStatus, vector } = require("./constant");

module.exports = class Board {
  constructor () {
    this.initialize();
  }

  initialize () {
    this.cells = [];
    for (let i = 0; i < constant.lineLength; i++) {
      this.cells[i] = [];
      for (let j = 0; j < constant.rowLength; j++) {
        this.cells[i][j] = new Cell();
      }
    }
    this.cells[3][3].setStatus(constant.White);
    this.cells[4][4].setStatus(constant.White);
    this.cells[3][4].setStatus(constant.Black);
    this.cells[4][3].setStatus(constant.Black);
  }

  searchUsableCell () {
    for (let i = 0; i < constant.lineLength; i++) {
      for (let j = 0; j < constant.rowLength; j++) {
        this.cells[i][j].setUsable(usableStoneStatus.None);
      }
    }
    for (let i = 0; i < constant.lineLength; i++) {
      for (let j = 0; j < constant.rowLength; j++) {
        if (this.cells[i][j].getStatus() !== constant.Blank) {
          this.setUsable(i, j);
        }
      }
    }
  }

  getUsableCell (stone) {
    const list = [];
    for (let i = 0; i < constant.lineLength; i++) {
      for (let j = 0; j < constant.rowLength; j++) {
        if (stone === constant.Black) {
          if (this.cells[i][j].getUsable() === usableStoneStatus.Black ||
                        this.cells[i][j].getUsable() === usableStoneStatus.Both) {
            list.push({
              line: i,
              row: j
            });
          }
        } else if (stone === constant.White) {
          if (this.cells[i][j].getUsable() === usableStoneStatus.White ||
                        this.cells[i][j].getUsable() === usableStoneStatus.Both) {
            list.push({
              line: i,
              row: j
            });
          }
        }
      }
    }
    return list;
  }

  setStone (line, row, stone) {
    if (stone === constant.Black) {
      if (this.cells[line][row].getUsable() === usableStoneStatus.Black ||
              this.cells[line][row].getUsable() === usableStoneStatus.Both) {
        this.cells[line][row].setStatus(stone);
        this.reverseStone(line, row, stone);
        return true;
      }
      return false;
    } else if (stone === constant.White) {
      if (this.cells[line][row].getUsable() === usableStoneStatus.White ||
              this.cells[line][row].getUsable() === usableStoneStatus.Both) {
        this.cells[line][row].setStatus(stone);
        this.reverseStone(line, row, stone);
        return true;
      }
      return false;
    } else {
      return false;
    }
  }

  reverseStone (line, row, stone) {
    for (let i = line - 1; i <= line + 1; i++) {
      for (let j = row - 1; j <= row + 1; j++) {
        if (!(i === line && j === row) &&
                i >= 0 && i < constant.lineLength &&
                j >= 0 && j < constant.rowLength) {
          if (stone === constant.Black) {
            if (this.cells[i][j].getStatus() === constant.White) {
              const sandStone = this.getSandStone(i, j, line, row, constant.White);
              this.reverse(line, row, sandStone.count, sandStone.vector, stone);
            }
          } else if (stone === constant.White) {
            if (this.cells[i][j].getStatus() === constant.Black) {
              const sandStone = this.getSandStone(i, j, line, row, constant.Black);
              this.reverse(line, row, sandStone.count, sandStone.vector, stone);
            }
          }
        }
      }
    }
  }

  reverse (line, row, count, vectorStone, stone) {
    let x = line;
    let y = row;
    for (let cnt = 0; cnt < count; cnt++) {
      if (vectorStone === vector.BottomLeft) {
        x--;
        y++;
      } else if (vectorStone === vector.BottomCenter) {
        y++;
      } else if (vectorStone === vector.BottomRight) {
        x++;
        y++;
      } else if (vectorStone === vector.Left) {
        x--;
      } else if (vectorStone === vector.Right) {
        x++;
      } else if (vectorStone === vector.TopLeft) {
        x--;
        y--;
      } else if (vectorStone === vector.TopCenter) {
        y--;
      } else if (vectorStone === vector.TopRight) {
        x++;
        y--;
      }
      this.cells[x][y].setStatus(stone);
    }
  }

  setUsable (line, row) {
    for (let i = line - 1; i <= line + 1; i++) {
      for (let j = row - 1; j <= row + 1; j++) {
        if (this.isValidCell(line, row, i, j)) {
          const blackCount = this.puttableBlack(line, row, i, j);
          const whiteCount = this.puttableWhite(line, row, i, j);
          if (blackCount > 0) {
            if (whiteCount > 0) {
              this.cells[i][j].setUsable(usableStoneStatus.Both);
            } else {
              if (this.cells[i][j].getUsable() === usableStoneStatus.None) {
                this.cells[i][j].setUsable(usableStoneStatus.Black);
              } else if (this.cells[i][j].getUsable() === usableStoneStatus.White) {
                this.cells[i][j].setUsable(usableStoneStatus.Both);
              }
            }
          } else if (whiteCount > 0) {
            if (this.cells[i][j].getUsable() === usableStoneStatus.None) {
              this.cells[i][j].setUsable(usableStoneStatus.White);
            } else if (this.cells[i][j].getUsable() === usableStoneStatus.Black) {
              this.cells[i][j].setUsable(usableStoneStatus.Both);
            }
          }
        }
      }
    }
  }

  isValidCell (line, row, i, j) {
    return (!(i === line && j === row) &&
          i >= 0 && i < constant.lineLength &&
          j >= 0 && j < constant.rowLength &&
          this.cells[i][j].getStatus() === constant.Blank &&
          this.cells[i][j].getUsable() !== usableStoneStatus.Both);
  }

  puttableBlack (line, row, i, j) {
    if (this.cells[line][row].getStatus() === constant.Black) {
      return 0;
    }
    const count = this.getSandStone(line, row, i, j, constant.White).count;
    return count;
  }

  puttableWhite (line, row, i, j) {
    if (this.cells[line][row].getStatus() === constant.White) {
      return 0;
    }
    const count = this.getSandStone(line, row, i, j, constant.Black).count;
    return count;
  }

  getVector (line, row, i, j) {
    if (i === line - 1) {
      if (j === row - 1) {
        return vector.BottomRight;
      } else if (j === row) {
        return vector.Right;
      } else if (j === row + 1) {
        return vector.TopRight;
      } else {
        throw new Error("inValid Vector");
      }
    } else if (i === line) {
      if (j === row - 1) {
        return vector.BottomCenter;
      } else if (j === row) {
        return vector.Center;
      } else if (j === row + 1) {
        return vector.TopCenter;
      } else {
        throw new Error("inValid Vector");
      }
    } else if (i === line + 1) {
      if (j === row - 1) {
        return vector.BottomLeft;
      } else if (j === row) {
        return vector.Left;
      } else if (j === row + 1) {
        return vector.TopLeft;
      } else {
        throw new Error("inValid Vector");
      }
    } else {
      throw new Error("inValid Vector");
    }
  }

  getSandStone (line, row, i, j, stone) {
    const vectorStone = this.getVector(line, row, i, j);
    let x = line;
    let y = row;
    let count = 1;
    while (1) {
      if (vectorStone === vector.BottomLeft) {
        x--;
        y++;
      } else if (vectorStone === vector.BottomCenter) {
        y++;
      } else if (vectorStone === vector.BottomRight) {
        x++;
        y++;
      } else if (vectorStone === vector.Left) {
        x--;
      } else if (vectorStone === vector.Right) {
        x++;
      } else if (vectorStone === vector.TopLeft) {
        x--;
        y--;
      } else if (vectorStone === vector.TopCenter) {
        y--;
      } else if (vectorStone === vector.TopRight) {
        x++;
        y--;
      }
      if (!(x >= 0 && x < constant.lineLength &&
                y >= 0 && y < constant.rowLength)) {
        return 0;
      }
      if (this.cells[x][y].getStatus() === constant.Blank) {
        return 0;
      } else if (this.cells[x][y].getStatus() === stone) {
        count++;
      } else {
        break;
      }
    }
    return {
      count: count,
      vector: vectorStone
    };
  }

  getWinner () {
    let black = 0;
    let white = 0;
    for (let i = 0; i < constant.lineLength; i++) {
      for (let j = 0; j < constant.rowLength; j++) {
        if (this.cells[i][j].getStatus() === constant.Black) {
          black++;
        } else if (this.cells[i][j].getStatus() === constant.White) {
          white++;
        }
      }
    }
    if (black > white) {
      return constant.Black;
    } else if (white > black) {
      return constant.White;
    } else {
      return constant.Blank;
    }
  }

  printTable () {
    console.log("ーーーーーーーーーーーーーーーーー");
    for (let i = 0; i < constant.lineLength; i++) {
      let str = "｜";
      for (let j = 0; j < constant.rowLength; j++) {
        if (this.cells[i][j].getStatus() === constant.Black) {
          str += "黒｜";
        } else if (this.cells[i][j].getStatus() === constant.White) {
          str += "白｜";
        } else if (this.cells[i][j].getStatus() === constant.Blank) {
          str += `${this.cells[i][j].getUsable().toString().replace(/[A-Za-z0-9]/g, function (s) {
                        return String.fromCharCode(s.charCodeAt(0) + 0xFEE0);
                    })}｜`;
        }
      }
      console.log(str);
      console.log("ーーーーーーーーーーーーーーーーー");
    }
  }
};
