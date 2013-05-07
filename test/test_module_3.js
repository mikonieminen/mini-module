console.log("Executing test_module_3.js");

(function(module) {
    var mod2 = require('./test_module_2.js');

    console.log("Required modules look like; test module 2: " + JSON.stringify(mod2, null, '\t'));

    mod2.callMe(function() {
        console.log("Got callback from mod2.callMe");
    });

    module.exports = {
        name: "Module 3"
    };
})(typeof module !== "undefined" ? module : null);
