/*jshint browser: true, esversion: 6, devel: true */
/*var Card = require('./card.js');
var c = new Card('Hello Mark!');
c.print();*/

var locationTitleBox = document.getElementById('location');
var button1 = document.getElementById('button1');
var button2 = document.getElementById('button2');
var button3 = document.getElementById('button3');
var button4 = document.getElementById('button4');
var html = document.querySelector('html');

var activeIndex = 201;
var activeCardsUp = 0;
var displayText = '';
var initialization = true;
var shownDice = 0;

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
for (i=0; i<maxdice; i++) {
    dice[i] = document.createElement('div');
    dice[i].setAttribute('class', 'diceType diceFace1');
}



var cardField = document.getElementById('cardField');

//create 20 displayable cards
var display = [];
var maxcards = 20;
var i = 0;
for (i=0; i<maxcards; i++) {
    display[i] = document.createElement('div');
    display[i].setAttribute('class', 'displayCard enabledCard');
}



//set up event listeners for up to 20 displayable cards
for (i=0; i<maxcards; i++) {
    display[i].displayIndex = i;
    display[i].addEventListener('click', function (event) {
        if (display[this.displayIndex].className === 'displayCard enabledCard'){
                displayText += `<span class=styleCard>* ${deck[activeIndex].buttonInstructions[this.displayIndex]}<br></span>`;
            activeIndex = activeCardsUp[this.displayIndex];
            Board.setBoard();
        }
    });
}



//board object
var Board = {
    setBoard() {
        var oldNumOfCards = activeCardsUp.length;
        //remove old cards.
        for (i=0; i<oldNumOfCards; i++) {
            cardField.removeChild(display[i]);
        }


        //Create Stats and Inventory & put the text in the story
        score[0].updateInventory();
        score[1].updateStats();
        score[50].updateReputation();
        displayText += deck[activeIndex].cardText();
        if (playerInfo.justDied) {
            playerInfo.justDied=false;
            displayText+=`<span class=styleAlert>${cardDescription[99]}<br></span>`;
        }
        if (playerInfo.justWentInsane) {
            playerInfo.justWentInsane=false;
            displayText+=`<span class=styleAlert>${cardDescription[95]}<br></span>`;
            }
        storyDisplay.innerHTML = displayText;


        //append the appropriate number of cards to choose from
        button1.innerHTML = activeIndex;
        button2.innerHTML = deck[activeIndex].nextCards;
        button3.innerHTML = activeCardsUp;
        activeCardsUp = deck[activeIndex].nextCards;
        var numOfCards = activeCardsUp.length;
        for (i=0; i<numOfCards; i++) {
            cardField.appendChild(display[i]);
            display[i].innerHTML= `${deck[activeIndex].buttonInstructions[i]}<br>${deck[activeIndex].requirementSentence(activeCardsUp[i])}`;
            //disable cards if requirments are not met
            if (!deck[activeIndex].checkRequirements(activeCardsUp[i]))
                display[i].setAttribute('class', 'displayCard disabledCard');
            else
                display[i].setAttribute('class', 'displayCard enabledCard');
        }
    }
};


/*var playerInfo = new Object();
playerInfo.alive = true;
playerInfo.sane = true;
playerInfo.justDied = false;
playerInfo.justWentInsane = false;
playerInfo.gender = 0;
playerInfo.name = 'Cecil Palmer';

playerInfo.getGender = function(inputGender){
    this.gender = inputGender;
    switch (this.gender) {
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
};*/

var playerInfo = {
    alive: true,
    sane: true,
    justDied: false,
    justWentInsane: false,
    gender: 0,
    name: 'Cecil Palmer',

    getGender : function(inputGender){
        this.gender = inputGender;
        switch (this.gender) {
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
    if (amount === 1)
        {return this.singularName;}
    else {return this.pluralName;}
};

//assign the quantity of a collectible
Score.prototype.setQuantity = function(amount) {
    this.quantity = amount;
};

function Collectible(inputName, quantity, icon){
    Score.call(this);
    if (Array.isArray(inputName)){
        this.singularName = inputName[0];
        if (inputName.length===1)
            this.pluralName = inputName[0]+'s';
        else
            this.pluralName = inputName[1];
    }
    else{
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
        if (inputName.length===1)
            this.pluralName = inputName[0];
        else
            this.pluralName = inputName[1];
    }
    else{
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
        if (inputName.length===1)
            this.pluralName = inputName[0]+'s';
        else
            this.pluralName = inputName[1];
    }
    else{
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
    if (item.quantity>0 && item instanceof Collectible)
        inventoryList += `• ${item.quantity} ${item.correctName(item.quantity)}<br>`;
    });
    inventoryDisplay.innerHTML = inventoryList;
};

//list the progress
Reputation.prototype.updateReputation = function() {
    var reputationList = '<b><u>Progress</u></b><br>';
    score.forEach(function (item) {
    if (item.quantity>0 && (item instanceof Progress || item instanceof Reputation))
        reputationList += `• ${item.quantity} ${item.correctName(item.quantity)}<br>`;
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
    if (this.quantity<0) this.quantity=0;
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
    var statList = '<b><u>Health</u></b><br>';
    statList += `•  ${score[1].singularName}: ${score[1].quantity}<br>`;
    statList += `•  ${score[2].singularName}: ${score[2].quantity}<br><br>`;
    statList += '<b><u>Stats</u></b><br>';
    score.forEach(function (item) {
    if (item.singularName!=="Body" && item.singularName!=="Mind" && item.quantity>0 && item instanceof PlayerStat) {
        var levelArray = item.getLevel();
        statList += `•  ${item.singularName}: Level:${levelArray[0]}, Points:${item.quantity}, Exp:${levelArray[1]}, Next:${levelArray[2]}<br>`;
        }
    });
    playerStatsDisplay.innerHTML = statList;
};

PlayerStat.prototype.getLevel = function(){
    var points = this.quantity;
    var exp = this.quantity;
    var level = 1;
    for (level===1;level<=exp;level++)
        exp -= level;
    return [level-1,exp,level-exp];
};

PlayerStat.prototype.increment = function(amount) {
    this.quantity += amount;
    this.updateStats();
};

//decrement the quantity of a stat
PlayerStat.prototype.decrement = function(amount) {
    this.quantity -= amount;
    if (this.quantity<0) this.quantity=0;
    this.updateStats();
};

PlayerStat.prototype.roll = function() {
    var diceIndex = 0;
    var diceResults = [];
    for (diceIndex=0;diceIndex<this.diceQuantity;diceIndex++) {
        diceResults[diceIndex] = Math.floor(Math.random()*6)+1;
    }
    return diceResults;
};

PlayerStat.prototype.addDice = function(diceInput) {
    var diceResults = diceInput;
    var diceTotal = 0;
    var numOfDice = diceResults.length;
    var diceIndex = 0;
    for (diceIndex=0;diceIndex<numOfDice;diceIndex++){
        diceTotal += diceResults[diceIndex];
    }
    return diceTotal;
};

PlayerStat.prototype.drawDice = function(diceInput){
    //clear the dice
    var i = 0;
    for (i=0; i<shownDice; i++) {
        diceField.removeChild(dice[i]);
    }

    //draw new dice
    var diceResults = diceInput;
    shownDice = diceResults.length;
    var diceIndex = 0;
    for (diceIndex=0;diceIndex<shownDice;diceIndex++){
        switch (diceResults[diceIndex]) {
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
            case 7:
                dice[diceIndex].setAttribute('class', 'diceType diceFace7');
                diceField.appendChild(dice[diceIndex]);
                break;
        }
    }
};

PlayerStat.prototype.rollCompare = function(opponent) {
    var opponentRoll = opponent;
    var diceResults = this.roll();
    this.drawDice(diceResults);
    var diceTotal = this.addDice(diceResults);
    if (diceTotal>=opponentRoll)
        return [true,`${this.singularName} roll succeded!`];
    else
        return [false,`${this.singularName} roll failed!`];
};




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

score[1] = new PlayerStat(['Body', 'Health points'],100);
score[2] = new PlayerStat(['Mind', 'Mind points'],75);
score[3] = new PlayerStat(['Brawn', 'Brawn points'],0);
score[4] = new PlayerStat(['Hand', 'Hand points'],20);
score[5] = new PlayerStat(['Heart', 'Heart points'],30);
score[6] = new PlayerStat(['Eye', 'Eye points'],40);
score[7] = new PlayerStat(['Voice', 'Voice points'],50);

score[50] = new Reputation(['Privateer'],5);
score[100] = new Progress('Medusa',10);

//for testing. remove later
score[4].diceQuantity = 1;

//decrementing happens differnetly if death or insantiy occurs. This needs to be fixed.
score[1].decrement = function(amount) {
    this.quantity -= amount;
    if (this.quantity<=0){
        this.quantity=0;
        activeIndex = 99;
        deck[activeIndex].updateLocation();
        playerInfo.alive = false;
        playerInfo.justDied = true;
    }
    this.updateStats();
};

score[2].decrement = function(amount) {
    this.quantity -= amount;
    if (this.quantity<=0){
        this.quantity=0;
        activeIndex = 95;
        deck[activeIndex].updateLocation();
        playerInfo.sane = false;
        playerInfo.justWentInsane = true;
    }
    this.updateStats();
};

//create the prototype card object
function Card(){
    this.cardProperty ='';
    this.rewardItem = [0];
    this.rewardQuantity = [0];
    this.costItem = [0];
    this.costQuantity = [0];
    this.requiredItem = [0];
    this.requiredQuantity = [0];
    this.nextCards = [1];
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
}

//get & set a card's rewards to be given out when clicked
Card.prototype.setRewards = function(rewardItem,rewardQuantity){
    if (!Array.isArray(rewardItem)) rewardItem=[rewardItem];
    if (!Array.isArray(rewardQuantity)) rewardQuantity=[rewardQuantity];
    this.rewardItem = rewardItem;
    this.rewardQuantity = rewardQuantity;
};

//check to see if this card gave any rewards
Card.prototype.processRewards = function(givenRewardItem, givenRewardQuantity){
    var rewardList = '';

    if (givenRewardItem[0]>0) {
        var rewardIndex = 0;
        var numOfRewards = givenRewardItem.length;
        for (rewardIndex=0;rewardIndex<numOfRewards;rewardIndex++) {
            score[givenRewardItem[rewardIndex]].increment(givenRewardQuantity[rewardIndex]);
            //add a comment to the story about rewards.
            if (rewardIndex===0)
                rewardList += `<span class=styleReward>↑You gained `;
            rewardList += `${givenRewardQuantity[rewardIndex]} ${score[givenRewardItem[rewardIndex]].correctName(givenRewardQuantity[rewardIndex])}`;
            if (rewardIndex<numOfRewards-2) rewardList += ', ';
            if (rewardIndex===numOfRewards-2) rewardList += ', and ';
            if (rewardIndex===numOfRewards-1) rewardList += '.<br></span>';
        }
    }
    return rewardList;
};

//get & set a card's costs to be subtracted when clicked
Card.prototype.setCosts = function(costItem,costQuantity){
    if (!Array.isArray(costItem)) costItem=[costItem];
    if (!Array.isArray(costQuantity)) costQuantity=[costQuantity];
    this.costItem = costItem;
    this.costQuantity = costQuantity;
    //if a card has costs, then those also must be requirements too
    this.requiredItem = costItem;
    this.requiredQuantity = costQuantity;
};

//check to see if this card gave any costs
Card.prototype.processCosts = function(givenCostItem, givenCostQuantity){
    var costList = '';
    if (givenCostItem[0]>0) {
        var costIndex = 0;
        var numOfCosts = givenCostItem.length;
        for (costIndex=0;costIndex<numOfCosts;costIndex++) {
            score[givenCostItem[costIndex]].decrement(givenCostQuantity[costIndex]);
            //add a comment to the story about costs.
            if (costIndex===0)
                costList += `<span class=styleCost>↓You lost `;
            costList += `${givenCostQuantity[costIndex]} ${score[givenCostItem[costIndex]].correctName(givenCostQuantity[costIndex])}`;
            if (costIndex<numOfCosts-2) costList += ', ';
            if (costIndex===numOfCosts-2) costList += ', and ';
            if (costIndex===numOfCosts-1) costList += '.<br></span>';
        }
    }
    return costList;
};

//get & set a card's requirements that must be met in order for a card to be clicked on
Card.prototype.setRequirements = function(requiredItem,requiredQuantity){
    if (!Array.isArray(requiredItem)) this.requiredItem=[requiredItem];
    else this.requiredItem = requiredItem;
    if (!Array.isArray(requiredQuantity)) this.requiredQuantity=[requiredQuantity];
    else this.requiredQuantity = requiredQuantity;
};

Card.prototype.requirementSentence = function(reqCard){
    var reqList = '';

    //check to see if the card has a roll challenge too
    if (deck[reqCard].challengeStat!==0)
    reqList += `<br>Challenge: roll ${deck[reqCard].challengeQuantity} ${score[deck[reqCard].challengeStat].singularName}.`;

    if (deck[reqCard].requiredItem[0]===0)
        reqList += ' (No reqs)';
    else {
    var req = 0;
    var numOfReqs = deck[reqCard].requiredItem.length;
    for (req=0;req<numOfReqs;req++) {
        //prepare a statement about card requirements.
        if (req===0)
            reqList += '(Requires ';
        reqList += `${deck[reqCard].requiredQuantity[req]} ${score[deck[reqCard].requiredItem[req]].correctName(deck[reqCard].requiredQuantity[req])}`;
        if (req<numOfReqs-2)
            reqList += ', ';
        if (req===numOfReqs-2)
            reqList += ', and ';
        if (req===numOfReqs-1)
            reqList += `)`;
        }

    }


    return reqList;
};

Card.prototype.checkRequirements = function(reqCard){
    var passReq = true;
    if (deck[reqCard].challengeStat!==0 && score[deck[reqCard].challengeStat].diceQuantity<deck[reqCard].challengeQuantity/6)
        return false;
    if (deck[reqCard].requiredItem[0]===0)
        return true;
    else {
    var req = 0;
        for (req=0;req<deck[reqCard].requiredItem.length;req++) {
            //compare score vs card requirements.
            if (score[deck[reqCard].requiredItem[req]].quantity < deck[reqCard].requiredQuantity[req])
            passReq = false;
         }
        return passReq;
    }
};

//activate the card and return text describing what happened
Card.prototype.cardText = function(){
    var returnCardText = '';
    if (this.firstTime===true)
        returnCardText += `<span class = styleDescription>${cardDescription[activeIndex]}<br></span>`;
    //update locationBox
    this.updateLocation();
    returnCardText += this.cardScript();
    if (deck[activeIndex].challengeStat!==0) {
        returnCardText += deck[activeIndex].performChallenge();
    }
    else {
        returnCardText += `<em>${this.processRewards(this.rewardItem, this.rewardQuantity)}</em>`;
        returnCardText += `<em>${this.processCosts(this.costItem, this.costQuantity)}</em>`;
    }
    this.firstTime = false;
    return returnCardText;
};

Card.prototype.setChallenge = function(challengeStat, challengeQuantity, successText, successRewardItem, successRewardQuantity, successCostItem, successCostQuantity, failText, failRewardItem, failRewardQuantity, failCostItem, failCostQuantity) {
    this.challengeStat = challengeStat;
    this.challengeQuantity = challengeQuantity;
    this.successText = successText;
    if (!Array.isArray(successRewardItem)) this.successRewardItem=[successRewardItem];
    else this.successRewardItem = successRewardItem;
    if (!Array.isArray(successRewardQuantity)) this.successRewardQuantity=[successRewardQuantity];
    else this.successRewardQuantity = successRewardQuantity;
    if (!Array.isArray(successCostItem)) this.successCostItem=[successCostItem];
    else this.successCostItem = successCostItem;
    if (!Array.isArray(successCostQuantity)) this.successCostQuantity=[successCostQuantity];
    else this.successCostQuantity = successCostQuantity;

    this.failText = failText;
    if (!Array.isArray(failRewardItem)) this.failRewardItem=[failRewardItem];
    else this.failRewardItem = failRewardItem;
    if (!Array.isArray(failRewardQuantity)) this.failRewardQuantity=[failRewardQuantity];
    else this.failRewardQuantity = failRewardQuantity;
    if (!Array.isArray(failCostItem)) this.failCostItem=[failCostItem];
    else this.failCostItem = failCostItem;
    if (!Array.isArray(failCostQuantity)) this.failCostQuantity=[failCostQuantity];
    else this.failCostQuantity = failCostQuantity;
};


Card.prototype.performChallenge = function() {
    var result = score[this.challengeStat].rollCompare(this.challengeQuantity);
    var numOfRewards = 0;
    var rewardIndex = 0;
    var costIndex = 0;
    var numOfCosts = 0;
    var returnCardText = '';

    if (result[0]) {
        numOfRewards = this.successRewardItem.length;
        for (rewardIndex = 0;rewardIndex<numOfRewards;rewardIndex++) {
        }
        numOfCosts = this.successCostItem.length;
         for (costIndex = 0;costIndex<numOfCosts;costIndex++) {
        }
        returnCardText = `${this.successText}<br>`;
        returnCardText += `<em>${this.processRewards(this.successRewardItem, this.successRewardQuantity)}</em>`;
        returnCardText += `<em>${this.processCosts(this.successCostItem, this.successCostQuantity)}</em>`;
        //give a little experience based on the type of challenge, equal to half of the opponent roll
        var successExp = Math.floor(this.challengeQuantity/2);
        returnCardText += `You succeeded in this challenge and learned a little.  ${this.processRewards([this.challengeStat],[successExp])}`;
        return returnCardText;
    }
    else {
        numOfRewards = this.failRewardItem.length;
        for (rewardIndex = 0;rewardIndex<numOfRewards;rewardIndex++) {
        }
        numOfCosts = this.failCostItem.length;
         for (costIndex = 0;costIndex<numOfCosts;costIndex++) {
        }
        returnCardText = `${this.failText}<br>`;
        returnCardText += `<em>${this.processRewards(this.failRewardItem, this.failRewardQuantity)}</em>`;
        returnCardText += `<em>${this.processCosts(this.failCostItem, this.failCostQuantity)}</em>`;
        //give a more experience based on the type of challenge, equal the opponent roll
        var failExp = Math.floor(this.challengeQuantity);
        returnCardText += `You failed in this challenge but learned a lot.  ${this.processRewards([this.challengeStat],[failExp])}`;
        return returnCardText;
    }
};


Card.prototype.cardScript = function(){
    return '';
};

//create a card whoe primary purpose is navigation
function MoveCard(locationName, buttonInstructions, nextCards) {
    Card.call(this);
    this.locationName = locationName;
    if (Array.isArray(buttonInstructions))
        this.buttonInstructions = buttonInstructions;
    else
        this.buttonInstructions = [buttonInstructions];
    this.nextCards = nextCards;
    this.firstTime = true;
}

MoveCard.prototype = new Card();

MoveCard.prototype.updateLocation = function(){
    locationTitleBox.innerHTML = `<b>Location: ${this.locationName}</b><br>${cardDescription[activeIndex]}`;
};

function StoryCard(storyName, buttonInstructions, nextCards) {
    Card.call(this);
    this.storyName = storyName;
    if (Array.isArray(buttonInstructions)) this.buttonInstructions = buttonInstructions;
    else this.buttonInstructions = [buttonInstructions];
    if (Array.isArray(nextCards)) this.nextCards = nextCards;
    else this.nextCards = [nextCards];
    this.firstTime = true;
}

StoryCard.prototype = new Card();

StoryCard.prototype.updateLocation = function(){
    //don't change any location information
};

StoryCard.prototype.returnCardName = function(){
    return '';
};

//data for story text - move this to another file?
var cardDescription = [];
cardDescription[200] = 'N/A';
cardDescription[201] = 'The centre of the Windpepper Island prison camp is dominated by a moderately sized recreational yard.';
cardDescription[202] = 'Today the sea gently laps up to the lone pier that serves as the only entrance or exit to Windpepper Island. Like most days, there are no boats here. You find a stray pug here who begins following you around.';
cardDescription[203] = 'The long rows of bararcks each house four inmates, but since you are just visiting, you get one all to yourself.';
cardDescription[204] = 'You enter the small office building beside the central rec yard. There is a locked door leading to Warder Quo\'s personal office.';
cardDescription[205] = 'The burn hill features a smouldering pile of white ashes and glowing embers remaining from last night’s trashfire. There is a well-worn path back to the camp\'s rec yard, and another path off into the jungle labeled as ‘creches’.';
cardDescription[206] = 'Interspersed among the trees, you finally see the wealth of Windpepper Island - the reason why the Royal Empire built this prison work camp here: flamingos. You can hear them through the trees before you can see them: rows and rows of aviaries. Some are home to juvenile birds, while others house dozens of eggs.';
cardDescription[207] = 'The jungle becomes dense quickly, but a small clearing has been made just a short distance from the creches.';
cardDescription[208] = 'Quo\'s office consists of years of well-organized records covered in a veneer of chaos.';
cardDescription[209] = 'There appears to be a key lying on the ground outside of the door of one of the barracks. The key has three letters stamped into the side of it: QUO.';
cardDescription[210] = 'Just try to take treats from a pug.';
cardDescription[211] = 'You see a Pokémon sitting nearby so you throw a pokéball at it.';
cardDescription[1000] = 'Nowhere';
cardDescription[99] = 'Oops! You seem to have died somehow. Sucks to be you!';
cardDescription[95] = 'Life\'s trials and tribulations have driven you COMPLETELY MAD!!!';

//data describing the cards for the deck. - move this to another file?
var deck = [];
deck[200] = new MoveCard('Neutral', ['Go to the rec yard'], [201]);
deck[200].setCosts(1000,1);
deck[201] = new MoveCard('Central Recreation Yard', ['Go to the docks','Go to the barracks', 'Go to the camp office', 'Go to the burn hill', 'go to jungle', 'Pug challenge', 'Pokemon Challenge', 'Neutral'], [202,203,204,205,207,210,211,200]);
deck[202] = new MoveCard('Docks', ['Go back to the rec yard'], [201]);
deck[202].setCosts(204,5);
deck[202].setRewards([203,205,201,202],[1,1,10,20]);
deck[203] = new MoveCard('Barracks', ['Go back to the rec yard','Check out the shiny object in the grass'], [201,209]);
deck[203].cardScript = function(){
    if (score[202].quantity === 0) {
        this.nextCards = [201,209];
        return ['<b>You notice a shiny object in the grass.</b><br>'];
    }
    else {
        this.nextCards = [201];
        return '';
    }
};
deck[204] = new MoveCard('Office Building', ['Go back to the rec yard','Enter Warder Quo\'s office'], [201,208]);
deck[205] = new MoveCard('Burn Hill', ['Go back to the rec yard','Follow the path to the creches'], [201,206]);
deck[205].setCosts(4,10);
deck[205].setRewards(3,10);
deck[206] = new MoveCard('Nesting Creches', ['Go back to the burn hill','Go into the jungle'], [205,207]);
deck[206].setCosts([201,203,205], [3,2,1]);
deck[207] = new MoveCard('Jungle', ['Go back to the creches'], [206]);
deck[208] = new MoveCard('Warder Quo\'s Office', ['Leave Quo\'s office'], [204]);
deck[208].setRequirements([3,202],[20,1]);
deck[208].cardScript = function(){
    score[5].increment(100);
    return `Holey moley! You made it into the office! You gained 100 points of ${score[5].correctName(100)}<br>`;
};
deck[209] = new StoryCard('Investigate the shiny object in the grass.',['Return to the rec yard'], [201]);
deck[209].setRewards(202,1);
deck[210] = new StoryCard('Try to take a pug\s treats.', ['RETURN to the rec yard'], [201]);
deck[210].setCosts(205,1);
deck[210].setChallenge(3,7,'You successfully stole the treats from the pug without getting injured!',[201], [1], [205], [1], 'Those pugs aren\'t all bark. You now have the injuries to prove it.', [0], [0], [205,1],[1,10]);
deck[211] = new StoryCard('Try to capture a pokémon','OK', [201]);
deck[211].setChallenge(4,2,'You capture a Pikachu!', [206,201], [1,1], [0],[0],'A Pikachu slipped away from you, and took another pokémon with him!', [0], [0], [206],[1]);

deck[99] = new MoveCard('Death.', ['Return to the living.'], [201]);
deck[95] = new MoveCard('Insanity.', ['Return to sanity.'], [201]);

//Initialize the board & set listeners for button pushes.
Board.setBoard();

//start the Medusa storyline
//split up stuff into different js files
//
