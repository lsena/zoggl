Meteor.methods({
	'desktop.sendNotification': function (userToken) {
        console.log("sending nofitication");
        var callback = this;
        Electrify.call("notification.send", [], function(error, data){

        });
    },
});