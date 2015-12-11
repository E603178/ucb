var ISDemo = ISDemo || {};

// Begin boilerplate code generated with Cordova project.

var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {

    }
};

app.initialize();

// End boilerplate code.

$(document).on("mobileinit", function (event, ui) {
    $.mobile.defaultPageTransition = "slide";
});

app.signInController = new ISDemo.SignInController();

$(document).on("pagecontainerbeforeshow", function (event, ui) {
    if (typeof ui.toPage == "object") {
        switch (ui.toPage.attr("id")) {
            case "page-signin":
                // Reset signin form.
                app.signInController.resetSignInForm();
                break;
        }
    }
});

$(document).delegate("#page-signin", "pagebeforecreate", function () {

    app.signInController.init();

    app.signInController.$btnSubmit.off("tap").on("tap", function () {
        app.signInController.onSignInCommand();
    });
});

$(document).delegate("#page-eventlist", "pagebeforecreate", function () {
    app.eventListController.init();

});

$(document).on("pagebeforeshow", "#page-eventlist", function(){
	var session = ISDemo.Session.getInstance().get();
    var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST", "https://webmessaging-test.ucb.com:9233/ucbboothdemo/Login", true);

	var sr = "<?xml version='1.0' encoding='UTF-8'?>";
	sr += "<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:wsu=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-utility-1.0.xsd\">";
	sr += "<soap:Header>";
	sr += "<wsse:Security xmlns:wsse=\"http:\//docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd\" xmlns=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd\" xmlns:env=\"http://schemas.xmlsoap.org/soap/envelope/\" soap:mustUnderstand=\"1\">";
	sr += "<wsse:UsernameToken xmlns:wsse=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd\" xmlns=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-wssecurity-secext-1.0.xsd\">";
	sr += "<wsse:Username>" + session.username + "<\/wsse:Username>";
	sr += "<wsse:Password Type=\"http:\//docs.oasis-open.org\/wss\/2004\/01\/oasis-200401-wss-username-token-profile-1.0#PasswordText\">"
			+ session.password + "<\/wsse:Password>";
	sr += "<\/wsse:UsernameToken>";
	sr += "<\/wsse:Security>";
	sr += "<\/soap:Header>";
	sr += "<soap:Body xmlns:ns1=\"http://xmlns.oracle.com/bpel/mobile/Notificationlist\">";
	sr += "<wsse:Username>" + session.username +"</wsse:Username>";
	sr += "<wsse:Password Type=\"http://docs.oasis-open.org/wss/2004/01/oasis-200401-wss-username-token-profile-1.0#PasswordText\">" + session.password + "</wsse:Password>";
	sr += "<\/soap:Body>";
	sr += "<\/soap:Envelope>";

	// Send the POST request
	xmlhttp.setRequestHeader("Accept", "application/xml", "text/xml", "\*/\*");
	xmlhttp.setRequestHeader("SOAPAction", "Login");
	xmlhttp.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
	//xmlhttp.send(sr);
	// send request
	// ...
	
	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4) {
			if (xmlhttp.status == 200) {

				// alert('done use firebug to see response');
				alert('Response' + xmlhttp.responseText);
			} else {
				alert('Error ' + xmlhttp.status);
			}
		}
	}	
    
    
    
    
    
    var response = "[{"EVT_STARTDATE":"2014-11-04T12:00:00+01:00","EVT_NAME":"testEvent","EVT_VENUE":"testVenue","EVT_MASTER_EVENTID":"EVR00000110","EVT_VENUE_CITY":"Braine"}," +
	"{"EVT_STARTDATE":"2014-11-03T00:00:00+01:00","EVT_NAME":"testEvent","EVT_VENUE":"testVenue","EVT_MASTER_EVENTID":"EVR00000130","EVT_VENUE_CITY":"Braine"}," +
	"{"EVT_STARTDATE":"2015-12-17T12:00:00+01:00","EVT_NAME":"IT Gov Dept Fair Cleanup","EVT_VENUE":"Kasteel Gravenhof","EVT_MASTER_EVENTID":"EVR00000840","EVT_VENUE_CITY":"Dworp"}," +
	"{"EVT_STARTDATE":"2015-12-17T12:00:00+01:00","EVT_NAME":"IT Governance Department Fair","EVT_VENUE":"Kasteel Gravenhof","EVT_MASTER_EVENTID":"EVR00000828","EVT_VENUE_CITY":"Dworp"}]";

movieInfo.result = result.results;
$.each(response, function(i, event) {
$('#page-eventlist').append('<li><a href="" data-id="' + event.EVT_MASTER_EVENTID + '"><h3>' + event.EVT_NAME + '</h3><p>' + event.EVT_STARTDATE.split("T") + ' - ' + event.EVT_VENUE_CITY + ' - ' + event.EVT_VENUE + '</p></a></li>');
});
$('#page-eventlist').listview('refresh');
    
    
});

$(document).on("pagecontainerbeforechange", function (event, ui) {

    if (typeof ui.toPage !== "object") return;
    
    switch (ui.toPage.attr("id")) {
        case "page-index":
            if (!ui.prevPage) {
                // Check session.keepSignedIn and redirect to main menu.
                var session = ISDemo.Session.getInstance().get(),
                    today = new Date();
                if (session && session.keepSignedIn && new Date(session.expirationDate).getTime() > today.getTime()) {
                    ui.toPage = $("#page-eventlist");                }
            }
    }
});