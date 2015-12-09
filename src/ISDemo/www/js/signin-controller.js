var ISDemo = ISDemo || {};

ISDemo.SignInController = function () {

    this.$signInPage = null;
    this.$btnSubmit = null;
    this.$txtUsername = null;
    this.$txtPassword = null;
    this.$chkKeepSignedIn = null;
    this.$ctnErr = null;
    this.mainMenuPageId = null;
};

ISDemo.SignInController.prototype.init = function () {
    this.$signInPage = $("#page-signin");
    this.mainMenuPageId = "#page-main-menu";
    this.$btnSubmit = $("#btn-submit", this.$signInPage);
    this.$ctnErr = $("#ctn-err", this.$signInPage);
    this.$txtUsername = $("#txt-username", this.$signInPage);
    this.$txtPassword = $("#txt-password", this.$signInPage);
    this.$chkKeepSignedIn = $("#chk-keep-signed-in", this.$signInPage);
};

ISDemo.SignInController.prototype.usernameIsValid = function (username) {
	return username.length==7 
	&&	(username.charAt(0).toUpperCase()=="U" 
			|| username.charAt(0).toUpperCase()=="E" 
			|| username.charAt(0).toUpperCase()=="T")
	&& !(isNaN(username.substring(1, 7)));
};

ISDemo.SignInController.prototype.resetSignInForm = function () {

    var invisibleStyle = "bi-invisible",
        invalidInputStyle = "bi-invalid-input";

    this.$ctnErr.html("");
    this.$ctnErr.removeClass().addClass(invisibleStyle);
    this.$txtUsername.removeClass(invalidInputStyle);
    this.$txtPassword.removeClass(invalidInputStyle);
    this.$txtUsername.val("");
    this.$txtPassword.val("");
    this.$chkKeepSignedIn.prop("checked", false);
};

ISDemo.SignInController.prototype.onSignInCommand = function () {

    var me = this,
        Username = me.$txtUsername.val().trim(),
        password = me.$txtPassword.val().trim(),
        invalidInput = false,
        invisibleStyle = "bi-invisible",
        invalidInputStyle = "bi-invalid-input";

    // Reset styles.
    me.$ctnErr.removeClass().addClass(invisibleStyle);
    me.$txtUsername.removeClass(invalidInputStyle);
    me.$txtPassword.removeClass(invalidInputStyle);

    // Flag each invalid field.
    if (Username.length === 0) {
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

    if (!me.usernameIsValid(Username)) {
        me.$ctnErr.html("<p>Please enter a valid username.</p>");
        me.$ctnErr.addClass("bi-ctn-err").slideDown();
        me.$txtUsername.addClass(invalidInputStyle);
        return;
    }
/*
    $.mobile.loading("show");
	
    $.ajax({
        type: 'POST',
        url: ISDemo.Settings.signInUrl,
        data: "username=" + username + "&password=" + password,
        success: function (resp) {

            $.mobile.loading("hide");

            if (resp.success === true) {
			*/
                // Create session. 
                var today = new Date();
                var expirationDate = new Date();
                expirationDate.setTime(today.getTime() + ISDemo.Settings.sessionTimeoutInMSec);

//                ISDemo.Session.getInstance().set({
//                    userProfileModel: resp.extras.userProfileModel,
//                    sessionId: resp.extras.sessionId,
//                    expirationDate: expirationDate,
//                    keepSignedIn:me.$chkKeepSignedIn.is(":checked")
//                });
                // Go to main menu.
                $.mobile.navigate(me.mainMenuPageId);
            /*    
				return;
            } else {
                if (resp.extras.msg) {
                    switch (resp.extras.msg) {
                        case ISDemo.ApiMessages.DB_ERROR:
                        // TODO: Use a friendlier error message below.
                            me.$ctnErr.html("<p>Oops! ISDemo had a problem and could not log you on.  Please try again in a few minutes.</p>");
                            me.$ctnErr.addClass("bi-ctn-err").slideDown();
                            break;
                        case ISDemo.ApiMessages.INVALID_PWD:
                        case ISDemo.ApiMessages.USERNAME_NOT_FOUND:
                            me.$ctnErr.html("<p>You entered a wrong username or password.  Please try again.</p>");
                            me.$ctnErr.addClass("bi-ctn-err").slideDown();
                            me.$txtUsername.addClass(invalidInputStyle);
                            break;
                    }
                }
            }
        },
        error: function (e) {
            $.mobile.loading("hide");
            console.log(e.message);
            // TODO: Use a friendlier error message below.
            me.$ctnErr.html("<p>Oops! ISDemo had a problem and could not log you on.  Please try again in a few minutes.</p>");
            me.$ctnErr.addClass("bi-ctn-err").slideDown();
        }
    });
*/
};