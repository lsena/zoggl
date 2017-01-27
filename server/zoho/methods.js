
let authToken = '1c87d83132647d44bb0260aa29d564a0'
let portalId = 'dengun'

Meteor.methods({
	'zoho.getProjects': function () {
        url = "https://projectsapi.zoho.com/restapi/portal/" + portalId + "/projects/";
        var result = HTTP.call("GET", url, {params: {'authtoken': authToken}});
        var data = JSON.parse(result.content);
        return data;
    },
	'zoho.getTasks': function (projectId) {
        
        url = "https://projectsapi.zoho.com/restapi/portal/" + portalId + "/projects/" + projectId + "/tasks/"
        var result = HTTP.call("GET", url, {params: {'authtoken': authToken}});
        var data = JSON.parse(result.content);
        return data;
    },
	'zoho.getTimeLogs': function (url) {
        
        //url = "https://projectsapi.zoho.com/restapi/portal/" + portalId + "/projects/" + projectId + "/tasks/"
        var result = HTTP.call("GET", url, {params: {'authtoken': authToken}});
        var data = JSON.parse(result.content);
        return data;
    },
	'zoho.addTime': function (projectId, taskId, hours) {
        hours = hours.substring(0,5); 
        url = "https://projectsapi.zoho.com/restapi/portal/" + portalId + "/projects/" + projectId + "/tasks/" + taskId + "/logs/";
        params = {"authtoken": authToken, "date": moment().format("MM-DD-YYYY"), "bill_status": 'Billable', "hours": hours, "notes": "Zoggl"}

        var result = HTTP.call("POST", url, {params: params});
        //var data = JSON.parse(result.content);
        return result;
    },
});