var game = null;

$(function () {
    showScreen("gameScreen");
    setTimeout(function() {
        game = new Game();
        game.start();
    }, 250);
});