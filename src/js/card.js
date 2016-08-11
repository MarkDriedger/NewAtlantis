function Card(parameter) {
  this.parameter=parameter;
}
Card.prototype.print= function(){
  console.log(this.parameter);
}
module.exports = Card;
