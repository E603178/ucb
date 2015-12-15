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

var eventInfo = {
	    id : null,
	    result : null
	}

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



$(document).on("pagebeforeshow", "#page-eventlist", function(){
	var session = ISDemo.Session.getInstance().get();    
    var response = ISDemo.Events;     
    response = jQuery.parseJSON('[{"EVT_STARTDATE":"2014-11-04T12:00:00+01:00","EVT_NAME":"testEvent","EVT_VENUE":"testVenue","EVT_MASTER_EVENTID":"EVR00000110","EVT_VENUE_CITY":"Braine"},' +
	'{"EVT_STARTDATE":"2014-11-03T00:00:00+01:00","EVT_NAME":"testEvent","EVT_VENUE":"testVenue","EVT_MASTER_EVENTID":"EVR00000130","EVT_VENUE_CITY":"Braine"},' +
	'{"EVT_STARTDATE":"2015-12-17T12:00:00+01:00","EVT_NAME":"IT Gov Dept Fair Cleanup","EVT_VENUE":"Kasteel Gravenhof","EVT_MASTER_EVENTID":"EVR00000840","EVT_VENUE_CITY":"Dworp"},' +
	'{"EVT_STARTDATE":"2015-12-17T12:00:00+01:00","EVT_NAME":"IT Governance Department Fair","EVT_VENUE":"Kasteel Gravenhof","EVT_MASTER_EVENTID":"EVR00000828","EVT_VENUE_CITY":"Dworp"}]');
    
    $('#event-list').empty();
    $.each(response, function(i, event) {	
    	$('#event-list').append('<li><a href="" data-id="' + event.EVT_MASTER_EVENTID + '"><h3>' + event.EVT_NAME + '</h3><p>' + event.EVT_STARTDATE.split("T")[0] + ' - ' + event.EVT_VENUE_CITY + ' - ' + event.EVT_VENUE + '</p></a></li>');
    });
    $('#event-list').listview('refresh');
    
    
});

$(document).on('vclick', '#event-list li a', function(){  
    eventInfo.id = $(this).attr('data-id');
    //TODO inserd soap call here to get data for specific event.
    
    var event = jQuery.parseJSON('{"EVT_STARTDATE":"2014-11-03T00:00:00+01:00","EVT_ENDDATE":"2014-11-03T00:00:00+01:00","EVT_NAME":"testEvent","EVT_VENUE":"testVenue","EVT_MASTER_EVENTID":"EVR00000130","EVT_VENUE_CITY":"Braine"}');
    $('#event-data').empty();
	$('#event-data').append('<li><h3>' + event.EVT_NAME + '</h3>'
			+ '<p>' + event.EVT_STARTDATE.split("T")[0] + ' - ' + event.EVT_ENDDATE.split("T")[0] + '</p>'
			+ '<p>' + event.EVT_VENUE + ' - ' + event.EVT_VENUE_CITY + '</p></li>');
	$('#event-data').append('<li>Invitee 1</li>');
	$('#event-data').append('<li>Invitee 2</li>');
    $.mobile.changePage( "#headline", { transition: "slide", changeHash: false });
    $('#event-data').listview('refresh');
});

//$(document).on('pagebeforeshow', '#headline', function(){      
//    $('#event-data').empty();
//    $.each(eventInfo.result, function(i, row) {
//        if(row.id == event.id) {
//            $('#event-data').append('<li>event: test</li>');
//            $('#event-data').append('<li>eventId: eventId</li>');
//// $('#event-data').append('<li>Release date'+row.release_date+'</li>');
//// $('#event-data').append('<li>Popularity : '+row.popularity+'</li>');
//// $('#event-data').append('<li>Popularity : '+row.vote_average+'</li>');
//            $('#event-data').listview('refresh');            
//        }
//    });    
//});