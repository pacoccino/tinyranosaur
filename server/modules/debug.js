var Debug = {};

Debug.logConsole = process.env.DEBUG || false;;

Debug.log = function(message) {
    if(Debug.logConsole) {
        console.log(message)
    }
};

Debug.error = function(message) {
    if(Debug.logConsole) {
        console.error(message)
    }
};

module.exports = Debug;
