import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';

import './project.html';

Template.project.helpers({
  isOwner() {
    return this.owner === Meteor.userId();
  },
});

Template.project.onRendered(function bodyOnRendered() {

  $(".project-list").select2({
      placeholder: "Please select a project"
  });
});
Template.project.events({
	
});
