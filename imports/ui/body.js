import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Tasks } from '../api/tasks.js';

//import './auth.html';

import './task.js';
import './project.js';
import './log.js';
import './body.html';
Template.body.onRendered(function bodyOnRendered() {
  $(".activate-left-nav").sideNav();
});
Template.body.onCreated(function bodyOnCreated() {

});
Template.body.helpers({
  projects() {
    const instance = Template.instance();


    var projects = ReactiveMethod.call("zoho.getProjects");

    if (projects) {
      // console.log("\nProjects\n");
      // console.log(projects.projects);
      return projects.projects;
    }
    return;
    // if (instance.state.get('hideCompleted')) {
    //   // If hide completed is checked, filter tasks
    //   return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
    // }
    // // Otherwise, return all of the tasks
    // return Tasks.find({}, { sort: { createdAt: -1 } });
  },
  tasksGrouped(groupId) {

    console.log("tasksGrouped: " + groupId);
    console.log(Session.get("tasksGrouped")[groupId]);
    return Session.get("tasksGrouped")[groupId];
    // if (instance.state.get('hideCompleted')) {
    //   // If hide completed is checked, filter tasks
    //   return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
    // }
    // // Otherwise, return all of the tasks
    // return Tasks.find({}, { sort: { createdAt: -1 } });
  },
  tasks() {

    console.log("tasks:");
    console.log(Session.get("tasks"));
    return Session.get("tasks");
    // if (instance.state.get('hideCompleted')) {
    //   // If hide completed is checked, filter tasks
    //   return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
    // }
    // // Otherwise, return all of the tasks
    // return Tasks.find({}, { sort: { createdAt: -1 } });
  },
  taskLists() {

    console.log("taskLists:");
    let tasklists = Session.get("taskLists");
    console.log(tasklists);
    return Session.get("taskLists");
    // if (instance.state.get('hideCompleted')) {
    //   // If hide completed is checked, filter tasks
    //   return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
    // }
    // // Otherwise, return all of the tasks
    // return Tasks.find({}, { sort: { createdAt: -1 } });
  },
  timeLogs() {
    return Session.get("timeLogs");
    // if (instance.state.get('hideCompleted')) {
    //   // If hide completed is checked, filter tasks
    //   return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
    // }
    // // Otherwise, return all of the tasks
    // return Tasks.find({}, { sort: { createdAt: -1 } });
  },
  getUserToken: function () {
    if (Meteor.user().profile)
      return Meteor.user().profile.userToken;
  }
});

findTask = function (item) {
  let taskId = Session.get("taskId");
  if (item.id_string == taskId)
    return true;
}
Template.body.events({
  'click #sendNotification': function(e){
    console.log("notify");
    Meteor.call("desktop.sendNotification", e.target.value, function (err, data) {

    });
  },
  'change .project-list': function (e) {

    $("#task-loader").css("display","block");
    Meteor.call("zoho.getTasks", e.target.value, function (err, data) {

      Session.set("projectId", e.target.value);
      //Session.set("tasks", data.tasks);

      var taskLists = [];
      var tasks = [];
      var tasksGrouped = {};
      var tasksAll = [];

      _.each(data, function (item) {
        if (item.tasklist) {
          let taskListId = item.tasklist.id;
          let taskListName = item.tasklist.name;

          if (tasksGrouped[taskListId]) {
            tasksGrouped[taskListId].push({ "id": item.id_string, "name": item.name });
          } else {
            // var obj = {};
            // obj[taskListId] = [{ "id": item.id_string, "name": item.name }];
            // tasksGrouped.push(obj);
            tasksGrouped[taskListId] = [{ "id": item.id_string, "name": item.name }];
          }

          if (taskLists.filter(function (obj) { return obj.id == taskListId; }).length > 0) {

          } else {
            taskLists.push({ "id": taskListId, "name": taskListName });
          }
        }
        else {
          tasks.push(item);
        }
        tasksAll.push(item);
      });
      Session.set("taskLists", taskLists);
      Session.set("tasks", tasks);
      Session.set("tasksAll", tasksAll);
      Session.set("tasksGrouped", tasksGrouped);

      $("#task-loader").css("display","none");
    });
  },
  'change .task-list': function (e) {

    let taskId = e.target.value;
    let tasks = Session.get("tasksAll");
    Session.set("taskId", taskId);
    let task = tasks.find(findTask);
    Meteor.call("zoho.getTimeLogs", task.link.timesheet.url, function (err, data) {

      if(data && data.timelogs){
        Session.set("taskId", e.target.value);
        Session.set("timeLogs", data.timelogs.tasklogs);
      }else{
        Session.set("taskId", e.target.value);
        Session.set("timeLogs", '');
      }
    });
  },
  'submit .new-task'(event) {
    // Prevent default browser form submit
    event.preventDefault();

    // Get value from form element
    const target = event.target;
    const text = target.text.value;

    // Insert a task into the collection
    Meteor.call('tasks.insert', text);

    // Clear form
    target.text.value = '';
  },
  'change .hide-completed input'(event, instance) {
    instance.state.set('hideCompleted', event.target.checked);
  },
  'click #toggle-timer': function (e) {
    if (Session.get("timer_start")) {

      stop_timer();

    } else {

      start_timer();
    }
  },
  'change #userToken': function (e) {
    console.log($(e.target).val());
    Meteor.call("user.updateToken", $(e.target).val(), function (error, data) {

    })
  }
});
