;(function() {
    describe('Test "require()".', function(){
        it('Require using relative path', function(done) {
            try {
                var mod = require('./modules/test_module_1.js');
                if (mod && mod.name === "Module 1") {
                    done();
                } else if (mod) {
                    done(new Error("Expecting to get module with name 'Module 1', but got module with name '" + mod.name + "'"));
                } else {
                    done(new Error("Require retured null or undefined."));
                }
            } catch(err) {
                done(err);
            }
        });
        it('Require with absolute path should fail', function(done) {
            try {
                var mod = require('/test_module_1.js');
                done(new Error("Using absolute paths should throw error."));
            } catch(err) {
                if (err.message === "Absolute paths are not supported by require. Use relative path or module name.") {
                    done();
                } else {
                    done(err);
                }
            }
        });
        it('Require using module name', function(done) {
            try {
                var mod = require('test_module_1');
                if (mod && mod.name === "Module 1") {
                    done();
                } else if (mod) {
                    done(new Error("Expecting to get module with name 'Module 1', but got module with name '" + mod.name + "'"));
                } else {
                    done(new Error("Require retured null or undefined."));
                }
            } catch(err) {
                done(err);
            }
        });
    });
    describe('Test exporting API through "module".', function(){
        it('Get exports of module that uses "module.exports"', function(done) {
            try {
                var mod = require('./modules/test_module_3.js');
                if (mod && mod.name === "Module 3" && mod.callMe instanceof Function) {
                    done();
                } else if (mod && mod.callMe instanceof Function) {
                    done(new Error("Expecting to get module with name 'Module 3', but got module with name '" + mod.name + "'"));
                } else if (mod && mod.name === "Module 3") {
                    done(new Error("Expecting module to export method called 'callMe', but it does not exist."));
                } else {
                    done(new Error("Require retured null or undefined."));
                }
            } catch(err) {
                done(err);
            }
        });
    });
    describe('Test exporting API with "exports".', function(){
        it('Get exports of module that uses "exports"', function(done) {
            try {
                var mod = require('./modules/test_module_2.js');
                if (mod && mod.name === "Module 2" && mod.callMe instanceof Function) {
                    done();
                } else if (mod && mod.callMe instanceof Function) {
                    done(new Error("Expecting to get module with name 'Module 2', but got module with name '" + mod.name + "'"));
                } else if (mod && mod.name === "Module 2") {
                    done(new Error("Expecting module to export method called 'callMe', but it does not exist."));
                } else {
                    done(new Error("Require retured null or undefined."));
                }
            } catch(err) {
                done(err);
            }
        });
    });
})();
