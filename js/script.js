var game = null;

var words = {};

$(async function () {
    showScreen("gameScreen");
    words = await loadWords();
    setTimeout(function() {
        game = new Game();
        game.start();
    }, 250);
});

async function loadWords() {
    var words = await $.ajax("words.txt");
    var w = words.split("\n");
    var w2 = [];
    for (var i=0; i<w.length; i++) {
        w2.push(w[i].trim());
    }
    return w2;
}

function isWord(word) {
    return words.indexOf(word.toLowerCase()) > -1;
}