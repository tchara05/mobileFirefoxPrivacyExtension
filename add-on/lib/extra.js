function dummy(text, callback) {
  callback(text);
}
exports.dummy = dummy;

var self = require("sdk/self");
var data = require("sdk/self").data;
var pageMod = require("sdk/page-mod");
var tabs = require("sdk/tabs");
var ss = require("sdk/simple-storage");




var pageStart = pageMod.PageMod({
    include: "*",
    contentScriptFile: [self.data.url("extra.js")],
    contentScriptWhen:"start",
    onAttach: function(worker) {
        worker.postMessage(ss);
        worker.on('message', function(message) {
            ss.storage[message.key] = message.value;
        });
    }
});



