'use strict';

var Card = (function (win) {
    if (win.console === undefined) {
        win.console = {
            log: function () { return; }
        };
    }

    var Card = function (rank, suit) {
        this.rank = rank;
        this.suit = suit;
        this.div = null;
    };

    Card.prototype.dump = function () {
        win.console.log(this.toString());
    };

    Card.prototype.toString = function () {
        return String(Card.ranks[this.rank] + Card.suits[this.suit]);
    };

    Card.prototype.draw = function (x, y, div, parent) {
        if (!div) {
            div = win.document.createElement('div');
        }

        if (!parent) {
            parent = win.document.body;
        }

        if (div.className.length === 0) {
            div.className = 'card';
        } else {
            div.className = div.className + ' card';
        }

        if (this.rank === Card.JOKER) {
            div.style.backgroundPosition = (this.suit * -79) + 'px ' + (4 * -123) + 'px';
        } else {
            div.style.backgroundPosition = ((this.rank - 1) * -79) + 'px ' + (this.suit * -123) + 'px';
        }

        div.style.position = 'absolute';
        div.style.left = x + 'px';
        div.style.top = y + 'px';
        parent.appendChild(div);
        this.div = div;
        return div;
    };

    Card.drawBack = function (x, y, div) {
        if (!div) {
            div = win.document.createElement('div');
        }
        div.className = 'card';
        div.style.backgroundPosition = (2 * -79) + 'px ' + (4 * -123) + 'px';
        div.style.position = 'absolute';
        div.style.left = x + 'px';
        div.style.top = y + 'px';
        win.document.body.appendChild(div);
        return div;
    };

    Card.FIRST_SUIT = 0;
    Card.SPADE = 3;
    Card.HEART = 2;
    Card.CLUB = 0;
    Card.DIAMOND = 1;
    Card.LAST_SUIT = 3;
    Card.suits = [ 'C', 'D', 'H', 'S' ];

    Card.JOKER = 0;
    Card.ACE = 1;
    Card.JACK = 11;
    Card.QUEEN = 12;
    Card.KING = 13;
    Card.ranks = [ 'G', 'A', '2', '3', '4', '5', '6', '7',
                    '8', '9', 'T', 'J', 'Q', 'K' ];

    return Card;
}(this));

var Hand = (function (win) {
    var Hand = function () {
        this.cards = [];
    };

    Hand.prototype.clear = function () {
        this.cards = [];
    };

    Hand.prototype.length = function () {
        return this.cards.length;
    };

    Hand.prototype.add = function () {
        var i;
        var len = arguments.length;
        for (i = 0; i < len; i++) {
            if (arguments[i] instanceof Card) {
                this.cards.push(arguments[i]);
            }
        }
    };

    return Hand;
}(this));

var Deck = (function (win) {
    var Deck = function (black_joker, red_joker) {
        this.cards = [];
        var i;
        var j;
        for (i = Card.FIRST_SUIT; i <= Card.LAST_SUIT; ++i) {
            for (j = Card.ACE; j <= Card.KING; ++j) {
                this.cards.push(new Card(j, i));
            }
        }

        if (black_joker) {
            this.cards.push(new Card(Card.JOKER, Card.CLUB));
        }

        if (red_joker) {
            this.cards.push(new Card(Card.JOKER, Card.DIAMOND));
        }
    };

    Deck.prototype.length = function () {
        return this.cards.length;
    };

    Deck.prototype.shuffle = function () {
        var len = this.cards.length;
        var temp;
        var index;
        while (len > 0) {
            index = Math.floor(Math.random() * len);
            len--;
            temp = this.cards[index];
            this.cards[index] = this.cards[len];
            this.cards[len] = temp;
        }
    };

    Deck.prototype.dump = function () {
        var i;
        var len = this.cards.length;
        for (i = 0; i < len; i++) {
            this.cards[i].dump();
        }
    };

    Deck.prototype.deal = function (number_hands, number_cards) {
        if (!number_hands) {
            return this.cards.shift();
        }

        if (this.cards.length < (number_hands * number_cards)) {
            return null;
        }

        var hands = [];
        var i;
        var j;
        for (i = 0; i < number_hands; ++i) {
            hands.push(new Hand());
        }

        for (j = 0; j < number_cards; ++j) {
            for (i = 0; i < number_hands; ++i) {
                hands[i].add(this.cards.shift());
            }
        }

        return hands;
    };

    return Deck;
}(this));
