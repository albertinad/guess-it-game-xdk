(function () {
    "use strict";
        
    // hook up event handlers 
    function register_event_handlers() {
        var _game = game.controllers.Game;
        var _history = game.controllers.History;

        $(document).on("click", "#btn-history", function (evt) {
            activate_subpage("#page-historysub");
        });
        
        $(document).on("click", "#btn-new-game", function (evt) {
            activate_subpage("#page-game-configsub");
        });
        
        $(document).on("click", "#btn-start-game", function (evt) {
            var $playerName = $('#txt-player-name');
            var playerName = $playerName.val();
            var gameMode = 'normal';
            
            _game.newGame(playerName, gameMode);
                        
            activate_subpage('#page-gamesub');
            
            $playerName.val('');
        });

        $("#page-game").bind("loadpanel", function(evt) {            
            _game.start();
        });
        
        $("#page-history").bind("loadpanel", function(evt) {            
            _history.showHistory();
        });
    }

    document.addEventListener("app.Ready", register_event_handlers, false);
})();