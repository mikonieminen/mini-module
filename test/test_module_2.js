console.log("Executing test_module_2.js");

(function(exports) {
    exports.name = "Module 2";
    exports.callMe = function(cb) {
        setTimeout(function() {
            console.log("Module 2, timeout expired.");
            cb();
        }, 1000);
    };
})(typeof exports !== "undefined" ? exports : this.test_module_2 = {});
