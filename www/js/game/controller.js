var game = game || {};

(function () {

    'use strict';

    /**
     * Game constructor function
     */
    function Game() {
        this._view = null;
        this._game = null;
        this._player = null;
        this._guessElements = new game.models.Elements();
    }

    Game.prototype.setView = function (view) {
        this._view = view;
    };

    Game.prototype.newGame = function (gameMode, playerName, playerImageUrl) {
        this._player = new game.models.Player(playerName, playerImageUrl);
        this._guessElements.load(gameMode);

        this._game = new game.core.GameEngine(this._player, this._guessElements);
    };

    Game.prototype.show = function () {
        this._view.showGameScene();
        this._view.showPlayerInfo(this._player.Name, this._player.scoreValue(), this._player.ImageUrl);
    };

    Game.prototype.start = function () {
        this.show();
        this._game.clear();

        if (this._game !== null) {
            var that = this;

            this._game.addProgressCallback(function (time) {
                // cordova notification API
                if (time === 2) {
                    navigator.notification.beep(1);
                }

                that._view.updateTime(time);
            });

            this._game.addStartCallback(function (guess, intentsAvailable) {
                that._view.setUp(guess, intentsAvailable);
            });

            this._game.addSuccessCallback(this.onSuccess.bind(this));
            this._game.addFailureCallback(this.onFailure.bind(this));
            this._game.addWinCallback(this.onWin.bind(this));
            this._game.addLoseCallback(this.onLoose.bind(this));

            this._game.start();
        }
    };

    Game.prototype.notifyOptionSelected = function (index) {
        this._game.selectedOption(index);
    };

    Game.prototype.load = function (data) {};

    Game.prototype.saveCurrent = function () {
        var data = this._game.toRawObject();
        this.saveToHistory(data);
    };

    /**
     * @private
     */
    Game.prototype.saveToHistory = function (data) {
        var value = window.localStorage.getItem("history");
        if (value === undefined || value === null) {
            value = [];
        } else {
            value = JSON.parse(value);
        }

        value.push(data);

        window.localStorage.setItem("history", JSON.stringify(value));
    };

    Game.prototype.next = function () {
        this._game.next();
    };

    Game.prototype.reset = function () {};

    Game.prototype.results = function () {
        return this._game.results();
    };

    // game callbacks

    /**
     * @private
     */
    Game.prototype.onSuccess = function (score, guess) {
        this._view.updateScore(score);

        this._view.showSuccess(score);
    };

    /**
     * @private
     */
    Game.prototype.onFailure = function (score, intents) {
        this._view.showFailure(score);
    };

    /**
     * @private
     */
    Game.prototype.onWin = function (score, guess) {
        this._view.updateScore(score);
        this._view.showWin();
    };

    /**
     * @private
     */
    Game.prototype.onLoose = function (score, guess) {
        this._view.showLose();
    };

    /**
     * History Controller constructor function.
     */
    function History() {
        this._view = null;
    }

    History.prototype.setView = function (view) {
        this._view = view;
    };

    History.prototype.showHistory = function () {
        var history = window.localStorage.getItem("history");
        if (history === undefined || history === null) {
            history = [];
        } else {
            history = JSON.parse(history);
        }

        this._view.showHistory(history);
    };

    History.prototype.clear = function () {
        window.localStorage.clear();
    };

    /**
     * GameSetup Controller constructor function.
     */
    function GameSetup() {
        this._view = null;
    }

    GameSetup.prototype.setView = function (view) {
        this._view = view;
    };

    GameSetup.prototype.createNewGame = function (gameMode, playerName, playerImage) {
        // TODO it's ugly..
        gameInstance.newGame(gameMode, playerName, playerImage);
    };

    var gameInstance = new Game();
    var gameSetupInstance = new GameSetup();
    var historyInstance = new History();

    // game api
    game.controllers = {
        Game: gameInstance,
        GameSetup: gameSetupInstance,
        History: historyInstance
    };
})(game);