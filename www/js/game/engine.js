var game = game || {};

(function (game) {

    'use strict';

    /**
     * Game engine logic constructor function
     */
    function GameEngine(player, guess) {
        this._player = player || null;
        this._guess = guess || null;
        this._currentGuess = null;
        this._timer = new Timer();
        this._intent = 0;

        // callbacks
        this._startCallback = null;
        this._stopCallback = null;
        this._progressCallback = null;
        this._successCallback = null;
        this._failureCallback = null;
        this._winCallback = null;
        this._looseCallback = null;

        // internal callbacks
        var startCallback = this.onStartCallback.bind(this);
        var stopCallback = this.onStopCallback.bind(this);
        var progressCallback = this.onProgressCallback.bind(this);

        this._timer.addOnStartCallback(startCallback);
        this._timer.addOnStopCallback(stopCallback);
        this._timer.addOnProgressCallback(progressCallback);
    }

    GameEngine.MAX_INTENTS = 3;

    GameEngine.SCORE_X = 10;

    Object.defineProperty(GameEngine.prototype, 'Player', {
        set: function (value) {
            this._player = value;
        }
    });

    Object.defineProperty(GameEngine.prototype, 'Guess', {
        set: function (value) {
            this._guess = value;
        },
        get: function () {
            return this._guess;
        }
    });

    GameEngine.prototype.start = function () {
        this._currentGuess = this._guess.next();
        this.notifyStart(this._currentGuess, this.availableIntents());

        this._timer.start();
    };

    GameEngine.prototype.next = function () {
        this._currentGuess = this._guess.next();

        if (this._currentGuess !== null) {
            this._timer.reset();

            this.notifyStart(this._currentGuess, this.availableIntents());

            this._timer.start();
        } else {
            // no more options available
            // notify win or lose according to the intents of playing

            if (this._intent < GameEngine.MAX_INTENTS) {
                this.notifyWin();
            } else {
                this.notifyLoose();
            }
        }
    };

    GameEngine.prototype.stop = function () {
        this._timer.stop();

        this.notifyStop();
    };

    GameEngine.prototype.setPlayer = function (player) {
        this._player = player;
    };

    GameEngine.prototype.selectedOption = function (option) {
        this._timer.stop();

        var hasNext = this._guess.hasNext();
        var isValid = this._currentGuess.isValue(option);
        var currentTime = this._timer.currentTime() / Timer.DEFAULT_STEP;

        this.calculateScore(currentTime, isValid);


        if (isValid && currentTime > 0) {
            if (hasNext) {
                this.notifySuccess();
            } else {
                this.notifyWin();
            }
        } else {
            this._intent += 1;

            if (this._intent >= GameEngine.MAX_INTENTS || !hasNext) {
                this.notifyLoose();
            } else {
                this.notifyFailure();
            }
        }
    };

    GameEngine.prototype.clear = function () {
        this._intent = 0;
        this._currentGuess = null;
        this._timer.reset();
        this._guess.reset();
    };

    GameEngine.prototype.availableIntents = function () {
        return GameEngine.MAX_INTENTS - this._intent;
    };

    /** 
     * @private
     */
    GameEngine.prototype.calculateScore = function (currentTime, isValid) {
        var newScore;

        if (isValid) {
            newScore = GameEngine.SCORE_X * currentTime;
        } else {
            newScore = -(GameEngine.SCORE_X / currentTime);
        }

        this._player.Score = newScore;
    };

    GameEngine.prototype.results = function () {
        var result = {};
        result.player = this._player.Name;
        result.score = this._player.Score;
        result.intents = this._intent;
        result.time = null;

        return result;
    }

    GameEngine.prototype.toRawObject = function () {
        var raw = {
            player: this._player.Name,
            score: this._player.Score,
            intents: this._intent
        }

        return raw;
    };

    // notify

    /** 
     * @private
     */
    GameEngine.prototype.notifyStart = function (guess, intents) {
        if (this._startCallback !== null) {
            this._startCallback(guess, intents);
        }
    };

    /** 
     * @private
     */
    GameEngine.prototype.notifyStop = function () {
        if (this._stopCallback !== null) this._stopCallback();
    };

    /** 
     * @private
     */
    GameEngine.prototype.notifyProgress = function (progress) {
        if (this._progressCallback !== null) this._progressCallback(progress);
    };

    /** 
     * @private
     */
    GameEngine.prototype.notifySuccess = function () {
        if (this._successCallback !== null) {
            this._successCallback(this._player.Score);
        }
    };

    /** 
     * @private
     */
    GameEngine.prototype.notifyFailure = function () {
        if (this._failureCallback !== null) {
            this._failureCallback(this._player.Score);
        }
    };

    /** 
     * @private
     */
    GameEngine.prototype.notifyWin = function () {
        if (this._winCallback !== null) {
            this._winCallback(this._player.Score);
        }
    };

    /** 
     * @private
     */
    GameEngine.prototype.notifyLoose = function () {
        if (this._looseCallback !== null) {
            this._looseCallback(this._player.Score);
        }
    };

    // engine internal callbacks

    GameEngine.prototype.onStartCallback = function () {
        console.log('start');
    };

    GameEngine.prototype.onStopCallback = function (time) {
        console.log('stop');

        if (time === 0) {
            this.notifyLoose();
        }
    };

    GameEngine.prototype.onProgressCallback = function (progress) {
        console.log(progress);

        var progressValue = progress / Timer.DEFAULT_STEP;

        this.notifyProgress(progressValue);
    };

    // add callbacks

    GameEngine.prototype.addStartCallback = function (callback) {
        if (typeof callback === "function") this._startCallback = callback;
    };

    GameEngine.prototype.addStopCallback = function (callback) {
        if (typeof callback === "function") this._stopCallback = callback;
    };

    GameEngine.prototype.addProgressCallback = function (callback) {
        if (typeof callback === "function") this._progressCallback = callback;
    };

    GameEngine.prototype.addSuccessCallback = function (callback) {
        if (typeof callback === "function") this._successCallback = callback;
    };

    GameEngine.prototype.addFailureCallback = function (callback) {
        if (typeof callback === "function") this._failureCallback = callback;
    };

    GameEngine.prototype.addWinCallback = function (callback) {
        if (typeof callback === "function") this._winCallback = callback;
    };

    GameEngine.prototype.addLoseCallback = function (callback) {
        if (typeof callback === "function") this._looseCallback = callback;
    };

    /**
     * Timer constructor function
     */
    function Timer() {
        this._startTime = 5000;
        this._time = 1000;
        this._step = 1000;
        this._currentTime = 0;
        this._isActive = false;

        this._startCallback = null;
        this._stopCallback = null;
        this._progressCallback = null;

        this._timerId = null;
    }

    Timer.DEFAULT_TIME = 5000;

    Timer.DEFAULT_STEP = 1000;

    Timer.prototype.start = function (time, step) {
        if (time === null || time === undefined || time <= 0) {
            this._startTime = Timer.DEFAULT_TIME;
        } else {
            this._startTime = time;
        }

        if (step === null || step === undefined || step <= 0) {
            this._step = Timer.DEFAULT_STEP;
        } else {
            this._step = step;
        }

        this.notifyStart();

        this.internalStart();
    };

    Timer.prototype.stop = function () {
        this._startTime = Timer.DEFAULT_TIME;
        this._step = Timer.DEFAULT_STEP;

        this.internalStop(this._timerId);

        this.notifyStop();
    };

    /**
     * @private
     */
    Timer.prototype.internalStart = function () {
        if (this._isActive === false) {
            this._isActive = true;
            this._currentTime = this._startTime;
            var that = this;

            this.notifyProgress(this._startTime);

            this._timerId = setInterval(function () {
                that._currentTime -= that._step;

                that.notifyProgress(that._currentTime);

                if (that._currentTime <= 0) that.stop(that._timerId);
            }, this._time);
        }
    };

    /**
     * @private
     */
    Timer.prototype.internalStop = function (id) {
        if (this._isActive) {
            clearInterval(id);
        }

        this._isActive = false;
        this._timerId = null;
    };

    Timer.prototype.reset = function () {
        this._isActive = false;
        this._timerId = false;
        this._currentTime = 0;
    };

    Timer.prototype.currentTime = function () {
        return this._currentTime;
    };

    Timer.prototype.increase = function () {
        this._step += 10;
    };

    Timer.prototype.decrease = function () {
        if (this._step >= 10) this._step -= 10;
    };

    Timer.prototype.addOnStartCallback = function (callback) {
        if (callback instanceof Function) this._startCallback = callback;
    };

    Timer.prototype.addOnStopCallback = function (callback) {
        if (callback instanceof Function) this._stopCallback = callback;
    };

    Timer.prototype.addOnProgressCallback = function (callback) {
        if (callback instanceof Function) this._progressCallback = callback;
    };

    Timer.prototype.notifyStart = function () {
        if (this._startCallback !== null) this._startCallback();
    };

    Timer.prototype.notifyStop = function () {
        if (this._stopCallback !== null) {
            this._stopCallback(this._currentTime);
        }
    };

    Timer.prototype.notifyProgress = function (progress) {
        if (this._progressCallback !== null) this._progressCallback(progress);
    };

    game.core = {
        GameEngine: GameEngine
    };

})(game);