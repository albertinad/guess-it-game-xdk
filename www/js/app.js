/*jslint browser:true, devel:true, white:true, vars:true */
/*global $:false, intel:false, app:false, dev:false */
/*global myEventHandler:false, cordova:false, device:false */

(function () {
    // app framework setup
    $.ui.autoLaunch = false;

    $.ui.ready(function () {
        if ($.os.android) {
            $('#afui').addClass('light');
        }

        var gameMarkup = $('#page-game');
        var gameSetupMarkup = $('#page-game-config');
        var historyMarkup = $('#page-history');

        var gameView = new game.views.Game(game.controllers.Game, gameMarkup);
        var gameSetupView = new game.views.GameSetup(game.controllers.GameSetup, gameSetupMarkup);
        var historyView = new game.views.History(game.controllers.History, historyMarkup);

        game.controllers.Game.setView(gameView);
        game.controllers.GameSetup.setView(gameSetupView);
        game.controllers.History.setView(historyView);
    });

    function onDeviceReady() {
        if (navigator.splashscreen) {
            navigator.splashscreen.hide();
        }

        // intel native bridge for legacy containers
        if (window.intel && intel.xdk && intel.xdk.device) {
            intel.xdk.device.hideSplashScreen();
        }

        // start afui
        $.ui.launch();
    }

    document.addEventListener('app.Ready', onDeviceReady, false);
})();