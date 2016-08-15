/*jshint browser: true, esversion: 6, devel: true */

/*
function Card(parameter) {
  this.parameter=parameter;
}
Card.prototype.print= function(){
  console.log(this.parameter);
}
module.exports = Card;
*/



//data for story text - move this to another file?
var cardDescription = [];

cardDescription[0] = 'N/A';
cardDescription[1] = 'You dream of darkness<br>You dream of the cold<br>You dream of screams<br>';
cardDescription[2] = 'You realize that you are not dreaming. You have woken up. The darkness, the cold, the screams - they are all real. In addition, gravity doesn’t seem to be working properly.<br><br>You can’t see anything in the pitch black, and it is hard to get your bearings in this commotion. But amidst the noise, you remember there was a lantern near your bunk.';
cardDescription[3] = 'You are surrounded by other lost souls wearing their nightclothes. The floor and all of the walls around you are crooked. Water is pooling up in the lowest corner of the room.<br><br>“We’re sinking! The ship is sinking!” Someone cries out. Perhaps it wasn’t wise to travel on a ship named the Medusa?<br><br>“Remain calm!” Orders a middle-aged man who thinks he has control over the situation. The deck and walls do not agree. They groan and tilt even more. Several of the bunks spring loose from the floor, and slide across the room. <br><br>There is only one door to this cabin. It is free of water. (for the time being)';
cardDescription[4] = 'You spend some time searching, but many of your belongings have been scattered around the room. There is too little light and too much chaos to find them. You are able to grab your jacket though, which contains a few useful possessions. You rush toward the door.';
cardDescription[5] = 'You head toward the door. Amidst all the chaos, that is easier said than done. A few bunks have toppled over and are blocking your path.';
cardDescription[6] = 'The door of the cabin is jammed shut. The tiny glimmer of light peeking through the cracks show that in some areas the frame is pulled away from the door, and in others, it is pressed tight. The ship’s tilting must be putting enormous strain on the walls. That is not a good sign.';
cardDescription[7] = '“My paintings! My paintings! Where are my masterpieces!” the man in the green nightgown yells, shoving past people to go backwards away from the door.';
cardDescription[8] = 'There are two children in the cabin with you - they really should be the ones to leave first.';
cardDescription[9] = 'The scene outside the ship’s cabin is one of panic. The remaining crewmembers are trying hard, but they aren’t succeeding in commanding the flailing mast. A large wave hits the ship and the mast sweeps into the mainsail, tearing through the fabric. Ominous creaking sounds are coming from somewhere - possibly everywhere.<br><br>You can see three lifeboats are already in the ocean, two of which are still upright. One more is not far from you, but it is very quickly filling up with people.';
cardDescription[10] = 'Anything that isn’t nailed down has gone overboard. Even some things that were nailed down have gone overboard. You really need to get to that lifeboat.';

cardDescription[11] = 'There are three men in crew uniforms and brandishing sabres, standing in front of the lifeboat. “The lifeboat is for children and the elderly only!” one yells. “The ship is leaning, but is remaining afloat! All others must remain on board to wait for help to come!”<br><br>There are no children or elderly nearby, and you see that many of the other boats are full of crewmembers. You suspect that these three are just waiting for some of their buddies and then they’ll be on the lifeboat too. How will you attempt to get on the boat?';
cardDescription[12] = 'The three crewmembers are not letting anyone on, even though there are no children or elderly trying to get on. The crewmembers are gesturing toward some of their buddies. Another sail tears loose as a strong wave hits the ship. The crewmembers start yelling at their buddies to get over to the lifeboat. It is clear that the lifeboat isn’t going to be around much longer - the ship may not be either. You really need to get onto that lifeboat.';
cardDescription[19] = 'One of the others yells “Andie! Let’s go!” A sailor (Andie perhaps?) leaps into the lifeboat beside you, and her crewmates start to untie the knots to release the lifeboat into the heaving ocean waves. The knots are wet from the storm, and one of the crewmembers begins to hack at the ropes with his sabre.<BR><BR>“No!” One of his buddies yells, but it is too late. The blade cuts through the rope, releasing only the front of the lifeboat, pitching you and all the other lifeboat passengers head over heels into the ocean.';
cardDescription[20] = 'You flounder, barely managing to get your head above water to take a gasp of air. You look up and see the lifeboat swinging precariously above you. It doesn’t come down gently though. Some commotion ensues on the deck of the ship, and a rope snaps. The bow of the lifeboat falls, and it does a nosedive into the ocean, drenching all who thought they had found relative safety. Screaming people are floundering all around, but you can barely hear them over the storm - and one other noise. You don’t know what the noise is coming from - the masts, the sails, or the hull of the Medusa itself, but something is about to come apart.';
cardDescription[21] = 'You flounder, barely managing to get your head above water to take a gasp of air. Screaming people are floundering all around, but you can barely hear them over the storm - and one other noise. You don’t know what the noise is coming from - the masts, the sails, or the hull of the Medusa itself, but something is about to come apart.';
cardDescription[22] = 'You see it coming. This storms waves are nothing compared to this one. It looms beyond the Medusa. Maybe it a trick of your imagination, but it almost seems to stand still and gather its strength before lightning lights up the sky and the wave begins its assault on the ship. The hull of the poor Medusa folds as if it were a paper ship designed to compactly fit inside of a bottle. The masts and sails slap the sea as if the ship is still trying to fight back. The wave engulfs you next, and when you come up for air again, there is no ship to be seen. You pull yourself up onto a piece of debris, and remember little else for the next several hours.';
cardDescription[16] = 'You dream of darkness again<br><br>You dream of the cold again<br><BR>You dream of screams again';
cardDescription[17] = 'You dream of the fins of undersea predators circling you in the water.<br><br>You dream of the slimy arms of an octopus, wrapping around your body, dragging you down.<br><br>You dream of a jaguar in the night bearing its teeth and leaning in to get a good smell of you.';


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



//module.exports = deck;
module.exports = cardDescription;
