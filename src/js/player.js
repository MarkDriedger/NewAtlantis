/*jshint browser: true, esversion: 6, devel: true */

var player = {
    alive: true,
    sane: true,
    justDied: false,
    justWentInsane: false,
    gender: 0,
    name: 'Cecil Palmer',

    score: require('./scores.js'),

    getGender : function(inputGender){
        this.gender = inputGender;
        switch (this.gender) {
        default:
        case 0:
            this.nominative = 'this person';
            this.objective = 'this party';
            this.posessive = 'this individual’s';
            this.posessiveWithS = 'this individual’s';
            this.noun = 'person';
            this.politeNoun = 'esteemed individual';
            this.honorific = 'Your Honour';
            break;
        case 1:
            this.nominative = 'she';
            this.objective = 'her';
            this.posessive = 'her';
            this.posessiveWithS = 'hers';
            this.noun = 'woman';
            this.politeNoun = 'lady';
            this.honorific = 'Ma’am';
            break;
        case 2:
            this.nominative = 'he';
            this.objective = 'him';
            this.posessive = 'his';
            this.posessiveWithS = 'his';
            this.noun = 'man' ;
            this.politeNoun = 'individual';
            this.honorific = 'Sir';
            break;
        }
    }
};

//scores (collectibles & stats)
function Score(){
    this.singularName = '';
    this.pluralName = '';
    this.quantity = 0;
    this.icon = '';
}

//return the singular or plural name of the collectible
Score.prototype.correctName = function(amount){
    if (amount === 1) {
        return this.singularName;
    } else {
        return this.pluralName;
    }
};

//assign the quantity of a collectible
Score.prototype.setQuantity = function(amount) {
    this.quantity = amount;
};

function Collectible(inputName, quantity, icon){
    Score.call(this);
    if (Array.isArray(inputName)){
        this.singularName = inputName[0];
        if (inputName.length === 1) {
            this.pluralName = inputName[0]+'s';
        } else {
            this.pluralName = inputName[1];
        }
    } else {
        this.singularName = inputName;
        this.pluralName = inputName+'s';
    }
    this.setQuantity(quantity);
    this.icon = icon;
}

function Progress(inputName, quantity, icon){
    Score.call(this);
    if (Array.isArray(inputName)){
        this.singularName = inputName[0];
        if (inputName.length === 1) {
            this.pluralName = inputName[0];
        } else {
            this.pluralName = inputName[1];
        }
    } else {
        this.singularName = inputName;
        this.pluralName = inputName;
    }
    this.setQuantity(quantity);
    this.icon = icon;
}

Progress.prototype = new Score();

function Reputation(inputName, quantity, icon){
    Score.call(this);
    if (Array.isArray(inputName)){
        this.singularName = inputName[0];
        if (inputName.length === 1) {
            this.pluralName = inputName[0]+'s';
        } else {
            this.pluralName = inputName[1];
        }
    } else {
        this.singularName = inputName;
        this.pluralName = inputName+'s';
    }
    this.setQuantity(quantity);
    this.icon = icon;
}

Reputation.prototype = new Score();
Collectible.prototype = new Score();

//list the inventory
Collectible.prototype.updateInventory = function() {
    var inventoryList = '<b><u>Inventory</u></b><br>';

    score.forEach(function (item) {
        if (item.quantity > 0 && item instanceof Collectible) {
            inventoryList += `• ${item.quantity} ${item.correctName(item.quantity)}<br>`;
        }
    });
    inventoryDisplay.innerHTML = inventoryList;
};

//list the progress
Reputation.prototype.updateReputation = function() {
    var reputationList = '<b><u>Progress</u></b><br>';

    score.forEach(function (item) {
        if (item.quantity > 0 && (item instanceof Progress || item instanceof Reputation)) {
            reputationList += `• ${item.quantity} ${item.correctName(item.quantity)}<br>`;
        }
    });
    reputationDisplay.innerHTML = reputationList;
};

//increment the quantity of a collectible
Collectible.prototype.increment = function(amount) {
    this.quantity += amount;
    this.updateInventory();
};

//decrement the quantity of a collectible
Collectible.prototype.decrement = function(amount) {
    this.quantity -= amount;
    if (this.quantity < 0) {
        this.quantity = 0;
    }
    this.updateInventory();
};


//stats
function PlayerStat(inputName, quantity, icon){
    Score.call(this);
    this.singularName = inputName[0];
    this.pluralName = inputName[0];
    this.setQuantity(quantity);
    this.icon = icon;
    this.diceQuantity = 2;
    this.experience = 0;
    this.level = 0;
}

PlayerStat.prototype = new Score();

 //list the player's stats
PlayerStat.prototype.updateStats = function() {
    var statList = '<b><u>Health</u></b><br>',
    levelArray = 0;

    statList += `•  ${score[1].singularName}: ${score[1].quantity}<br>`;
    statList += `•  ${score[2].singularName}: ${score[2].quantity}<br><br>`;
    statList += '<b><u>Stats</u></b><br>';
    score.forEach(function (item) {
    if ((item.singularName !== "Body") && (item.singularName !== "Mind") && (item.quantity > 0) && (item instanceof PlayerStat)) {
        levelArray = item.getLevel();
        statList += `•  ${item.singularName}: Level:${levelArray[0]}, Points:${item.quantity}, Exp:${levelArray[1]}, Next:${levelArray[2]}<br>`;
        }
    });
    playerStatsDisplay.innerHTML = statList;
};

PlayerStat.prototype.getLevel = function(){
    var exp = this.quantity,
    level = 1;

    for (level === 1; level <= exp; level += 1) {
        exp -= level;
    }
    return [level - 1, exp, level - exp];
};

PlayerStat.prototype.increment = function(amount) {
    this.quantity += amount;
    this.updateStats();
};

//decrement the quantity of a stat
PlayerStat.prototype.decrement = function(amount) {
    this.quantity -= amount;
    if (this.quantity < 0) {
        this.quantity = 0;
    }
    this.updateStats();
};

PlayerStat.prototype.roll = function() {
    var diceIndex = 0,
    diceResults = [];

    for (diceIndex = 0; diceIndex < this.diceQuantity; diceIndex+=1) {
        diceResults[diceIndex] = Math.floor(Math.random() * 6) + 1;
    }
    return diceResults;
};

PlayerStat.prototype.addDice = function() {
    var diceTotal = 0,
    numOfDice = board.activeDice.length,
    diceIndex = 0;

    for (diceIndex = 0; diceIndex < numOfDice; diceIndex += 1){
        diceTotal += board.activeDice[diceIndex];
    }
    return diceTotal;
};

PlayerStat.prototype.eraseDice = function(diceInput){
    var i = 0,
    shownDice = board.activeDice.length;

    //clear the old dice
    for (i = 0; i < shownDice; i += 1) {
        diceField.removeChild(dice[i]);
    }
};

PlayerStat.prototype.drawDice = function(diceInput){
    var i = 0,
    diceIndex = 0,
    numOfDice = board.activeDice.length;

    //draw new dice
//    board.shownDice = diceResults.length;
    for (diceIndex = 0; diceIndex < numOfDice; diceIndex += 1){
        switch (diceInput[diceIndex]) {
        case 1:
            dice[diceIndex].setAttribute('class', 'diceType diceFace1');
            diceField.appendChild(dice[diceIndex]);
            break;
        case 2:
            dice[diceIndex].setAttribute('class', 'diceType diceFace2');
            diceField.appendChild(dice[diceIndex]);
            break;
        case 3:
            dice[diceIndex].setAttribute('class', 'diceType diceFace3');
            diceField.appendChild(dice[diceIndex]);
            break;
        case 4:
            dice[diceIndex].setAttribute('class', 'diceType diceFace4');
            diceField.appendChild(dice[diceIndex]);
            break;
        case 5:
            dice[diceIndex].setAttribute('class', 'diceType diceFace5');
            diceField.appendChild(dice[diceIndex]);
            break;
        case 6:
            dice[diceIndex].setAttribute('class', 'diceType diceFace6');
            diceField.appendChild(dice[diceIndex]);
            break;
        default:
        case 7:
            dice[diceIndex].setAttribute('class', 'diceType diceFace7');
            diceField.appendChild(dice[diceIndex]);
            break;
        }
    }
};

PlayerStat.prototype.rollCompare = function(opponent) {
    var opponentRoll = opponent,
    diceTotal = 0;

    this.eraseDice();
    board.activeDice = this.roll();
    this.drawDice(board.activeDice);
    diceTotal = this.addDice(board.activeDice);
    if (diceTotal >= opponentRoll) {
        return [true,`${this.singularName} roll succeded!`];
    } else {
        return [false,`${this.singularName} roll failed!`];
    }
};
