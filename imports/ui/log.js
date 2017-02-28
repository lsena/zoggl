import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './log.html';

String.prototype.toHHMMSS = function () {
  var sec_num = parseInt(this, 10); // don't forget the second param
  var hours = Math.floor(sec_num / 3600);
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
  var seconds = sec_num - (hours * 3600) - (minutes * 60);

  if (hours < 10) { hours = "0" + hours; }
  if (minutes < 10) { minutes = "0" + minutes; }
  if (seconds < 10) { seconds = "0" + seconds; }
  return hours + ':' + minutes + ':' + seconds;
}

Template.log.helpers({
  isOwner() {
    return this.owner === Meteor.userId();
  },
});

Template.log.onRendered(function bodyOnRendered() {

});

Template.log.events({
  
  'click .toggle-timer'(e) {
    console.log(Session.get("current_timer"));
    if (!Session.get("timer_start")) {

      let taskNotes = $("#task-notes");
      taskNotes.val($(e.target).data("task-notes"));
      start_timer();

    } else {
      // let hours = Session.get("current_timer");

      // Meteor.clearInterval(Session.get("currentTimerId"));
      // Session.set("current_timer", '');
      // Session.set("currentTimerId", '');

      // let timer = $(e.target).parent().find("#timer-label");
      // timer.html("00:00:00");
      // $(e.target).removeClass("fa-stop");
      // $(e.target).addClass("fa-play");

      // let projectId = Session.get("projectId");
      // let taskId = $(e.target).data("task-id");
      // Meteor.call("zoho.addTime", projectId, taskId, hours.toString().toHHMMSS(), function(error, data){
      //   console.log(data);
      // });
    }
  },
  'click .toggle-private'() {
    Meteor.call('tasks.setPrivate', this._id, !this.private);
  },
});
