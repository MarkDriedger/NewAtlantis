/*jshint browser: true, esversion: 6, devel: true */


var mysteryNumber = 12;

//create an array of the game's score items
var score = [];
score[0] = new Collectible(['nothing', 'nothings'], 0);
score[201] = new Collectible('candlenut', 4);
score[202] = new Collectible(['Quo\'s office key'], 0);
score[203] = new Collectible('pug', 1);
score[204] = new Collectible(['dock pass', 'dock passes'], 10);
score[205] = new Collectible(['Pugly doll'], 4);
score[206] = new Collectible(['Pokémon', 'Pokémon'], 10);

score[1000] = new Collectible(['Nothingness', 'Nothingnesses'], 0);

score[1] = new PlayerStat(['Body', 'Health points'], 100);
score[2] = new PlayerStat(['Mind', 'Mind points'], 75);
score[3] = new PlayerStat(['Brawn', 'Brawn points'], 0);
score[4] = new PlayerStat(['Hand', 'Hand points'], 20);
score[5] = new PlayerStat(['Heart', 'Heart points'], 30);
score[6] = new PlayerStat(['Eye', 'Eye points'], 40);
score[7] = new PlayerStat(['Voice', 'Voice points'], 50);

score[50] = new Reputation(['Privateer'], 5);
score[100] = new Progress('Medusa', 10);

//for testing. remove later
score[4].diceQuantity = 1;

//decrementing happens differnetly if death occurs.
score[1].decrement = function(amount) {
    this.quantity -= amount;
    if (this.quantity <= 0){
        this.quantity = 0;
        board.activeIndex = 99;
        deck[board.activeIndex].updateLocation();
        player.alive = false;
        player.justDied = true;
    }
    this.updateStats();
};

//decrementing happens differnetly if insanity occurs.
score[2].decrement = function(amount) {
    this.quantity -= amount;
    if (this.quantity <= 0){
        this.quantity = 0;
        board.activeIndex = 95;
        deck[board.activeIndex].updateLocation();
        player.sane = false;
        player.justWentInsane = true;
    }
    this.updateStats();
};
