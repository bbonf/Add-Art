//this file checks to see if the add-on has been updated and, if true, will load a page on add-art.org

var addonart = {
  init: function AA_init() {
    // The preference services gives us access to about:config stuff
    var prefs = Components.classes["@mozilla.org/preferences-service;1"]
                             .getService(Components.interfaces.nsIPrefService);
    prefs = prefs.getBranch("add-art.org.prefs.");
    // The version service gives us access to versions defined in install.rdf
    var versionChecker = Components.classes["@mozilla.org/xpcom/version-comparator;1"]
                             .getService(Components.interfaces.nsIVersionComparator);
    var em = Components.classes["@mozilla.org/extensions/manager;1"]
                             .getService(Components.interfaces.nsIExtensionManager);
    var addon = em.getItemForID("development@add-art.org");
    var currentVersion = addon.version;
    var lastVersion = null;
    if (prefs.prefHasUserValue("currentVersion"))
      lastVersion = prefs.getCharPref("currentVersion");

    if (!lastVersion) {/* This is the first time this was installed */
      prefs.setCharPref("currentVersion", currentVersion);
      var url = "http://add-art.org/version.php?ver=" + currentVersion;
      gBrowser.selectedTab = gBrowser.addTab(url, null);
    } else if (versionChecker.compare(currentVersion,lastVersion) > 0) {
      /* just an updated version... */
      prefs.setCharPref("currentVersion", currentVersion);
      var url = "http://add-art.org/version.php?ver=" + currentVersion + "&prev=" + lastVersion;
      gBrowser.selectedTab = gBrowser.addTab(url, null);
    }
  }
}

window.addEventListener("load", addonart.init, false);