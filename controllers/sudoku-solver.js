const REGIONS = [
  1, 1, 1, 2, 2, 2, 3, 3, 3,
  1, 1, 1, 2, 2, 2, 3, 3, 3,
  1, 1, 1, 2, 2, 2, 3, 3, 3,

  4, 4, 4, 5, 5, 5, 6, 6, 6,
  4, 4, 4, 5, 5, 5, 6, 6, 6,
  4, 4, 4, 5, 5, 5, 6, 6, 6,

  7, 7, 7, 8, 8, 8, 9, 9, 9,
  7, 7, 7, 8, 8, 8, 9, 9, 9,
  7, 7, 7, 8, 8, 8, 9, 9, 9
];

const COORDINATES = [
  'A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9',
  'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9',
  'C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9',
  'D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9',
  'E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9',
  'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9',
  'G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9',
  'H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9',
  'I1', 'I2', 'I3', 'I4', 'I5', 'I6', 'I7', 'I8', 'I9',
];

class SudokuSolver {

  validate(puzzleString) {

    if (!puzzleString) {
      return { error: 'Required field missing' }
    }

    if (this.invalidPuzzleLength(puzzleString)) {
      return { error: 'Expected puzzle to be 81 characters long' }
    }

    if (this.invalidChars(puzzleString)) {
      return { error: 'Invalid characters in puzzle' }
    }

    return { error: false }
  }

  checkRowPlacement(puzzleString, index, value) {
    let coord = COORDINATES[index]
    let regionIndex = this.getCoordinates(COORDINATES, coord[0])
    let regionItems = regionIndex.map(item => puzzleString[item])
    return regionItems.indexOf(value.toString()) > -1
  }

  checkColPlacement(puzzleString, index, value) {
    let coord = COORDINATES[index]
    let regionIndex = this.getCoordinates(COORDINATES, coord[1])
    let regionItems = regionIndex.map(item => puzzleString[item])
    return regionItems.indexOf(value.toString()) > -1
  }

  getCoordinates(array, searched) {
    return array.map((item, index) => item.indexOf(searched) > -1 ? index : -1).filter(item => item > -1)
  }

  checkRegionPlacement(puzzleString, index, value) {
    let indexRegion = this.getRegions(REGIONS, REGIONS[index])
    let itemsRegion = indexRegion.map(item => puzzleString[item])
    return itemsRegion.indexOf(value.toString()) > -1
  }

  getRegions(array, searched) {
    return array.map((item, index) => item === searched ? index : -1).filter(item => item > -1)
  }

  getDots(puzzleString) {
    let dots = this.getRegions([...puzzleString], '.')
    return dots;
  }

  invalidNumber(number) {
    return !number.match(/[1-9]/)
  }

  invalidPuzzleLength(puzzleString) {
    return puzzleString.length != 81
  }

  invalidChars(puzzleString) {
    let s = puzzleString.replace(/[1-9.]/g, '');
    return s.length > 0
  }

  ceckCoordinate(puzzleString, coordinate, value) {
    if (!puzzleString || !coordinate || !value) {
      return { error: 'Required field(s) missing' }
    }

    let validate = this.validate(puzzleString)
    if (validate.error != false) {
      return validate
    }

    let index = COORDINATES.indexOf(coordinate.toUpperCase())
    if (index <= -1) {
      return { error: 'Invalid coordinate' }
    }

    if (this.invalidNumber(value)) {
      return { error: 'Invalid value' }
    }

    if(puzzleString[index] == value){
      return { "valid": true }
    }

    let conflict = []
    if (this.checkRowPlacement(puzzleString, index, value)) {
      conflict.push("row")
    }
    if (this.checkColPlacement(puzzleString, index, value)) {
      conflict.push("column")
    }
    if (this.checkRegionPlacement(puzzleString, index, value)) {
      conflict.push("region")
    }

    if (conflict.length) {
      return { "valid": false, "conflict": conflict }
    }

    return { "valid": true }
  }

  getNewValue(number) {
    return (Number.parseInt(number) + 1) >= 9 ? 9 : (Number.parseInt(number) + 1)
  }

  solve(puzzleString) {

    let validate = this.validate(puzzleString)
    if (validate.error != false) {
      return validate
    }

    let dots = this.getDots(puzzleString)
    let tempString = [...puzzleString]
    let restoreString = [...puzzleString]
    let j = 1
    let goingBack = false

    let i = 0;

    while (i >= 0 && i < dots.length) {

      let changed = false
      let initValue = 1
      let pos = dots[i]

      if (goingBack) {
        initValue = this.getNewValue(tempString[pos])
        tempString = [].concat(tempString.slice(0, pos + 1), restoreString.slice(pos + 1 - restoreString.length))
      }

      for (let value = initValue; value <= 9; ++value) {
        if (this.checkRowPlacement(tempString, pos, value) ||
          this.checkColPlacement(tempString, pos, value) ||
          this.checkRegionPlacement(tempString, pos, value)
        ) {
          continue
        }
        tempString[pos] = value.toString()
        changed = true
        i++
        break
      }//end for 1-9 

      goingBack = false
      if (!changed) {
        i--
        goingBack = true
      }

      console.log(tempString.join(''), '-', j)
      j++
      if (i < 0 && !changed || i > puzzleString.length || tempString.indexOf('.') <= -1) {
        break
      }

    }//end while

    if (tempString.indexOf('.') > -1) {
      return { error: 'Puzzle cannot be solved' }
    } else {
      return { solution: tempString.join('') }
    }

  }
}

module.exports = SudokuSolver;