/*jshint browser: true, esversion: 6, devel: true */

var locationTitleBox = document.getElementById('location');
var button1 = document.getElementById('button1');
var button2 = document.getElementById('button2');
var button3 = document.getElementById('button3');
var button4 = document.getElementById('button4');
var html = document.querySelector('html');

//set up the stats field at the top that shows player stats & inventory items
var statsField = document.getElementById('statsField');

var locationDisplay = document.getElementById('location');
statsField.appendChild(locationDisplay);

var playerStatsDisplay = document.createElement('p');
playerStatsDisplay.setAttribute('class', 'topDisplay');
statsField.appendChild(playerStatsDisplay);

var inventoryDisplay = document.createElement('p');
inventoryDisplay.setAttribute('class', 'topDisplay');
statsField.appendChild(inventoryDisplay);

var reputationDisplay = document.createElement('p');
reputationDisplay.setAttribute('class', 'topDisplay');
statsField.appendChild(reputationDisplay);

var storyDisplay = document.querySelector('.output');
statsField.appendChild(storyDisplay);

var diceField = document.getElementById('diceField');
var dice = [];
var maxdice = 20;
var i = 0;
for (i = 0; i < maxdice; i += 1) {
    dice[i] = document.createElement('div');
    dice[i].setAttribute('class', 'diceType diceFace1');
}

var cardField = document.getElementById('cardField');

//create 20 displayable cards
var display = [];
var maxcards = 20;
var i = 0;
for (i = 0; i < maxcards; i += 1) {
    display[i] = document.createElement('div');
    display[i].setAttribute('class', 'displayCard enabledCard');
}

//set up event listeners for up to 20 displayable cards
var onCardClick = function (event) {
    if (display[this.displayIndex].className === 'displayCard enabledCard'){
        board.displayText += `<span class = styleCard>* ${deck.card[board.activeIndex].buttonInstructions[this.displayIndex]}<br></span>`;
        board.activeIndex = board.activeCardsUp[this.displayIndex];
        board.setBoard();
    }
};

for (i = 0; i < maxcards; i += 1) {
    display[i].displayIndex = i;
    display[i].addEventListener('click', onCardClick);
}

//board object
var board = {
    displayText: '',
    extra: 0,
    activeIndex: 1,
    activeCardsUp: [],
    activeDice: [],

    setBoard() {
        var oldNumOfCards = this.activeCardsUp.length,
        numOfCards = 0;

//remove old cards.
        for (i = 0; i < oldNumOfCards; i += 1) {
            cardField.removeChild(display[i]);
        }
        //Create Stats and Inventory & put the text in the story
        scoreData[0].updateInventory();
        scoreData[1].updateStats();
        scoreData[50].updateReputation();
        this.displayText += deck.card[this.activeIndex].cardText();
        if (player.justDied) {
            player.justDied = false;
            this.displayText +=`<span class = styleAlert>${cardDescription[99]}<br></span>`;
        }
        if (player.justWentInsane) {
            player.justWentInsane = false;
            this.displayText +=`<span class = styleAlert>${cardDescription[95]}<br></span>`;
        }
        storyDisplay.innerHTML = this.displayText;

        //append the appropriate number of cards to choose from
        this.activeCardsUp = deck.card[this.activeIndex].nextCards;
        numOfCards = this.activeCardsUp.length;
        for (i = 0; i < numOfCards; i += 1) {
            cardField.appendChild(display[i]);
            display[i].innerHTML = `${deck.card[this.activeIndex].buttonInstructions[i]}<br>${deck.card[this.activeIndex].requirementSentence(this.activeCardsUp[i])}`;
            //disable cards if requirments are not met
            if (!deck.card[this.activeIndex].checkRequirements(this.activeCardsUp[i])) {
                display[i].setAttribute('class', 'displayCard disabledCard');
            } else {
                display[i].setAttribute('class', 'displayCard enabledCard');
            }
        }
    }
};

var player = {
    alive: true,
    sane: true,
    justDied: false,
    justWentInsane: false,
    gender: 0,
    name: 'Cecil Palmer',

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
function ScoreType(){
    this.singularName = '';
    this.pluralName = '';
    this.quantity = 0;
    this.icon = '';
}

//return the singular or plural name of the collectible
ScoreType.prototype.correctName = function(amount){
    if (amount === 1) {
        return this.singularName;
    } else {
        return this.pluralName;
    }
};

//assign the quantity of a collectible
ScoreType.prototype.setQuantity = function(amount) {
    this.quantity = amount;
};

function Collectible(inputName, quantity, marcheValue, icon){
    ScoreType.call(this);
    this.marcheValue = marcheValue;
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

function Progress(inputName, icon){
    ScoreType.call(this);
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
    this.icon = icon;
}

Progress.prototype = new ScoreType();

function Reputation(inputName, quantity, icon){
    ScoreType.call(this);
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

Reputation.prototype = new ScoreType();
Collectible.prototype = new ScoreType();

//list the inventory
Collectible.prototype.updateInventory = function() {
    var inventoryList = '<b><u>Inventory</u></b><br>';

    scoreData.forEach(function (item) {
        if (item.quantity > 0 && item instanceof Collectible) {
            inventoryList += `• ${item.quantity} ${item.correctName(item.quantity)}<br>`;
        }
    });
    inventoryDisplay.innerHTML = inventoryList;
};

//list the reputation
Reputation.prototype.updateReputation = function() {
    var reputationList = '<b><u>Progress</u></b><br>';

    scoreData.forEach(function (item) {
        if (item.quantity > 0 && (item instanceof Progress || item instanceof Reputation || item instanceof HiddenProgress)) {
            reputationList += `• ${item.quantity} ${item.correctName(item.quantity)}<br>`;
        }
    });
    reputationDisplay.innerHTML = reputationList;
};

//list the progress
Progress.prototype.updateReputation = function() {
    var reputationList = '<b><u>Progress</u></b><br>';

    scoreData.forEach(function (item) {
        if (item.quantity > 0 && (item instanceof Progress || item instanceof Reputation || item instanceof HiddenProgress)) {
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

//increment &decrement the quantity of progress
Progress.prototype.increment = function(amount) {
    this.quantity += amount;
    this.updateReputation();
};

Progress.prototype.decrement = function(amount) {
    this.quantity -= amount;
    if (this.quantity < 0) {
        this.quantity = 0;
    }
    this.updateReputation();
};

//increment &decrement the quantity of a reputation
Progress.prototype.increment = function(amount) {
    this.quantity += amount;
    this.updateReputation();
};

Progress.prototype.decrement = function(amount) {
    this.quantity -= amount;
    this.updateReputation();
};

function HiddenProgress(inputName){
    ScoreType.call(this);
    this.singularName = inputName;
    this.pluralName = inputName;
    this.setQuantity(0);
}

HiddenProgress.prototype = new ScoreType();

HiddenProgress.prototype.increment = function(amount) {
    this.quantity += amount;
    this.updateReputation();
};

HiddenProgress.prototype.decrement = function(amount) {
    this.quantity -= amount;
    this.updateReputation();
};

HiddenProgress.prototype.updateReputation = function() {
    var reputationList = '<b><u>Progress</u></b><br>';

    scoreData.forEach(function (item) {
        if (item.quantity > 0 && (item instanceof Progress || item instanceof Reputation || item instanceof HiddenProgress)) {
            reputationList += `• ${item.quantity} ${item.correctName(item.quantity)}<br>`;
        }
    });
    reputationDisplay.innerHTML = reputationList;
};

//stats
function PlayerStat(inputName, quantity, icon){
    ScoreType.call(this);
    if (Array.isArray(inputName)){
        this.singularName = inputName[0];
        if (inputName.length === 1) {
            this.pluralName = inputName[0]+' points';
        } else {
            this.pluralName = inputName[1];
        }
    } else {
        this.singularName = inputName;
        this.pluralName = inputName+' points';
    }
    this.setQuantity(quantity);
    this.icon = icon;
    this.diceQuantity = 1;
    this.experience = 0;
    this.level = 0;
}

PlayerStat.prototype = new ScoreType();

////////////////////////////////////////////////////////////////////////////////

var externalScoreData = require('./scoreData.json');

//continue with voice - hands of salt
//lantern and deerskin jacket shoud have buffs
var scoreManager = {
    score: [],
    loadData(data) {
        // Populate the score array with the provided data
    },
    getScore(scoreName) {

        /*function isItemNameEqualToScoreName(item) {
            return item.name === scoreName;
        }

        this.score.find(isItemNameEqualToScoreName);*/

        return this.score.find(function (item) {
            return item.singularName === scoreName;
        });

    }
};

scoreManager.loadData(externalScoreData);
var pugScore = scoreManager.getScore('pug');
//pugScore.increment();

    externalScoreData.player.forEach(function (item) {
        var myItem = new PlayerStat(item.inputName, item.quantity, item.icon);
        scoreManager.score.push(myItem);
      });

    externalScoreData.reputation.forEach(function (item) {
        var myItem = new Reputation(item.inputName, item.quantity, item.icon);
        scoreManager.score.push(myItem);
      });

    externalScoreData.progress.forEach(function (item) {
        var myItem = new Progress(item.inputName, item.icon);
        scoreManager.score.push(myItem);
      });

    externalScoreData.hiddenProgress.forEach(function (item) {
        var myItem = new HiddenProgress(item.inputName);
        scoreManager.score.push(myItem);
      });

    externalScoreData.collectibles.forEach(function (item) {
      var myItem = new Collectible(item.inputName, item.quantity, item.value, item.buff, item.icon);
      scoreManager.score.push(myItem);
    });


// next sections are for testing only, from here...
function findBody(thisFunc) {
    return thisFunc.singularName === 'Body';
}
button1.innerHTML = scoreManager.score.find(findBody).quantity;

function findSirens(thisFunc) {
    return thisFunc.singularName === 'Sirens';
}
button2.innerHTML = scoreManager.score.find(findSirens).quantity;

function findMinutes(thisFunc) {
    return thisFunc.singularName === 'minute until The Medusa sinks';
}
button3.innerHTML = scoreManager.score.find(findMinutes).quantity;

function findBoat(thisFunc) {
    return thisFunc.singularName === 'Medusa lifeboat success';
}

function findPug(thisFunc) {
    return thisFunc.singularName === 'pug';
}
button4.innerHTML = scoreManager.score.find(findPug).quantity + " " + scoreManager.score.find(findPug).correctName(scoreManager.score.find(findPug).quantity);
//...until here (testing)

 //list the player's stats
PlayerStat.prototype.updateStats = function() {
    var statList = '<b><u>Health</u></b><br>',
    levelArray = 0;

    statList += `•  ${scoreData[1].singularName}: ${scoreData[1].quantity}<br>`;
    statList += `•  ${scoreData[2].singularName}: ${scoreData[2].quantity}<br><br>`;
    statList += '<b><u>Stats</u></b><br>';
    scoreData.forEach(function (item) {
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

//create an array of the game's score items 1234
var scoreData = [];
scoreData[0] = new Collectible(['nothing', 'nothings'], 0);
scoreData[201] = new Collectible('candlenut', 0);
scoreData[202] = new Collectible(['Quo\'s office key'], 0);
scoreData[203] = new Collectible('pug', 0);
scoreData[204] = new Collectible('inkpot', 0);
scoreData[205] = new Collectible('deerskin jacket', 0);
scoreData[206] = new Collectible('Royal shilling', 0);
scoreData[207] = new Collectible('Royal pound', 0);
scoreData[208] = new Collectible('Valhalan mark', 0);
scoreData[209] = new Collectible('New Foundland scrip', 0);
scoreData[210] = new Collectible('Post stamp', 0);
scoreData[211] = new Collectible('fig', 0);
scoreData[212] = new Collectible('flamingo feather', 0);
scoreData[213] = new Collectible('flamingo egg', 0);
scoreData[214] = new Collectible('kumquat', 0);
scoreData[215] = new Collectible('grape', 0);
scoreData[216] = new Collectible('beetle', 0);
scoreData[217] = new Collectible('cat eye', 0);
scoreData[218] = new Collectible('newt eye', 0);
scoreData[219] = new Collectible('frog toe', 0);
scoreData[220] = new Collectible('parrot wing', 0);
scoreData[221] = new Collectible(['shrimp','shrimp'], 0);
scoreData[222] = new Collectible(['hacksilver','hacksilver'], 0);
scoreData[223] = new Collectible('beaker', 0);
scoreData[224] = new Collectible('retort', 0);
scoreData[225] = new Collectible(['vial of deflogisticated nitrous air', 'vials of deflogisticated nitrous air'], 0);
scoreData[226] = new Collectible('oiled cambric', 0);
scoreData[227] = new Collectible('lantern', 0); //continue with voice - hands of salt


scoreData[10000] = new Collectible(['Nothingness', 'Nothingnesses'], 0);

scoreData[1] = new PlayerStat(['Body', 'Health points'], 100);
scoreData[2] = new PlayerStat(['Mind', 'Mind points'], 100);
scoreData[3] = new PlayerStat(['Brawn', 'Brawn points'], 0);
scoreData[4] = new PlayerStat(['Hand', 'Hand points'], 0);
scoreData[5] = new PlayerStat(['Heart', 'Heart points'], 0);
scoreData[6] = new PlayerStat(['Eye', 'Eye points'], 0);
scoreData[7] = new PlayerStat(['Voice', 'Voice points'], 0);

scoreData[50] = new Reputation(['Privateer'], 10);
scoreData[51] = new Reputation(['Viking'], 20);

scoreData[100] = new Progress(['minute until The Medusa sinks', 'minutes until The Medusa sinks']);
scoreData[101] = new Progress('Medusa crew gratitude');

scoreData[1000] = new HiddenProgress('Medusa lifeboat success');
scoreData[1001] = new HiddenProgress('Medusa lifeboat fail');

//for testing. remove later
scoreData[4].diceQuantity = 2;

//decrementing happens differnetly if death occurs.
scoreData[1].decrement = function(amount) {
    this.quantity -= amount;
    if (this.quantity <= 0){
        this.quantity = 0;
        board.activeIndex = 99;
        deck.card[board.activeIndex].updateLocation();
        player.alive = false;
        player.justDied = true;
    }
    this.updateStats();
};

//decrementing happens differnetly if insanity occurs.
scoreData[2].decrement = function(amount) {
    this.quantity -= amount;
    if (this.quantity <= 0){
        this.quantity = 0;
        board.activeIndex = 95;
        deck.card[board.activeIndex].updateLocation();
        player.sane = false;
        player.justWentInsane = true;
    }
    this.updateStats();
};

//create the prototype PlayableCard object
function PlayableCard(){
    this.rewardItem = [0];
    this.rewardQuantity = [0];
    this.costItem = [0];
    this.costQuantity = [0];
    this.requiredItem = [0];
    this.requiredQuantity = [0];
    this.nextCards = [201];
    this.buttonInstructions = [''];
    this.challengeStat = 0;
    this.challengeQuantity = 0;
    this.successText = '';
    this.successRewardItem = [0];
    this.successRewardQuantity = [0];
    this.successCostItem = [0];
    this.successCostQuantity = [0];
    this.failText = '';
    this.failRewardItem = [0];
    this.failRewardQuantity = [0];
    this.failCostItem = [0];
    this.failCostQuantity = [0];
    this.locationDescription = '';
}

//get & set a card's rewards to be given out when clicked
PlayableCard.prototype.setRewards = function(rewardItem,rewardQuantity){
    if (!Array.isArray(rewardItem)) {
        rewardItem = [rewardItem];
    }
    if (!Array.isArray(rewardQuantity)) {
        rewardQuantity = [rewardQuantity];
    }
    this.rewardItem = rewardItem;
    this.rewardQuantity = rewardQuantity;
};

//check to see if this card gave any rewards
PlayableCard.prototype.processRewards = function(givenRewardItem, givenRewardQuantity){
    var rewardList = '',
    rewardIndex = 0;
    numOfRewards = 0;

    if (givenRewardItem[0] > 0) {
        numOfRewards = givenRewardItem.length;
        for (rewardIndex = 0; rewardIndex < numOfRewards; rewardIndex += 1) {
            scoreData[givenRewardItem[rewardIndex]].increment(givenRewardQuantity[rewardIndex]);
            //add a comment to the story about rewards.
            if (rewardIndex === 0) {
                rewardList += `<span class=styleReward>↑You gained `;
            }
            rewardList += `${givenRewardQuantity[rewardIndex]} ${scoreData[givenRewardItem[rewardIndex]].correctName(givenRewardQuantity[rewardIndex])}`;
            if (rewardIndex < numOfRewards - 2) {
                rewardList += ', ';
            }
            if (rewardIndex === numOfRewards - 2) {
                rewardList += ', and ';
            }
            if (rewardIndex === numOfRewards - 1) {
                rewardList += '.<br></span>';
            }
        }
    }
    return rewardList;
};

//get & set a card's costs to be subtracted when clicked
PlayableCard.prototype.setCosts = function(costItem,costQuantity){
    if (!Array.isArray(costItem)) {
        costItem = [costItem];
    }
    if (!Array.isArray(costQuantity)) {
        costQuantity = [costQuantity];
    }
    this.costItem = costItem;
    this.costQuantity = costQuantity;
    //if a card has costs, then those also must be requirements too
    this.requiredItem = costItem;
    this.requiredQuantity = costQuantity;
};

//check to see if this card gave any costs
PlayableCard.prototype.processCosts = function(givenCostItem, givenCostQuantity){
    var costList = '',
    costIndex = 0,
    numOfCosts = 0;
    if (givenCostItem[0] > 0) {
        numOfCosts = givenCostItem.length;
        for (costIndex = 0; costIndex < numOfCosts; costIndex += 1) {
            scoreData[givenCostItem[costIndex]].decrement(givenCostQuantity[costIndex]);
            //add a comment to the story about costs.
            if (costIndex === 0) {
                costList += `<span class=styleCost>↓You lost `;
            }
            costList += `${givenCostQuantity[costIndex]} ${scoreData[givenCostItem[costIndex]].correctName(givenCostQuantity[costIndex])}`;
            if (costIndex < numOfCosts - 2) {
                costList += ', ';
            }
            if (costIndex === numOfCosts - 2) {
                costList += ', and ';
            }
            if (costIndex === numOfCosts - 1) {
                costList += '.<br></span>';
            }
        }
    }
    return costList;
};

//get & set a card's requirements that must be met in order for a card to be clicked on
PlayableCard.prototype.setRequirements = function(requiredItem,requiredQuantity){
    if (!Array.isArray(requiredItem)) {
        this.requiredItem = [requiredItem];
    } else {
        this.requiredItem = requiredItem;
    }
    if (!Array.isArray(requiredQuantity)) {
        this.requiredQuantity = [requiredQuantity];
    } else {
        this.requiredQuantity = requiredQuantity;
    }
};

PlayableCard.prototype.requirementSentence = function(reqCard){
    var reqList = '',
    req = 0,
    numOfReqs = 0;

    //check to see if the card has a roll challenge too
    if (deck.card[reqCard].challengeStat !== 0) {
        reqList += `<br>Challenge: roll ${deck.card[reqCard].challengeQuantity} ${scoreData[deck.card[reqCard].challengeStat].singularName}.`;
    }
    if (deck.card[reqCard].requiredItem[0] === 0) {
        reqList += ' (No reqs)';
    }
    else {
        numOfReqs = deck.card[reqCard].requiredItem.length;
        for (req = 0; req < numOfReqs; req += 1) {
            //prepare a statement about card requirements.
            //add something here to copy the entire list of reqs, remove all that are NOT HiddenProgress, and use taht list instead
            if (req === 0) {
                reqList += '(Requires ';
            }
            if (scoreData[deck.card[reqCard].requiredItem[req]] instanceof HiddenProgress) {
                reqList = ' (No reqs)';
                req = numOfReqs;
            } else {
                reqList += `${deck.card[reqCard].requiredQuantity[req]} ${scoreData[deck.card[reqCard].requiredItem[req]].correctName(deck.card[reqCard].requiredQuantity[req])}`;
            }
            if (req < numOfReqs - 2) {
                reqList += ', ';
            }
            if (req === numOfReqs - 2) {
                reqList += ', and ';
            }
            if (req === numOfReqs - 1) {
                reqList += `)`;
            }
        }

    }
    return reqList;
};

PlayableCard.prototype.checkRequirements = function(reqCard){
    var passReq = true,
    req = 0,
    numOfReqs = 0;

    if (deck.card[reqCard].challengeStat !== 0 && scoreData[deck.card[reqCard].challengeStat].diceQuantity < deck.card[reqCard].challengeQuantity/6) {
        return false;
    }
    if (deck.card[reqCard].requiredItem[0] === 0) {
        return true;
    } else {
        numOfReqs = deck.card[reqCard].requiredItem.length;
        for (req = 0; req < numOfReqs; req += 1) {
            //compare score vs card requirements.
            if (scoreData[deck.card[reqCard].requiredItem[req]].quantity < deck.card[reqCard].requiredQuantity[req])
            passReq = false;
        }
        return passReq;
    }
};

//activate the card and return text describing what happened
PlayableCard.prototype.cardText = function(){
    var returnCardText = '';
    //update locationBox
    this.updateLocation();
    if (deck.card[board.activeIndex].challengeStat !== 0) {
        returnCardText += deck.card[board.activeIndex].performChallenge();
        returnCardText += this.cardScript();
        if (this.firstTime === true) {
            returnCardText += `<span class = styleDescription>${cardDescription[board.activeIndex]}<br></span>`;
        }
    } else {
        returnCardText += this.cardScript();
        if (this.firstTime === true) {
            returnCardText += `<span class = styleDescription>${cardDescription[board.activeIndex]}<br></span>`;
        }
        returnCardText += `<em>${this.processRewards(this.rewardItem, this.rewardQuantity)}</em>`;
        returnCardText += `<em>${this.processCosts(this.costItem, this.costQuantity)}</em>`;
    }
    this.firstTime = false;
    return returnCardText;
};

PlayableCard.prototype.setChallenge = function(challengeStat, challengeQuantity, successText, successRewardItem, successRewardQuantity, successCostItem, successCostQuantity, failText, failRewardItem, failRewardQuantity, failCostItem, failCostQuantity) {
    this.challengeStat = challengeStat;
    this.challengeQuantity = challengeQuantity;
    this.successText = successText;
    if (!Array.isArray(successRewardItem)) {
        this.successRewardItem = [successRewardItem];
    } else {
        this.successRewardItem = successRewardItem;
    }
    if (!Array.isArray(successRewardQuantity)) {
        this.successRewardQuantity = [successRewardQuantity];
    } else {
        this.successRewardQuantity = successRewardQuantity;
    }
    if (!Array.isArray(successCostItem)) {
        this.successCostItem = [successCostItem];
    } else {
        this.successCostItem = successCostItem;
    }
    if (!Array.isArray(successCostQuantity)) {
        this.successCostQuantity = [successCostQuantity];
    } else {
        this.successCostQuantity = successCostQuantity;
    }
    this.failText = failText;
    if (!Array.isArray(failRewardItem)) {
        this.failRewardItem = [failRewardItem];
    } else {
        this.failRewardItem = failRewardItem;
    }
    if (!Array.isArray(failRewardQuantity)) {
        this.failRewardQuantity = [failRewardQuantity];
    } else {
        this.failRewardQuantity = failRewardQuantity;
    }
    if (!Array.isArray(failCostItem)) {
        this.failCostItem = [failCostItem];
    } else {
        this.failCostItem = failCostItem;
    }
    if (!Array.isArray(failCostQuantity)) {
        this.failCostQuantity = [failCostQuantity];
    } else {
        this.failCostQuantity = failCostQuantity;
    }
};


PlayableCard.prototype.performChallenge = function() {
    var result = scoreData[this.challengeStat].rollCompare(this.challengeQuantity),
    numOfRewards = 0,
    rewardIndex = 0,
    costIndex = 0,
    numOfCosts = 0,
    returnCardText = '',
    successExp = 0,
    failExp = 0;

    if (result[0]) {
        returnCardText = `${this.successText}<br>`;
        returnCardText += `<em>${this.processRewards(this.successRewardItem, this.successRewardQuantity)}</em>`;
        returnCardText += `<em>${this.processCosts(this.successCostItem, this.successCostQuantity)}</em>`;
        //give a little experience based on the type of challenge, equal to half of the opponent roll
        successExp = Math.floor(this.challengeQuantity / 2);
        returnCardText += `<span class = styleChallenge>You succeeded in this challenge and learned a little.  ${this.processRewards([this.challengeStat],[successExp])}</span>`;
        return returnCardText + '<br>';
    }
    else {
        returnCardText = `${this.failText}<br>`;
        returnCardText += `<em>${this.processRewards(this.failRewardItem, this.failRewardQuantity)}</em>`;
        returnCardText += `<em>${this.processCosts(this.failCostItem, this.failCostQuantity)}</em>`;
        //give more experience based on the type of challenge, equal the opponent roll
        failExp = Math.floor(this.challengeQuantity);
        returnCardText += `<span class = styleChallenge>You failed in this challenge but learned a lot.  ${this.processRewards([this.challengeStat],[failExp])}</span>`;
        return returnCardText + '<br>';
    }
};

PlayableCard.prototype.cardScript = function(){
    return '';
};

//create a card whoe primary purpose is navigation
function MoveCard(locationName, buttonInstructions, nextCards) {
    PlayableCard.call(this);
    this.locationName = locationName;
    if (Array.isArray(buttonInstructions)) {
        this.buttonInstructions = buttonInstructions;
    } else {
        this.buttonInstructions = [buttonInstructions];
    }
    if (Array.isArray(nextCards)) {
        this.nextCards = nextCards;
    } else {
        this.nextCards = [nextCards];
    }
    this.firstTime = true;
}

MoveCard.prototype = new PlayableCard();

MoveCard.prototype.updateLocation = function(){
    locationTitleBox.innerHTML = `<b>Location: ${this.locationName}</b><br>${this.locationDescription}`;
};

function StoryCard(storyName, buttonInstructions, nextCards) {
    PlayableCard.call(this);
    this.storyName = storyName;
    if (Array.isArray(buttonInstructions)) {
        this.buttonInstructions = buttonInstructions;
    } else {
        this.buttonInstructions = [buttonInstructions];
    }
    if (Array.isArray(nextCards)) {
        this.nextCards = nextCards;
    } else {
        this.nextCards = [nextCards];
    }
    this.firstTime = true;
}

StoryCard.prototype = new PlayableCard();

StoryCard.prototype.updateLocation = function(){
    //no text because a StoryCard usually shouldn't change any location information
};

var deck = {
    card: [],

    setDeck() {
    this.card[1] = new MoveCard('?', ['Wake up'], [2]);
    this.card[2] = new MoveCard('The Medusa', ['Search for the Lantern'], [3]);
    this.card[3] = new StoryCard('A choatic cabin', ['Grab your belongings', 'Hurry to the door'], [4,5]);
    this.card[3].cardScript = function(){
        scoreData[100].setQuantity(10);
        scoreData[100].updateReputation();
        return `At this rate, the Medusa isn’t going to stay afloat much longer. You give it 10 minutes tops. <br><br>`;
    };
    this.card[3].setChallenge(6, 4, 'You grope around in the darkness in the general area where you think the lantern was. The hot metal lightly singes your fingers, but your light helps another get their own lantern working too. Now you can literally shed light on what’s going on.', [227, 101], [1, 1], 1, 2, 'You grope around in the darkness in the general area where you think the lantern was, but can’t seem to find anything there. Thankfully, someone else finds their own lantern and illuminates the scene before you.', 0, 0, 0, 0);
    this.card[4] = new StoryCard('', ['Hurry to the door'], 5);
    this.card[4].setCosts(100, 1);
    this.card[4].setRewards([205,206], [1,117]);
    this.card[4].setRequirements(0, 0);
    this.card[5] = new StoryCard('', 'Climb over the bunks', 6);
    this.card[5].setCosts(100, 1);
    this.card[5].setRequirements(0, 0);
    this.card[6] = new StoryCard('', 'Force the door open', 7);
    this.card[6].setChallenge(4, 4, 'You find a path over some toppled wardrobes that brings you directly to the door. Several others follow your route over the debris.',101, 1, 100, 1, 'You have trouble finding your way through the toppled furniture, cursing when the jagged edge of a broken bedpost scrapes you along the thigh.', 0, 0, [1, 100], [5, 1]);
    this.card[7] = new StoryCard('', 'Convince the man to leave', 8);
    this.card[7].setChallenge(3, 4, 'With a squeal of wood on wood, the door flies open under the force of your shoulder. The dark cabin is immediately invaded by the blaze of a lightning strike, as well as a large panicking man in a green nightgown.',[101, 1], [1, 2], 100, 1, 'Your shoulder is displaced more easily than the door. You step back to take another run at it, when the door bursts open inward, propelled by a large man in a green nightgown.', 0, 0, [100, 1], [1, 10]);
    this.card[8] = new StoryCard('', 'Get the children out first', 9);
    this.card[8].setChallenge(7, 4, 'You tell the man that he’s as good as dead if he goes in to look for his paintings. Seeing the water filling the room, he realizes that you’re right.', 101, 1, 100, 1, 'You tell the man that he’s as good as dead if he goes in to look for his paintings. Your words have no effect, as he shoves you violently out of his way and runs to the back of the cabin, searching for his missing goods.', 0, 0, [100, 1], [1, 5]);
    this.card[9] = new StoryCard('', ['Hurry to the nearest lifeboat', 'Do a quick search for abandoned valuables'], [11, 10]);
    this.card[9].setChallenge(5, 4, 'Using your words as much your own body, you manage to hold back several men and women, insisting that the children leave before anyone else.', 101, 1, 100, 1, 'Using your words as much your own body, you try to hold back the crowd so that the children can leave. But several men and women barge through, shoving you to the floor and pushing their way out first.', 0, 0, [100, 1], [1, 5]);
    this.card[10] = new StoryCard('', 'Hurry to the nearest lifeboat', 11);
    this.card[10].setCosts(100, 1);
    this.card[10].setRequirements(0, 0);
    this.card[11] = new StoryCard('', ['Wait for them to let you on', 'Force your way onto the lifeboat', 'Leap from the rigging onto the lifeboat', 'Plead with the sailor emotionally', 'Look for another way onto the lifeboat', 'Lie to the sailor that you are royalty', 'Bribe the sailor'], [12, 13, 14, 15, 16, 17, 18]);
    this.card[12] = new StoryCard('', 'Re-evaluate your opitons', 11);
    this.card[12].setCosts(100, 1);
    this.card[13] = new StoryCard('', 'continue', 19);
    this.card[13].setChallenge(3, 4, 'With the help of a knee to a chest, you shove your way past the first crewmember, and get on the lifeboat over any objections.', 1000, 1, 100, 1, 'You take a swing at the first crewmember. He dodges, grabs your arm and pins you against the bulwark.<br><br>“You wanna get past me? Fine. Go right ahead!” he says as and another crewmember grabs your other arm and they throw you over the edge of the ship. You go tumbling through the air and land with a crash into the roiling, icy ocean.', 1001, 1, [100, 1], [1, 20]);
    this.card[14] = new StoryCard('', 'continue', 19);
    this.card[14].setChallenge(4, 1, 'You leap onto a cabin roof, made easier by the fact that the walls are no longer quite vertical. You shimmy up a pole, where you cross over to a rope that passes over the heads of the crewmembers, allowing you to drop down into the lifeboat. They are too busy yelling at others to stay back to notice you.', 1000, 1, 100, 1, 'You leap onto a cabin roof, made easier by the fact that the walls are no longer quite vertical. You shimmy up a pole, where you cross over to a rope that passes over the heads of the crewmembers, you attempt to slide along the rope, but it is slick with rain, and you slip off. Your left leg smashes into the bulwark as you fall overboard, landing with a crash into the roiling, icy ocean.', 1001, 1, [100, 1], [1, 20]);
    this.card[15] = new StoryCard('', 'continue', 19);
    this.card[15].setChallenge(5, 4, '“Please, you have to let me on the lifeboat! I’m the sole breadwinner for my family,” you lie. ”There are seven kids. And my mother - she is sick and needs me to pay for her medication! If you let me die here, you’ll be sentencing them all to death!”<br><br>You must be a good actor - or just lucky. The alpha of the three sailors says a few expletives and shoves you onto the lifeboat.', 1000, 1, 100, 1, '“Please, you have to let me on the lifeboat! I’m the sole breadwinner for my family,” you lie. ”There are seven kids. And my mother - she is sick and needs me to pay for her medication! If you let me die here, you’ll be sentencing them all to death!”<br><br>You can tell your acting isn’t convincing anyone.<br><br>“We’re all in the same boat here, pal. You wanna get back to them so bad? Swim home!”<br><br>The three sailors decide to make an example of you to the crowd and grab your limbs and throw you over the edge of the ship. You go tumbling through the air and land with a crash into the roiling, icy ocean.', 1001, 1, [100, 1], [1, 20]);
    this.card[16] = new StoryCard('', 'continue', 19);
    this.card[16].setChallenge(6, 4, 'You realize that since there is a ladder on this side of the lifeboat, and it appears to be symmetrical, there is probably one on the other side too, facing the ocean. You step back from the crowd and step around to the stern of the lifeboat. Gingerly, you leap over the edge of the ship, carefully still holding on. You cross hand over hand, holding onto the railing, making your way to the lifeboat’s other ladder. Shortly, your hands are chilled to the bone, but you climb the ladder and enter the back of the lifeboat.', 1000, 1, 100, 1, 'You realize that since there is a ladder on this side of the lifeboat, and it appears to be symmetrical, there is probably one on the other side too, facing the ocean. You step back from the crowd and step around to the stern of the lifeboat. Gingerly, you leap over the edge of the ship, carefully still holding on. You cross hand over hand, holding onto the railing, making your way to the lifeboat’s other ladder.<br><br>“Oh, no you don’t” says one of the sailors as he realizes what you are doing. Exposed as you are, you can do nothing to defend yourself. He runs over to you and bashes the butt of his sabre into your knuckles, causing you to let go and plummet overboard, landing with a crash into the roiling, icy ocean.', 1001, 1, [100, 1], [1, 20]);
    this.card[17] = new StoryCard('', 'continue', 19);
    this.card[17].setChallenge(7, 4, '“My good sir, I will have you know that I am the cousin of the Crown Prince,” you lie, “eighth in line to the throne of the Royal Empire, and I am on a secret mission of utmost importance to the colonies. I implore you to let me on board that lifeboat. My family shall owe you a great debt.”<br><br>The sailor looks at you, eyes narrowed. For a moment you wonder if you should have made up a higher station. Eighth? Maybe fourth would place your life at a higher value. Maybe twelfth would have sounded more plausible.<br><br>“Cousin to the Crown Prince, you say?” He looks at you skeptically.<br><br>“Me name’s Helmsman Asa from Eelingborough. You make sure you take care of me wife if I don’t make it through this,” he says as he hurries you up the ladder onto the lifeboat.', 1000, 1, 100, 1, '“My good sir, I will have you know that I am the cousin of the Crown Prince,” you lie, “eighth in line to the throne of the Royal Empire, and I am on a secret mission of utmost importance to the colonies. I implore you to let me on board that lifeboat. My family shall owe you a great debt.”<br><br>The sailor looks at you, eyes narrowed. For a moment you wonder if you should have made up a higher station. Eighth? Maybe fourth would place your life at a higher value. Maybe twelfth would have sounded more plausible.<br><br>“Cousin to the Crown Prince, you say?”He looks at you skeptically.<br><br>“Well, here I outrank you. I’m the bloody Queen,” he says as his buddies grab your arms from behind and throw you over the edge of the ship. You go tumbling through the air and land with a crash into the roiling, icy ocean.', 1001, 1, [100, 1], [1, 20]);
    this.card[18] = new StoryCard('', 'continue', 19);
    this.card[18].setChallenge(7, 4, 'Using your words as much your own body, you manage to hold back several men and women, insisting that the children leave before anyone else.', 1000, 1, 100, 1, 'Using your words as much your own body, you try to hold back the crowd so that the children can leave. But several men and women barge through, shoving you to the floor and pushing their way out first.', 1001, 1, [100, 1], [1, 5]);
    this.card[19] = new StoryCard('', ['Uh oh', 'uh oh'], [20, 21]);
    this.card[19].cardScript = function() {
        if (scoreData[1000].quantity === 1) {
            return 'One of the others yells “Andie! Let’s go!” A sailor (Andie perhaps?) leaps into the lifeboat beside you, and her crewmates start to untie the knots to release the lifeboat into the heaving ocean waves. The knots are wet from the storm, and one of the crewmembers begins to hack at the ropes with his sabre.<BR><BR>“No!” One of his buddies yells, but it is too late. The blade cuts through the rope, releasing only the front of the lifeboat, pitching you and all the other lifeboat passengers head over heels into the ocean.';
        }
        else {
            return 'You flounder, barely managing to get your head above water to take a gasp of air.';
        }
    };

    this.card[19].setCosts(100, 1);
    this.card[19].setRequirements(0, 0);
    this.card[20] = new MoveCard('In the ocean', 'Flounder!', 22);
    this.card[20].cardScript = function() {
        this.setCosts(100, scoreData[100].quantity);
        return '';
    };
    this.card[20].setRequirements(1000, 1);
    this.card[21] = new MoveCard('In the ocean', 'Flounder!2', 22);
    this.card[21].cardScript = function() {
        this.setCosts(100, scoreData[100].quantity);
        return '';
    };
    this.card[21].setRequirements(1001, 1);
    this.card[22] = new StoryCard('', 'don’t drown', 23);
    this.card[23] = new StoryCard('', 'continue', 24);
    this.card[24] = new StoryCard('', 'continue', 25);








    this.card[200] = new MoveCard('Neutral', ['Go to the rec yard'], [201]);
    this.card[200].setCosts(1000,1);
    this.card[201] = new MoveCard('Central Recreation Yard', ['Go to the docks','Go to the barracks', 'Go to the camp office', 'Go to the burn hill', 'Pug challenge', 'Pokemon Challenge', 'Neutral'], [202,203,204,205,210,211,200]);
    this.card[202] = new MoveCard('Docks', ['Go back to the rec yard'], [201]);
    this.card[202].setCosts(204,5);
    this.card[202].setRewards([203,205,201,202],[1,1,10,20]);
    this.card[203] = new MoveCard('Barracks', ['Go back to the rec yard','Check out the shiny object in the grass'], [201,209]);

    this.card[204] = new MoveCard('Office Building', ['Go back to the rec yard','Enter Warder Quo\'s office'], [201,208]);
    this.card[205] = new MoveCard('Burn Hill', ['Go back to the rec yard','Follow the path to the creches'], [201,206]);
    this.card[205].setCosts(4,10);
    this.card[205].setRewards(3,10);
    this.card[206] = new MoveCard('Nesting Creches', ['Go back to the burn hill','Go into the jungle'], [205,207]);
    this.card[206].setCosts([201,203,205], [3,2,1]);
    this.card[207] = new MoveCard('Jungle', ['Go back to the creches'], [206]);
    this.card[208] = new MoveCard('Warder Quo\'s Office', ['Leave Quo\'s office'], [204]);
    this.card[208].setRequirements([3,202],[20,1]);
    this.card[208].cardScript = function(){
        scoreData[5].increment(100);
        return `Holey moley! You made it into the office! You gained 100 points of ${scoreData[5].correctName(100)}<br>`;
    };
    this.card[209] = new StoryCard('Investigate the shiny object in the grass.',['Return to the rec yard'], [201]);
    this.card[209].setRewards(202,1);
    this.card[210] = new StoryCard('Try to take a pug\s treats.', ['RETURN to the rec yard'], [201]);
    this.card[210].setCosts(205,1);
    this.card[210].setChallenge(3,9,'You successfully stole the treats from the pug without getting injured!',[201], [1], [205], [1], 'Those pugs aren\'t all bark. You now have the injuries to prove it.', [0], [0], [205,1],[1,10]);
    this.card[211] = new StoryCard('Try to capture a pokémon','OK', [201]);
    this.card[211].setChallenge(4,2,'You capture a Pikachu!', [206,201], [1,1], [0],[0],'A Pikachu slipped away from you, and took another pokémon with him!', [0], [0], [206],[1]);

    this.card[99] = new MoveCard('Death.', ['Return to the living.'], [201]);
    this.card[95] = new MoveCard('Insanity.', ['Return to sanity.'], [201]);
    }
};

//var deck = require('./cards.js');
var cardDescription = require('./cards.js');
//var playerStatText = require('./scoreData.js');
//var successCards = require('./cards.js');
//var failCards = require('./cards.js');

//var PlayableCard = require('./cards.js');

//Initialize the board & set listeners for button pushes.
deck.setDeck();
board.setBoard();

//start the Medusa storyline
//split up stuff into different js modules
//
