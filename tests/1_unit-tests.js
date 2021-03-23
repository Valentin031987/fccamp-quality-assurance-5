const chai = require('chai');
const assert = chai.assert;

const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver;

suite('UnitTests', () => {

    test('Logic handles a valid puzzle string of 81 characters', function (done) {
        let puzzleString = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        let response = solver.validate(puzzleString);
        assert.isObject(response);
        assert.property(response, 'error');
        assert.isFalse(response.error);
        done();
    });

    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)', function (done) {
        let puzzleString = 'x.9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        let response = solver.validate(puzzleString);
        assert.isObject(response);
        assert.property(response, 'error');
        assert.equal(response.error, 'Invalid characters in puzzle');
        done();
    });

    test('Logic handles a puzzle string that is not 81 characters in length', function (done) {
        let puzzleString = '..i..n.v.a.l.i.d..32......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        let response = solver.validate(puzzleString);
        assert.isObject(response);
        assert.property(response, 'error');
        assert.equal(response.error, 'Expected puzzle to be 81 characters long');
        done();
    });

    test('Logic handles a valid row placement', function (done) {
        let puzzleString = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        let response = solver.checkRowPlacement(puzzleString, 0, '7');
        assert.isFalse(response);
        done();
    });

    test('Logic handles an invalid row placement', function (done) {
        let puzzleString = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        let response = solver.checkRowPlacement(puzzleString, 0, '5');
        assert.isTrue(response);
        done();
    });

    test('Logic handles a valid column placement', function (done) {
        let puzzleString = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        let response = solver.checkColPlacement(puzzleString, 1, '6');
        assert.isFalse(response);
        done();
    });

    test('Logic handles an invalid column placement', function (done) {
        let puzzleString = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        let response = solver.checkColPlacement(puzzleString, 1, '5');
        assert.isTrue(response);
        done();
    });

    test('Logic handles a valid region (3x3 grid) placement', function (done) {
        let puzzleString = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        let response = solver.checkRegionPlacement(puzzleString, 11, '1');
        assert.isFalse(response);
        done();
    });

    test('Logic handles a invalid region (3x3 grid) placement', function (done) {
        let puzzleString = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        let response = solver.checkRegionPlacement(puzzleString, 0, '9');
        assert.isTrue(response);
        done();
    });

    test('Valid puzzle strings pass the solver', function (done) {
        let puzzleString = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6..';
        let response = solver.solve(puzzleString);
        assert.isObject(response);
        assert.property(response, 'solution');
        assert.equal(response.solution, '769235418851496372432178956174569283395842761628713549283657194516924837947381625');
        done();
    });

    test('Invalid puzzle strings fail the solver', function (done) {
        let puzzleString = '..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9..8...1945....4.37.4.3..6..';
        let response = solver.solve(puzzleString);
        assert.isObject(response);
        assert.property(response, 'error');
        assert.equal(response.error, 'Puzzle cannot be solved');
        done();
    });

    test('Invalid puzzle strings fail the solver', function (done) {
        let puzzleString = '.................................................................................';
        let response = solver.solve(puzzleString);
        assert.isObject(response);
        assert.property(response, 'solution');
        assert.equal(response.solution, '123456789456789123789123456214365897365897214897214365531642978642978531978531642');
        done();
    });








});