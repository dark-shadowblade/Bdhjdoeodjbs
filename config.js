var config = {};

config.test = {
  "page": "https://webbrowsertools.com/useragent/?verbose=false&delay=true&method=ug"
};

config.default = {
  "useragent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_1_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.1 Mobile/15E148 Safari/604.1"
};

config.welcome = {
  set lastupdate (val) {app.storage.write("lastupdate", val)},
  get lastupdate () {return app.storage.read("lastupdate") !== undefined ? app.storage.read("lastupdate") : 0}
};

config.addon = {
  set state (val) {app.storage.write("state", val)},
  get state () {return app.storage.read("state") !== undefined ? app.storage.read("state") : "OFF"}
};

config.bypass = {
  set cache (val) {app.storage.write("cache", val)},
  get cache () {return app.storage.read("cache") !== undefined ? app.storage.read("cache") : true}
};

config.useragent = {
  set string (val) {app.storage.write("useragent", val)},
  get string () {return app.storage.read("useragent") !== undefined ? app.storage.read("useragent") : config.default.useragent}
};

config.filters = [
  {
    "world": "MAIN",
    "allFrames": true,
    "matches": ["*://*/*"],
    "runAt": "document_start",
    "matchOriginAsFallback": true,
    "id": "mobile-view-switcher-script",
    "js": ["data/content_script/page_context/inject.js"]
  }
];