import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';

import { Tasks } from '../api/tasks.js';

import './task.js';
import './project.js';
import './log.js';
import './body.html';

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
  tasks() {

    return Session.get("tasks");
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
  taskList() {
    if (Session.get("tasks")) {
      Session.get("tasks").length;
    } else {
      return 0;
    }
  },
});

findTask = function (item) {
  let taskId = Session.get("taskId");
  if (item.id_string == taskId)
    return true;
}
Template.body.events({

  'change .project-list': function (e) {

    Meteor.call("zoho.getTasks", e.target.value, function (err, data) {

      Session.set("projectId", e.target.value);
      Session.set("tasks", data.tasks);
    });
  },
  'change .task-list': function (e) {

    let taskId = e.target.value;
    let tasks = Session.get("tasks");
    Session.set("taskId", taskId);
    let task = tasks.find(findTask);
    Meteor.call("zoho.getTimeLogs", task.link.timesheet.url, function(err, data){

      console.log(data.timelogs.tasklogs);
      Session.set("projectId", e.target.value);
      Session.set("timeLogs", data.timelogs.tasklogs);
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
});
