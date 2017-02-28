start_timer = function () {

    let timer_start = new Date();
    Session.set("current_timer", 0);
    Session.set("timer_start", timer_start);
    Session.set("timerProjectId", Session.get("projectId"));
    Session.set("timerTaskId", Session.get("taskId"));

    // $(e.target).removeClass("fa-play");
    // $(e.target).addClass("fa-stop");
    let timer = $("#timer-label");
    let idInterval = Meteor.setInterval(function () {
        let current_date = new Date();
        let current_hours = (current_date - timer_start.getTime()) / 1000;
        let next_tic = Session.get("current_timer") + 1;
        Session.set("current_timer", next_tic);
        timer.html(current_hours.toString().toHHMMSS());

    }, 1000);
    Session.set("currentTimerId", idInterval);

    $("#toggle-timer").find("i").removeClass("fa-play");
    $("#toggle-timer").find("i").addClass("fa-stop");
}

stop_timer = function () {
    $("#toggle-timer").find("i").removeClass("fa-stop");
    $("#toggle-timer").find("i").addClass("fa-play");

    let timer = $("#timer-label");
    //let hours = Session.get("current_timer");
    let timer_start = Session.get("timer_start");
    let hours = (new Date().getTime() - timer_start.getTime()) / 1000;
    let projectId = Session.get("timerProjectId");
    let taskId = Session.get("timerTaskId");
    let notes = $("#task-notes").val();
    let tasks = Session.get("tasksAll");
    let task = tasks.find(findTask);

    Meteor.clearInterval(Session.get("currentTimerId"));
    if (!notes) {
        notes = "Zoggl timelog entry."
    }

    //clear input/labels
    timer.html("00:00:00");
    $("#task-notes").val('');

    //clean session vars
    Session.set("current_timer", '');
    Session.set("timer_start", '');
    Session.set("currentTimerId", '');
    Session.set("timerProjectId", '');
    Session.set("timerTaskId", '');
    //Session.set("taskId", '');

    Meteor.call("zoho.addTime", projectId, taskId, hours.toString().toHHMMSS(), notes, function (error, data) {

        Meteor.call("zoho.getTimeLogs", task.link.timesheet.url, function (err, data2) {

            if (data2 && data2.timelogs) {
                Session.set("timeLogs", data2.timelogs.tasklogs);
            }
        });
    });
}