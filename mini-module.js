/**
 * @author Miko Nieminen <miko.nieminen@iki.fi>
 * @license {@link http://opensource.org/licenses/MIT|MIT}
 *
 * @name mini-module
 * @module
 *
 * @example <caption>Writing module and using exports.</caption>
 * (function(exports) {
 *
 *     var message = "Hello";
 *
 *     exports.mesage = message;
 *
 * })(typeof exports !== "undefined" ? exports : this.myModule = {});
 *
 * @example <caption>Writing module and using module.exports.</caption>
 * (function(module) {
 *
 *     var message = "Hello";
 *
 *     module.exports = {
 *         message: message
 *     };
 *
 * })(typeof module !== "undefined" ? module : null);
 *
 * @example <caption>Using require.</caption>
 * (function(module) {
 *     // Require by module name
 *     var otherModule = require("other-module-name");
 *
 *     // Require by relative path to another module
 *     var anotherModule = require("../another_module.js");
 *
 *     var message = "Hello";
 *
 *     function hello() {
 *         console.log(message);
 *     }
 *
 *     module.exports = {
 *         message: message,
 *         hello: hello
 *     };
 *
 * })(typeof module !== "undefined" ? module : null);
 */

/**
 * @external window
 */

/**
 * @external document
 */
(function() {
    "use strict"

    /**
     * Maps module names to module objects.
     *
     * @name module:mini-module.modulesByName
     * @property {Object.<string, mini-module.Module>} Maps module names to Module objects.
     * @private
     */
    var modulesByName = {};

    /**
     * Maps module URLs to module objects.
     *
     * @name module:mini-module.modulesByURL
     * @property {Object.<String, mini-module.Module>} Mas URLs to Module objects.
     * @private
     */
    var modulesByURL = {};

    if (document) {
        var documentRoot = document.location.href.substr(0, document.location.href.lastIndexOf('/') + 1);
        modulesByURL[document.location.href] = new Module(document.location.href);
    }

    /**
     * Function to polyfill currentScript implementation in
     * browsers that do not support it yet.
     *
     * @name module:mini-module.currentScript
     * @private
     * @returns Script element matching with currently running script.
     */
    function currentScript() {
        var s;
        var url;
        var l;
        var scripts;
        if (document && document.currentScript) {
            // By default use document.currentScript if supported
            s = document.currentScript;
        } else {
            // If document.currentScript is not supported, throw an error
            // and parse current script from the stack.
            try {
                throw new Error();
            } catch (e) {
                l = e.stack.indexOf(" at ") !== -1 ? " at " : "@";

                // In known browsers, last line of the stack defines the current script.
                url = e.stack.substring(e.stack.lastIndexOf(l) + l.length);
                if (l === " at ") {
                    // In Chrome, last line in stack has URL in format: " at <url>:<line>:<column>"
                    url = url.substring(0, url.lastIndexOf(':', url.lastIndexOf(':') - 1));
                } else if (l === "@") {
                    // In Firefox, last line in stack has URL in format: "<function>@<url>:<line>"
                    url = url.substring(url.indexOf(l), url.lastIndexOf(':'));
                } else {
                    throw new Error("Unsupported browser.");
                }

                // Find the matching script element from DOM
                scripts = document.getElementsByTagName("script");
                for (var i = 0; i < scripts.length; i++) {
                    if (scripts[i].src === url) {
                        s = scripts[i];
                        break;
                    }
                }
            }
        }
        if (!s) {
            s = document.location.href;
        }
        return s;
    }

    /**
     * Helper to turn any URL to absolute URL
     *
     * @name module:mini-module.getFullURL
     * @private
     * @returns Return URL in absolute form
     */
    function getFullURL(url) {
        var a = document.createElement('a');
        a.href = url;
        return a.href;
    }

    function getDirName(url) {
        var a = document.createElement('a');
        a.href = url;
        return a.pathname.substr(0, a.pathname.lastIndexOf('/') + 1);
    }

    /**
     * Module.
     *
     * @name module:mini-module.Module
     * @constructor
     * @private
     *
     * @param {String} url Full URL that was used to load the module.
     * @param {String} name Name of the module.
     *
     * @property {Object} exports Object that contains module's public API.
     * @property {String} url URL used to load the module.
     * @property {String} name Name of the module.
     * @property {String} dirname Pathname of module until last '/'.
     */
    function Module(url, name) {
        this.exports = {};
        this.url = url;
        this.name = name;
        this.dirname = getDirName(url);
    }

    /**
     * Actual require functionality used by modules.
     *
     * @param {String} id Either relative path to module (relative to caller) or module name.
     * @returns Return module matching passed ID.
     */
    Module.prototype.require = function(id) {
        var module;
        if (id.match(/^\/.*$/)) {
            throw new Error("Absolute paths are not supported by require. Use relative path or module name.");
        } else if (id.match(/^.*\.js$/)) {
            // console.log("Module: " + this.name + ", url: " + this.url + ", dirname: " + this.dirname);
            module = modulesByURL[getFullURL(this.dirname + id)];
        } else {
            module = modulesByName[id];
        }
        if (module instanceof Module) {
            return module.exports;
        } else {
            throw new Error("Cannot find module '" + id + "'");
        }
    };

    /**
     * Exports object that allows modules to export their API.
     *
     * @name external:window.exports
     * @see {@link http://nodejs.org/api/modules.html#modules_module_exports|Node.js module.exports}
     */
    Object.defineProperty(window, "exports", {
        configurable: false,
        enumerable: true,
        get: function() {
            var script = currentScript();
            var url = getFullURL(script.src);
            var name = script.dataset["moduleName"];
            var module = null;

            if (modulesByURL[url]) {
                // console.log("window.exports, found module by URL: " + url);
                module = modulesByURL[url];
            } else if (modulesByName[name]) {
                // console.log("window.exports, found module by name: " + name);
                module = modulesByName[name];
            } else {
                // console.log("window.exports, new module name: " + name + ", URL: " + url);
                module = new Module(url, name);
                if (name) {
                    modulesByName[name] = module;
                }
                modulesByURL[url] = module;
            }
            // console.log("window.exports, return exports of module: " + JSON.stringify(module));
            // console.log("\n");
            return module.exports;
        }
    });

    /**
     * This exposes Module object to module during module evaluation.
     * This implementation proves similar functionality as node.js modules,
     * but is incomplete implementation.
     *
     * @name external:window.module
     * @see {@link http://nodejs.org/api/modules.html|Node.js module}
     */
    Object.defineProperty(window, "module", {
        configurable: false,
        enumerable: true,
        get: function() {
            var script = currentScript();
            var url = getFullURL(script.src);
            var name = script.dataset["moduleName"];
            var module = null;

            if (modulesByURL[url]) {
                // console.log("window.module, found module by URL: " + url);
                module = modulesByURL[url];
            } else if (modulesByName[name]) {
                // console.log("window.module, found module by name: " + name);
                module = modulesByName[name];
            } else {
                // console.log("window.module, new module name: " + name + ", URL: " + url);
                module = new Module(url, name);
                if (name) {
                    modulesByName[name] = module;
                }
                modulesByURL[url] = module;
            }
            // console.log("window.module, return module: " + JSON.stringify(module));
            // console.log("\n");
            return module;
        }
    });

    /**
     * This implementation of node.js module.require(id).
     *
     * @name external:window.require
     * @see {@link http://nodejs.org/api/modules.html#modules_module_require_id|Node.js module.require(id)}
     */
    Object.defineProperty(window, "require", {
        configurable: false,
        enumerable: true,
        get: function() {
            var module = null;
            var script = currentScript();
            var url = null;
            var name = null;

            if (!script) {
                url = getFullURL(script.src);
                name = script.dataset["moduleName"];
            } else {
                url = document.location.href;
                name = null;
            }

            if (name && modulesByName[name]) {
                // console.log("window.module, found module by name: " + name);
                module = modulesByName[name];
            } else if (modulesByURL[url]) {
                // console.log("window.module, found module by URL: " + url);
                module = modulesByURL[url];
            } else {
                throw new Error("Cannot find matching module.");
            }
            // console.log("window.module, return module: " + JSON.stringify(module));
            // console.log("\n");
            return module.require.bind(module);
        }
    });
})();
