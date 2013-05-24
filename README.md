
# About #

Mini-module is about providing node.js *module*, *exports* and *require* functionality in browsers. Idea is to provide as close as possible experience with a minimalistic framework.

# Usage #

All code that works in node.js should work in the browser as long as all required modules are implemented.

Examples under "test" introduce also a pattern for writing modules such a way that global namespace is not polluted when running the code inside a browsers. Using proper encapsulation is important especially when modules might be required by multiple modules. The modularization pattern used here works well for browsers and node.js (though in node.js it provides no additional value).

The pattern for modularization should follow appoach:
```javascript
(function(exports) {
    var otherMod = require(...);
    var localVar = "my var";

    exports.getLocals = function() {
        return { localVar: localVar };
    };
})(typeof exports !== "undefined" ? exports : this.myNamespace = {});
```

If you use module instead of exports when setting exports, you should have:
```javascript
(function(module) {
    ...
    function thing1() {
    }

    function thing2() {
    }

    module.exports = {
        thing1: thing1,
	thing2: thing2
    };
})(typeof module !== "undefined" ? module : null);
```

In general the module should have format:
```javascript
(function(module or exports) {
    // Require other modules needed by this module
    var mod1 = require("./module1.js");
    var mod2 = require("module2");

    // Module's internal variables
    var private1 = null;
    var private2 = null;

    // Module's private methods
    function myPrivateFunc1() {
        // ...
    }


    // Module's public methods
    function myPublicFunc1() {
        // ...
    }

    function myPublicFunc2() {
        // ...
    }
    
    // Use module object for defining the API
    module.exports = {
        myPublicFunc1: myPublicFunc1,
    	myPublicFunc2: myPublicFunc2
    };

    // Use exports for defining the API
    exports.myPublicFunc1 = myPublicFunc1;
    exports.myPublicFunc2 = myPublicFunc2;

})(module or exports object);
```

In HTML you should have your modules included in the head:
```html
<script src="javascripts/myModule.js" data-module-name="myModule"></script>
```

Attribute data-module-name allows you to use module names instead of relative paths when calling require. This is handy especially when writing replacement module for something that is provided by node.js or used as npm module.

# Examples #

Under "test" you can find some test code that show some basic use cases.

# Restrictions #

## Using require ##

Use require in the body of your module so that when the module is evaluated/executed relative paths can be calculated correctly. Relative paths require that you can get the currently running script and that script needs to match to file that calls require. If require is used in callbacks or some methods called by some other script, then currentScript will point to wrong script and required module might not be found. Other solution is to use module names when using require, those will work in any place require is called.

## Minimizing the code ##

Do not minimize your code into single file, mini-module does not work well together with that. Minimizing individual modules works just fine.
