import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './task.html';

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

Template.task.helpers({
  isOwner() {
    return this.owner === Meteor.userId();
  },
});

Template.task.onRendered(function bodyOnRendered() {

  // $(".task-list").select2({
  //     placeholder: "Please select a task"
  // });
});

Template.task.events({
  
  'click .toggle-timer'(e) {
    if (!Session.get("current_timer")) {
      Session.set("current_timer", 0);

      $(e.target).removeClass("fa-play");
      $(e.target).addClass("fa-stop");
      let timer = $(e.target).parent().find(".timer-text");
      let idInterval = Meteor.setInterval(function () {
        let next_tic = Session.get("current_timer") + 1;
        Session.set("current_timer", next_tic);
        timer.html(next_tic.toString().toHHMMSS());

      }, 1000);
      Session.set("current_timer_id", idInterval);

    } else {
      let hours = Session.get("current_timer");

      Meteor.clearInterval(Session.get("current_timer_id"));
      Session.set("current_timer", '');
      Session.set("current_timer_id", '');

      let timer = $(e.target).parent().find(".timer-text");
      timer.html("00:00:00");
      $(e.target).removeClass("fa-stop");
      $(e.target).addClass("fa-play");

      let projectId = Session.get("projectId");
      let taskId = $(e.target).data("task-id");
      Meteor.call("zoho.addTime", projectId, taskId, hours.toString().toHHMMSS(), function(error, data){
        console.log(data);
      });
    }
  },
  'click .toggle-private'() {
    Meteor.call('tasks.setPrivate', this._id, !this.private);
  },
});
