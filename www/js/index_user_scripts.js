(function () {
    "use strict";

    // hook up event handlers 
    function register_event_handlers() {
        var _game = game.controllers.Game;

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

        $(document).on("click", "#img-user", function () {
            function onSuccess(imageURI) {
                var image = document.getElementById('img-user');
                image.src = imageURI;
            }

            function onFail(message) {
                alert('Failed because: ' + message);
            }

            navigator.camera.getPicture(onSuccess, onFail, {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI
            });
        });
    }

    document.addEventListener("app.Ready", register_event_handlers, false);
})();