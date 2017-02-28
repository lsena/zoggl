Meteor.methods({
	'user.updateToken': function (userToken) {
        let userId = this.userId;
        Meteor.users.update(
            {_id: userId}, 
            {
                $set:
                {
                    'profile.userToken': userToken
                }
            });
    },
});