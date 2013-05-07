(function() {
    var modulesByName = {};
    var modulesByURL = {};

    var documentRoot = document.location.href.substr(0, document.location.href.lastIndexOf('/') + 1);

    function currentScript() {
        var s;
        var url;
        var l;
        var scripts;
        if (document.currentScript) {
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
        return s;
    }

    function getFullURL(url) {
        var a = document.createElement('a');
        a.href = url;
        return a.href;
    }

    function Module(url, name) {
        this.exports = {};
        this.url = url;
        this.name = name;
    }

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

    window.require = function(module) {
        var moduleObj;
        if (module.match(/.*\.js$/)) {
            moduleObj = modulesByURL[getFullURL(module)];
        } else {
            moduleObj = modulesByName[module];
        }
        if (moduleObj instanceof Module) {
            return moduleObj.exports;
        } else {
            throw new Error("Cannot find module '" + module + "'");
        }
    };
})();
