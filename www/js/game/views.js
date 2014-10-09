var game = game || {};

(function (game) {

    'use strict';

    /**
     * GameView constructor function
     */
    function GameView(controller, gameView) {
        this._controller = controller;
        this._$view = gameView;
        this._$gameView = gameView.find('#game-scene');
        this._$gameResult = gameView.find('#game-result');
        this._$scoreView = this._$gameView.find('#game-player-score');
        this._$playerView = this._$gameView.find('#game-player-name');
        this._$playerImage = this._$gameView.find('#game-player-image');
        this._$playerIntens = this._$gameView.find('#game-player-intents');
        this._$time = this._$gameView.find('#current-time');
        this._$imageView = this._$gameView.find('#guess-image');
        this._$optionsList = this._$gameView.find('#guess-options');

        this.initialize();
    }

    GameView.prototype.initialize = function () {
        var that = this;
        var activeClass = 'active';

        this._$view.bind("loadpanel", function (evt) {
            that._controller.start();
        });

        this._$optionsList.on('click', 'li', function () {
            var optionIndex = $(this).attr('data-option-index') | 0;
            var $oldSelection = that._$optionsList.find('.' + activeClass);
            $oldSelection.removeClass(activeClass);
            $(this).addClass(activeClass);

            that._controller.notifyOptionSelected(optionIndex);
        });

        this._$gameResult.find('#btn-save').on('click', function () {
            that.saveAndExit();
        });
    };

    GameView.prototype.setUp = function (guess, intentsAvailable) {
        this._$time.css('background-color', 'green');
        this._$imageView.attr('src', guess.ImagePath);
        this._$optionsList.empty();
        this.updateAvailableIntents(intentsAvailable);

        var size = guess.Options.length;
        var option;
        var $optionView;

        for (var i = 0; i < size; i++) {
            option = guess.Options[i];

            $optionView = $('<li data-option-index="' + i + '">' + option + '</li>');
            this._$optionsList.append($optionView);
        }
    };

    GameView.prototype.updateTime = function (time) {
        this._$time.text(time);

        if (time > 3) {
            this._$time.css('background-color', 'green');
        } else if (time <= 3 && time >= 2) {
            this._$time.css('background-color', 'orange');
        } else if (time < 2) {
            this._$time.css('background-color', 'red');
        }
    };

    GameView.prototype.updateScore = function (score) {
        this._$scoreView.text(score);
    };

    GameView.prototype.updateAvailableIntents = function (count) {
        this._$playerIntens.text(count);
    };

    GameView.prototype.showPlayerInfo = function (name, score, playerImageUrl) {
        if (!score) score = 0;

        this._$playerView.text(name);
        this._$scoreView.text(score);
        this._$playerImage.attr("src", playerImageUrl);
    };

    GameView.prototype.showSuccess = function (score) {
        var message = '<h3>Great!</h3><h2>Score: ' + score + '</h2>';
        var title = 'Success!';

        this.showPopup(title, message);
    };

    GameView.prototype.showFailure = function (score) {
        var message = '<h3>Wrong...</h3><h2>Score: ' + score + '</h2>';
        var title = 'Failure';

        this.showPopup(title, message);
    };

    GameView.prototype.showWin = function () {
        var title = 'And the winner is...';
        var message = 'YOU ROCK!';

        this.showSmallPopup(title, message, true);
    };

    GameView.prototype.showLose = function () {
        var that = this;
        var title = 'That\' bad...';
        var message = 'YOU LOSE';

        this.showSmallPopup(title, message, false);
    };

    GameView.prototype.showGameScene = function () {
        this._$gameView.css('display', 'block');
        this._$gameResult.css('display', 'none');
    };

    GameView.prototype.showResults = function (isWinner) {
        this._$gameView.css('display', 'none');
        this._$gameResult.css('display', 'block');

        var results = this._controller.results();
        var name = results.player.toUpperCase();
        var title = (isWinner) ? 'You Rock! Congratulations!' : 'You Loose...';

        this._$gameResult.find('#title').text(title);
        this._$gameResult.find('#name').text(name);
        this._$gameResult.find('#score').text(results.score);
        this._$gameResult.find('#intents').text(results.intents);
    };

    /**
     * @private
     */
    GameView.prototype.showPopup = function (title, message) {
        var that = this;

        $(document.body).popup({
            title: title,
            message: message,
            cancelText: 'Next',
            cancelCallback: function () {
                that._controller.next();
            },
            cancelOnly: true
        });
    };

    /**
     * @private
     */
    GameView.prototype.showSmallPopup = function (title, message, isWinner) {
        var that = this;

        $(document.body).popup({
            title: title,
            message: message,
            cancelText: 'Next',
            cancelCallback: function () {
                that.showResults(isWinner);
            },
            cancelOnly: true
        });
    };

    /**
     * @private
     */
    GameView.prototype.saveAndExit = function () {
        // save current game state
        this._controller.saveCurrent();
        // go back to the previous panel
        $.ui.goBack();
    };

    /**
     * HistoryView constructor function
     */
    function HistoryView(controller, view) {
        this._controller = controller;
        this._$view = view;
        this._$list = this._$view.find('#list-history');

        this.initialize();
    }

    HistoryView.prototype.initialize = function () {
        var that = this;

        this._$view.bind("loadpanel", function (evt) {
            that._controller.showHistory();
        });

        this._$view.on('click', '#btn-clear', function () {
            that._controller.clear();
            that.showHistory();
        });
    };

    HistoryView.prototype.showHistory = function (data) {
        this.clear();

        var item;
        var size = data.length;

        for (var i = 0; i < size; i++) {
            item = data[i];
            var $thumbnail = $('<div class="thumbnail"><img src="' + item.playerImg + '"/>');
            var $player = $('<h3>' + item.player + '</h3>');
            var $score = $('<h4> Score: ' + item.score + ' - Intents: ' + item.intents + '</h4>');
            var $listItem = $('<li></li>');

            $listItem.append($thumbnail);
            $listItem.append($player);
            $listItem.append($score);

            this._$list.append($listItem);
        }
    };

    HistoryView.prototype.clear = function () {
        this._$list.empty();
    };

    /**
     * HistoryView constructor function
     */
    function GameSetupView(controller, view) {
        this._controller = controller;
        this._$view = view;
        this._$playerName = this._$view.find('#txt-player-name');
        this._$playerImg = this._$view.find('#img-user');

        this.initialize();
    }

    GameSetupView.prototype.initialize = function () {
        var that = this;

        this._$playerImg.on('click', function () {
            function onSuccess(imageURI) {
                if (imageURI) that._$playerImg[0].src = imageURI;
            }

            function onFail(message) {
                alert('Failed because: ' + message);
            }

            var config = {
                quality: 50,
                destinationType: Camera.DestinationType.FILE_URI
            };

            navigator.camera.getPicture(onSuccess, onFail, config);
        });

        // delegate click evento to start game button
        this._$view.on('click', '#btn-start-game', function (evt) {
            var playerName = that._$playerName.val() || 'Unnamed';
            var playerImg = that._$playerImg.attr('src'); // TODO document.getElementById('img-user').src;
            var gameMode = 'normal';

            that._controller.createNewGame(gameMode, playerName, playerImg);

            activate_subpage('#page-gamesub');

            that._$playerName.val('');
        });
    };

    game.views = {
        Game: GameView,
        GameSetup: GameSetupView,
        History: HistoryView
    };
})(game);