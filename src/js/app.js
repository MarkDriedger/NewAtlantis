/*jshint browser: true, esversion: 6, devel: true */
//107
//var locationTitleBox = document.getElementById('location');



var button1 = document.getElementById('button1');
var button2 = document.getElementById('button2');
var button3 = document.getElementById('button3');
var button4 = document.getElementById('button4');
var html = document.querySelector('html');

//set up the stats field at the top that shows player stats & inventory items
var statsField = document.getElementById('statsField');

var locationDisplay = document.getElementById('location');
statsField.appendChild(locationDisplay);

var diceField = document.getElementById('diceField');
statsField.appendChild(diceField);

var storyDisplay = document.querySelector('.output');
statsField.appendChild(storyDisplay);

var playerStatsDisplay = document.createElement('p');
playerStatsDisplay.setAttribute('class', 'topDisplay');
statsField.appendChild(playerStatsDisplay);

var inventoryDisplay = document.createElement('p');
inventoryDisplay.setAttribute('class', 'topDisplay');
statsField.appendChild(inventoryDisplay);

var reputationDisplay = document.createElement('p');
reputationDisplay.setAttribute('class', 'topDisplay');
statsField.appendChild(reputationDisplay);



//var diceField = document.getElementById('diceField');
var dice = [];
var maxdice = 20;
var i = 0;
for (i = 0; i < maxdice; i += 1) {
    dice[i] = document.createElement('div');
    dice[i].setAttribute('class', 'diceType diceFace1');
}

var cardField = document.getElementById('cardField');
statsField.appendChild(cardField);


//create 20 displayable cards
var display = [];
var maxcards = 20;
var i = 0;
for (i = 0; i < maxcards; i += 1) {
    display[i] = document.createElement('div');
    display[i].setAttribute('class', 'displayCard');

}

//set up event listeners for up to 20 displayable cards
var onCardClick = function (event) {
    if (display[this.displayIndex].className !== 'disabledCard'){
        player.displayText += `<br><span class = styleCard>* ${deck.getCard(player.activeCardsShown[this.displayIndex]).cardText}<br></span>`;
        player.activeCard = player.activeCardsShown[this.displayIndex];
        board.setBoard();
    }
};

for (i = 0; i < maxcards; i += 1) {
    display[i].displayIndex = i;
    display[i].addEventListener('click', onCardClick);
}


var player = {
    displayText: '',
    //whatever this is set to will be the initial card that the player will start the game at
//start of game
//        activeCard: 'Medusa0',
//wake up on Bifröst shore
//    activeCard: 'Medusa22',
//beginning of lifeboat
//    activeCard: 'LifeboatWakeUp',
//beginning of Life or Death game
//    activeCard: 'BifröstShore23',
//end of Life or Death game
//    activeCard: 'BifröstShore41Won',
//end of beginning of work day
    activeCard: 'BifröstCamp01BurnHill',
    activeCardsShown: [],
    activeDice: [],
    alive: true,
    sane: true,
    justDied: false,
    justWentInsane: false,
    justWon: false,
    justFailed: false,
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
            this.honorific = 'Your Grace';
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

////////////////////////////////////////////////////////////////////////////////


//ScoreType is the prototype for all types of stats
function ScoreType(){
//    this.singularName = ''; DELETE
//    this.pluralName = ''; DELETE
    this.quantity = 0;
    this.icon = '';
}

//return the singular or plural name of the score, based upon a quantity
ScoreType.prototype.setNames = function(){
    this.singularName = this.inputName[0];
    if (this.inputName.length === 1) {
        this.pluralName = this.inputName[0]+'s';
    } else {
        this.pluralName = this.inputName[1];
    }
};

//return the singular or plural name of the score, based upon a quantity
ScoreType.prototype.correctName = function(amount){
    if (amount === 1) {
        return this.singularName;
    } else {
        return this.pluralName;
    }
};

ScoreType.prototype.getLevel = function(){
    var exp = this.experience,
    level = 1;
    for (level = 1; level <= exp; level += 1) {
        exp -= level;
    }
    return (level - 1);
};

ScoreType.prototype.getNextExp = function(){
    var exp = 0,
    nextLevel = this.quantity,
    level = 1;
    nextLevel = this.quantity + 2;
    for (level = 1; level < (nextLevel); level += 1) {
        exp += level;
    }
    return exp;
};

ScoreType.prototype.increment = function(amount) {
    if (this.leveled) {
        this.experience += amount;
        this.quantity = this.getLevel();
        this.nextExp = this.getNextExp();
    }
    else {
        this.quantity += amount;
        if (this.quantity > this.maxQuantity) {
            this.quantity = this.maxQuantity;
        }
    }
};

/*ScoreType.prototype.checkIfDiceChanged = function(amount) {
    if (this.getLevel() = 100 && amount >= (this.getNextExp()-this.quantity)) {
        return 'You won an extra die.';
    }
};*/

//decrement the quantity of a stat. All stats can go below zero except for PlayerStat and Collectible.
ScoreType.prototype.decrement = function(amount) {
//    this.quantity += amount;
    //if Health goes below zero, the player has died
    if (this.quantity < 0 && (this.inputName === 'Health')) {
        this.quantity = 0;
        player.activeCard = 'Death';
        deck.getCard(player.activeCard).updateLocation();
        player.alive = false;
        player.justDied = true;
    }
    //if Mind goes below zero, the player has gone insane
    if (this.quantity < 0 && (this.inputName === 'Mind')) {
        this.quantity = 0;
        player.activeCard = 'Insanity';
        deck.getCard(player.activeCard).updateLocation();
        player.sane = false;
        player.justWentInsane = true;
    }
    //prevent the quantity from going below zero
    if (this.leveled) {
        this.experience += amount;
        this.quantity = this.getLevel();
        this.nextExp = this.getNextExp();
    }
    else {
        this.quantity += amount;
        if (this.quantity < this.minQuantity) {
            this.quantity = this.minQuantity;
        }
    }
};

//PlayerStats are ScoreType objects that track a player's abilities
function PlayerStat(inputName, quantity, maxQuantity, minQuantity, leveled, icon){
    ScoreType.call(this);
    //by unless a pluralized name has been specified, assume that the pluralName to be singularName + points
    this.inputName = inputName;
    this.singularName = inputName[0];
    if (inputName.length === 1) {
    //    this.pluralName = inputName[0]+' points'; DELETE
        this.pluralName = inputName[0];
    } else {
        this.pluralName = inputName[1];
    }
    this.quantity = quantity;
    //stats may have a maximum value. FIX this so some stats have no maxQuantity
    this.maxQuantity = maxQuantity;
    this.minQuantity = 0;
    if (minQuantity !== 0) {
        this.minQuantity = minQuantity;
    }
    this.icon = icon;
    //since dice can be rolled for PlayerStats, the number of dice is needed
    this.diceQuantity = 1;
    //PlayerStats can be leveled up
    this.experience = this.getNextExp() - this.quantity;
    this.leveled = leveled;
    //set the threshold at 100 for earning new dice
    if ((this.inputName !== "Health") && (this.inputName !== "Mind") && (this.inputName !== "Action")) {
        this.diceLevel = 100;
    }
}
PlayerStat.prototype = new ScoreType();

//Reputations are ScoreType objects that indicate a faction's relationship with the player. They can go negative.
function Reputation(inputName, quantity, maxQuantity, minQuantity, icon){
    ScoreType.call(this);
    this.inputName = inputName;
    this.singularName = inputName[0];
    this.pluralName = inputName[0];
    this.quantity = quantity;
    this.maxQuantity = maxQuantity;
    this.minQuantity = 0;
    if (minQuantity !== 0) {
        this.minQuantity = minQuantity;
    }
    this.leveled = true;
    this.icon = icon;
    //since dice can be rolled for Reputation, the number of dice is needed. FIX
    this.diceQuantity = 1;
    //Reputation can be leveled up. FIX
    this.experience = 0;
}
Reputation.prototype = new ScoreType();

//Progresses are ScoreType objects that are a generic catch-all, indicating the progress the player has made in some aspect. The player is made aware of these. They start at zero, and generally simply increment when moving through a story.
function Progress(inputName, quantity, maxQuantity, minQuantity, leveled, icon){
    var level = 0;
    ScoreType.call(this);
    //by unless a pluralized name has been specified, assume that the pluralName to be singularName + s
    this.inputName = inputName;
    this.setNames();
    this.quantity = 0;
    if (quantity >= 0) {
        this.quantity = quantity;
    }
    this.minQuantity = 0;
    if (minQuantity < 1000000) {
        this.minQuantity = minQuantity;
    }
    this.maxQuantity = maxQuantity;
    this.icon = icon;
    // create experience level requirements up to level 1000
    this.leveled = leveled;
    if (this.leveled) {
        this.experience = 0;
        this.levelRequired = [0,1];
        for (level = 2; level <= 1000; level += 1) {
            this.levelRequired[level] = this.levelRequired[level-1] + level;
        }
    }
}
Progress.prototype = new ScoreType();

//HiddenProgresses are ScoreType objects that behave like regular Progress, but they are not shared with the player.
function HiddenProgress(inputName, quantity, maxQuantity, minQuantity, icon){
    ScoreType.call(this);
    this.inputName = inputName;
    this.singularName = inputName;
    this.pluralName = inputName;
    this.quantity = 0;
    if (quantity >= 0) {
        this.quantity = quantity;
    }
    this.minQuantity = 0;
    if (minQuantity !== 0) {
        this.minQuantity = minQuantity;
    }
    this.maxQuantity = maxQuantity;
    this.icon = icon;
}
HiddenProgress.prototype = new ScoreType();

//Collectibles are ScoreType objects that the player can acquire into their inventory
function Collectible(inputName, quantity, marketValue, minQuantity, buff, icon){
    ScoreType.call(this);
    this.inputName = inputName;
    this.setNames();
    this.quantity = 0;
    if (quantity >= 0) {
        this.quantity = quantity;
    }
    this.minQuantity = 0;
    if (minQuantity !== 0) {
        this.minQuantity = minQuantity;
    }
    //Collectibles are the only ScoreType objects that can be sold or equipped, so they need marketValues and buffs
    this.marketValue = marketValue;
    this.buff = buff;
    this.icon = icon;
}

//establish that ScoreType is the prototype of all 5.
Collectible.prototype = new ScoreType();

//update the DOM elements for Collectibles, Reputation/Progress, & PlayerStat
Collectible.prototype.updateInventory = function() {
    var inventoryList = '<b><u>Inventory</u></b><br>';

    stats.score.forEach(function (item) {
        if (item.quantity > 0 && item instanceof Collectible) {
            inventoryList += `• ${item.quantity} ${item.correctName(item.quantity)}<br>`;
        }
    });
    inventoryDisplay.innerHTML = inventoryList;
};

//list the reputation DELETE? IS THIS NEEDED?
Progress.prototype.updateReputation = function() {
    var reputationList = '<b><u>Progress</u></b><br>';

    stats.score.forEach(function (item) {
        if ((item.quantity > 0 ) && (item instanceof Progress || item instanceof Reputation)) {
            if (item.leveled) {
                reputationList += `• ${item.quantity} (${item.experience} of ${item.nextExp}) ${item.correctName(item.quantity)}<br>`;
            } else {
                reputationList += `• ${item.quantity} ${item.correctName(item.quantity)}<br>`;
            }
        }
    });
    reputationDisplay.innerHTML = reputationList;
};

//list the progress
Reputation.prototype.updateReputation = function() {
    var reputationList = '<b><u>Progress</u></b><br>';

    stats.score.forEach(function (item) {
        if ((item.quantity > 0 ) && (item instanceof Progress || item instanceof Reputation)) {
            if (item.leveled) {
                reputationList += `• ${item.quantity} (${item.experience} of ${item.nextExp}) ${item.correctName(item.quantity)}<br>`;
            } else {
                reputationList += `• ${item.quantity} ${item.correctName(item.quantity)}<br>`;
            }
        }
    });
    reputationDisplay.innerHTML = reputationList;
};

//list the player's stats
PlayerStat.prototype.updateStatus = function() {
    var statList = '<b><u>Status</u></b><br>';
//    levelArray = 0;

    statList += `•  Health: ${stats.getScore('Health').quantity}/${stats.getScore('Health').maxQuantity}<br>`;
    statList += `•  Mind: ${stats.getScore('Mind').quantity}/${stats.getScore('Health').maxQuantity}<br>`;
    statList += `•  Actions: ${stats.getScore('Action').quantity}/${stats.getScore('Action').maxQuantity}<br><br>`;
    statList += '<b><u>Levels:</u></b><br>';
    stats.score.forEach(function (item) {
        if ((item.singularName !== 'Health') && (item.singularName !== 'Mind') && (item.singularName !== 'Action') && (item.quantity > 0) && (item instanceof PlayerStat)) {
            if (item.leveled) {
                statList += `• ${item.quantity} (${item.experience} of ${item.nextExp}) ${item.correctName(item.quantity)}<br>`;
            } else {
                statList += `• ${item.quantity} ${item.correctName(item.quantity)}<br>`;
            }
        }
    });
    playerStatsDisplay.innerHTML = statList;
};

//function that uses the player's stat quantity to return the level, experience in that level, and experience to the next level
/*PlayerStat.prototype.getLevel = function(){
    var exp = this.quantity,
    level = 1;
    for (level = 1; level <= exp; level += 1) {
        exp -= level;
    }
    return [level - 1, exp, level - exp];
};*/

//roll an appropriate number of dice for a stat and return the results in an array
PlayerStat.prototype.roll = function() {
    var diceIndex = 0,
    diceResults = [];

    this.diceQuantity = 1 + Math.floor(this.quantity/this.diceLevel);

    for (diceIndex = 0; diceIndex < this.diceQuantity; diceIndex+=1) {
        diceResults[diceIndex] = Math.floor(Math.random() * 6) + 1;
    }
    return diceResults;
};

//add up the total of the rolled dice
PlayerStat.prototype.addDice = function() {
    var diceTotal = 0,
    numOfDice = player.activeDice.length,
    diceIndex = 0;

    for (diceIndex = 0; diceIndex < numOfDice; diceIndex += 1){
        diceTotal += player.activeDice[diceIndex];
    }
    return diceTotal;
};

//erase the old dice form the screen
PlayerStat.prototype.eraseDice = function(diceInput){
    var i = 0,
    shownDice = player.activeDice.length;

    //clear the old dice
    for (i = 0; i < shownDice; i += 1) {
        diceField.removeChild(dice[i]);
    }
};

//draw new dice on the screen
PlayerStat.prototype.drawDice = function(diceInput){
    var i = 0,
    diceIndex = 0,
    numOfDice = player.activeDice.length;

    //draw new dice
    for (diceIndex = 0; diceIndex < numOfDice; diceIndex += 1){
        switch (diceInput[diceIndex]) {
        default:
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
        case 8:
            dice[diceIndex].setAttribute('class', 'diceType diceFace8');
            diceField.appendChild(dice[diceIndex]);
            break;
        case 9:
            dice[diceIndex].setAttribute('class', 'diceType diceFace9');
            diceField.appendChild(dice[diceIndex]);
            break;
        case 10:
            dice[diceIndex].setAttribute('class', 'diceType diceFace10');
            diceField.appendChild(dice[diceIndex]);
            break;

        }
    }
};

//remove the old dice from the board, roll new dice, and draw those new dice.
PlayerStat.prototype.rollCompare= function(opponent) {
    var diceTotal = 0,
    bonusResults;

    this.eraseDice();
    player.activeDice = this.roll();
    bonusResults = this.applySkills();
    player.activeDice[0] += bonusResults.bonusAmount;
    this.drawDice(player.activeDice);
    diceTotal = this.addDice(player.activeDice);
    //return whether or not this dice roll succeeded
    if (diceTotal >= opponent) {
        return {'wonTheRoll': true, 'bonusAmount': bonusResults.bonusAmount, 'bonusText': bonusResults.bonusText};
    } else {
        return {'wonTheRoll': false, 'bonusAmount': bonusResults.bonusAmount, 'bonusText': bonusResults.bonusText};
    }
};

PlayerStat.prototype.applySkills = function() {
    var levelMatrix = this.getLevel(),
    level = levelMatrix[0],
    bonus = 0,
    index = 0;

    for (level; level >= 100; level -= 100) {
        bonus += 1;
    }
    if (Math.floor(Math.random() * 100) < level) {
        bonus += 1;
    }

    if (bonus > 0) {
        return {'bonusAmount': bonus, 'bonusText': `<span class=styleBonus>Your ${this.singularName} skill increased your dice roll from ${player.activeDice[0]} to ${player.activeDice[0]+bonus}. </span>`};
    } else {
        return {'bonusAmount': 0, 'bonusText': ''};
    }
};

var externalScoreData = require('./scoreData.json');
//FIX continue collectibles with voice - hands of salt
//FIX lantern and deerskin jacket shoud have buffs


var stats = {
    score: [],
    loadData(data) {
        var me = this;
        // Populate the score array with the provided data
        data.player.forEach(function (item) {
            var myItem = new PlayerStat(item.inputName, item.quantity, item.maxQuantity, item.minQuantity, item.leveled, item.icon);
            me.score.push(myItem);
        });
        data.reputation.forEach(function (item) {
            var myItem = new Reputation(item.inputName, item.quantity, item.maxQuantity, item.minQuantity, item.icon);
            me.score.push(myItem);
        });
        data.progress.forEach(function (item) {
            var myItem = new Progress(item.inputName, item.quantity, item.maxQuantity, item.minQuantity, item. leveled, item.icon);
            me.score.push(myItem);
        });
        data.hiddenProgress.forEach(function (item) {
            var myItem = new HiddenProgress(item.inputName, item.quantity, item.maxQuantity, item.minQuantity);
            me.score.push(myItem);
        });
        data.collectibles.forEach(function (item) {
            var myItem = new Collectible(item.inputName, item.quantity, item.maxQuantity, item.minQuantity, item.marketValue, item.buff, item.icon);
            me.score.push(myItem);
        });
    },
    getScore(scoreName) {
        return this.score.find(function (item) {
            return item.singularName === scoreName;
        });
    }
};

stats.loadData(externalScoreData);

//create the prototype PlayableCard object
function PlayableCard(){
    this.addedText = '';
    this.hiddenIfReqsFail = false;
}

//check to see if this card gave any rewards
PlayableCard.prototype.processRewards = function(totalArray){

    var rewardArray = [],
    rewardList = '',
    rewardIndex,
    numOfRewards,
    costArray = [],
    costList = '',
    setList = '',
    processedName = '',
    processedQuantity = 0,
    randomNameIndex,
    totalIndex = 0,
    numofTotal = totalArray.length,
    randomValue = 0;

    for (totalIndex = 0; totalIndex < numofTotal; totalIndex += 1) {
        //if any of the rewardNames have multiple random possibilities, determine which one to use
        if (Array.isArray(totalArray[totalIndex].rewardName) ) {
            randomNameIndex = Math.floor(totalArray[totalIndex].rewardName.length * Math.random());
            processedName = totalArray[totalIndex].rewardName[randomNameIndex];
        } else {
            processedName = totalArray[totalIndex].rewardName;
        }
        //if any of the rewardQuantities have a random range of possibilities, determine which one to use
        if (totalArray[totalIndex].rewardRange !== undefined ) {
            randomValue = Math.floor((totalArray[totalIndex].rewardRange[randomNameIndex] * 2 + 1) * Math.random() - totalArray[totalIndex].rewardRange[randomNameIndex]);
            processedQuantity = totalArray[totalIndex].rewardQuantity[randomNameIndex] + randomValue;
        } else {
            processedQuantity = totalArray[totalIndex].rewardQuantity;
        }

        //create an array of only the positive rewards
        if (processedQuantity > 0) {
            stats.getScore(processedName).increment(processedQuantity);
            rewardArray.push({"rewardName": processedName, "rewardQuantity": processedQuantity});
        //create an array of only the negative costs
        } else if (processedQuantity < 0) {
            stats.getScore(processedName).decrement(processedQuantity);
            costArray.push({"rewardName": processedName, "rewardQuantity": processedQuantity});
        }
    }

    //actually process the rewards
    numOfRewards = rewardArray.length;
    if (numOfRewards > 0) {
        rewardList = `<span class=styleReward>↑You gained `;
        for (rewardIndex = 0; rewardIndex < numOfRewards; rewardIndex += 1) {
            rewardList += `${rewardArray[rewardIndex].rewardQuantity} ${stats.getScore(rewardArray[rewardIndex].rewardName).correctName(rewardArray[rewardIndex].rewardQuantity)}`;
            // add the word "reputation" in if you are gaining reputation
            if (stats.getScore(rewardArray[rewardIndex].rewardName) instanceof Reputation) {
                rewardList += ' reputation';
            }
            // add the word "points" in if you are gaining stat points
            if ((stats.getScore(rewardArray[rewardIndex].rewardName) instanceof PlayerStat) && (rewardArray[rewardIndex].rewardQuantity !== 1)) {
                rewardList += ' points';
            }
            // add the word "point" in if you are gaining one stat point
            if ((stats.getScore(rewardArray[rewardIndex].rewardName) instanceof PlayerStat) && (rewardArray[rewardIndex].rewardQuantity === 1)) {
                rewardList += ' point';
            }
            if (rewardIndex < numOfRewards - 2) {
                rewardList += ', ';
            }
            if (rewardIndex === numOfRewards - 2) {
                rewardList += ', and ';
            }
            if (rewardIndex === numOfRewards - 1) {
                rewardList += '.</span><br>';
            }
        }
    }

    numOfRewards = costArray.length;
    if (numOfRewards > 0) {
        costList = `<span class=styleCost>↓You lost `;
        for (rewardIndex = 0; rewardIndex < numOfRewards; rewardIndex += 1) {
            costList += `${Math.abs(costArray[rewardIndex].rewardQuantity)} ${stats.getScore(costArray[rewardIndex].rewardName).correctName(Math.abs(costArray[rewardIndex].rewardQuantity))}`;
            if (rewardIndex < numOfRewards - 2) {
                costList += ', ';
            }
            if (rewardIndex === numOfRewards - 2) {
                costList += ', and ';
            }
            if (rewardIndex === numOfRewards - 1) {
                costList += '.</span><br>';
            }
        }
    }

    if (this.setScore !== undefined) {
        numOfRewards = this.setScore.length;
        setList = `<span class=styleChallenge>→You now have `;
        for (rewardIndex = 0; rewardIndex < numOfRewards; rewardIndex += 1) {
            stats.getScore(this.setScore[rewardIndex].setName).quantity = this.setScore[rewardIndex].setQuantity;
            setList += `${this.setScore[rewardIndex].setQuantity} ${stats.getScore(this.setScore[rewardIndex].setName).correctName(this.setScore[rewardIndex].setQuantity)}`;
            if (rewardIndex < numOfRewards - 2) {
                setList += ', ';
            }
            if (rewardIndex === numOfRewards - 2) {
                setList += ', and ';
            }
            if (rewardIndex === numOfRewards - 1) {
                setList += '.</span><br>';
            }
        }
    }
    //this is awkward since it references specific objects. FIX
    stats.getScore('Health').updateStatus();
    stats.getScore('candlenut').updateInventory();
    stats.getScore('Royal Navy').updateReputation();
    return `<br>${rewardList}${costList}${setList}`;
};

PlayableCard.prototype.requirementSentence = function(){
    var reqList = '',
    chalList = '',
    req,
    numOfReqs,
    challengeStat = this.challengeStat,
    challengeRoll = this.challengeRoll;

    //check to see if the card has a roll challenge too
    if (challengeStat !== undefined) {
        chalList += `<br>Roll: ${challengeRoll} ${challengeStat}`;
    }
    if (this.reqs === undefined || this.hideReqs) {
        // add no text if there are no requirements
    }
    else {
        numOfReqs = this.reqs.length;
        for (req = 0; req < numOfReqs; req += 1) {
            //prepare a statement about card requirements.
            if (req === 0) {
                reqList += '(Requires ';
            }
            if (this.reqs[req].reqHidden === true) {
                //add nothing to the requirement list if this requirement should be hidden
            }
            else if ((this.reqs[req].reqRule === '>=') & (this.reqs[req].reqQuantity !== 1)) {
                reqList += `at least ${this.reqs[req].reqQuantity} ${stats.getScore(this.reqs[req].reqName).correctName(this.reqs[req].reqQuantity)}`;
            //this one will say "a" in the case that at least one thing is required
            } else if ((this.reqs[req].reqRule === '>=') & (this.reqs[req].reqQuantity === 1)) {
                reqList += `a ${stats.getScore(this.reqs[req].reqName).correctName(1)}`;
            } else if ((this.reqs[req].reqRule === '>') & (this.reqs[req].reqQuantity !== 0)) {
                reqList += `more than ${this.reqs[req].reqQuantity} ${stats.getScore(this.reqs[req].reqName).correctName(this.reqs[req].reqQuantity)}`;
            //this one will say "a" in the case that more than zero things are required
            } else if ((this.reqs[req].reqRule === '>') & (this.reqs[req].reqQuantity === 0)) {
                reqList += `a ${stats.getScore(this.reqs[req].reqName).correctName(1)}`;
            } else if (this.reqs[req].reqRule === '<') {
                reqList += `less than ${this.reqs[req].reqQuantity} ${stats.getScore(this.reqs[req].reqName).correctName(this.reqs[req].reqQuantity)}`;
            } else if (this.reqs[req].reqRule === '<=') {
                reqList += `at most ${this.reqs[req].reqQuantity} ${stats.getScore(this.reqs[req].reqName).correctName(this.reqs[req].reqQuantity)}`;
            } else if ((this.reqs[req].reqRule === '=') & (this.reqs[req].reqQuantity === 0)){
                reqList += `no ${stats.getScore(this.reqs[req].reqName).correctName(this.reqs[req].reqQuantity)}`;
            } else if ((this.reqs[req].reqRule === '=') & (this.reqs[req].reqQuantity !== 0)){
                reqList += `exactly ${this.reqs[req].reqQuantity} ${stats.getScore(this.reqs[req].reqName).correctName(this.reqs[req].reqQuantity)}`;
            }
            // add a comma to the list if there are more items coming
            if (req <= numOfReqs - 2 & this.reqs[req].reqHidden !== true) {
                reqList += ', ';
            }
// this part tried to add the word AND and an Oxford comma to the end of the list, but messed up with hidden requirements REMOVE this to FIX
//            if (req === numOfReqs - 2 & this.reqs[req].reqHidden !== true) {
//                reqList += ', and ';
//            }
            if (req === numOfReqs - 1) {
                reqList += `)`;
            }
        }
    }
    if (reqList.substring(reqList.length, reqList.length-10) === 'Requires )') {
        // Remove the word "Requires" from the end of the string if no things were added
        reqList = '';
    }
    return chalList + reqList;
};

PlayableCard.prototype.checkRequirements = function(){
    var passReq = true,
    index,
    playerQuantity,
    neededQuantity,
    numOfReqs,
    diceQuantity;

    //if the player doesn't have enough dice to possibly meet the card's challenge, then they fail the requirements
    //REMOVE? Because you still might want to try a challenge to learn even if you are guaranteed to fail?
    if (this.challengeStat !== undefined) {
        diceQuantity = stats.getScore(this.challengeStat).diceQuantity;
        if (this.challengeRoll > diceQuantity * 6) {
            passReq = false;
        }
    }

    //if the player fails any one requirement, then they fail
    if (this.reqs !== undefined) {
        numOfReqs = this.reqs.length;
        for (index = 0; index < numOfReqs; index += 1) {
            //compare score vs card requirements.
            playerQuantity = stats.getScore(this.reqs[index].reqName).quantity;
            neededQuantity = this.reqs[index].reqQuantity;
            if ((this.reqs[index].reqRule === '>=') && (playerQuantity < neededQuantity)) {
                passReq = false;
            } else if ((this.reqs[index].reqRule === '>') && (playerQuantity <= neededQuantity)) {
                passReq = false;
            } else if ((this.reqs[index].reqRule === '<') && (playerQuantity >= neededQuantity)) {
                passReq = false;
            } else if ((this.reqs[index].reqRule === '<=') && (playerQuantity > neededQuantity)) {
                passReq = false;
            } else if ((this.reqs[index].reqRule === '=') && (playerQuantity !== neededQuantity)) {
                passReq = false;
            }
        }
    }
    return passReq;
};

//activate the card and return text describing what happened
PlayableCard.prototype.performCard = function(){
    var returnCardText = '';
    //update locationBox
    this.updateLocation();
    //if this is the first time viewing this card, then add any text that only applies on the first viewing
    if (this.firstTime === true && this.firstText !== undefined) {
        returnCardText += this.firstText;
    }
    this.firstTime = false;
    if (this.challengeStat !== undefined) {
        returnCardText += this.performChallenge();
    } else {
        returnCardText += this.cardScript();
        returnCardText += `<span class = styleStory>${this.addedText}</span>`;
        if (this.rewards !== undefined) {
            returnCardText += `<em>${this.processRewards(this.rewards)}</em>`;
        } else if (this.setScore !== undefined) {
            returnCardText += `<em>${this.processRewards([])}</em>`;
        }
    }
    return returnCardText;
};

PlayableCard.prototype.performChallenge = function() {
    var rollResults = stats.getScore(this.challengeStat).rollCompare(this.challengeRoll),
    returnCardText = '',
    successExp,
    failExp;

    returnCardText += rollResults.bonusText;
    if (rollResults.wonTheRoll) {
        player.justWon = true;
        successExp = Math.floor(this.challengeRoll / 2);
        returnCardText += `<span class = styleChallenge>You succeeded in this challenge and learned a little.  ${this.processRewards([{"rewardName": this.challengeStat, "rewardQuantity": successExp}])}</span>`;
        if (this.randomTerms !== undefined) {
            returnCardText += `<span class = styleStory>${this.randomTextGenerator(this.challengeSuccessText)}</span>`;
        } else {
            returnCardText += `<span class = styleStory>${this.challengeSuccessText}</span>`;
        }
        returnCardText += `${this.cardScript()}`;
        if (this.addedText !== undefined) {
            returnCardText += `<span class = styleStory>${this.addedText}</span>`;
        }
        returnCardText += `<em>${this.processRewards(this.challengeSuccessRewards)}</em>`;
        //give a little experience based on the type of challenge, equal to half of the opponent roll
    }
    else {
        player.justFailed = true;
        failExp = this.challengeRoll;
        returnCardText += `<span class = styleChallenge>You failed in this challenge but learned a lot.  ${this.processRewards([{"rewardName": this.challengeStat, "rewardQuantity": failExp}])}</span>`;
        if (this.randomTerms !== undefined) {
            returnCardText += `<span class = styleStory>${this.randomTextGenerator(this.challengeFailText)}</span>`;
        } else {
            returnCardText += `<span class = styleStory>${this.challengeFailText}</span>`;
        }
        returnCardText += `${this.cardScript()}`;
        if (this.addedText !== undefined) {
            returnCardText += `<span class = styleStory>${this.addedText}</span>`;
        }
        returnCardText += `<em>${this.processRewards(this.challengeFailRewards)}</em>`;
        //give more experience based on the type of challenge, equal the opponent roll
    }
    return returnCardText + '<br>';
};

PlayableCard.prototype.randomTextGenerator = function(modifyText) {
    var choiceIndex,
    returnRandom = [],
    randomTermsArray,
    randomValue,
    regEx,
    maxChoices = this.randomTerms.length;

    for (choiceIndex = 0; choiceIndex < maxChoices; choiceIndex += 1) {
        randomTermsArray = this.randomTerms[choiceIndex].split(',');
        randomValue = Math.floor(randomTermsArray.length * Math.random());
        returnRandom[choiceIndex] = randomTermsArray[randomValue];
        regEx = new RegExp('\\{' + choiceIndex + '\\}', 'g');
        modifyText = modifyText.replace(regEx, returnRandom[choiceIndex]);
    }

    return modifyText;
};

PlayableCard.prototype.cardScript = function(){
    //any PlayableCard that has a cardScript needs to include its own <br>
    return '';
};

PlayableCard.prototype.updateLocation = function(){
    var locationText = '';
    if (this.locationName) {
        board.locationName = this.locationName;
    }
    if (this.locationDescription) {
        board.locationDescription = this.locationDescription;
    }
    locationDisplay.innerHTML = `<b>Location: ${board.locationName}</b><br>${board.locationDescription}`;
};

//create a card whoe primary purpose is navigation
function LocationCard(cardID) {
    PlayableCard.call(this);
    this.cardID = cardID;
}
LocationCard.prototype = new PlayableCard();

LocationCard.prototype.loadFromData = function (data) {
    this.cardID = data.cardID;
    this.locationName = data.locationName;
    this.locationDescription = data.locationDescription;
    this.cardText = data.cardText;
    this.challengeStat = data.challengeStat;
    this.challengeRoll = data.challengeRoll;
    this.challengeSuccessRewards = data.challengeSuccessRewards;
    this.challengeSuccessCards = data.challengeSuccessCards;
    this.challengeSuccessText = data.challengeSuccessText;
    this.challengeFailRewards = data.challengeFailRewards;
    this.challengeFailCards = data.challengeFailCards;
    this.challengeFailText = data.challengeFailText;
    this.addedText = data.addedText;
    this.rewards = data.rewards;
    this.reqs = data.reqs;
    this.nextCardsID = data.nextCardsID;
    this.hiddenIfReqsFail = data.hiddenIfReqsFail;
    this.hideReqs = data.hideReqs;
    this.firstTime = true;
    this.openQuest = data.openQuest;
    this.setScore = data.setScore;
};

function ActionCard(cardID) {
    PlayableCard.call(this);
    this.cardID = cardID;
}
ActionCard.prototype = new PlayableCard();

ActionCard.prototype.loadFromData = function (data) {
    this.cardID = data.cardID;
    this.locationName = data.locationName;
    this.locationDescription = data.locationDescription;
    this.cardText = data.cardText;
    this.challengeStat = data.challengeStat;
    this.challengeRoll = data.challengeRoll;
    this.challengeSuccessRewards = data.challengeSuccessRewards;
    this.challengeSuccessCards = data.challengeSuccessCards;
    this.challengeSuccessText = data.challengeSuccessText;
    this.challengeFailRewards = data.challengeFailRewards;
    this.challengeFailCards = data.challengeFailCards;
    this.challengeFailText = data.challengeFailText;
    this.addedText = data.addedText;
    this.rewards = data.rewards;
    this.reqs = data.reqs;
    this.nextCardsID = data.nextCardsID;
    this.hiddenIfReqsFail = data.hiddenIfReqsFail;
    this.hideReqs = data.hideReqs;
    this.openQuest = data.openQuest;
    this.setScore = data.setScore;
};

function StoryCard(cardID) {
    PlayableCard.call(this);
    this.cardID = cardID;
}
StoryCard.prototype = new PlayableCard();

StoryCard.prototype.loadFromData = function (data) {
    this.cardID = data.cardID;
    this.locationName = data.locationName;
    this.locationDescription = data.locationDescription;
    this.cardText = data.cardText;
    this.challengeStat = data.challengeStat;
    this.challengeRoll = data.challengeRoll;
    this.challengeSuccessRewards = data.challengeSuccessRewards;
    this.challengeSuccessCards = data.challengeSuccessCards;
    this.challengeSuccessText = data.challengeSuccessText;
    this.challengeFailRewards = data.challengeFailRewards;
    this.challengeFailCards = data.challengeFailCards;
    this.challengeFailText = data.challengeFailText;
    this.addedText = data.addedText;
    this.rewards = data.rewards;
    this.reqs = data.reqs;
    this.nextCardsID = data.nextCardsID;
    this.hiddenIfReqsFail = data.hiddenIfReqsFail;
    this.hideReqs = data.hideReqs;
    this.openQuest = data.openQuest;
    this.setScore = data.setScore;
    this.firstTime = true;
    this.firstText = data.firstText;
    this.cardStyle = data.cardStyle;
};


var externalCardData = require('./cardData.json');

var deck = {
    card: [],
    loadData(data) {
        me = this;
        // Populate the score array with the provided data
        data.locations.forEach(function (item) {
            var myItem = new LocationCard();
            myItem.loadFromData(item);
            me.card.push(myItem);
        });
        data.actions.forEach(function (item) {
            var myItem = new ActionCard();
            myItem.loadFromData(item);
            me.card.push(myItem);
        });
        data.stories.forEach(function (item) {
            var myItem = new StoryCard();
            myItem.loadFromData(item);
            me.card.push(myItem);
        });
    },
    getCard(cardName) {
        //12345
        /*function isItemNameEqualToScoreName(item) {
            return item.name === scoreName;
        }

        this.score.find(isItemNameEqualToScoreName);*/

        return this.card.find(function (item) {
            return item.cardID === cardName;
        });

    }
};

deck.loadData(externalCardData);

//board object
var board = {
    locationName: '?',
    locationDescription: '<br>',

    setBoard() {
        var oldNumOfCards = player.activeCardsShown.length,
        numOfCards = 0;

//remove old cards.
        for (i = 0; i < oldNumOfCards; i += 1) {
            cardField.removeChild(display[i]);
        }
        //Create Stats and Inventory & put the text in the story
        player.displayText = deck.getCard(player.activeCard).performCard();
//        player.displayText += deck.getCard(player.activeCard).performCard();
//        alert(deck.getCard(player.activeCard).nextCardsID);
//        alert(player.justWon);
//        alert(player.justFailed);

        if (player.justDied) {
            player.justDied = false;
            player.activeCard = 'Dead';
            player.displayText +=`<span class = styleAlert>${deck.getCard(player.activeCard).addedText}<br></span>`;
            player.activeCardsShown = deck.getCard(player.activeCard).nextCardsID.slice();
        }
        else if (player.justWentInsane) {
            player.justWentInsane = false;
            player.activeCard = 'Insane';
            player.displayText +=`<span class = styleAlert>${deck.getCard(player.activeCard).addedText}<br></span>`;
            player.activeCardsShown = deck.getCard(player.activeCard).nextCardsID.slice();
        }
        else if (player.justWon) {
            player.justWon = false;
            //player.displayText +=`<span class = styleReward>${deck.getCard(player.activeCard).challengeSuccessText}<br></span>`;
            player.activeCardsShown = deck.getCard(player.activeCard).challengeSuccessCards.slice();
        }
        else if (player.justFailed) {
            player.justFailed = false;
            //player.displayText +=`<span class = styleCost>${deck.getCard(player.activeCard).challengeFailText}<br></span>`;
            player.activeCardsShown = deck.getCard(player.activeCard).challengeFailCards.slice();
        } else {
            //if the player isn't being redirected by death, insanity or a challengeRoll, then load the usual next cards
            player.activeCardsShown = deck.getCard(player.activeCard).nextCardsID.slice();
        }

        numOfCards = player.activeCardsShown.length;
        for(var i = numOfCards - 1; i >= 0; i -= 1) {
            var x = deck.getCard(player.activeCardsShown[i]).checkRequirements();
            if(deck.getCard(player.activeCardsShown[i]).hiddenIfReqsFail && (!x)) {
                player.activeCardsShown.splice(i, 1);
            }
        }
//        alert(deck.getCard(player.activeCard).nextCardsID);

        numOfCards = player.activeCardsShown.length;
        storyDisplay.innerHTML = player.displayText;

        //append the appropriate number of cards to choose from
        for (i = 0; i < numOfCards; i += 1) {
            cardField.appendChild(display[i]);
            display[i].innerHTML = `${deck.getCard(player.activeCardsShown[i]).cardText}<br>${deck.getCard(player.activeCardsShown[i]).requirementSentence()}`;
            //disable cards if requirements are not met
            if (deck.getCard(player.activeCardsShown[i]).checkRequirements()) {
                if ((deck.getCard(player.activeCardsShown[i]).challengeStat==='Eye')||(deck.getCard(player.activeCardsShown[i]).cardStyle==='eyeCardStyle')) {
                    display[i].setAttribute('class', 'eyeCard');
                }
                else if ((deck.getCard(player.activeCardsShown[i]).challengeStat==='Brawn')||(deck.getCard(player.activeCardsShown[i]).cardStyle==='brawnCardStyle')) {
                    display[i].setAttribute('class', 'brawnCard');
                }
                else if ((deck.getCard(player.activeCardsShown[i]).challengeStat==='Voice')||(deck.getCard(player.activeCardsShown[i]).cardStyle==='voiceCardStyle')) {
                    display[i].setAttribute('class', 'voiceCard');
                }
                else if ((deck.getCard(player.activeCardsShown[i]).challengeStat==='Hand')||(deck.getCard(player.activeCardsShown[i]).cardStyle==='handCardStyle')) {
                    display[i].setAttribute('class', 'handCard');
                }
                else if ((deck.getCard(player.activeCardsShown[i]).challengeStat==='Heart')||(deck.getCard(player.activeCardsShown[i]).cardStyle==='heartCardStyle')) {
                    display[i].setAttribute('class', 'heartCard');
                }
                else {
                    display[i].setAttribute('class', 'displayCard');
                }
            } else {
                display[i].setAttribute('class', 'disabledCard');
            }
        }
    }
};

//Initialize the board & set listeners for button pushes.
board.setBoard();
