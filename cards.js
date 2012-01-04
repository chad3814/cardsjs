var Card = (function() {
    Card = function(rank, suit) {
	this.rank = rank;
	this.suit = suit;
	this.div = null;
    };

    Card.prototype.dump = function() {
	if(console && console.log) {
	    console.log(Card.ranks[this.rank] + Card.suits[this.suit]);
	}
    };

    Card.prototype.draw = function(x, y, div) {
	if(!div) {
	    div = document.createElement('div');
	}
	div.className = 'card';
	if(this.rank == Card.JOKER) {
	    div.style.backgroundPosition = (this.suit * -79) + "px " + (4 * -123) + "px";
	} else {
	    div.style.backgroundPosition = ((this.rank - 1) * -79) + "px " + (this.suit * -123) + "px";
	}
	div.style.position = 'absolute';
	div.style.left = x + "px";
	div.style.top = y + "px";
	document.body.appendChild(div);
	this.div = div;
	return div;
    };

    Card.drawBack = function(x, y, div) {
	if(!div) {
	    div = document.createElement('div');
	}
	div.className = 'card';
	div.style.backgroundPosition = (2 * -79) + "px " + (4 * -123) + "px";
	div.style.position = 'absolute';
	div.style.left = x + "px";
	div.style.top = y + "px";
	document.body.appendChild(div);
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
})();

var Hand = (function() {
    Hand = function() {
	this.cards = [];
    };

    Hand.prototype.clear = function() {
	this.cards = [];
    };

    Hand.prototype.length = function() {
	return this.cards.length;
    };

    Hand.prototype.add = function() {
	for(var i in arguments) {
	    if(arguments[i] instanceof Card)
		this.cards.push(arguments[i]);
	}
    };

    return Hand;
})();

var Deck = (function() {
    Deck = function(black_joker, red_joker) {
	this.cards = [];
	for(var i = Card.FIRST_SUIT; i <= Card.LAST_SUIT; ++i) {
	    for(var j = Card.ACE; j <= Card.KING; ++j) {
		this.cards.push(new Card(j, i));
	    }
	}
	if(black_joker)
	    this.cards.push(new Card(Card.JOKER, Card.CLUB));
	if(red_joker)
	    this.cards.push(new Card(Card.JOKER, Card.DIAMOND));
    };

    Deck.prototype.length = function() {
	return this.cards.length;
    };

    Deck.prototype.shuffle = function() {
	this.cards.sort(function() {
	    return 0.5 - Math.random();
	});
    };

    Deck.prototype.dump = function() {
	for(var c in this.cards) {
	    this.cards[c].dump();
	}
    };

    Deck.prototype.deal = function(number_hands, number_cards) {
	if(!number_hands) {
	    return this.cards.shift();
	}

	if(this.cards.length < (number_hands * number_cards)) {
	    return null;
	}

	var hands = [];
	for(var i=0; i<number_hands; ++i) {
	    hands.push(new Hand());
	}

	for(var j=0; j<number_cards; ++j) {
	    for(var i=0; i<number_hands; ++i) {
		hands[i].add(this.cards.shift());
	    }
	}

	return hands;
    };

    return Deck;
})();
