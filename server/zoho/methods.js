
let portalId = 'dengun'

Meteor.methods({
	'zoho.getProjects': function () {
        let authToken = Meteor.users.findOne({_id:this.userId}).profile.userToken;
        url = "https://projectsapi.zoho.com/restapi/portal/" + portalId + "/projects/";
        var result = HTTP.call("GET", url, {params: {'authtoken': authToken}});
        if(result && result.content){
            var data = JSON.parse(result.content);
            return data;
        }
    },
	'zoho.getTaskLists': function (projectId) {
        let authToken = Meteor.users.findOne({_id:this.userId}).profile.userToken;
        
        url = "https://projectsapi.zoho.com/restapi/portal/" + portalId + "/projects/" + projectId + "/tasklists/"
        var result = HTTP.call("GET", url, {params: {'authtoken': authToken, 'flag': 'external'}});
        if(result && result.content){
            var data = JSON.parse(result.content);
            return data;
        }
    },
	'zoho.getTasks': function (projectId, taskListId) {
        let authToken = Meteor.users.findOne({_id:this.userId}).profile.userToken;
        var step = 100;
        var index = 0;
        var range = 0 + step;
        var getMore = true;
        var tasks = [];
        var data;

        if(taskListId)
        {

            url = "https://projectsapi.zoho.com/restapi/portal/" + portalId + "/projects/" + projectId + "/tasklists/" + taskListId + "/tasks/"
        }
        else
        {
            while(getMore){
                url = "https://projectsapi.zoho.com/restapi/portal/" + portalId + "/projects/" + projectId + "/tasks/"
                var result = HTTP.call("GET", url, {params: {'authtoken': authToken, 'index': index, 'range': range }});
                if(result && result.content){
                    var data = JSON.parse(result.content);
                    tasks.push.apply(tasks, data.tasks);
                }else{
                    getMore = false;
                }
                range += step;
                index += step;
            }
        }

        return tasks;
    },
	'zoho.getAllTasks': function (projectId) {
        let authToken = Meteor.users.findOne({_id:this.userId}).profile.userToken;
        
        var data;
        url = "https://projectsapi.zoho.com/restapi/portal/" + portalId + "/projects/" + projectId + "/tasklists/"
        var result = HTTP.call("GET", url, {params: {'authtoken': authToken, 'flag': 'internal'}});
        if(result && result.content){
            data = JSON.parse(result.content);
        }


        let tasks = [];
        _.each(data.tasklists, function(item){
            //console.log(item);
            url = "https://projectsapi.zoho.com/restapi/portal/" + portalId + "/projects/" + projectId + "/tasklists/" + item.id_string + "/tasks/"
            console.log(url);
            var result = HTTP.call("GET", url, {params: {'authtoken': authToken}});
            if(result && result.content){
                data = JSON.parse(result.content);
                tasks.push.apply(tasks, data.tasks);
            }
        });
        return tasks;
        
    },
	'zoho.getTimeLogs': function (url) {
        let authToken = Meteor.users.findOne({_id:this.userId}).profile.userToken;
        
        //url = "https://projectsapi.zoho.com/restapi/portal/" + portalId + "/projects/" + projectId + "/tasks/"
        var result = HTTP.call("GET", url, {params: {'authtoken': authToken}});
        if(result && result.content){
            var data = JSON.parse(result.content);
            return data;
        }
    },
	'zoho.addTime': function (projectId, taskId, hours, notes) {
        let authToken = Meteor.users.findOne({_id:this.userId}).profile.userToken;
        hours = hours.substring(0,5);
        if(hours == '00:00')
            hours = '00:01';

        url = "https://projectsapi.zoho.com/restapi/portal/" + portalId + "/projects/" + projectId + "/tasks/" + taskId + "/logs/";
        params = {"authtoken": authToken, "date": moment().format("MM-DD-YYYY"), "bill_status": 'Billable', "hours": hours, "notes": notes}
        var result = HTTP.call("POST", url, {params: params});
        var data = JSON.parse(result.content);
        return result;
    },
});