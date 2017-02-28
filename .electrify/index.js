var app       = require('app');
var browser   = require('browser-window');
var electrify = require('electrify')(__dirname);
const dialog = require('dialog')

var window    = null;

app.on('ready', function() {

  // electrify start
  electrify.start(function(meteor_root_url) {

    // creates a new electron window
    window = new browser({
      width: 800, height: 600,
      'node-integration': false // node integration must to be off
    });

    // open up meteor root url
    window.loadURL(meteor_root_url);
  });
});


app.on('window-all-closed', function() {
  app.quit();
});


app.on('will-quit', function terminate_and_quit(event) {
  
  // if electrify is up, cancel exiting with `preventDefault`,
  // so we can terminate electrify gracefully without leaving child
  // processes hanging in background
  if(electrify.isup() && event) {

    // holds electron termination
    event.preventDefault();

    // gracefully stops electrify 
    electrify.stop(function(){

      // and then finally quit app
      app.quit();
    });
  }
});

// 
// =============================================================================
// 
// the methods bellow can be called seamlessly from your Meteor's
// client and server code, using:
// 
//    Electrify.call('methodname', [..args..], callback);
// 
// ATENTION:
//    From meteor, you can only call these methods after electrify is fully
//    started, use the Electrify.startup() convenience method for this
// 
// 
// Electrify.startup(function(){
//   Electrify.call(...);
// });
// 
// =============================================================================
// 
 electrify.methods({
   'notification.send': function(msg, done) {
    // do things with electron api, and then call the `done` callback
    // as ~> done(err, res);
      var buttons = ['OK', 'Cancel'];

      return dialog.showMessageBox({ type: 'info', buttons: buttons, message: 'Exit?' }, function (buttonIndex) {
      });

      done(null, 'Hello ');
   }
 });
// 
