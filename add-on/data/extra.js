
var store = {};
var flag = 1;
var pageName = window.location.href;



if (pageName=="http://www.cs.ucy.ac.cy/~tchara05/popup_window_phone/data/default-settings.html") {
    if (!localStorage.hasOwnProperty("simple-settings")) {
        self.on('message', function (ss) {
            if (isEmpty(ss.storage)){
                ss.storage["simple-settings"] = "{}";
                ss.storage["advance-settings"] = "{}";
                localStorage.setItem("simple-settings", null);
            }else{
                localStorage.setItem("simple-settings", ss.storage["simple-settings"]);
            }
            loadSimple();
        });
        window.stop();
    }
    setInterval(saveSimpleSettings,300);

}else if (pageName=="http://www.cs.ucy.ac.cy/~tchara05/popup_window_phone/components/advance-settings.html") {
    if (!localStorage.hasOwnProperty("advance-settings")) {
        self.on('message', function (ss) {
            if (isEmpty(ss.storage)){
                ss.storage["advance-settings"] = "{}";
                ss.storage["simple-settings"] = "{}";
                localStorage.setItem("advance-settings", null);
            }else{
                localStorage.setItem("advance-settings", ss.storage["advance-settings"]);
            }
            loadAdvance();
        });
        window.stop();
    }
    setInterval(saveAdvanceSettings,300);

}else if (!localStorage.hasOwnProperty("page-name")) {
    localStorage.setItem("page-name",pageName);
    self.on('message', function (ss) {
        var userSets = {};
        console.log(ss);
        if (!isEmpty(ss.storage)){
            console.log(ss.storage);
            if ( isEmpty(userSets) && !isEmpty(JSON.parse(ss.storage["advance-settings"]))){
                userSets = checkForAdvance(JSON.parse(ss.storage["advance-settings"]));
            }
            if ( isEmpty(userSets) && !isEmpty(JSON.parse(ss.storage["simple-settings"]))){
                userSets = JSON.parse(ss.storage["simple-settings"]);
            }
        }
        if (!isEmpty(userSets)) {
            localStorage.setItem("settings", JSON.stringify(userSets));
        }
        console.log(localStorage.getItem("page-name"));
        loadPage();

    });
    localStorage.setItem("page-name",pageName);
    window.stop();

}else{

    if (localStorage.hasOwnProperty("settings")){
     createUserSettingsDeleteElement();
     deleteUserSettingsEvents();
    }
    localStorage.removeItem("settings");
    localStorage.removeItem("page-name");
}



function createUserSettingsDeleteElement(){
    var myScript = top.window.document.createElement('script');
    myScript.type = 'text/javascript';
    myScript.id="navigator";
    myScript.innerHTML = 'console.log("deleting"); var userSettings;' +
    'var nav=navigator; ' +
    'delete window.navigator;' +
    'window.navigator = {};' +
    'userSettings = JSON.parse(localStorage.getItem("settings"));  ' +
    '' +
    '' +
    'if (userSettings!=null){' +
    'for (var navkey in nav){' +
    '' +
    '   if (navkey=="mozNotification" && userSettings["notification"]==false){' +
    '       continue;' +
    '   }' +
    '   if (navkey=="mozContacts" && userSettings["mozContacts"]==false){' +
    '       delete mozContact;' +
    '   }' +
    ''  +
    '   if ((navkey=="getDeviceStorages" || navkey=="getDeviceStorage" || navkey=="getDeviceStorageByNameAndType") && userSettings["deviceStorage"]==false){' +
    '       continue;' +
    '   }' +
    '   if ( userSettings.hasOwnProperty(navkey) && userSettings[navkey]==false){' +
    '' +
    '       continue;' +
    '   }' +
    ''+
    '   window.navigator[navkey]=nav[navkey];' +
    ''+
    '}' +
    'if(userSettings.hasOwnProperty("indexedDB") && userSettings["indexedDB"]==false){' +
    '   delete indexedDB;' +
    '}' +
    'if(userSettings.hasOwnProperty("powerManager") && userSettings["powerManager"]==false){' +
    '   delete MozPowerManager;' +
    '}' +
    'if(userSettings.hasOwnProperty("notification") && userSettings["notification"]==false){' +
    '   delete Notification;' +
    '   delete DesktopNotificationCenter;' +
    '   delete DesktopNotification;' +
    '}' +
    'if(userSettings.hasOwnProperty("deviceStorage") && userSettings["deviceStorage"]==false){' +
    '   delete DeviceStorage;' +
    '   delete DeviceStorageChangeEvent;' +
    '   delete DeviceStorageAreaListener;' +
    '}' +
    '' +
    '}';
    top.window.content.document.getElementsByTagName('html')[0].insertBefore(myScript, document.getElementsByTagName("head")[0]);
}

function deleteUserSettingsEvents(){
    var mySecondScript =top.window.content.document.createElement('script');
    mySecondScript.type = 'text/javascript';
    mySecondScript.id="events";
    mySecondScript.innerHTML = '' +
    'if (userSettings!=null){' +
    'if (userSettings["deviceorientation"]==false){' +
    '     delete DeviceOrientationEvent;' +
    '     delete DeviceMotionEvent;  ' +
    '}' +
    '' +
    'if (userSettings["screenorientation"]==false){' +
    '   delete ScreenOrientation;' +
    '   ' +
    '}' +
    '' +
    'if (userSettings["devicelight"]==false){' +
    '  delete DeviceLightEvent' +
    '}' +
    '' +
    'if (userSettings["userproximity"]==false){' +
    '   delete UserProximityEvent;' +
    '   delete DeviceProximityEvent;' +
    '}' +
    '' +
    '' +
    '}';
    top.window.content.document.getElementsByTagName('html')[0].insertBefore(mySecondScript, document.getElementsByTagName("head")[0]);
}



function checkForAdvance(store){
    var distances = {};
    var DAYS = ["sunday","monday","tuesday","wednesday","thursday","friday","saturday"];
    var today = DAYS[new Date().getDay()];
    var sets = {};
    pageName= pageName.replace("http://","");
    pageName=pageName.replace("https://","");
    for(var key in store){
        if (pageName.indexOf(key)>-1){
            var dist = distanceString(pageName,key);
            distances[key] = dist;
        }
    }
    if (!isEmpty(distances)){
        var maxPageName = maxDistance(distances);
        if (maxPageName== undefined || maxPageName =="") { return {};}
        sets= store[maxPageName][today];
    }
    return sets;
}


function distanceString(str1,str2){

    var dist = 0;
    for (var i=0; i<str1.length && i<str2.length;i++){
        if (str1.charAt(i)==str2.charAt(i)){
            dist++;
        }else{
            return dist;
        }
    }

    return dist;
}


function maxDistance( t){
    var max = -1;
    var pageName = "";
    for (var key in t){
        if (t[key]>max){
            max = t[key];
            pageName = key;
        }
    }
    return pageName;
}




function saveSimpleSettings(){
    var value =localStorage.getItem("simple-settings");
    if( value==null||value==undefined){
        return ;
    }
    self.postMessage({"key":"simple-settings","value":value+""});


}
function saveAdvanceSettings(){
    if (!localStorage.hasOwnProperty("advance-settings")){return;}
    var value = localStorage.getItem("advance-settings");
    if( value==null||value==undefined  ){
        return ;
    }
    console.log("collecting");
    self.postMessage({"key":"advance-settings","value":value+""});


}

function isEmpty(e){

    for (var key in e){
        return false;
    }
    return true;
}


function loadSimple(){
    window.location.href="http://www.cs.ucy.ac.cy/~tchara05/popup_window_phone/data/default-settings.html";
}
function loadAdvance(){
    window.location.href="http://www.cs.ucy.ac.cy/~tchara05/popup_window_phone/components/advance-settings.html";
}

function loadPage(){
    window.location.href=localStorage.getItem("page-name");
}