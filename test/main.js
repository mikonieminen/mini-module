console.log("Executing main.js");
document.addEventListener("readystatechange", function() {
    if (document.readyState == "complete") {
        console.log("main: ready state change, complete");
    } else {
        console.log("main: ready state change:", document.readyState);
    }
});
