var ISDemo = ISDemo || {};

// Begin boilerplate code generated with Cordova project.

var app = {
	// Application Constructor
	initialize : function() {
		this.bindEvents();
	},
	// Bind Event Listeners
	//
	// Bind any events that are required on startup. Common events are:
	// 'load', 'deviceready', 'offline', and 'online'.
	bindEvents : function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	// deviceready Event Handler
	//
	// The scope of 'this' is the event. In order to call the 'receivedEvent'
	// function, we must explicitly call 'app.receivedEvent(...);'
	onDeviceReady : function() {
		app.receivedEvent('deviceready');
	},
	// Update DOM on a Received Event
	receivedEvent : function(id) {

	}
};

var eventInfo = {
	id : null,
	result : null
}

app.initialize();

// End boilerplate code.

$(document).on("mobileinit", function(event, ui) {
	$.mobile.defaultPageTransition = "slide";
});

$(document).bind("mobileinit", function() {
	// Make your jQuery Mobile framework configuration changes here!
	
	
	
});

app.signInController = new ISDemo.SignInController();

$(document).on("pagecontainerbeforeshow", function(event, ui) {
	if (typeof ui.toPage == "object") {
		switch (ui.toPage.attr("id")) {
		case "page-signin":
			// Reset signin form.
			app.signInController.resetSignInForm();
			break;
		}
	}
});

$(document).delegate("#page-signin", "pagebeforecreate", function() {

	app.signInController.init();

	app.signInController.$btnSubmit.off("tap").on("tap", function() {
		app.signInController.onSignInCommand();
	});
});

$(document).on("pagecontainerbeforechange", function(event, ui) {

	if (typeof ui.toPage !== "object")
		return;

	switch (ui.toPage.attr("id")) {
	case "page-index":
		if (!ui.prevPage) {
			// Check session.keepSignedIn and redirect to main menu.
			var session = ISDemo.Session, today = new Date();
			if (session && session.keepSignedIn && new Date(session.expirationDate).getTime() > today.getTime()) {
				ui.toPage = $("#page-eventlist");
			}
		}
	}
});

$(document).on(
		"pagebeforeshow",
		"#page-eventlist",
		function() {
			var session = ISDemo.Session;
			var response = ISDemo.Events;
			$('#event-list').empty();
			$.each(response, function(i, event) {
				$('#event-list').append(
						'<li><a href="" data-id="' + event.EVT_MASTER_EVENTID + '"><h3>' + event.EVT_NAME + '</h3><p>'
								+ event.EVT_STARTDATE.split("T")[0] + ' - ' + event.EVT_VENUE_CITY + ' - '
								+ event.EVT_VENUE + '</p></a></li>');
			});
			$('#event-list').listview('refresh');

		});

$(document).on(
		'vclick',
		'#event-list li a',
		function() {
			eventInfo.id = $(this).attr('data-id');
			var session = ISDemo.Session;
			$.mobile.loading("show");
			$.support.cors = true;
			var xmlhttp = new XMLHttpRequest();
			xmlhttp.open("POST", "https://webmessaging-test.ucb.com:9233/ucbboothdemo/GetEvents", true);

			var sr = "<?xml version='1.0' encoding='UTF-8'?>";
			sr += "<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" >";
			sr += "<soap:Body>";
			sr += "<wsse:Username>" + session.username + "</wsse:Username>";
			sr += "<wsse:Password>" + session.password + "</wsse:Password>";
			sr += "<wsse:EventId>" + $(this).attr('data-id') + "</wsse:EventId>";
			sr += "<\/soap:Body>";
			sr += "<\/soap:Envelope>";

			// Send the POST request
			xmlhttp.setRequestHeader("Accept", "application/xml", "text/xml", "\*/\*");
			xmlhttp.setRequestHeader("SOAPAction", "\"GetEvents\"");
			xmlhttp.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
			xmlhttp.send(sr);
			// send request

			xmlhttp.onreadystatechange = function() {
				if (xmlhttp.readyState == 4) {
					if (xmlhttp.status == 200) {
						$.mobile.loading("hide");
						var resp = jQuery.parseJSON(xmlhttp.response);
						var event = resp[0];
						// Event info
						$('#event-data').empty();
						$('#event-data').append(
								'<li><h3>' + event.EVT_NAME + '</h3>' + '<p>' + event.EVT_STARTDATE.split("T")[0]
										+ ' - ' + event.EVT_ENDDATE.split("T")[0] + '</p>' + '<p>' + event.EVT_VENUE
										+ ' - ' + event.EVT_VENUE_CITY + '</p></li>');

						// invitees
						$.each(resp, function(i, invitee) {
							$('#event-data').append(
									'<li>' + invitee.INV_LASTNAME + ' ' + invitee.INV_FIRSTNAME + ': '
											+ invitee.INV_STATUS + '</li>');
						});
						$.mobile.changePage("#headline", {
							transition : "slide",
							changeHash : false
						});
						$('#event-data').listview('refresh');
					} else {
						$.mobile.loading("hide");
						alert('Error ' + xmlhttp.status);
					}
				}
			}
		});

// $(document).on('pagebeforeshow', '#headline', function(){
// $('#event-data').empty();
// $.each(eventInfo.result, function(i, row) {
// if(row.id == event.id) {
// $('#event-data').append('<li>event: test</li>');
// $('#event-data').append('<li>eventId: eventId</li>');
// // $('#event-data').append('<li>Release date'+row.release_date+'</li>');
// // $('#event-data').append('<li>Popularity : '+row.popularity+'</li>');
// // $('#event-data').append('<li>Popularity : '+row.vote_average+'</li>');
// $('#event-data').listview('refresh');
// }
// });
// });
