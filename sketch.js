var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var cloud, cloud_image;
var score;
var obstacle, ob1, ob2, ob3, ob4, ob5, ob6;
var cloudGroup, obsGroup;
var PLAY = 1;
var END = 0;
var gameState = PLAY;
var gameOver,gameOver_img, reset, reset_img;
var checkpoint, die, jump;

function preload(){
  trex_running = loadAnimation("trex1.png","trex2.png","trex3.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground2.png");
  
cloud_image = loadImage("cloud.png");
  
ob1 = loadImage("obstacle1.png");
  
ob2 = loadImage("obstacle2.png");
  
ob3 = loadImage("obstacle3.png");
  
ob4 = loadImage("obstacle4.png");
  
ob5 = loadImage("obstacle5.png");
  
ob6 = loadImage("obstacle6.png");
  
gameOver_img = loadImage("gameOver.png");
  
reset_img = loadImage("restart.png");

checkPoint = loadSound("checkPoint.mp3");
  
die = loadSound("die.mp3");
  
jump = loadSound("jump.mp3");
}

function setup() 
{
  background(220)
  createCanvas(600,200)
  
  //create a trex sprite
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.scale = 0.6;
  
  //create a ground sprite
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -4;
  
  //creating invisible ground
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  

  
score=0;
  
gameOver = createSprite(300, 100);
gameOver.addImage("gameover", gameOver_img);
gameOver.scale = 0.5;
  
reset = createSprite(300, 150);
reset.addImage("restart", reset_img);
reset.scale = 0.5;
gameOver.visible = false;
reset.visible = false;
// creating groups
cloudGroup = new Group();
obsGroup = new Group();
  
trex.setCollider("rectangle", 0, 0, width/10, 100);
trex.debug = false;
}

function draw() {
//set background color
background("white");
  
if (gameState === PLAY)
{
// score after every 400 frames
score = score+(Math.round (getFrameRate()/60));
  
//Spawn Clouds
spawnClouds();
  
// spawn obstacles
spawnObstacles();
  
ground.velocityX = -(4+score/1000);
  
if (score%200 === 0 && score>0)
{
  checkPoint.play();
  //ground.velocityX = -6;
 // obsGroup.setVelocityXEach(-6);
}
  
// jump when the space key is pressed
if(keyDown("space")&& trex.y >= 150) 
{
    trex.velocityY = -13;
    jump.play();
}
  
trex.velocityY = trex.velocityY + 0.8
  
if (ground.x < 0)
{
  ground.x = ground.width/2;
}
  
// changing the gamestate
if(obsGroup.isTouching(trex))
  {
    gameState = END;
   
    die.play();
  }
}
else if(gameState === END)
  {
// stoppping the ground
ground.velocityX = 0;
    
// stopping the cloud and obstacles
cloudGroup.setVelocityXEach(0);
obsGroup.setVelocityXEach(0);
  
   
// setting lifetime
cloudGroup.setLifetimeEach(-1);
obsGroup.setLifetimeEach(-1);
    
gameOver.visible = true;
reset.visible = true; 
// trex collided
trex.addAnimation("running", trex_collided);
    

// resetting the game
if (mousePressedOver(reset))
{
  replay();
  
  
}
  }
  


fill("black");
text("Score:"+score, 530, 50);
  

  

  
//stop trex from falling down
trex.collide(invisibleGround);
  
drawSprites();
}

//function to spawn the clouds
function spawnClouds()
{
// making clouds appear at random positions
 if(frameCount % 150 === 0)
  {
 cloud = createSprite(500, 50, 40, 20);
 cloud.y = Math.round(random(30, 120));
 cloud.velocityX = -2;
 cloud.addImage("cloud.png", cloud_image);
 cloud.scale = 0.7;
 cloud.lifetime = 300;
 trex.depth = cloud.depth;
 trex.depth = trex.depth+1;
 cloudGroup.add(cloud);
  }
}

function spawnObstacles()
{
  if(frameCount % 150 === 0)
   {
obstacle = createSprite(500, 170, 40, 20);
obstacle.y = Math.round(random(170, 180));
obstacle.velocityX = -(4+score/1000);
obstacle.scale = 0.5;
obstacle.lifetime = 300;
var obs = Math.round(random(1, 6));
switch(obs){
case 1: obstacle.addImage("obj", ob1);
      break;
case 2: obstacle.addImage("obj", ob2);
      break;
case 3: obstacle.addImage("obj", ob3);
      break;      
case 4: obstacle.addImage("obj", ob4);
      break;
case 5: obstacle.addImage("obj", ob5);
      break;
case 6: obstacle.addImage("obj", ob6);
      break;
deafault: break;
}
obsGroup.add(obstacle);    
   }
}

function replay ()
{
   gameState = PLAY;
  obsGroup.destroyEach();  
  cloudGroup.destroyEach();
  trex.addAnimation("running", trex_running);
  gameOver.visible = false;
  reset.visible = false;
  score = 0;
}