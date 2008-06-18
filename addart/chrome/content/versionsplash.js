//this file checks to see if the add-on has been updated and, if true, will load a page on add-art.org

var addonart = {
	
  init: function() {
    var consoleService = Components.classes["@mozilla.org/consoleservice;1"]
                                   .getService(Components.interfaces.nsIConsoleService);
    consoleService.logStringMessage("Checking if versionsplash has started");
    // The preference services gives us access to about:config stuff
    var prefs = Components.classes["@mozilla.org/preferences-service;1"]
                             .getService(Components.interfaces.nsIPrefService);
    prefs = prefs.getBranch("extensions.add-art."); // jamie sez: note change of branch, more common
    var currentVersion = null, lastVersion = null;
    
    try {
      // The version service gives us access to versions defined in install.rdf
      var versionChecker = Components.classes["@mozilla.org/xpcom/version-comparator;1"]
                               .getService(Components.interfaces.nsIVersionComparator);
      var em = Components.classes["@mozilla.org/extensions/manager;1"]
                               .getService(Components.interfaces.nsIExtensionManager);
      
      var addon = em.getItemForID("development@add-art.org");
      consoleService.logStringMessage("addon = "+addon);
      currentVersion = addon.version;
    }
    catch(e) {
      consoleService.logStringMessage("EXCEPTION!  "+e.name+": "+e.message);
      consoleService.logStringMessage("Faking a version to continue with execution...");
      var currentVersion = "0.0.0";
    }

    if (prefs.prefHasUserValue("currentVersion"))
      lastVersion = prefs.getCharPref("currentVersion");
  
    consoleService.logStringMessage("current version = "+currentVersion+", last = " + lastVersion);
    if (!lastVersion) { /* This is the first time this was installed */
      consoleService.logStringMessage("First time this was installed");
      prefs.setCharPref("currentVersion", currentVersion);
      consoleService.logStringMessage("we set the version in about config, eh what?");
      var url = "http://add-art.org/install/?version=" + currentVersion;
      // gBrowser.selectedTab = gBrowser.addTab(url, null);
      // Useful for loading a mini tutorial
      window.setTimeout(function(){
        gBrowser.selectedTab = gBrowser.addTab(url);
      }, 1500); //Firefox 2 fix - or else tab will get closed
    } 
    else if (versionChecker.compare(currentVersion,lastVersion) > 0) {
      /* just an updated version... */
      consoleService.logStringMessage("updatedVersion");
      prefs.setCharPref("currentVersion", currentVersion);
      var url = "http://add-art.org/install/?version=" + currentVersion + "&previous=" + lastVersion;
      // gBrowser.selectedTab = gBrowser.addTab(url, null);
      // Useful for loading a mini tutorial
      window.setTimeout(function(){
        gBrowser.selectedTab = gBrowser.addTab(url);
      }, 1500); //Firefox 2 fix - or else tab will get closed
    }    
    window.removeEventListener("load",function(){ addonart.init(); },true);    
  }
};


window.addEventListener("load", function(){ addonart.init(); }, true);
