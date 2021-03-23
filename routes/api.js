'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {

  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      let { puzzle, coordinate, value } = req.body
      res.json(solver.ceckCoordinate(puzzle, coordinate, value))
    });

  app.route('/api/solve')
    .post((req, res) => {
      let { puzzle } = req.body
      res.json(solver.solve(puzzle))
    });
};
