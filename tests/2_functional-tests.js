const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {

    suite('/api/solve', () => {
        let urlApi = '/api/solve';

        test('Solve a puzzle with valid puzzle string: POST request to /api/solve', function (done) {
            const input = {
                puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
            }
            chai.request(server)
                .post(urlApi)
                .send(input)
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body);
                    assert.property(res.body, 'solution');
                    assert.equal(res.body.solution, '769235418851496372432178956174569283395842761628713549283657194516924837947381625')
                    done();
                });
        });

        test('Solve a puzzle with missing puzzle string: POST request to /api/solve', function (done) {
            const input = {
                //puzzle: "invalid string"
            }
            chai.request(server)
                .post(urlApi)
                .send(input)
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body);
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'Required field missing')
                    done();
                });
        });

        test('Solve a puzzle with invalid characters: POST request to /api/solve', function (done) {
            const input = {
                puzzle: "..i..n.v.al.i....d432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
            }
            chai.request(server)
                .post(urlApi)
                .send(input)
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body);
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'Invalid characters in puzzle')
                    done();
                });
        });

        test('Solve a puzzle with incorrect length: POST request to /api/solve', function (done) {
            const input = {
                puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3"
            }
            chai.request(server)
                .post(urlApi)
                .send(input)
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body);
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'Expected puzzle to be 81 characters long')
                    done();
                });
        });

        test('Solve a puzzle that cannot be solved: POST request to /api/solve', function (done) {
            const input = {
                puzzle: "..9..5.1.85.4....2432......1...69.83.9..8..6.62.71...9......1945....4.37.4.3..6.."
            }
            chai.request(server)
                .post(urlApi)
                .send(input)
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body);
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'Puzzle cannot be solved')
                    done();
                });
        });
    })

    suite('/api/check', () => {
        let urlApi = '/api/check';

        test('Check a puzzle placement with all fields: POST request to /api/check', function (done) {
            const input = {
                coordinate: "A1",
                value: "7",
                puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
            }
            chai.request(server)
                .post(urlApi)
                .send(input)
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body);
                    assert.property(res.body, 'valid');
                    done();
                });
        });

        test('Check a puzzle placement with single placement conflict: POST request to /api/check', function (done) {
            const input = {
                coordinate: "B1",
                value: "1",
                puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
            }
            chai.request(server)
                .post(urlApi)
                .send(input)
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body);
                    assert.property(res.body, 'valid');
                    assert.isFalse(res.body.valid);

                    assert.property(res.body, 'conflict');

                    assert.isArray(res.body.conflict)
                    assert.equal(res.body.conflict.length, 1)
                    done();
                });
        });


        test('Check a puzzle placement with multiple placement conflicts: POST request to /api/check', function (done) {
            const input = {
                coordinate: "A1",
                value: "1",
                puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
            }
            chai.request(server)
                .post(urlApi)
                .send(input)
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body);
                    assert.property(res.body, 'valid');
                    assert.isFalse(res.body.valid);

                    assert.property(res.body, 'conflict');

                    assert.isArray(res.body.conflict)
                    assert.equal(res.body.conflict.length, 2)
                    done();
                });
        });

        test('Check a puzzle placement with all placement conflicts: POST request to /api/check', function (done) {
            const input = {
                coordinate: "D7",
                value: "6",
                puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
            }
            chai.request(server)
                .post(urlApi)
                .send(input)
                .end(function (err, res) {
                    assert.equal(res.status, 200);
                    assert.isObject(res.body);
                    assert.property(res.body, 'valid');
                    assert.isFalse(res.body.valid);

                    assert.property(res.body, 'conflict');

                    assert.isArray(res.body.conflict)
                    assert.equal(res.body.conflict.length, 3)
                    done();
                });
        });        

        test('Check a puzzle placement with missing required fields: POST request to /api/check', function (done) {
            const input = {
                coordinate: "D7",
                value: "",
                puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
            }
            chai.request(server)
                .post(urlApi)
                .send(input)
                .end(function (err, res) {
                    assert.equal(res.status, 200);

                    assert.isObject(res.body);
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'Required field(s) missing');

                    done();
                });
        });  


        test('Check a puzzle placement with invalid characters: POST request to /api/check', function (done) {
            const input = {
                coordinate: "D7",
                value: "l",
                puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
            }
            chai.request(server)
                .post(urlApi)
                .send(input)
                .end(function (err, res) {
                    assert.equal(res.status, 200);

                    assert.isObject(res.body);
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'Invalid value');

                    done();
                });
        });  

        test('Check a puzzle placement with incorrect length: POST request to /api/check', function (done) {
            const input = {
                coordinate: "D7",
                value: "l",
                puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6......"
            }
            chai.request(server)
                .post(urlApi)
                .send(input)
                .end(function (err, res) {
                    assert.equal(res.status, 200);

                    assert.isObject(res.body);
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'Expected puzzle to be 81 characters long');

                    done();
                });
        });    
        
        test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check', function (done) {
            const input = {
                coordinate: "M9",
                value: "9",
                puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
            }
            chai.request(server)
                .post(urlApi)
                .send(input)
                .end(function (err, res) {
                    assert.equal(res.status, 200);

                    assert.isObject(res.body);
                    assert.property(res.body, 'error');
                    assert.equal(res.body.error, 'Invalid coordinate');

                    done();
                });
        });            


        test('Check a puzzle placement with invalid placement value: POST request to /api/check', function (done) {
            const input = {
                coordinate: "A1",
                value: "9",
                puzzle: "..9..5.1.85.4....2432......1...69.83.9.....6.62.71...9......1945....4.37.4.3..6.."
            }
            chai.request(server)
                .post(urlApi)
                .send(input)
                .end(function (err, res) {
                    assert.equal(res.status, 200);

                    assert.isObject(res.body);
                    assert.property(res.body, 'valid');
                    assert.isFalse(res.body.valid);

                    done();
                });
        });            




    })
    
    
    


});

