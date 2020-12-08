var colors = ["#d83f3f", "#287c57", "#2369bd"]

class Game {
    constructor() {
        this.tiles = [];
        this.div = $("#gameScreen");
        this.gridDiv = $(`<div id="grid"></div>`);
        this.div.append(this.gridDiv);
    }
    start() {
        this.deck = [];
        // Starting deck
        this.deck.push(new Tile("A", "0", "1", "", 0));
        this.deck.push(new Tile("A", "1", "0", "", 1));
        this.deck.push(new Tile("A", "0", "1", "", 2));
        this.deck.push(new Tile("E", "1", "0", "", 0));
        this.deck.push(new Tile("E", "0", "1", "", 1));
        this.deck.push(new Tile("E", "1", "0", "", 2));
        this.deck.push(new Tile("E", "0", "1", "", 0));
        this.deck.push(new Tile("I", "1", "0", "", 1));
        this.deck.push(new Tile("I", "0", "1", "", 2));
        this.deck.push(new Tile("I", "1", "0", "", 0));
        this.deck.push(new Tile("O", "0", "1", "", 1));
        this.deck.push(new Tile("O", "1", "0", "", 2));
        this.deck.push(new Tile("O", "0", "1", "", 0));
        this.deck.push(new Tile("U", "1", "0", "", 1));
        this.deck.push(new Tile("R", "0", "1", "", 2));
        this.deck.push(new Tile("R", "1", "0", "", 0));
        this.deck.push(new Tile("S", "0", "1", "", 1));
        this.deck.push(new Tile("S", "1", "0", "", 2));
        this.deck.push(new Tile("T", "0", "1", "", 0));
        this.deck.push(new Tile("T", "1", "0", "", 1));
        this.deck.push(new Tile("L", "0", "1", "", 2));
        this.deck.push(new Tile("L", "1", "0", "", 0));
        this.deck.push(new Tile("N", "0", "1", "", 1));
        this.deck.push(new Tile("N", "1", "0", "", 2));
        // Make divs
        for (var i = 0; i < this.deck.length; i++) {
            this.gridDiv.append(this.deck[i].div);
        }
        // Shuffle
        this.deck = shuffle(this.deck);
        // Deal
        this.grid = [];
        for (var i = 0; i < 4; i++) {
            this.grid[i] = [];
            for (var j = 0; j < 4; j++) {
                var tile = this.deck.shift();
                tile.x = i;
                tile.y = j+4;
                tile.shown = true;
                tile.update(false);
                tile.y = j;
                tile.update(true);
                this.grid[i].push(tile);
            }
        }
        console.log(this.grid);
    }

}

class Tile {
    constructor(letter, power, coins, keyword, color) {
        this.letter = letter;
        this.power = power;
        this.coins = coins;
        this.color = color;
        this.keyword = "";
        this.shown = false;
        this.x = 0;
        this.y = 0;
        this.init();
    }
    init() {
        this.div = $(`<div class="tile"></div>`);
        this.bgDiv = $(`<div class="bg"></div>`);
        this.div.append(this.bgDiv);
        this.panelDiv = $(`<div class="panel"></div>`);
        this.div.append(this.panelDiv);
        this.letterDiv = $(`<div class="letter"></div>`);
        this.div.append(this.letterDiv);
        this.powerDiv = $(`<div class="power"></div>`);
        this.div.append(this.powerDiv);
        this.coinsDiv = $(`<div class="coins"></div>`);
        this.div.append(this.coinsDiv);
        this.iconDiv = $(`<div class="icon"></div>`);
        this.div.append(this.iconDiv);
    }
    update(animate) {
        this.letterDiv.text(this.letter);
        this.powerDiv.text(this.power);
        this.coinsDiv.text(this.coins);
        var opacity = (this.shown ? 1 : 0);
        var props = {
            "left": this.x + "rem",
            "top": (3 - this.y) + "rem"
        }
        var bgProps = {
            "background-color": colors[this.color]
        };
        if (animate) {
            this.div.animate({
                "left": this.x + "rem",
                "top": [(3 - this.y) + "rem", "easeInQuad"],
                "opacity": opacity
            }, 500);
            this.bgDiv.animate(bgProps, 250, "linear");
        } else {
            this.div.css({
                "left": this.x + "rem",
                "top": (3 - this.y) + "rem",
                "opacity": opacity
            });
            this.bgDiv.css(bgProps);
        }
    }
}
