(function () {
    "use strict";

    // hook up event handlers 
    function register_event_handlers() {
        var _game = game.controllers.Game,
            _history = game.controllers.History,
            _playerImageUrl = 'assets/elephants.jpg';

        $(document).on("click", "#btn-history", function (evt) {
            activate_subpage("#page-historysub");
        });

        $(document).on("click", "#btn-new-game", function (evt) {
            activate_subpage("#page-game-configsub");
        });

        $(document).on("click", "#btn-start-game", function (evt) {
            var $playerName = $('#txt-player-name');
            var playerName = $playerName.val() || "Unnamed";
            var gameMode = 'normal';

            _game.newGame(playerName, gameMode, _playerImageUrl);

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
            $(document).on("click", ".uib_w_20", function(evt)
        {
            navigator.camera.getPicture(onSuccess, onFail, { quality: 50,
                destinationType: Camera.DestinationType.DATA_URL
            });

            function onSuccess(imageData) {                       
                _playerImageUrl = "data:image/jpeg;base64," + imageData;                
            }

            function onFail(message) {
                alert('Failed because: ' + message);
            }
        });
}

    document.addEventListener("app.Ready", register_event_handlers, false);
})();