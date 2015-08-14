// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(790, 400, Phaser.AUTO, 'game', stateActions);
var score = 0;
//score = 1
//score = 2
var labelScore;
var player;
var pipes = [];
var balloons = [];
var weight = [];
var pipeEndHeight = 25;
var pipeEndExtraWidth;
var gapSize = 100;
var gapMargin = 50;
var blockHeight = 50;
 /* Loads all resources for the game and gives them names.
 */
jQuery("#greeting-form").on("submit", function(event_details) {
    var greeting = "Hello";
    var name = jQuery("#fullName").val();
    var greeting_message = greeting + name;
    jQuery("#greeting-form").hide();
    $("#greeting").append("<p>"+ greeting_message + "</p>");
    event_details.preventDefault();
});
function preload() {
    game.load.image("playerImg" , "../assets/harrytransparent.gif");
    game.load.image("backgroundImg","../assets/quiddicthpitch.png");
    game.load.image("clicksprite","../assets/flappy_frog.png");
    game.load.audio("score", "../assets/point.ogg");
    game.load.image("pipe","../assets/pipe.png");
    game.load.image("pipeEnd","../assets/pipeEnd.png");
    game.load.image("balloons","../assets/balloons.png");
    game.load.image("weight","../assets/weight.png");


}

/*
 * Initialises the game. This function is only called once.
 */
function create() {
    game.stage.setBackgroundColor("#1919FF");
    game.add.image(0, 0, "backgroundImg");
    // set the background colour of the scene
    game.add.text(220, 75, "Croeso i gem",
        {font: "60px Calibri ", fill: "#000000"});
    player = game.add.sprite(250, 150, "playerImg");
    game.physics.arcade.enable(player);
    player.width = 75;
    player.height = 60;
    player.anchor.setTo(0.5, 0.5);

    game.input
        .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(spaceHandler);

    game.input
        .onDown
        .add(clickHandler);
    //alert(score);
    labelScore = game.add.text(20, 20, "0");
    //player = game.add.sprite(100,220, "playerImg")
    game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
        .onDown.add(moveRight);
    game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
        .onDown.add(moveLeft);
    game.input.keyboard.addKey(Phaser.Keyboard.UP)
        .onDown.add(moveUp);
    game.input.keyboard.addKey(Phaser.Keyboard.DOWN)
        .onDown.add(moveDown);
    generatePipe();
    game.physics.startSystem(Phaser.Physics.ARCADE);
   // game.physics.arcade.enable(player);
  //  player.body.velocity.x = 100;
    player.body.velocity.y = -25;
    player.body.gravity.y = 500;
    game.input.keyboard
        .addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(playerJump);
  var  pipeInterval = 1.75;
   game.time.events
        .loop(pipeInterval * Phaser.Timer.SECOND, generate);


}

function spaceHandler (event) {
    game.sound.play("score");


}
function clickHandler(event) {
//    alert("position is: " + event.x + "," + event.y);
    game.add.sprite(event.x, event.y, "clicksprite");

}
function changeScore() {
    score = score + 1;
    labelScore.setText(score.toString());
}
function moveRight () {
    player.x = player.x + 10;
    //alert("moveRight");
}

function moveLeft () {
    player.x = player.x - 10;
}

function moveUp () {
    player.y = player.y + 10;
}
function moveDown () {
    player.y = player.y - 10;
}
function generatePipe () {
       var gap = game.rnd.integerInRange(1, 5);
       for (var count=0; count<8; count++) {
           if(count != gap && count != gap+1) {
               addPipeBlock(750, count * 50);
           }

       }
    /*var gapStart = game.rnd.integerInRange(gapMargin, height - gapSize - gapMargin);
    for(var y=gapStart; y > 0 ; y -= blockHeight){
        addPipeBlock(width,y - blockHeight);
    }
    for(var y = gapStart + gapSize; y < height; y += blockHeight){
        addPipeBlock(width, y);
    }*/
    changeScore();


   }
function playerJump () {
    player.body.velocity.y = -200;
}

function addPipeBlock(x, y) {
    var pipeBlock = game.add.sprite(x,y,"pipe");
    pipes.push(pipeBlock);
    game.physics.arcade.enable(pipeBlock);
    pipeBlock.body.velocity.x = -200;
}
function changeGravity(g) {
    gameGravity += g;
    player.body.gravity.y = gameGravity;
}

function generateBalloons (){
    var bonus = game.add.sprite(20, 40, "balloons");
    balloons.push(bonus);
    game.physics.arcade.enable(bonus);
    bonus.body.velocity.x = -200;
    bonus.body.velocity.y = - game.rnd.integerInRange(60,100);
}
function generateWeight (){
    var bonus = game.add.sprite(20, 40, "weight");
    weight.push(bonus);
    game.physics.arcade.enable(bonus);
    bonus.body.velocity.x = - 200;
    bonus.body.velocity.y = - game.rnd.integerInRange(-60,-100);
}
function generate () {
    var diceRoll = game.rnd.integerInRange(1, 10);
    if(diceRoll==1) {
        generateBalloons();
    } else if(diceRoll==2) {
        generateWeight();
    } else {
        generatePipe();
    }
}
/* This function updates the scene. It is called for every new frame.
 */
function update() {
    for(var index=0; index<pipes.length; index++){
        game.physics.arcade
        .overlap(player,
        pipes[index],
        gameOver);
        player.rotation = Math.atan(player.body.velocity.y / 750);
if(player.body.y < 0 || player.body.y > 400){
    gameOver();
}
}
}

function gameOver() {
    $("score").val(score.toString());
    $("#greeting").show();
    game.destroy();
   // location.reload();
   // game.state.restart()
    gameGravity = 200;

}


