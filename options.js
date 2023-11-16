var background = (function () {
  var tmp = {};
  chrome.runtime.onMessage.addListener(function (request) {
    for (var id in tmp) {
      if (tmp[id] && (typeof tmp[id] === "function")) {
        if (request.path === "background-to-options") {
          if (request.method === id) {
            tmp[id](request.data);
          }
        }
      }
    }
  });
  /*  */
  return {
    "receive": function (id, callback) {
      tmp[id] = callback;
    },
    "send": function (id, data) {
      chrome.runtime.sendMessage({
        "method": id, 
        "data": data,
        "path": "options-to-background"
      }, function () {
        return chrome.runtime.lastError;
      });
    }
  }
})();

var config = {
  "render": function (e) {
    const cache = document.getElementById("cache");
    const useragent = document.getElementById("useragent");
    /*  */
    cache.checked = e.cache;
    useragent.value = e.useragent;
  },
  "load": function () {
    const test = document.getElementById("test");
    const cache = document.getElementById("cache");
    const support = document.getElementById("support");
    const donation = document.getElementById("donation");
    const useragent = document.getElementById("useragent");
    /*  */
    test.addEventListener("click", function () {background.send("test")});
    support.addEventListener("click", function () {background.send("support")});
    donation.addEventListener("click", function () {background.send("donation")});
    cache.addEventListener("change", function (e) {background.send("cache", {"cache": e.target.checked})});
    useragent.addEventListener("change", function (e) {background.send("useragent", {"useragent": e.target.value})});
    /*  */
    background.send("load");
    window.removeEventListener("load", config.load, false);
  }
};

background.receive("storage", config.render);
window.addEventListener("load", config.load, false);
