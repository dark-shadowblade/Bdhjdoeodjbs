var core = {
  "start": function () {
    core.load();
  },
  "install": function () {
    core.load();
  },
  "load": async function () {
    await core.register.netrequest();
    /*  */
    app.button.icon(null, config.addon.state); 
    app.contextmenu.create({
      "contexts": ["action"],
      "id": "mobile-view-switcher", 
      "title": "What is my UserAgent?"
    }, app.error);
  },
  "action": {
    "storage": function (changes, namespace) {
      /*  */
    },
    "contextmenu": function () {
      app.tab.open(config.test.page);
    },
    "hotkey": function (e) {
      if (e) {
        if (e === "toggle-mobile-view") {
          core.action.button();
        }
      }
    },
    "button": async function () {
      config.addon.state = config.addon.state === "ON" ? "OFF" : "ON";
      /*  */
      await core.register.scripts();
      await core.register.netrequest();
      /*  */
      app.button.icon(null, config.addon.state);
      /*  */
      app.tab.query.active(function (tab) {
        if (tab && tab.id && tab.url) {
          const cond_1 = tab.url.indexOf("http") === 0;
          const cond_2 = tab.url.indexOf("file") === 0;
          /*  */
          if (cond_1 || cond_2) {
            if (tab.url.indexOf("//m.") === -1) {
              app.tab.reload(tab.id);
            } else {
              app.tab.update(tab.id, {
                "url": tab.url.replace("m.", '')
              });
            }
          }
        }
      });
    }
  },
  "register": {
    "scripts": async function () {
      await app.contentscripts.unregister();
      //
      if (config.addon.state === "ON") {
        if (config.useragent.string) {
          await app.contentscripts.register(config.filters);
        }
      }
    },
    "netrequest": async function () {
      await app.netrequest.display.badge.text(false);
      await app.netrequest.rules.remove.by.action.type("modifyHeaders", "requestHeaders");
      /*  */
      if (config.addon.state === "ON") {
        if (config.useragent.string) {
          app.netrequest.rules.push({
            "action": {
              "type": "modifyHeaders",
              "requestHeaders": [
                {
                  "operation": "set",
                  "header": "user-agent",
                  "value": config.useragent.string
                }
              ]
            },
            "condition": {
              "urlFilter": "*://*/*",
              "resourceTypes": [
                "ping",
                "other",
                "websocket",
                "sub_frame",
                "csp_report",
                "main_frame", 
                "xmlhttprequest"
              ]
            }
          });
          /*  */          
          await app.netrequest.rules.update();
        }
      }
    }
  }
};

app.options.receive("load", function () {
  app.options.send("storage", {
    "cache": config.bypass.cache,
    "useragent": config.useragent.string
  }, null);
});

app.page.receive("load", function (e) {
  if (config.addon.state === "ON") {
    if (config.useragent.string) {
      app.page.send("storage", {
        "useragent": config.useragent.string
      }, e ? e.tabId : null, e ? e.frameId : null);
    }
  }
});

app.options.receive("test", function () {app.tab.open(config.test.page)});
app.options.receive("support", function () {app.tab.open(app.homepage())});
app.options.receive("cache", function (e) {config.bypass.cache = e.cache});
app.options.receive("useragent", function (e) {config.useragent.string = e.useragent});
app.options.receive("donation", function () {app.tab.open(app.homepage() + "?reason=support")});

app.hotkey.on.pressed(core.action.hotkey);
app.button.on.clicked(core.action.button);
app.contextmenu.on.clicked(core.action.contextmenu);

app.on.startup(core.start);
app.on.installed(core.install);
app.on.storage(core.action.storage);
app.storage.load(core.register.scripts);