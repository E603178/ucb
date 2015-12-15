var ISDemo = ISDemo || {};

ISDemo.SignInController = function() {

	this.$signInPage = null;
	this.$btnSubmit = null;
	this.$txtUsername = null;
	this.$txtPassword = null;
	this.$chkKeepSignedIn = null;
	this.$ctnErr = null;
	this.mainMenuPageId = null;
};

ISDemo.SignInController.prototype.init = function() {
	this.$signInPage = $("#page-signin");
	this.mainMenuPageId = "#page-eventlist";
	this.$btnSubmit = $("#btn-submit", this.$signInPage);
	this.$ctnErr = $("#ctn-err", this.$signInPage);
	this.$txtUsername = $("#txt-username", this.$signInPage);
	this.$txtPassword = $("#txt-password", this.$signInPage);
	this.$chkKeepSignedIn = $("#chk-keep-signed-in", this.$signInPage);
};

ISDemo.SignInController.prototype.usernameIsValid = function(username) {
	return username.length == 7
			&& (username.charAt(0).toUpperCase() == "U" || username.charAt(0).toUpperCase() == "E" || username
					.charAt(0).toUpperCase() == "T") && !(isNaN(username.substring(1, 7)));
};

ISDemo.SignInController.prototype.resetSignInForm = function() {

	var invisibleStyle = "bi-invisible", invalidInputStyle = "bi-invalid-input";

	this.$ctnErr.html("");
	this.$ctnErr.removeClass().addClass(invisibleStyle);
	this.$txtUsername.removeClass(invalidInputStyle);
	this.$txtPassword.removeClass(invalidInputStyle);
	this.$txtUsername.val("");
	this.$txtPassword.val("");
	this.$chkKeepSignedIn.prop("checked", false);
};

ISDemo.SignInController.prototype.onSignInCommand = function() {

	var me = this, username = me.$txtUsername.val().trim(), password = me.$txtPassword.val().trim(), invalidInput = false, invisibleStyle = "bi-invisible", invalidInputStyle = "bi-invalid-input";

	// Reset styles.
	me.$ctnErr.removeClass().addClass(invisibleStyle);
	me.$txtUsername.removeClass(invalidInputStyle);
	me.$txtPassword.removeClass(invalidInputStyle);

	// Flag each invalid field.
	if (username.length === 0) {
		me.$txtUsername.addClass(invalidInputStyle);
		invalidInput = true;
	}
	if (password.length === 0) {
		me.$txtPassword.addClass(invalidInputStyle);
		invalidInput = true;
	}

	// Make sure that all the required fields have values.
	if (invalidInput) {
		me.$ctnErr.html("<p>Please enter all the required fields.</p>");
		me.$ctnErr.addClass("bi-ctn-err").slideDown();
		return;
	}

	if (!me.usernameIsValid(username)) {
		me.$ctnErr.html("<p>Please enter a valid username.</p>");
		me.$ctnErr.addClass("bi-ctn-err").slideDown();
		me.$txtUsername.addClass(invalidInputStyle);
		return;
	}

	$.mobile.loading("show");

	$.support.cors=true;
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.open("POST", "https://webmessaging-test.ucb.com:9233/ucbboothdemo/Login", true);

	var sr = "<?xml version='1.0' encoding='UTF-8'?>";
	sr += "<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\" >";
		sr += "<soap:Body>";
	sr += "<wsse:Username>" + username + "</wsse:Username>";
	sr += "<wsse:Password>"	+ password + "</wsse:Password>";
	sr += "<\/soap:Body>";
	sr += "<\/soap:Envelope>";

	// Send the POST request
	xmlhttp.setRequestHeader("Accept", "application/xml", "text/xml", "\*/\*");
	xmlhttp.setRequestHeader("SOAPAction", "\"Login\"");
	xmlhttp.setRequestHeader("Content-Type", "text/xml; charset=utf-8");
	xmlhttp.send(sr);
	// send request


	// Skip login for testing purposes. TODO remove for final deployment.

	// ...

	xmlhttp.onreadystatechange = function() {
		if (xmlhttp.readyState == 4) {
			if (xmlhttp.status == 200) {
				$.mobile.loading("hide");
				var resp = xmlhttp.response;
				ISDemo.Events = jQuery.parseJSON(resp);
				$.mobile.loading("hide");
				// Create session.
				var today = new Date();
				var expirationDate = new Date();
				expirationDate.setTime(today.getTime() + ISDemo.Settings.sessionTimeoutInMSec);
				ISDemo.Session.username=username;
				ISDemo.Session.password=password;
				ISDemo.SessionexpirationDate=expirationDate,
				ISDemo.SessionkeepSignedIn=me.$chkKeepSignedIn.is(":checked")
				// Go to main menu.
//				aler("username: " + ISDemo.Session.getInstance().get("username"));
				$.mobile.navigate(me.mainMenuPageId);
			}

			else if (xmlhttp.status == 500) {
				$.mobile.loading("hide");
				alert('Error ' + xmlhttp.status);
				var resp = '[{"EVT_STARTDATE":"2014-11-04T12:00:00+01:00","EVT_NAME":"testEvent","EVT_VENUE":"testVenue","EVT_MASTER_EVENTID":"EVR00000110","EVT_VENUE_CITY":"Braine"},'
						+ '{"EVT_STARTDATE":"2014-11-03T00:00:00+01:00","EVT_NAME":"testEvent","EVT_VENUE":"testVenue","EVT_MASTER_EVENTID":"EVR00000130","EVT_VENUE_CITY":"Braine"},'
						+ '{"EVT_STARTDATE":"2015-12-17T12:00:00+01:00","EVT_NAME":"IT Gov Dept Fair Cleanup","EVT_VENUE":"Kasteel Gravenhof","EVT_MASTER_EVENTID":"EVR00000840","EVT_VENUE_CITY":"Dworp"},'
						+ '{"EVT_STARTDATE":"2015-12-17T12:00:00+01:00","EVT_NAME":"IT Governance Department Fair","EVT_VENUE":"Kasteel Gravenhof","EVT_MASTER_EVENTID":"EVR00000828","EVT_VENUE_CITY":"Dworp"}]';
				;
				ISDemo.Events = jQuery.parseJSON(resp);
				$.mobile.loading("hide");
				// Create session.
				var today = new Date();
				var expirationDate = new Date();
				expirationDate.setTime(today.getTime() + ISDemo.Settings.sessionTimeoutInMSec);

//				ISDemo.Session.getInstance().set({
//					expirationDate : expirationDate,
//					keepSignedIn : me.$chkKeepSignedIn.is(":checked"),
//					username : username,
//					password : password
//				});
				
				
				 $('#event-list').empty();
				    $.each(ISDemo.Events, function(i, event) {	
				    	$('#event-list').append('<li><a href="" data-id="' + event.EVT_MASTER_EVENTID + '"><h3>' + event.EVT_NAME + '</h3><p>' + event.EVT_STARTDATE.split("T") + ' - ' + event.EVT_VENUE_CITY + ' - ' + event.EVT_VENUE + '</p></a></li>');
				    });
				    $('#event-list').listview('refresh');
				// Go to main menu.
				$.mobile.navigate(me.mainMenuPageId);

			} else {
				$.mobile.loading("hide");
				alert('Error ' + xmlhttp.status);
			}
		}
	}

	/*
	 * 
	 * 
	 * 
	 * $.ajax({ type: 'POST', url: ISDemo.Settings.signInUrl, data: "username=" +
	 * username + "&password=" + password, success: function (resp) {
	 * 
	 * $.mobile.loading("hide");
	 * 
	 * if (resp.success === true) {
	 */
	// Create session.
	// var today = new Date();
	// var expirationDate = new Date();
	// expirationDate.setTime(today.getTime() +
	// ISDemo.Settings.sessionTimeoutInMSec);
	//
	// ISDemo.Session.getInstance().set({
	// userProfileModel: resp.extras.userProfileModel,
	// sessionId: resp.extras.sessionId,
	// expirationDate: expirationDate,
	// keepSignedIn:me.$chkKeepSignedIn.is(":checked")
	// });
	// Go to main menu.
	// $.mobile.navigate(me.mainMenuPageId);
	/*
	 * return; } else { if (resp.extras.msg) { switch (resp.extras.msg) { case
	 * ISDemo.ApiMessages.DB_ERROR: // TODO: Use a friendlier error message
	 * below. me.$ctnErr.html("<p>Oops! ISDemo had a problem and could not log
	 * you on. Please try again in a few minutes.</p>");
	 * me.$ctnErr.addClass("bi-ctn-err").slideDown(); break; case
	 * ISDemo.ApiMessages.INVALID_PWD: case
	 * ISDemo.ApiMessages.USERNAME_NOT_FOUND: me.$ctnErr.html("<p>You entered
	 * a wrong username or password. Please try again.</p>");
	 * me.$ctnErr.addClass("bi-ctn-err").slideDown();
	 * me.$txtUsername.addClass(invalidInputStyle); break; } } } }, error:
	 * function (e) { $.mobile.loading("hide"); console.log(e.message); // TODO:
	 * Use a friendlier error message below. me.$ctnErr.html("<p>Oops! ISDemo
	 * had a problem and could not log you on. Please try again in a few
	 * minutes.</p>"); me.$ctnErr.addClass("bi-ctn-err").slideDown(); } });
	 */
};