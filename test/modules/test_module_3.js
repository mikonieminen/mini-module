;(function(module) {
    var mod2 = module.require('./test_module_2.js');

    console.log("Required modules look like; test module 2: " + JSON.stringify(mod2, null, '\t'));

    function callMe() {
        console.log("Module 3 callMe.");
    }

    mod2.callMe(function() {
        console.log("Got callback from mod2.callMe, all done");
    });

    module.exports = {
        name: "Module 3",
        callMe: callMe
    };
})(typeof module !== "undefined" ? module : null);
