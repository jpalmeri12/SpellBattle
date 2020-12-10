var colors = ["#d83f3f", "#287c57", "#2369bd"];

var enemies = {
    "test": {
        id: "test",

    }
}

class Game {
    constructor() {
        var game = this;
        this.tiles = [];
        this.div = $("#gameScreen");
        this.gridDiv = $(`<div id="grid"></div>`);
        this.div.append(this.gridDiv);
        this.baseDiv = $(`<div id="base"></div>`);
        this.baseWordDiv = $(`<div class="word"></div>`);
        this.baseDiv.append(this.baseWordDiv);
        this.resetButtonDiv = $(`<div class="reset img"></div>`);
        this.resetButtonDiv.click(function () {
            game.resetWord();
        });
        this.baseDiv.append(this.resetButtonDiv);
        this.div.append(this.baseDiv);
        this.enemyDiv = $(`<div id="enemies"></div>`);
        this.div.append(this.enemyDiv);
    }
    start() {
        this.deck = [];
        // Starting deck
        this.deck.push(new Tile(this, "A", 0, 1, "", 0));
        this.deck.push(new Tile(this, "A", 1, 0, "", 1));
        this.deck.push(new Tile(this, "A", 0, 1, "", 2));
        this.deck.push(new Tile(this, "E", 1, 0, "", 0));
        this.deck.push(new Tile(this, "E", 0, 1, "", 1));
        this.deck.push(new Tile(this, "E", 1, 0, "", 2));
        this.deck.push(new Tile(this, "E", 0, 1, "", 0));
        this.deck.push(new Tile(this, "I", 1, 0, "", 1));
        this.deck.push(new Tile(this, "I", 0, 1, "", 2));
        this.deck.push(new Tile(this, "I", 1, 0, "", 0));
        this.deck.push(new Tile(this, "O", 0, 1, "", 1));
        this.deck.push(new Tile(this, "O", 1, 0, "", 2));
        this.deck.push(new Tile(this, "O", 0, 1, "", 0));
        this.deck.push(new Tile(this, "U", 1, 0, "", 1));
        this.deck.push(new Tile(this, "R", 0, 1, "", 2));
        this.deck.push(new Tile(this, "R", 1, 0, "", 0));
        this.deck.push(new Tile(this, "S", 0, 1, "", 1));
        this.deck.push(new Tile(this, "S", 1, 0, "", 2));
        this.deck.push(new Tile(this, "T", 0, 1, "", 0));
        this.deck.push(new Tile(this, "T", 1, 0, "", 1));
        this.deck.push(new Tile(this, "L", 0, 1, "", 2));
        this.deck.push(new Tile(this, "L", 1, 0, "", 0));
        this.deck.push(new Tile(this, "N", 0, 1, "", 1));
        this.deck.push(new Tile(this, "N", 1, 0, "", 2));
        // Make divs
        this.gridDiv.empty();
        for (var i = 0; i < this.deck.length; i++) {
            this.gridDiv.append(this.deck[i].div);
        }
        // Shuffle
        this.deck = shuffle(this.deck);
        this.discard = [];
        // Deal
        this.grid = [];
        for (var i = 0; i < 4; i++) {
            this.grid[i] = [];
            for (var j = 0; j < 4; j++) {
                var tile = this.deck.shift();
                this.summonTile(tile, i, j);
                this.grid[i].push(tile);
            }
        }
        this.resetWord();
        // Enemies
        this.enemyDiv.empty();
        this.enemies = [];
        var enemy = new Enemy(this, "test", 20);
        this.enemies.push(enemy);
        this.enemyDiv.append(enemy.div);
        this.updateEnemies();
    }
    tileClicked(tile) {
        var word = this.word;
        if (word.word.length == 0 || (Math.abs(tile.x - word.lastX) <= 1 && Math.abs(tile.y - word.lastY) <= 1)) {
            if (tile.selected) {
                // Deselect?
            } else {
                tile.selected = true;
                tile.update(false);
                word.word += tile.letter;
                this.word.tiles.push(tile);
                word.lastX = tile.x;
                word.lastY = tile.y;
                this.baseWordDiv.text(word.word);
                if (word.word.length >= 3 && isWord(word.word)) {
                    this.baseWordDiv.addClass("isWord");
                } else {
                    this.baseWordDiv.removeClass("isWord");
                }
            }
        }
    }
    resetWord() {
        if (this.word) {
            for (var i = 0; i < this.word.tiles.length; i++) {
                this.word.tiles[i].selected = false;
                this.word.tiles[i].update();
            }
        }
        this.word = {
            word: "",
            tiles: [],
            lastX: 0,
            lastY: 0
        };
        this.baseWordDiv.text("");
        this.baseWordDiv.removeClass("isWord");
    }
    updateEnemies() {
        for (var i = 0; i < this.enemies.length; i++) {
            var enemy = this.enemies[i];
            var x = 2.5 + i - 0.5 * (this.enemies.length - 1);
            enemy.div.css("left", x + "rem");
            enemy.update();
        }
    }
    enemyClicked(enemy) {
        if (enemy.dead) {
            return;
        }
        // Check if word is valid
        var word = this.word;
        if (word.word.length >= 3 && isWord(word.word)) {
            // Count damage
            var damage = 0;
            for (var i = 0; i < word.tiles.length; i++) {
                damage += word.tiles[i].power;
            }
            enemy.hp -= damage;
            // Enemy dead?
            if (enemy.hp <= 0) {
                enemy.dead = true;
            }
            this.updateEnemies();
            // Remove tiles
            for (var i = 0; i < this.grid.length; i++) {
                for (var j = this.grid[i].length - 1; j >= 0; j--) {
                    var tile = this.grid[i][j];
                    if (tile.selected) {
                        tile.selected = false;
                        tile.shown = false;
                        this.grid[i].splice(j, 1);
                        this.discard.push(tile);
                        tile.update();
                    }
                }
            }
            // Add new tiles
            for (var i = 0; i < this.grid.length; i++) {
                for (var j=0; j<this.grid[i].length; j++) {
                    var tile = this.grid[i][j];
                    tile.y = j;
                    tile.update(true);
                }
                while (this.grid[i].length < 4) {
                    var j = this.grid[i].length;
                    var tile = this.dealTile();
                    this.grid[i].push(tile);
                    this.summonTile(tile, i, j);
                }
            }
            this.resetWord();
        }
    }
    dealTile() {
        if (this.deck.length == 0) {
            this.deck = shuffle(this.discard);
        }
        return this.deck.shift();
    }
    summonTile(tile, x, y) {
        tile.x = x;
        tile.y = y + 4;
        tile.shown = true;
        tile.inGrid = true;
        tile.update(false);
        tile.y = y;
        tile.update(true);
    }
}

class Tile {
    constructor(game, letter, power, coins, keyword, color) {
        this.game = game;
        this.letter = letter;
        this.power = power;
        this.coins = coins;
        this.color = color;
        this.keyword = "";
        this.shown = false;
        this.inGrid = false;
        this.selected = false;
        this.x = 0;
        this.y = 0;
        this.init();
    }
    init() {
        var tile = this;
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
        this.div.click(function () {
            if (tile.shown) {
                tile.game.tileClicked(tile);
            }
        });
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
        if (this.selected) {
            this.div.addClass("selected");
        } else {
            this.div.removeClass("selected");
        }
        if (this.shown) {
            this.div.addClass("click");
        } else {
            this.div.removeClass("click");
        }
    }
}

class Enemy {
    constructor(game, kind, hp) {
        this.game = game;
        this.kind = kind;
        this.hp = hp;
        this.dead = false;
        console.log(this.hp);
        this.init();
    }
    init() {
        var enemy = this;
        this.div = $(`<div class="enemy"></div>`);
        this.spriteDiv = $(`<div class="sprite img"><div>`);
        this.div.append(this.spriteDiv);
        this.hpDiv = $(`<div class="hp"></div>`);
        this.div.append(this.hpDiv);
        this.div.click(function () {
            enemy.game.enemyClicked(enemy);
        });
    }
    update() {
        this.hpDiv.text(this.hp);
        if (this.dead) {
            this.div.addClass("anim_enemyDead");
        }
        else {
            this.div.removeClass("anim_enemyDead");
        }
    }
}
