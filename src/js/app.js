/*jshint browser: true, esversion: 6, devel: true */
//48
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
    activeCard: 'BifröstShore42',
    activeCardsShown: [],
    activeDice: [],
    alive: true,
    sane: true,
    justDied: false,
    justWentInsane: false,
    justWon: false,
    justFailed: false,
    timeOfDay: 'morning',
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

//PlayerStats are ScoreType objects that track a player's abilities
function PlayerStat(inputName, quantity, maxQuantity, icon){
    ScoreType.call(this);
    //by unless a pluralized name has been specified, assume that the pluralName to be singularName + points
    this.inputName = inputName;
    this.singularName = inputName[0];
    if (inputName.length === 1) {
        this.pluralName = inputName[0]+' points';
    } else {
        this.pluralName = inputName[1];
    }
    this.quantity = quantity;
    //stats may have a maximum value. FIX this so some stats have no maxQuantity
    this.maxQuantity = maxQuantity;
    this.icon = icon;
    //since dice can be rolled for PlayerStats, the number of dice is needed
    this.diceQuantity = 1;
    //PlayerStats can be leveled up
    this.experience = 0;
    this.level = 0;
}
PlayerStat.prototype = new ScoreType();

//Reputations are ScoreType objects that indicate a faction's relationship with the player. They can go negative.
function Reputation(inputName, quantity, icon){
    ScoreType.call(this);
    this.inputName = inputName;
    this.singularName = inputName[0];
    this.pluralName = inputName[0];
    this.quantity = quantity;
    this.icon = icon;
    //since dice can be rolled for Reputation, the number of dice is needed. FIX
    this.diceQuantity = 1;
    //Reputation can be leveled up. FIX
    this.experience = 0;
    this.level = 0;
}
Reputation.prototype = new ScoreType();

//Progresses are ScoreType objects that are a generic catch-all, indicating the progress the player has made in some aspect. The player is made aware of these. They start at zero, and generally simply increment when moving through a story.
function Progress(inputName, icon){
    ScoreType.call(this);
    //by unless a pluralized name has been specified, assume that the pluralName to be singularName + s
    this.inputName = inputName;
    this.setNames();
    this.icon = icon;
}
Progress.prototype = new ScoreType();

//HiddenProgresses are ScoreType objects that behave like regular Progress, but they are not shared with the player.
function HiddenProgress(inputName){
    ScoreType.call(this);
    this.inputName = inputName;
    this.singularName = inputName;
    this.pluralName = inputName;
}
HiddenProgress.prototype = new ScoreType();

//Collectibles are ScoreType objects that the player can acquire into their inventory
function Collectible(inputName, quantity, marketValue, buff, icon){
    ScoreType.call(this);
    this.inputName = inputName;
    this.setNames();
    this.quantity = quantity;
    //Collectibles are the only ScoreType objects that can be sold or equipped, so they need marketValues and buffs
    this.marketValue = marketValue;
    this.buff = buff;
    this.icon = icon;
}

//establish that ScoreType is the prototype of all 5.
Collectible.prototype = new ScoreType();

//increment the different types of scores, and update the appropriate DOM element. PlayerStat is the only score that can have a maximum value
PlayerStat.prototype.increment = function(amount) {
    this.quantity += amount;
    //prevent the quantity from going above it's maximum
    if (this.quantity > this.maxQuantity) {
        this.quantity = this.maxQuantity;
    }
    this.updateStatus();
};

Collectible.prototype.increment = function(amount) {
    this.quantity += amount;
    this.updateInventory();
};

Reputation.prototype.increment = function(amount) {
    this.quantity += amount;
    this.updateReputation();
};

Progress.prototype.increment = function(amount) {
    this.quantity += amount;
    this.updateReputation();
};

HiddenProgress.prototype.increment = function(amount) {
    this.quantity += amount;
};

//decrement the quantity of a stat. All stats can go below zero except for PlayerStat and Collectible.
PlayerStat.prototype.decrement = function(amount) {
    this.quantity += amount;
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
    if (this.quantity < 0) {
        this.quantity = 0;
    }

    this.updateStatus();
};

Reputation.prototype.decrement = function(amount) {
    this.quantity += amount;
    this.updateReputation();
};

Progress.prototype.decrement = function(amount) {
    this.quantity += amount;
    this.updateReputation();
};

HiddenProgress.prototype.decrement = function(amount) {
    this.quantity += amount;
};

Collectible.prototype.decrement = function(amount) {
    this.quantity += amount;
    if (this.quantity < 0) {
        this.quantity = 0;
    }
    this.updateInventory();
};


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

//list the reputation
Reputation.prototype.updateReputation = function() {
    var reputationList = '<b><u>Progress</u></b><br>';

    stats.score.forEach(function (item) {
        if (item.quantity > 0 && (item instanceof Progress || item instanceof Reputation)) {
            reputationList += `• ${item.quantity} ${item.correctName(item.quantity)}<br>`;
        }
    });
    reputationDisplay.innerHTML = reputationList;
};

//list the progress
Progress.prototype.updateReputation = function() {
    var reputationList = '<b><u>Progress</u></b><br>';

    stats.score.forEach(function (item) {
        if (item.quantity > 0 && (item instanceof Progress || item instanceof Reputation)) {
            reputationList += `• ${item.quantity} ${item.correctName(item.quantity)}<br>`;
        }
    });
    reputationDisplay.innerHTML = reputationList;
};

//list the player's stats
PlayerStat.prototype.updateStatus = function() {
    var statList = '<b><u>Status</u></b><br>',
    levelArray = 0;

    statList += `•  Health: ${stats.getScore('Health').quantity}/${stats.getScore('Health').maxQuantity}<br>`;
    statList += `•  Mind: ${stats.getScore('Mind').quantity}/${stats.getScore('Health').maxQuantity}<br><br>`;
    statList += '<b><u>Bonuses</u></b><br>';
    stats.score.forEach(function (item) {
    if ((item.singularName !== 'Health') && (item.singularName !== 'Mind') && (item.quantity > 0) && (item instanceof PlayerStat)) {
        levelArray = item.getLevel();
        statList += `•  ${item.singularName}: ${levelArray[0]}%, ${item.quantity}(${levelArray[1]})<br>`;
        }
    });
    playerStatsDisplay.innerHTML = statList;
};

//function that uses the player's stat quantity to return the level, experience in that level, and experience to the next level
PlayerStat.prototype.getLevel = function(){
    var exp = this.quantity,
    level = 1;
    for (level === 1; level <= exp; level += 1) {
        exp -= level;
    }
    return [level - 1, exp, level - exp];
};

//roll an appropriate number of dice for a stat and return the results in an array
PlayerStat.prototype.roll = function() {
    var diceIndex = 0,
    diceResults = [];

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
            var myItem = new PlayerStat(item.inputName, item.quantity, item.maxQuantity, item.icon);
            me.score.push(myItem);
        });
        data.reputation.forEach(function (item) {
            var myItem = new Reputation(item.inputName, item.quantity, item.icon);
            me.score.push(myItem);
        });
        data.progress.forEach(function (item) {
            var myItem = new Progress(item.inputName, item.icon);
            me.score.push(myItem);
        });
        data.hiddenProgress.forEach(function (item) {
            var myItem = new HiddenProgress(item.inputName);
            me.score.push(myItem);
        });
        data.collectibles.forEach(function (item) {
            var myItem = new Collectible(item.inputName, item.quantity, item.marketValue, item.buff, item.icon);
            me.score.push(myItem);
        });
    },
    getScore(scoreName) {
        //12345
        /*function isItemNameEqualToScoreName(item) {
            return item.name === scoreName;
        }

        this.score.find(isItemNameEqualToScoreName);*/

        return this.score.find(function (item) {
            return item.singularName === scoreName;
        });

    }
};

stats.loadData(externalScoreData);
//var pugScore = stats.getScore('pug');


/*create an array of the game's score items DELETE this

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
        board.activeCard = 99;
        deck.card[board.activeCard].updateLocation();
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
        board.activeCard = 95;
        deck.card[board.activeCard].updateLocation();
        player.sane = false;
        player.justWentInsane = true;
    }
    this.updateStats();
};*/


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
    costIndex,
    numOfCosts,
    setList = '',
    setIndex,
    numOfSets,
    totalIndex,
    numofTotal = totalArray.length,
    randomValue,
    newValue;

    for (totalIndex = 0; totalIndex < numofTotal; totalIndex += 1) {
        //if any of the rewardNames have multiple random possibilities, determine which one to use
        if (Array.isArray(totalArray[totalIndex].rewardName) ) {
            randomValue = Math.floor(totalArray[totalIndex].rewardName.length * Math.random());
            newValue = totalArray[totalIndex].rewardName[randomValue];
            totalArray[totalIndex].rewardName = newValue;
        }
        //if any of the rewardQuantities have a random range of possibilities, determine which one to use
        if (totalArray[totalIndex].rewardRange > 0 ) {
            randomValue = Math.floor(totalArray[totalIndex].rewardRange * 2 * Math.random()) - totalArray[totalIndex].rewardRange;
            newValue = totalArray[totalIndex].rewardQuantity + randomValue;
            totalArray[totalIndex].rewardQuantity = newValue;
        }
        //create an array of only the positive rewards
        if (totalArray[totalIndex].rewardQuantity > 0) {
            stats.getScore(totalArray[totalIndex].rewardName).increment(totalArray[totalIndex].rewardQuantity);
            rewardArray.push(totalArray[totalIndex]);
        //create an array of only the negative costs
        } else if (totalArray[totalIndex].rewardQuantity < 0) {
            stats.getScore(totalArray[totalIndex].rewardName).decrement(totalArray[totalIndex].rewardQuantity);
            costArray.push(totalArray[totalIndex]);
        }
    }

    //actually process the rewards
    numOfRewards = rewardArray.length;
    if (numOfRewards > 0) {
        rewardList = `<span class=styleReward>↑You gained `;
        for (rewardIndex = 0; rewardIndex < numOfRewards; rewardIndex += 1) {
            rewardList += `${rewardArray[rewardIndex].rewardQuantity} ${stats.getScore(rewardArray[rewardIndex].rewardName).correctName(rewardArray[rewardIndex].rewardQuantity)}`;
            if (rewardIndex < numOfRewards - 2) {
                rewardList += ', ';
            }
            if (rewardIndex === numOfRewards - 2) {
                rewardList += ', and ';
            }
            if (rewardIndex === numOfRewards - 1) {
                rewardList += '.</span>';
            }
        }
    }

    numOfCosts = costArray.length;
    if (numOfCosts > 0) {
        costList = `<span class=styleCost>↓You lost `;
        for (costIndex = 0; costIndex < numOfCosts; costIndex += 1) {
            costList += `${Math.abs(costArray[costIndex].rewardQuantity)} ${stats.getScore(costArray[costIndex].rewardName).correctName(Math.abs(costArray[costIndex].rewardQuantity))}`;
            if (costIndex < numOfCosts - 2) {
                costList += ', ';
            }
            if (costIndex === numOfCosts - 2) {
                costList += ', and ';
            }
            if (costIndex === numOfCosts - 1) {
                costList += '.</span>';
            }
        }
    }

    if (this.setScore !== undefined) {
        numOfSets = this.setScore.length;
        setList = `<span class=styleChallenge>→You now have `;
        for (setIndex = 0; setIndex < numOfSets; setIndex += 1) {
            stats.getScore(this.setScore[setIndex].setName).quantity = this.setScore[setIndex].setQuantity;
            setList += `${this.setScore[setIndex].setQuantity} ${stats.getScore(this.setScore[setIndex].setName).correctName(this.setScore[setIndex].setQuantity)}`;
            if (setIndex < numOfSets - 2) {
                setList += ', ';
            }
            if (setIndex === numOfSets - 2) {
                setList += ', and ';
            }
            if (setIndex === numOfSets - 1) {
                setList += '.</span>';
            }
        }
    }
    //this is awkward since it references specific objects. FIX
    stats.getScore('Health').updateStatus();
    stats.getScore('candlenut').updateInventory();
    stats.getScore('Royal Navy').updateReputation();
    return `${rewardList}<br>${costList}<br>${setList}<br>`;
};

// //get & set a card's costs to be subtracted when clicked DELETE
// PlayableCard.prototype.setCosts = function(costItem,costQuantity){
//     if (!Array.isArray(costItem)) {
//         costItem = [costItem];
//     }
//     if (!Array.isArray(costQuantity)) {
//         costQuantity = [costQuantity];
//     }
//     this.costItem = costItem;
//     this.costQuantity = costQuantity;
//     //if a card has costs, then those also must be requirements too
//     this.requiredItem = costItem;
//     this.requiredQuantity = costQuantity;
// };

// //check to see if this card gave any costs
// PlayableCard.prototype.processCosts = function(givenCostItem, givenCostQuantity){
//     var costList = '',
//     costIndex = 0,
//     numOfCosts = 0;
//     if (givenCostItem[0] > 0) {
//         numOfCosts = givenCostItem.length;
//         for (costIndex = 0; costIndex < numOfCosts; costIndex += 1) {
//             scoreData[givenCostItem[costIndex]].decrement(givenCostQuantity[costIndex]);
//             //add a comment to the story about costs.
//             if (costIndex === 0) {
//                 costList += `<span class=styleCost>↓You lost `;
//             }
//             costList += `${givenCostQuantity[costIndex]} ${scoreData[givenCostItem[costIndex]].correctName(givenCostQuantity[costIndex])}`;
//             if (costIndex < numOfCosts - 2) {
//                 costList += ', ';
//             }
//             if (costIndex === numOfCosts - 2) {
//                 costList += ', and ';
//             }
//             if (costIndex === numOfCosts - 1) {
//                 costList += '.<br></span>';
//             }
//         }
//     }
//     return costList;
// };

// //get & set a card's requirements that must be met in order for a card to be clicked on
// PlayableCard.prototype.setRequirements = function(requiredItem,requiredQuantity){
//     if (!Array.isArray(requiredItem)) {
//         this.requiredItem = [requiredItem];
//     } else {
//         this.requiredItem = requiredItem;
//     }
//     if (!Array.isArray(requiredQuantity)) {
//         this.requiredQuantity = [requiredQuantity];
//     } else {
//         this.requiredQuantity = requiredQuantity;
//     }
// };

PlayableCard.prototype.requirementSentence = function(){
    var reqList = '',
    req,
    numOfReqs,
    challengeStat = this.challengeStat,
    challengeRoll = this.challengeRoll;

    //check to see if the card has a roll challenge too
    if (challengeStat !== undefined) {
        reqList += `<br>Challenge: roll ${challengeRoll} ${challengeStat}.`;
    }
    if (this.reqs === undefined || this.hideReqs) {
        reqList += ' (No reqs)';
    }
    else {
        numOfReqs = this.reqs.length;
        for (req = 0; req < numOfReqs; req += 1) {
            //prepare a statement about card requirements.
            if (req === 0) {
                reqList += '(Requires ';
            }
            if (this.reqs[req].reqRule === '>=') {
                reqList += `at least ${this.reqs[req].reqQuantity} ${stats.getScore(this.reqs[req].reqName).correctName(this.reqs[req].reqQuantity)}`; //this will not pluralize names FIX
            } else if (this.reqs[req].reqRule === '>') {
                reqList += `more than ${this.reqs[req].reqQuantity} ${stats.getScore(this.reqs[req].reqName).correctName(this.reqs[req].reqQuantity)}`; //this will not pluralize names FIX
            } else if (this.reqs[req].reqRule === '<') {
                reqList += `less than ${this.reqs[req].reqQuantity} ${stats.getScore(this.reqs[req].reqName).correctName(this.reqs[req].reqQuantity)}`; //this will not pluralize names FIX
            } else if (this.reqs[req].reqRule === '<=') {
                reqList += `at most ${this.reqs[req].reqQuantity} ${stats.getScore(this.reqs[req].reqName).correctName(this.reqs[req].reqQuantity)}`; //this will not pluralize names FIX
            } else if (this.reqs[req].reqRule === '=') {
                reqList += `exactly ${this.reqs[req].reqQuantity} ${stats.getScore(this.reqs[req].reqName).correctName(this.reqs[req].reqQuantity)}`; //this will not pluralize names FIX
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
    if (this instanceof LocationCard) {
        this.firstTime = false;
    }
    return returnCardText;
};

/* DELETE PlayableCard.prototype.setChallenge = function(challengeStat, challengeQuantity, successText, successRewardItem, successRewardQuantity, successCostItem, successCostQuantity, failText, failRewardItem, failRewardQuantity, failCostItem, failCostQuantity) {
    this.challengeStat = challengeStat;
    this.challengeQuantity = challengeQuantity;
    this.successText = successText;
    this.successRewardItem = successRewardItem;
    this.successRewardQuantity = successRewardQuantity;
    this.successCostItem = successCostItem;
    this.successCostQuantity = successCostQuantity;
    this.failText = failText;
    this.failRewardItem = failRewardItem;
    this.failRewardQuantity = failRewardQuantity;
    this.failCostItem = failCostItem;
    this.failCostQuantity = failCostQuantity;
};*/

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
    locationTitleBox.innerHTML = `<b>Location: ${board.locationName}</b><br>${board.locationDescription}`;
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
    this.randomTerms = data.randomTerms;
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
    this.randomTerms = data.randomTerms;
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
    this.randomTerms = data.randomTerms;
    this.setScore = data.setScore;
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

deck.getCard('BifröstShore2').cardScript = function() {
    if (stats.getScore('lantern').quantity > 0) {
        stats.getScore('lantern').decrement(-1 * stats.getScore('lantern').quantity);
        stats.getScore('inkwell').decrement(-1 * stats.getScore('inkwell').quantity);
        return `<span class=styleCost>↓You lost 1 lantern, and 1 inkwell.</span><br>`;
    } else {
        return '';
    }
};

//board object
var board = {
    // activeCard: 'Medusa0',
    // displayText: '',
    // activeCardsShown: [],
    // activeDice: [],
    locationName: '?',

    setBoard() {
        var oldNumOfCards = player.activeCardsShown.length,
        numOfCards = 0;

//remove old cards.
        for (i = 0; i < oldNumOfCards; i += 1) {
            cardField.removeChild(display[i]);
        }
        //Create Stats and Inventory & put the text in the story
        player.displayText += deck.getCard(player.activeCard).performCard();
        player.activeCardsShown = deck.getCard(player.activeCard).nextCardsID;

        if (player.justDied) {
            player.justDied = false;
            player.activeCard = 'Dead';
            player.displayText +=`<span class = styleAlert>${deck.getCard(player.activeCard).addedText}<br></span>`;
            player.activeCardsShown = deck.getCard(player.activeCard).nextCardsID;
        }
        if (player.justWentInsane) {
            player.justWentInsane = false;
            player.activeCard = 'Insane';
            player.displayText +=`<span class = styleAlert>${deck.getCard(player.activeCard).addedText}<br></span>`;
            player.activeCardsShown = deck.getCard(player.activeCard).nextCardsID;
        }
        if (player.justWon) {
            player.justWon = false;
            //player.displayText +=`<span class = styleReward>${deck.getCard(player.activeCard).challengeSuccessText}<br></span>`;
            player.activeCardsShown = deck.getCard(player.activeCard).challengeSuccessCards;
        }
        if (player.justFailed) {
            player.justFailed = false;
            //player.displayText +=`<span class = styleCost>${deck.getCard(player.activeCard).challengeFailText}<br></span>`;
            player.activeCardsShown = deck.getCard(player.activeCard).challengeFailCards;
        }

        numOfCards = player.activeCardsShown.length;
        for(var i = numOfCards - 1; i >= 0; i -= 1) {
            var x = deck.getCard(player.activeCardsShown[i]).checkRequirements();
            if(deck.getCard(player.activeCardsShown[i]).hiddenIfReqsFail && (!x)) {
                player.activeCardsShown.splice(i, 1);

            }
        }

        numOfCards = player.activeCardsShown.length;
        storyDisplay.innerHTML = player.displayText;

        //append the appropriate number of cards to choose from
        for (i = 0; i < numOfCards; i += 1) {
            cardField.appendChild(display[i]);
            display[i].innerHTML = `${deck.getCard(player.activeCardsShown[i]).cardText}<br>${deck.getCard(player.activeCardsShown[i]).requirementSentence()}`;
            //disable cards if requirements are not met
            if (deck.getCard(player.activeCardsShown[i]).checkRequirements()) {
                display[i].setAttribute('class', 'displayCard enabledCard');
            } else {
                display[i].setAttribute('class', 'displayCard disabledCard');
            }
        }
    }
};

//Initialize the board & set listeners for button pushes.
board.setBoard();


// // next sections are for testing only, from here...
// function findBody(thisFunc) {
//     return thisFunc.singularName === 'Body';
// }
// button1.innerHTML = stats.score.find(findBody).quantity;
//
// function findSirens(thisFunc) {
//     return thisFunc.singularName === 'Sirens';
// }
// button2.innerHTML = stats.score.find(findSirens).quantity;
//
// function findMinutes(thisFunc) {
//     return thisFunc.singularName === 'minute until The Medusa sinks';
// }
// button3.innerHTML = stats.score.find(findMinutes).quantity;
//
// function findBoat(thisFunc) {
//     return thisFunc.singularName === 'Medusa lifeboat success';
// }
//
// function findPug(thisFunc) {
//     return thisFunc.singularName === 'pug';
// }
// button4.innerHTML = stats.score.find(findPug).quantity + " " + stats.score.find(findPug).correctName(stats.score.find(findPug).quantity);
//...until here (testing)

/*
var deck = {
    card: [],

    setDeck() {
    this.card[1] = new MoveCard('?', ['Wake up'], [2]);
    this.card[2] = new MoveCard('The Medusa', ['Search for the Lantern'], [3]);
    this.card[3] = new StoryCard('A choatic cabin', ['Grab your belongings', 'Hurry to the door'], [4,5]);
    this.card[3].cardScript = function(){
        scoreData[100].quantity = 10;
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
};*/

//var deck = require('./cards.js');
//var cardDescription = require('./cards.js');
//var playerStatText = require('./scoreData.js');
//var successCards = require('./cards.js');
//var failCards = require('./cards.js');

//var PlayableCard = require('./cards.js');


//deck.setDeck();
