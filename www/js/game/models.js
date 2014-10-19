var game = game || {};

(function (game) {

    'use strict';

    /**
     * Guess element constructor function
     */
    function GuessElement(imagePath, options, value) {
        this._imagePath = imagePath || null;
        this._options = options || null;
        this._value = value || null;
    }

    Object.defineProperty(GuessElement.prototype, 'ImagePath', {
        get: function () {
            return this._imagePath;
        }
    });

    Object.defineProperty(GuessElement.prototype, 'Options', {
        get: function () {
            return this._options;
        }
    });

    Object.defineProperty(GuessElement.prototype, 'Value', {
        get: function () {
            return this._value;
        }
    });

    GuessElement.prototype.isValue = function (value) {
        return this._value === value;
    };

    /**
     * Elements collection constructor function
     */
    function Elements() {
        this._elements = [];
        this._currentIndex = 0;
    }

    Elements.normalCategoryLoad = function () {
        var data = game.data.normal;
        var dataSize = data.length;
        var dataItem = null;
        var items = [];

        for (var i = 0; i < dataSize; i++) {
            dataItem = data[i];
            items.push(new GuessElement(dataItem.url, dataItem.options, dataItem.answer));
        }

        return items;
    };

    Elements.hardCategoryLoad = function () {
        var data = game.data.hard;
        var dataSize = data.length;
        var dataItem = null;
        var items = [];

        for (var i = 0; i < dataSize; i++) {
            dataItem = data[i];
            items.push(new GuessElement(dataItem.url, dataItem.options, dataItem.answer));
        }

        return items;
    };

    Elements.geekCategoryLoad = function () {
        var data = game.data.geek;
        var dataSize = data.length;
        var dataItem = null;
        var items = [];

        for (var i = 0; i < dataSize; i++) {
            dataItem = data[i];
            items.push(new GuessElement(dataItem.url, dataItem.options, dataItem.answer));
        }

        return items;
    };

    Elements.LEVELS = {
        normal: Elements.normalCategoryLoad,
        hard: Elements.hardCategoryLoad,
        geek: Elements.geekCategoryLoad
    };

    Elements.prototype.load = function (level) {
        var fn = Elements.LEVELS[level];

        if (typeof fn === 'function') {
            this._elements = fn(this);
        }
    };

    Elements.prototype.next = function () {
        var element = this.nextByIndex(this._currentIndex);

        if (element !== null) this._currentIndex++;

        return element;
    };

    Elements.prototype.current = function () {
        return this.nextByIndex(this._currentIndex);
    };

    Elements.prototype.reset = function () {
        this._currentIndex = 0;
    };

    Elements.prototype.getByIndex = function (index) {
        return this._elements[index];
    };

    /**
     * @private
     */
    Elements.prototype.nextByIndex = function (index) {
        var element = null;

        if (index !== this._elements.length) {
            element = this._elements[index];
        }

        return element;
    };

    Elements.prototype.hasNext = function () {
        var size = this._elements.length;

        return (this._currentIndex < size);
    };

    Elements.prototype.randomSort = function () {};

    /**
     * Player constructor function
     */
    function Player(name, imageUrl) {
        this._imageUrl = imageUrl;
        this._name = name || null;
        this._score = null;
    }

    Object.defineProperty(Player.prototype, 'Name', {
        get: function () {
            return this._name;
        }
    });
    
    Object.defineProperty(Player.prototype, 'ImageUrl', {
        get: function () {
            return this._imageUrl;
        }
    });

    Object.defineProperty(Player.prototype, 'Score', {
        get: function () {
            return this._score;
        },
        set: function (value) {
            this._score += value;
        }
    });

    Player.prototype.scoreValue = function () {
        return (this._score !== null) ? this._score.Score : 0;
    };

    Player.prototype.toRawObject = function () {
        var raw = {
            player: this._name,
            score: this._score
        };

        return raw;
    };

    /**
     *
     */
    function Score(value, time) {
        this._value = value || 0;
        this._time = time || null;
    }

    Object.defineProperty(Score.prototype, 'Score', {
        get: function () {
            return this._value;
        }
    });

    Object.defineProperty(Player.prototype, 'Time', {
        get: function () {
            return this._time;
        }
    });

    Score.prototype.toRawObject = function () {
        var raw = {};
        raw.score = this._value;
        raw.time = this._time; // TODO format date

        return raw;
    };

    game.models = {
        Elements: Elements,
        Player: Player
    };

})(game);