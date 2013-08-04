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

        this.div = div;
        var img = win.document.createElement('img');

        if (!parent) {
            parent = win.document.body;
        }

        if (div.className.length === 0) {
            div.className = 'card';
        } else {
            div.className = div.className + ' card';
        }

        if (this.rank === Card.JOKER) {
            // oops no joke svgs
            return div;
        }

        img.src = 'svg/' + Card.ranks[this.rank] + Card.suits[this.suit] + '.svg';

        div.innerHTML = '';
        div.innerText = '';
        div.appendChild(img);

        div.style.position = 'absolute';
        div.style.left = x + 'px';
        div.style.top = y + 'px';
        parent.appendChild(div);
        return div;
    };

    Card.drawBack = function (x, y, div) {
        if (!div) {
            div = win.document.createElement('div');
        }
        var img = win.document.createElement('img');
        div.className = 'card';
        img.src = 'svg/Blue_Back.svg';
        div.innerHTML = '';
        div.innerText = '';
        div.appendChild(img);
        div.style.position = 'absolute';
        div.style.left = x + 'px';
        div.style.top = y + 'px';
        win.document.body.appendChild(div);
        return div;
    };

    var flip = function (div, drawer) {
        var classes = div.className;
        div.className = classes + ' flipToEdge';
        setTimeout(function () {
            drawer();
            div.className = classes + ' flipFromEdge';
            setTimeout(function () {
                div.className = classes;
            }, 500);
        }, 500);
        return div;
    };

    Card.prototype.frontToBack = function (div) {
        return flip(div, Card.drawBack.bind(Card, div.style.left, div.style.top, div));
    };

    Card.prototype.backToFront = function (div) {
        return flip(div, this.draw.bind(this, div.style.left, div.style.top, div));
    };

    Card.FIRST_SUIT = 0;
    Card.SPADE = 3;
    Card.HEART = 2;
    Card.CLUB = 0;
    Card.DIAMOND = 1;
    Card.LAST_SUIT = 3;
    Card.suits = [ 'C', 'D', 'H', 'S' ];

    Card.JOKER = 0;
    Card.FIRST_RANK = 1;
    Card.ACE = 1;
    Card.JACK = 11;
    Card.QUEEN = 12;
    Card.KING = 13;
    Card.LAST_RANK = 13;
    Card.ranks = [ 'G', 'A', '2', '3', '4', '5', '6', '7',
                    '8', '9', '10', 'J', 'Q', 'K' ];

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
    var Deck = function (CardConstructor, black_joker, red_joker) {
        CardConstructor = CardConstructor || Card;
        this.cards = [];
        var i;
        var j;
        for (i = CardConstructor.FIRST_SUIT; i <= CardConstructor.LAST_SUIT; ++i) {
            for (j = CardConstructor.FIRST_RANK; j <= CardConstructor.LAST_RANK; ++j) {
                this.cards.push(new CardConstructor(j, i));
            }
        }

        if (black_joker) {
            this.cards.push(new CardConstructor(CardConstructor.JOKER, CardConstructor.CLUB));
        }

        if (red_joker) {
            this.cards.push(new CardConstructor(CardConstructor.JOKER, CardConstructor.DIAMOND));
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

    Deck.prototype.drawOne = function () {
        if (this.cards.length === 0) {
            return null;
        }
        return this.cards.shift();
    };

    Deck.prototype.draw = function (x, y, div) {
        div = Card.drawBack(x, y, div);
        var count_span = win.document.createElement('span');
        count_span.innerText = this.cards.length;
        count_span.style.backgroundColor = 'white';
        count_span.style.margin = '5px 5px';
        count_span.style.position = 'absolute';
        count_span.style.top = '0';
        count_span.style.left = '0';
        div.appendChild(count_span);
        return div;
    };

    return Deck;
}(this));
