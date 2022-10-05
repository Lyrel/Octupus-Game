/*
Dear tutor!

From extensions I have implementes sound effects:  
- when octupus collects heart
- when enemy catches octupus
- falls to canyon
- game over
- level complete
- background music

I have also added an enemy constructor 


Difficulties:
- the most difficult was to make objects move inside bounds (stars, bubbles); 
- I have also wanted to make a gradient background, but could not find suitable method for that. 

This was great module. I have learned a lot and really looking forward ITP 2 this fall. 

Thank you and all the best

Jelena Varyukhicheva
Student nr 210138700



Music credit t: https://www.chosic.com, https://www.bensound.com 



*/
var cnv;
var gameChar_x;
var gameChar_y;
var floorPos_y;
var scrollPos;
var scrollPos2;
var gameChar_world_x;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var inCanyon;

var trees_x;
var collectables;
var mountains;
var seamountains;
var canyons;
var clouds;

var game_score;
var lives;
var counter;
var flagpole;
var restartAvailable;
var level;

// variables for soundeffects
var collectSound;
var fallingSound;
var winSound;
var overSound;
var crabSound;
var backgroundMusic;
var avoidWinLoop;
var avoidOverloop;

var enemies;
var move;

var seaplant1;
var seaplant2;
var seaplant3;
var seaplant4;
var seaplant5;
var seaplant6;
var seaplant7;
var seaplant8;
var seaplant9;
var seaplant10;

var rock1;
var rock2;

var dino;

var lemon;
var bubble;

var octoColor;

const bubbleFloatSpeed = 0.3;
var shiftStar; 



// preload loads assets needed for the project to work
function preload() {
	
	// Sound files
	soundFormats("mp3", "wav");
	collectSound = loadSound("assets/sounds/bell.wav"); // bell sound for collectables
	collectSound.setVolume(0.1);
	fallingSound = loadSound("assets/sounds/fallingIntoCanyon.wav"); // sound for falling into canyon
	fallingSound.setVolume(0.1);
	winSound = loadSound("assets/sounds/win.wav"); // level complete/game won sound
	winSound.setVolume(0.1);
	overSound = loadSound("assets/sounds/over.wav"); // game over sound
	overSound.setVolume(0.1);
	crabSound = loadSound("assets/sounds/click.wav"); // game over sound
	crabSound.setVolume(0.1);
	backgroundMusic = loadSound("assets/sounds/bensound-cute.mp3"); // background music 
	backgroundMusic.setVolume(0.1);
   
	// Fonts
	lemon = loadFont('assets/fonts/LEMONMILK-Medium.otf');
	bubble = loadFont('assets/fonts/Bubblegum.ttf');

	// Images of plants
	seaplant1 = loadImage("assets/images/Plant1.png");
	seaplant2 = loadImage("assets/images/Plant2.png");
	seaplant3 = loadImage("assets/images/Plant3.png");
	seaplant4 = loadImage("assets/images/Plant4.png");
	seaplant5 = loadImage("assets/images/Plant5.png");
	seaplant6 = loadImage("assets/images/Plant6.png");
	seaplant7 = loadImage("assets/images/Plant7.png");
	seaplant8 = loadImage("assets/images/Plant8.png");
	seaplant9 = loadImage("assets/images/Plant9.png");
	seaplant10 = loadImage("assets/images/Plant10.png");
	
	//Images of rocks
	rock1 = loadImage("assets/images/rock1.png");
	rock2 = loadImage("assets/images/rock2.png");

	//Image of dinosaurus
	dino = loadImage("assets/images/dino.png");
};



function setup() {

	cnv = createCanvas(1024, 576);
	let newCanvasX=windowWidth/4;
	let newCanvasY=windowHeight/5
	cnv.position(newCanvasX, newCanvasY);
	floorPos_y = height * 3/4;
	lives = 3;
	level = 1;
	game_score = 0;
	//regulates color of the octupus
	octoColor = color(216, 35, 139); 
	shiftStar = 0.3; 

	startGame();
    backgroundMusic.play();
};


function draw() {
     
	// Fill  background
	background(100, 155, 255);
	noStroke();

	// Water from dark blue to light blue
	fill(6, 127, 201);
	rect(0, 0, width, 8*54); 

	fill(13, 140, 204);
	rect(0, 0, width, 6.8*54); 
	
	fill(19, 159, 214);
	rect(0, 0, width, 5.8*54); 
	
	fill(29, 172, 216);
	rect(0, 0, width, 5.2*54); 

	fill(40, 190, 224);
	rect(0, 0, width, 4.3*54); 

	fill(53, 204, 229);
	rect(0, 0, width, 3*54);

	fill(66, 218, 234);
	rect(0, 0, width, 1.2*54);

	fill(100, 235, 242);
	rect(0, 0, width, 24);

	//sand colors
	//light yellow part
	fill(249, 204, 103);
	rect(0, floorPos_y, width, height/4);

	//dark yellow part
	fill(229, 182, 96);
	rect(0, floorPos_y, width, height/14);


    
	//---- START of the slow background scroll ----

	push();
	translate(scrollPos2, 0); //scrolls

	//draws background fishes swimming from lef to right
	drawBGFishesRight();

	//draws mountains on the background 
	drawSeaMountain(); 
    pop();

	//---- END of the slow background scroll ----


	//----START of no-scroll area ----

    //draws reys of light
	drawLightRays();
	
	//----END of no-scroll area ----



    //----START of quick scrolling ----
	
	push();
    translate(scrollPos, 0); //scrolls

	// Draws bubble sources in multiple locations
	bubblecalls(); 

	// Makes bubbles float up
	bubblesUp();

	// Draws waves on the sand
	drawSandWave(); 

	// Draws shark
	drawShark(); 
	
	// Draws background fishes swimming from right to left
	drawBGFishesLeft();

    // Draws plants and rocks
	drawBGItems(plantsAndRocks);

	// Draws colorful fishes with dots
	drawFish();
    	
	// Regulates movement of all fishes (colorful, background fishes, sharks)
	swim();

    // Corrects characters position to the ground level 
	if((gameChar_y - floorPos_y) > 10) {
		  gameChar_y += 5;
	};
      
	// Draws the canyons
	for (var i = 0; i < canyons.length; i++) {
		drawCanyon(canyons[i]);
	};

	// Checks if character is over the canyon
	for (var i = 0; i < canyons.length; i++) {
		checkCanyon(canyons[i]);
	};

	// Draws collectables
	for (var i = 0; i < collectables.length; i++) {
		if(collectables[i].isFound == false) {
			drawCollectable(collectables[i]);
			checkCollectable(collectables[i]);		
		};
	}; 

    // Makes collectable float up and down
	moveCollectable();

	// Draws flag
	renderFlagpole (flagpole);

	// If flag has not been yet found, calls the function that checks if the character has reached the flagpole
	if (flagpole.isReached == false) {
		checkFlagpole();	
	};
	
	// Draws enemy from constructor
	for (var i =0; i< enemies.length; i++){
		enemies[i].draw();
		var isContact = enemies[i].checkContact(gameChar_world_x, gameChar_y);
		if(isContact){
			crabSound.play();
			if (lives > 0) {
				lives--;
				startGame();
				break;
			};
		};
	};

	pop(); 
    //---- END of quick scrolling ----


    // The function checks the y position of the character. It its below ground then, the character is dead. 
	checkPlayerDie();

	// DrawS game character.
	drawGameChar();


	// If jump and left arrow are pressed
	if (isFalling && isLeft && gameChar_y) {
		gameChar_y -= 4;
		gameChar_x -= 3;
		setTimeout(function(){isFalling = false;}, 0.5 * 1000);

	}; 

	// If jump and right arrow are pressed        
	if (isFalling && isRight && gameChar_y)  {
		gameChar_y -= 4;
		gameChar_x += 3;
		setTimeout(function(){isFalling = false;}, 0.5 * 1000);
	};

	 // Jump
	if (isFalling && gameChar_y) {
		gameChar_y -= 5;
	 };

	 // Grafity falling down
	if ((isFalling == false) && (gameChar_y < (floorPos_y))) {
	    gameChar_y += 2; 
	    isPlummeting = true; 
     };
	 
	 // Default front facingwhen character is on the ground
	 if (gameChar_y >= (floorPos_y)) { 
	    isPlummeting = false; 
     };


	// Update real position of gameChar for collision detection.
    	gameChar_world_x = gameChar_x - scrollPos;

    // Logic to make the game character move or the background scroll.
	if(isLeft)
	{
		if(gameChar_x > width * 0.5)
		{
			gameChar_x -= 5;
		}
		else
		{
			scrollPos += 5; //foreground scroll
			scrollPos2 += 0.5; //far background scroll
		};
	};

	if(isRight)
	{
		if(gameChar_x < width * 0.5)
		{
			gameChar_x  += 5;
		}
		else
		{
			scrollPos -= 5; // negative for moving against the background
			scrollPos2 -= 0.5; //far background scroll
		;}
	};	

	textSize(15);
	textFont(lemon);
	fill(3, 36, 94);
	text("Game score: " + game_score, width * 0.047, 35);
	text("Lives: " + lives, width * 0.05, 55);

	for(let i = lives; i > 0; i--) {
		fill(216, 43, 16);
		ellipse(115 + 20 * i, 50, 10, 10);
	};

	fill(3, 36, 94);
	text("Level: " + level, width * 0.05, 75);

};


// ---------------------
// Key control functions
// ---------------------

function keyPressed() {

// When left arrow is pressed
if (keyCode == 37) {
	isLeft = true;
	isPlummeting = false;		
}
// When right arrow is pressed
else if(keyCode == 39) {
	isRight = true;
	isPlummeting = false;
}

// Restart after level completed
else if ((keyCode == 32) && (restartAvailable)) {
	startGame();
	level++;
}

// Restart game when game is over and all lives are used
else if ((keyCode == 32) && (lives == 0)) {
	startGame();
	lives = 3;
	game_score = 0;
	level = 1;
}

 //When jump is pressed and character is on the groud 
else if ((keyCode == 32) && (gameChar_y >= (floorPos_y))) {
	isFalling = true;   
	return false; 
 };
};

function keyReleased() {

	// Left arrow released
	if (keyCode == 37) {
	isLeft = false;
	}
	// Right arrow released
	else if(keyCode == 39) {
	isRight = false;
	}
	// Jump/spacebar released
	else if (keyCode == 32) {
	isFalling = false;

    };
};


// ------------------------------
// Game character render function
// ------------------------------

// Function to draw the game character.

function drawGameChar() {

	// Draw game character
	if(isLeft && isFalling)
	{

	// ---------------------------
    // CHARACTER jumping left
    // ---------------------------	

	noFill();
	stroke(octoColor); //violet
	strokeCap(ROUND);
	strokeWeight(6);
	//large left tentackle
	bezier(
		gameChar_x - 10, gameChar_y - 30, 
		gameChar_x - 30, gameChar_y - 30, 
		gameChar_x - 28, gameChar_y - 25, 
		gameChar_x - 30, gameChar_y - 20);
	//large right tentackle
	bezier(
		gameChar_x + 10, gameChar_y - 30, 
		gameChar_x + 0, gameChar_y - 15, 
		gameChar_x + 20, gameChar_y, 
		gameChar_x + 30, gameChar_y -10);
	//small left tentackle
	bezier(
		gameChar_x - 5, gameChar_y - 30, 
		gameChar_x - 15, gameChar_y - 25, 
		gameChar_x - 20, gameChar_y - 20, 
		gameChar_x - 15, gameChar_y -10);
	//small right tentackle
	bezier(
		gameChar_x + 5, gameChar_y - 30, 
		gameChar_x - 10, gameChar_y - 15, 
		gameChar_x - 5, gameChar_y - 12, 
		gameChar_x + 5, gameChar_y - 5);
	
	//body of baby octupus
	strokeWeight(0.5);
	fill(octoColor); //violet
	ellipse(gameChar_x, gameChar_y - 40, 42, 40);
	
	//eyes whites
	noFill();
	fill(255, 255, 255); 
	stroke(0, 0, 0);
	ellipse(gameChar_x - 10, gameChar_y - 40, 15, 15);
	
	//eyes blacks
	fill(0, 0, 0); 
	ellipse(gameChar_x - 13, gameChar_y - 39, 8, 8);
	
	//eyes reflections 
	noStroke();
	fill(255, 255, 255);
	ellipse(gameChar_x - 12, gameChar_y - 40, 4, 4);

	}
	else if(isRight && isFalling)
	{
	// ---------------------------
    // CHARACTER jumping right
    // ---------------------------	

	noFill();
	stroke(octoColor); //violet
	strokeCap(ROUND);
	strokeWeight(6);
	//large left tentackle
	bezier(
		gameChar_x + 10, gameChar_y - 30, 
		gameChar_x + 20, gameChar_y - 30, 
		gameChar_x + 28, gameChar_y - 25, 
		gameChar_x + 30, gameChar_y - 20);
	//large right tentackle
	bezier(
		gameChar_x - 10, gameChar_y - 30, 
		gameChar_x + 0, gameChar_y - 15, 
		gameChar_x - 20, gameChar_y, 
		gameChar_x - 30, gameChar_y - 10);
	//small left tentackle
	bezier(
		gameChar_x + 5, gameChar_y - 30, 
		gameChar_x + 15, gameChar_y - 25, 
		gameChar_x + 20, gameChar_y - 20, 
		gameChar_x + 15, gameChar_y - 10);
	//small right tentackle
	bezier(
		gameChar_x - 5, gameChar_y - 30, 
		gameChar_x + 10, gameChar_y - 15, 
		gameChar_x + 5, gameChar_y - 12, 
		gameChar_x - 5, gameChar_y - 5);

    //body of baby octupus
	strokeWeight(0.5);
	fill(octoColor); //violet
	ellipse(gameChar_x, gameChar_y - 40, 42, 40);
	
	//eyes whites
	noFill();
	fill(255, 255, 255); 
	stroke(0, 0, 0);
	ellipse(gameChar_x + 10, gameChar_y - 40, 15, 15);
	
	//eyes blacks
	fill(0, 0, 0); 
	ellipse(gameChar_x + 13, gameChar_y - 39, 8, 8);
	
	//eyes reflections
	noStroke();
	fill(255, 255, 255); 
	ellipse(gameChar_x + 12, gameChar_y - 40, 4, 4);

	}
	else if(isLeft)
	{

	// ---------------------------
    // CHARACTER walking left
    // ---------------------------	
	
	noFill();
	stroke(octoColor); //violet
	strokeCap(ROUND);
	strokeWeight(6);
	//large left tentackle
	bezier(
		gameChar_x - 10, gameChar_y - 30, 
		gameChar_x - 10, gameChar_y - 15, 
		gameChar_x - 15, gameChar_y + 10, 
		gameChar_x - 10, gameChar_y);
	//large right tentackle
	bezier(
		gameChar_x + 10, gameChar_y - 30, 
		gameChar_x + 10, gameChar_y - 15, 
		gameChar_x + 25, gameChar_y + 10, 
		gameChar_x + 35, gameChar_y);
	//small left tentackle
	bezier(
		gameChar_x - 5, gameChar_y - 30, 
		gameChar_x + 0, gameChar_y - 15, 
		gameChar_x - 5, gameChar_y + 10, 
		gameChar_x + 0, gameChar_y);
	//small right tentackle
	bezier(
		gameChar_x + 5, gameChar_y - 30, 
		gameChar_x + 0, gameChar_y - 15, 
		gameChar_x + 10, gameChar_y + 10, 
		gameChar_x + 15, gameChar_y);
	
	//body of baby octupus
	strokeWeight(0.5);
	fill(octoColor); //violet
	ellipse(gameChar_x, gameChar_y - 40, 38, 40);
	
	//eyes whites
	noFill();
	fill(255, 255, 255); 
	stroke(0, 0, 0);
	ellipse(gameChar_x - 10, gameChar_y - 40, 15, 15);
	
	//eyes blacks
	fill(0, 0, 0); 
	ellipse(gameChar_x - 13, gameChar_y - 39, 8, 8);
	
	//eyes reflections 
	noStroke();
	fill(255, 255, 255);
	ellipse(gameChar_x - 12, gameChar_y - 40, 4, 4);


	}
	else if(isRight)
	{

	// ---------------------------
    // CHARACTER walking right
    // ---------------------------	

	noFill();
	stroke(octoColor); //violet
	strokeCap(ROUND);
	strokeWeight(6);
	//large left tentackle
	bezier(
		gameChar_x + 10, gameChar_y - 30, 
		gameChar_x + 10, gameChar_y - 15, 
		gameChar_x + 15, gameChar_y + 10, 
		gameChar_x + 10, gameChar_y);
	//large right tentackle
	bezier(
		gameChar_x - 10, gameChar_y - 30, 
		gameChar_x - 10, gameChar_y - 15, 
		gameChar_x - 25, gameChar_y + 10, 
		gameChar_x - 35, gameChar_y);
	//small left tentackle
	bezier(
		gameChar_x + 5, gameChar_y - 30, 
		gameChar_x + 0, gameChar_y - 15, 
		gameChar_x + 5, gameChar_y + 10, 
		gameChar_x + 0, gameChar_y);
	//small right tentackle
	bezier(
		gameChar_x - 5, gameChar_y - 30, 
		gameChar_x + 0, gameChar_y - 15, 
		gameChar_x - 10, gameChar_y + 10, 
		gameChar_x - 15, gameChar_y);
	
	//body of baby octupus
	strokeWeight(0.5)
	fill(octoColor); //violet
	ellipse(gameChar_x, gameChar_y - 40, 38, 40);
	
	//eyes whites
	noFill();
    fill(255, 255, 255); 
	stroke(0, 0, 0);
	ellipse(gameChar_x + 10, gameChar_y - 40, 15, 15);
	
	//eyes blacks
	fill(0, 0, 0); 
	ellipse(gameChar_x + 13, gameChar_y - 40, 8, 8);
	
	//eyes reflections
	noStroke();
	fill(255, 255, 255); 
	ellipse(gameChar_x + 12, gameChar_y - 40, 4, 4);
	
    }
	else if(isFalling || isPlummeting) 
	{
	
	// ---------------------------
    // CHARACTER jumping facing forward
    // ---------------------------	

	noFill();
	stroke(octoColor); //violet
	strokeCap(ROUND);
	strokeWeight(6);
	//large left tentackle
	bezier(
		gameChar_x - 10, gameChar_y - 30, 
		gameChar_x - 20, gameChar_y, 
		gameChar_x - 32, gameChar_y - 50, 
		gameChar_x - 40, gameChar_y - 20);
	//large right tentackle
	bezier(
		gameChar_x + 10, gameChar_y - 30, 
		gameChar_x + 20, gameChar_y, 
		gameChar_x + 32, gameChar_y - 50, 
		gameChar_x + 40, gameChar_y - 20);
	//small left tentackle
	bezier(
		gameChar_x - 5, gameChar_y - 30, 
		gameChar_x + 0, gameChar_y - 15, 
		gameChar_x - 28, gameChar_y + 10, 
		gameChar_x - 30, gameChar_y - 20);
	//small right tentackle
	bezier(
		gameChar_x + 5, gameChar_y - 30, 
		gameChar_x + 0, gameChar_y - 15, 
		gameChar_x + 28, gameChar_y + 10, 
		gameChar_x + 30, gameChar_y - 20);
	
	//body of baby octupus
	strokeWeight(0.5);
	fill(octoColor); //violet
	ellipse(gameChar_x, gameChar_y - 40, 43, 40);
	
	//eyes whites
	noFill();
    fill(255, 255, 255); 
	stroke(0, 0, 0);
	ellipse(gameChar_x - 9, gameChar_y - 40, 15, 15);
	ellipse(gameChar_x + 9, gameChar_y - 40, 15, 15);
	
	//eyes blacks
	fill(0, 0, 0); 
	ellipse(gameChar_x - 10, gameChar_y - 39, 8, 8);
	ellipse(gameChar_x + 10, gameChar_y - 39, 8, 8);
	
	//eyes reflections 
	noStroke();
	fill(255, 255, 255);
	ellipse(gameChar_x - 11, gameChar_y - 42, 4, 4);
	ellipse(gameChar_x + 9, gameChar_y - 42, 4, 4);

	}
	else
	{

	// ---------------------------
    // CHARACTER standing facing forward
    // ---------------------------
	noFill();
	stroke(octoColor); //violet 
	strokeCap(ROUND);
	strokeWeight(6);
	//large left tentackle
	bezier(
		gameChar_x -10, gameChar_y - 30, 
		gameChar_x -10, gameChar_y - 15, 
		gameChar_x -15, gameChar_y + 10, 
		gameChar_x -25, gameChar_y)
	//large right tentackle
	bezier(
		gameChar_x + 10, gameChar_y - 30, 
		gameChar_x + 10, gameChar_y - 15, 
		gameChar_x + 15, gameChar_y + 10, 
		gameChar_x + 25, gameChar_y)
	//small left tentackle
	bezier(
		gameChar_x - 5, gameChar_y - 30, 
		gameChar_x + 0, gameChar_y - 15, 
		gameChar_x - 5, gameChar_y + 10, 
		gameChar_x - 8, gameChar_y)
	//small right tentackle
	bezier(
		gameChar_x + 5, gameChar_y - 30, 
		gameChar_x + 0, gameChar_y - 15, 
		gameChar_x + 5, gameChar_y + 10, 
		gameChar_x + 8, gameChar_y)
	
	//body of baby octupus
	strokeWeight(0.5);
	fill(octoColor);   //violet
	ellipse(gameChar_x, gameChar_y - 40, 43, 40);
	
	//eyes whites
	noFill();
    fill(255, 255, 255); 
	stroke(0, 0, 0);
	ellipse(gameChar_x - 9, gameChar_y - 40, 15, 15);
	ellipse(gameChar_x + 9, gameChar_y - 40, 15, 15);
	
	//eyes blacks
	fill(0, 0, 0); 
	ellipse(gameChar_x - 10, gameChar_y - 39, 8, 8);
	ellipse(gameChar_x + 10, gameChar_y - 39, 8, 8);
	
	//eyes reflections
	noStroke();
	fill(255, 255, 255); 
	ellipse(gameChar_x - 11, gameChar_y - 42, 4, 4);
	ellipse(gameChar_x + 9, gameChar_y - 42, 4, 4);
	 };

	 noStroke();
};

// ---------------------------
// Background render functions
// ---------------------------

// Draws mountains on the background
function drawSeaMountain(){

	for (var i = 0; i < seamountains.length; i++) {
		
		fill(13, 145, 200);
		beginShape();
			vertex(seamountains[i].x + 20, floorPos_y);
			vertex(seamountains[i].x + 100, floorPos_y - 150);
			vertex(seamountains[i].x + 150, floorPos_y - 110);
			vertex(seamountains[i].x + 180, floorPos_y - 200);
			vertex(seamountains[i].x + 260, floorPos_y - 270);
			vertex(seamountains[i].x + 320, floorPos_y - 200);
			vertex(seamountains[i].x + 350, floorPos_y - 110);
			vertex(seamountains[i].x + 400, floorPos_y - 130);
			vertex(seamountains[i].x + 450, floorPos_y - 220);
			vertex(seamountains[i].x + 490, floorPos_y - 250);
			vertex(seamountains[i].x + 540, floorPos_y - 150);
			vertex(seamountains[i].x + 570, floorPos_y - 50);
			vertex(seamountains[i].x + 640, floorPos_y);
		endShape();

	};
 };


 // Draws wave on sand background
 function drawSandWave() {

	for (var i = 0; i < wave.length; i++) {
	
		fill(229, 182, 96);
		bezier(
			wave[i].pos_x, floorPos_y + 5, 
			wave[i].pos_x + 400, floorPos_y - 35, 
			wave[i].pos_x + 500, floorPos_y - 35, 
			wave[i].pos_x + 770, floorPos_y + 5);

		fill(249, 204, 103);
		stroke(249, 217, 103);
		strokeWeight(1);
		bezier(
			wave[i].pos_x, floorPos_y + 45, 
			wave[i].pos_x + 120, floorPos_y + 15, 
			wave[i].pos_x + 200, floorPos_y + 15, 
			wave[i].pos_x + 350, floorPos_y + 45);
		bezier(
			wave[i].pos_x + 330, floorPos_y + 45, 
			wave[i].pos_x + 400, floorPos_y + 15, 
			wave[i].pos_x + 500, floorPos_y + 15, 
			wave[i].pos_x + 800, floorPos_y + 45);
		noStroke();	
		};
	};

// Draws reys of light
function drawLightRays() {

	fill(100, 235, 242, 30); 
	quad(420, 0, -40, floorPos_y, 75, floorPos_y, 460, 0);
	quad(470, 0, 120, floorPos_y, 300, floorPos_y, 490, 0);
	quad(500, 0, 340, floorPos_y, 470, floorPos_y, 510, 0);
	quad(520, 0, 490, floorPos_y, 620, floorPos_y, 530, 0);
	quad(540, 0, 670, floorPos_y, 750, floorPos_y, 560, 0);
	quad(570, 0, 790, floorPos_y, 980, floorPos_y, 590, 0);
};


// Draws seaplants and rocks 
function drawBGItems(array) {

	for(var i = 0; i < array.length; i++) {
		image(array[i].item, array[i].pos_x, floorPos_y + array[i].pos_y);

	  };
};

// Draws bubbles 
function drawBubbles(pos) {

	for(var i =0; i < bubbles.length; i++) {
		noFill();
		stroke(255, 255, 255, 100);
		strokeWeight(1);
		circle(bubbles[i].pos_x + pos, bubbles[i].pos_y, bubbles[i].size + 1, bubbles[i].size + 1);
		noStroke();
	};
};


// Makes bubbles move up and from left to right
function bubblesUp() {

	for(var i = 0; i < bubbles.length; i++){
	
		let x = bubbles[i].x;
	    bubbles[i].pos_x += bubbles[i].shift;
		bubbles[i].size +=0.02;
		
		// Bubble moving up
		bubbles[i].pos_y -= 1;

		// Left-right wiggle of bubbles
		if(bubbles[i].pos_x >= x + 5) {
			bubbles[i].shift = -bubbles[i].shift;
		} else if (bubbles[i].pos_x < x) {
			bubbles[i].shift = bubbleFloatSpeed;
	    };

        // Restart bubbles, when they reach offscreen
		if(bubbles[i].pos_y < 0) {
			bubbles[i].pos_y = floorPos_y;
			bubbles[i].size = 0;
		};
     };
 };

 // Draws bubble sources
 function bubblecalls() {

	for(var i = 0; i < bubbleCalls.length; i++){
		drawBubbles(bubbleCalls[i]);

	};
};

 // Draws blue fishes on the background swimming left
function drawBGFishesLeft() {

	 for (var i = 0; i < bgFishesLeft.length; i++) {
	
		fill(13, 140, 204);
		bezier(
			bgFishesLeft[i].pos_x + 10, bgFishesLeft[i].pos_y + 10, 
			bgFishesLeft[i].pos_x + 15, bgFishesLeft[i].pos_y, 
			bgFishesLeft[i].pos_x + 30, bgFishesLeft[i].pos_y, 
			bgFishesLeft[i].pos_x + 40, bgFishesLeft[i].pos_y + 10);
		bezier(
			bgFishesLeft[i].pos_x + 10, bgFishesLeft[i].pos_y + 10, 
			bgFishesLeft[i].pos_x + 15, bgFishesLeft[i].pos_y + 17, 
			bgFishesLeft[i].pos_x + 30, bgFishesLeft[i].pos_y + 17, 
			bgFishesLeft[i].pos_x + 40, bgFishesLeft[i].pos_y + 10);
			
		beginShape();
		vertex(bgFishesLeft[i].pos_x + 30, bgFishesLeft[i].pos_y + 10);
		vertex(bgFishesLeft[i].pos_x + 50, bgFishesLeft[i].pos_y + 3);
		vertex(bgFishesLeft[i].pos_x + 40, bgFishesLeft[i].pos_y + 10);
		vertex(bgFishesLeft[i].pos_x + 45, bgFishesLeft[i].pos_y + 15);
		vertex(bgFishesLeft[i].pos_x + 30, bgFishesLeft[i].pos_y + 10);
		endShape();

	 };
 };


// Blue fishes on the background swimming right
function drawBGFishesRight() {

	for (var i = 0; i < bgFishesRight.length; i++) {
	 
		fill(29, 182, 225);
	   bezier(
		   bgFishesRight[i].pos_x + 40, bgFishesRight[i].pos_y + 10, 
		   bgFishesRight[i].pos_x + 30, bgFishesRight[i].pos_y, 
		   bgFishesRight[i].pos_x + 15, bgFishesRight[i].pos_y, 
		   bgFishesRight[i].pos_x + 10, bgFishesRight[i].pos_y + 10);
	   bezier(
		   bgFishesRight[i].pos_x + 40, bgFishesRight[i].pos_y + 10, 
		   bgFishesRight[i].pos_x + 30, bgFishesRight[i].pos_y + 17, 
		   bgFishesRight[i].pos_x + 15, bgFishesRight[i].pos_y + 17, 
		   bgFishesRight[i].pos_x + 10, bgFishesRight[i].pos_y + 10);
		   
	   beginShape();
	   vertex(bgFishesRight[i].pos_x + 20, bgFishesRight[i].pos_y + 10);
	   vertex(bgFishesRight[i].pos_x, bgFishesRight[i].pos_y + 3);
	   vertex(bgFishesRight[i].pos_x + 10, bgFishesRight[i].pos_y + 10);
	   vertex(bgFishesRight[i].pos_x + 5, bgFishesRight[i].pos_y + 15);
	   vertex(bgFishesRight[i].pos_x + 20, bgFishesRight[i].pos_y + 10);
	   endShape();

	};
};

function drawFish() {
	for(var i =0; i< fishes.length; i++) {
		//fish fins
		fill(fishes[i].color1);
		
		bezier(
			fishes[i].pos_x - 10, fishes[i].pos_y + 68,
			fishes[i].pos_x - 13, fishes[i].pos_y + 49,
			fishes[i].pos_x - 35, fishes[i].pos_y + 54, 
			fishes[i].pos_x - 45, fishes[i].pos_y + 84);
		bezier(
			fishes[i].pos_x - 12, fishes[i].pos_y + 90,
			fishes[i].pos_x - 16, fishes[i].pos_y + 105,
			fishes[i].pos_x - 33, fishes[i].pos_y + 100, 
			fishes[i].pos_x - 36, fishes[i].pos_y + 90);	
		bezier(
			fishes[i].pos_x - 40, fishes[i].pos_y + 65,
			fishes[i].pos_x - 80, fishes[i].pos_y + 75,
			fishes[i].pos_x - 80, fishes[i].pos_y + 85, 
			fishes[i].pos_x - 40, fishes[i].pos_y + 95);	

		//fish body
		fill(fishes[i].color2);
		
		bezier(
			fishes[i].pos_x, fishes[i].pos_y + 80,
			fishes[i].pos_x, fishes[i].pos_y + 60,
			fishes[i].pos_x - 40, fishes[i].pos_y + 66, 
			fishes[i].pos_x - 60, fishes[i].pos_y + 80);

		bezier(
			fishes[i].pos_x, fishes[i].pos_y + 80,
			fishes[i].pos_x, fishes[i].pos_y + 100,
			fishes[i].pos_x - 40, fishes[i].pos_y + 96, 
			fishes[i].pos_x - 60, fishes[i].pos_y + 80);
		
		//fish head		
		fill(fishes[i].color1); 

		bezier(
			fishes[i].pos_x - 10, fishes[i].pos_y + 64,
			fishes[i].pos_x + 20, fishes[i].pos_y + 75,
			fishes[i].pos_x + 20, fishes[i].pos_y + 85, 
			fishes[i].pos_x - 10, fishes[i].pos_y + 93);
		
		//eyes	
		fill(255);
		
		ellipse(fishes[i].pos_x, fishes[i].pos_y + 75, 10, 10)
		fill(0);
		ellipse(fishes[i].pos_x + 2, fishes[i].pos_y + 75, 7, 7)
		fill(255);
		ellipse(fishes[i].pos_x + 1, fishes[i].pos_y + 75, 3, 3)
		
		//dots on fish body
		fill(fishes[i].color3); 
		
		ellipse(fishes[i].pos_x - 20, fishes[i].pos_y + 75, 7, 7);
		ellipse(fishes[i].pos_x - 30, fishes[i].pos_y + 85, 6, 6);
		ellipse(fishes[i].pos_x - 45, fishes[i].pos_y + 80, 5, 5);
		ellipse(fishes[i].pos_x - 35, fishes[i].pos_y + 75, 5, 5);
		ellipse(fishes[i].pos_x - 17, fishes[i].pos_y + 85, 5, 5);
	};
};


// Draws shark
function drawShark() {

	for (var i = 0; i < sharks.length; i++) {
		fill(29, 172, 216);
		beginShape();
		 //upper body
		bezier (
			sharks[i].pos_x, sharks[i].pos_y + 110, 
			sharks[i].pos_x + 70, sharks[i].pos_y + 80, 
			sharks[i].pos_x + 110, sharks[i].pos_y + 80, 
			sharks[i].pos_x + 200, sharks[i].pos_y + 100);
		//lower body
		bezier (
			sharks[i].pos_x, sharks[i].pos_y + 110, 
			sharks[i].pos_x + 15, sharks[i].pos_y + 130, 
			sharks[i].pos_x + 110, sharks[i].pos_y + 135, 
			sharks[i].pos_x + 200, sharks[i].pos_y + 99); 
		//first lower fin	
		bezier (
			sharks[i].pos_x + 50, sharks[i].pos_y + 150, 
			sharks[i].pos_x + 20, sharks[i].pos_y + 98, 
			sharks[i].pos_x + 80, sharks[i].pos_y + 80, 
			sharks[i].pos_x + 90, sharks[i].pos_y + 60); 
		//upper fin
		bezier (
			sharks[i].pos_x + 90, sharks[i].pos_y + 60, 
			sharks[i].pos_x + 80, sharks[i].pos_y + 100, 
			sharks[i].pos_x + 140, sharks[i].pos_y + 100, 
			sharks[i].pos_x + 50, sharks[i].pos_y + 100); 
		//tail up
		bezier (
			sharks[i].pos_x + 150, sharks[i].pos_y + 110, 
			sharks[i].pos_x + 240, sharks[i].pos_y + 60, 
			sharks[i].pos_x + 250, sharks[i].pos_y + 50, 
			sharks[i].pos_x + 200, sharks[i].pos_y + 100); 
		//tail bottom
		bezier (
			sharks[i].pos_x + 150, sharks[i].pos_y + 110, 
			sharks[i].pos_x + 200, sharks[i].pos_y + 90, 
			sharks[i].pos_x + 210, sharks[i].pos_y + 150, 
			sharks[i].pos_x + 200, sharks[i].pos_y + 100); 
		//second lower fin
		bezier (
			sharks[i].pos_x + 50, sharks[i].pos_y + 100, 
			sharks[i].pos_x + 140, sharks[i].pos_y + 140, 
			sharks[i].pos_x + 120, sharks[i].pos_y + 180, 
			sharks[i].pos_x + 120, sharks[i].pos_y + 100);
	    //third lower fin
		bezier (
			sharks[i].pos_x + 100, sharks[i].pos_y + 100, 
			sharks[i].pos_x + 210, sharks[i].pos_y + 137, 
			sharks[i].pos_x + 160, sharks[i].pos_y + 150, 
			sharks[i].pos_x + 160, sharks[i].pos_y + 100);  
		endShape();
	};
 };

// Function makes fishes swim
function swim() {

	// Small dotted fishes swim left
	for(var i = 0; i< fishes.length; i++){

		fishes[i].pos_x += fishes[i].speed;
		
		if(fishes[i].pos_x > (flagpole.pos_x + 200)) {
			fishes[i].pos_x = -50;
		};
	};


	// Background fishes swim left
	for(var i = 0; i < bgFishesLeft.length; i++) {
		
		bgFishesLeft[i].pos_x -=0.4;
		
		if(bgFishesLeft[i].pos_x < -140) {
			bgFishesLeft[i].pos_x = 3600;
		};
	};

	// Background fishes swim right
	for(var i = 0; i < bgFishesRight.length; i++) {
		
		bgFishesRight[i].pos_x +=0.4;
		
		if(bgFishesLeft[i].pos_x > 3600) {
			bgFishesLeft[i].pos_x = -140;
    	};	
	};

	// Sharks swim left
	for(var i = 0; i < sharks.length; i++){
		
		sharks[i].pos_x -= 0.2;
		
		if(sharks[i].pos_x < -200) {
			sharks[i].pos_x = 3600;
		};
	};
};

// ---------------------------------
// Canyon render and check functions
// ---------------------------------

// Function draws canyon objects.
function drawCanyon(t_canyon) {

	fill(60, 36, 21); // brown
	rect (t_canyon.pos_x, floorPos_y, t_canyon.width, t_canyon.depth);

};

// checkCanoyon checks if a character is over a canyon.
// t_canyon - canyon[i] object from array of canyons.  
// the function checks for every canyon in the array of canyons if the characters x position is within inside bounds of t.canyon. 
// if the character's position is within width  +/- 10% of the canyon, then function fallingDownTheCanyon(t_canyon) is called.
function checkCanyon(t_canyon) {

	if((gameChar_world_x >= (t_canyon.pos_x + t_canyon.width * 0.1)) && (gameChar_world_x < (t_canyon.pos_x + t_canyon.width * 0.9))){
		inCanyon = true;
		fallingDownTheCanyon(t_canyon);
	  } else {
	    inCanyon = false;	
	
	};
};

// The character falls into the canyon if he is within canyon bounds and not in the air
function fallingDownTheCanyon(t_canyon) {

	if ((inCanyon) && (gameChar_y <= (floorPos_y + t_canyon.depth))){		
			gameChar_y += 5; 
			isPlummeting = true; 
			inCanyon = true;
	
	};	
};


// ----------------------------------
// Collectable items render and check functions
// ----------------------------------

// Function to draw collectable objects.

function drawCollectable(star) {

    fill(252, 200, 32); // light yellow
	beginShape();
	vertex(star.pos_x + 81, star.pos_y + 7);
	vertex(star.pos_x + 89, star.pos_y + 22);
	vertex(star.pos_x + 105, star.pos_y + 23);
	vertex(star.pos_x + 94, star.pos_y + 35);
	vertex(star.pos_x + 98, star.pos_y + 52);
	vertex(star.pos_x + 83, star.pos_y + 45);
	vertex(star.pos_x + 69, star.pos_y + 53);
	vertex(star.pos_x + 71, star.pos_y + 36);
	vertex(star.pos_x + 58, star.pos_y + 25);
	vertex(star.pos_x + 74, star.pos_y + 23);
	endShape();

	fill(249, 166, 33); // dark yellow
	triangle(
		star.pos_x + 81, star.pos_y + 7, 
		star.pos_x + 89, star.pos_y + 22, 
		star.pos_x + 82, star.pos_y + 30);
	triangle(
		star.pos_x + 105, star.pos_y + 23, 
		star.pos_x + 94, star.pos_y + 35, 
		star.pos_x + 82, star.pos_y + 30);
	triangle(
		star.pos_x + 98, star.pos_y + 52, 
		star.pos_x + 83, star.pos_y + 45, 
		star.pos_x + 82, star.pos_y + 30);
	triangle(
		star.pos_x + 69, star.pos_y + 53, 
		star.pos_x + 71, star.pos_y + 36, 
		star.pos_x + 82, star.pos_y + 30);
	triangle(
		star.pos_x + 58, star.pos_y + 25, 
		star.pos_x + 74, star.pos_y + 23, 
		star.pos_x + 82, star.pos_y + 30);
};


// Function to check character has collected an item.
function checkCollectable(star) {

	let distance = dist(star.pos_x + 80, star.pos_y + 60, gameChar_world_x, gameChar_y);
	if (distance <=40) {
		star.isFound = true;
		collectSound.play();
		game_score += 1
		console.log(game_score);

		// After 10 seconds the isFoundproperty is changed to false, so the collectable item appears again
		setTimeout(function(){star.isFound = false;}, 10 * 1000)
	
	};

  return star;
};

// Function makes collectable move
function moveCollectable() {

	for (var i = 0; i < collectables.length; i++) {

		 collectables[i].pos_y += shiftStar;

		 console.log(floorPos_y + 50, floorPos_y - 150);
		 console.log(collectables[i].pos_y);

		if(collectables[i].pos_y >= (floorPos_y - 120)) {
			shiftStar = -0.3;

		} else if (collectables[i].pos_y < (floorPos_y - 200)) {
			shiftStar = 0.3;
	    };
	 };
 };


// ----------------------------------
// CFlagpole render and check functions
// ----------------------------------

// Function to draw flagpole objects.
function renderFlagpole (flag) {

	if (flag.isReached) {
		// Condition prevents musinc from restarting
		if(!winSound.isPlaying()&& !avoidWinLoop) {
			avoidWinLoop = true;
			winSound.play();
		}
		restartAvailable = true;
		backgroundMusic.stop();
	
		// Flag
		fill(241, 116, 39); 
		rect(flag.pos_x, floorPos_y - 120, 60, 20);
		// flagpost
		fill(96, 50, 27); 
		rect(flag.pos_x, floorPos_y - 120, 10, 120);
		
		// Text in the middle of the screen
		stroke(247, 172, 6)
		strokeWeight(10)
		textFont(bubble);
		textSize(80);
		fill(198, 46, 40)
		text("LEVEL COMPLETE", flag.pos_x - 500, height/2);
		fill(247, 172, 6);
        rect(flag.pos_x - 350, height/2 + 20, 325, 25)
		textSize(20);
		textFont(lemon);
		fill(0)
		strokeWeight(4)
		text("Press space to continue", flag.pos_x - 330, height/2 + 40);

	} else {
		
		// Flag
		fill(252, 189, 36); 
		rect(flag.pos_x, floorPos_y - 20, 60, 20)
		
		//Flagpost
		fill(96, 50, 27);
		rect(flag.pos_x, floorPos_y - 120, 10, 120);
	}
}

// The function check the distance between game character and the flagpole. If the distance is less than 20px then frlagpole is reached
function checkFlagpole() {

	var d = abs(flagpole.pos_x - gameChar_world_x);
	if (d < 20) {
		flagpole.isReached = true;
 	};
};

// Function checks player position. If player has fallen into canyon, then he is declared dead. 
// The function then checks the number of remaining lives. If >=1, then number of lives decreased 
// by one and game restarts, otherwise the death is final and game is finished.  
function checkPlayerDie() {

	if (gameChar_y > 460) {
		fallingSound.play();	
	};

	if((gameChar_y > 575) && (lives > 0)){
		startGame();
		lives--;

	} else if (lives == 0) {
		
		stroke(247, 172, 6)
		strokeWeight(10)
		textFont(bubble);
		textSize(80);
		fill(198, 46, 40)
		text("GAME OVER", width * 0.35, height/3);

		fill(247, 172, 6);
        rect(width*0.4, height/2 - 20, 325, 25)
		textSize(20);
		textFont(lemon);
		fill(0)
		strokeWeight(4)
		text("Press space to continue", width * 0.42, height/2)
		gameChar_y = 700;
		fallingSound.stop();
		
		// Condition prevents music from restarting until it is finished playing
		if(!overSound.isPlaying() && !avoidOverloop) {
			avoidOverloop = true;
			overSound.play();
		};

		backgroundMusic.stop();
	};
};

function startGame() {

	gameChar_x = width/2;
	gameChar_y = floorPos_y;

	// Variable to control the background scrolling.
	scrollPos = 0;
	scrollPos2 = 0;

	// Variable to store the real position of the gameChar in the game world. 
	// Needed for collision detection.
	gameChar_world_x = gameChar_x - scrollPos;

	// Boolean variables to control the movement of the game character. All set to default values.
	isLeft = false;
	isRight = false;
	isFalling = false;
	isPlummeting = false;
	inCanyon = false;

	// Variables to stop music from repeating
	avoidWinLoop = false;
    avoidOverloop = false;

	// Bubbles x: must be equal to pos_x, x is needed for calculating x axis movements of rizing bubble  
	bubbles= [
		{pos_x: 200, pos_y: floorPos_y, x: 50, shift: bubbleFloatSpeed, size: 1}, 
		{pos_x: 201, pos_y: floorPos_y + 50, x: 100, shift: bubbleFloatSpeed, size: 1}, 
		{pos_x: 200, pos_y: floorPos_y + 120, x: 150, shift: bubbleFloatSpeed, size: 1}, 
		{pos_x: 201, pos_y: floorPos_y + 145, x: 200, shift: bubbleFloatSpeed, size: 1}, 
		{pos_x: 199, pos_y: floorPos_y + 200, x: 250, shift: bubbleFloatSpeed, size: 1}
	]; 


    // Coordinates where bubble sources are created
	bubbleCalls = [0, 200, 500, 1300, 1700, 2000, 2700, 3100];

	canyons = [
		{pos_x: 1080, width: 150, depth: 300},
		{pos_x: 1930, width: 150, depth: 300},
		{pos_x: 3200, width: 150, depth: 300}
	];

	// Coordinates of background mountains
	seamountains = [
		{x: -100},
		{x: 100}, 
		{x: 600},
		{x: 900},
		{x: 1400},
		{x: 1600},
		{x: 1900},
		{x: 1990},
		{x: 2000}
	];

	// Fishes with dots
	fishes = [
		{pos_x: 0, pos_y: 10, speed: 0.83, color1: color(238, 65, 108), color2: color(252, 200, 80), color3: color(216, 43, 61)}, 
		{pos_x: -100, pos_y: 110, speed: 0.49, color1: color(171, 73, 158), color2: color(241, 87, 106), color3: color(255, 196, 26)},
		{pos_x: 60, pos_y: 50, speed: 0.75, color1: color(201, 220, 45), color2: color(243, 69, 46), color3: color(252, 200, 32)},
		{pos_x: 190, pos_y: 120, speed: 0.95, color1: color(216, 43, 61), color2: color(171, 73, 168), color3: color(252, 200, 32)}, 
		{pos_x: 250, pos_y: 160, speed: 0.32, color1: color(241, 87, 106), color2: color(252, 200, 80), color3: color(201, 20, 45)},
		{pos_x: 1200, pos_y: 180, speed: 0.48, color1: color(238, 65, 108), color2: color(252, 200, 80), color3: color(216, 43, 61)}, 
		{pos_x: 1400, pos_y: 70, speed: 0.53, color1: color(171, 73, 158), color2: color(241, 87, 106), color3: color(255, 196, 26)},
		{pos_x: 1490, pos_y: 90, speed: 0.72, color1: color(201, 220, 45), color2: color(243, 69, 46), color3: color(252, 200, 32)},
		{pos_x: 1850, pos_y: 110, speed: 0.98, color1: color(216, 43, 61), color2: color(171, 73, 168), color3: color(252, 200, 32)}, 
		{pos_x: 1990, pos_y: 170, speed: 0.35, color1: color(241, 87, 106), color2: color(252, 200, 80), color3: color(201, 20, 45)},
		{pos_x: 2200, pos_y: 50, speed: 0.75, color1: color(201, 220, 45), color2: color(243, 69, 46), color3: color(252, 200, 32)},
		{pos_x: 2500, pos_y: 120, speed: 0.95, color1: color(216, 43, 61), color2: color(171, 73, 168), color3: color(252, 200, 32)}, 
		{pos_x: 2900, pos_y: 160, speed: 0.32, color1: color(241, 87, 106), color2: color(252, 200, 80), color3: color(201, 20, 45)},
		{pos_x: 2950, pos_y: 180, speed: 0.48, color1: color(238, 65, 108), color2: color(252, 200, 80), color3: color(216, 43, 61)} 
	];

	// Background fishes from right to left
	bgFishesLeft = [
		{pos_x: 300, pos_y: 170},
		{pos_x: 370, pos_y: 200},
		{pos_x: 320, pos_y: 285},
		{pos_x: 395, pos_y: 180},
		{pos_x: 355, pos_y: 170},
		{pos_x: 455, pos_y: 270},
		{pos_x: 1600, pos_y: 170},
		{pos_x: 1750, pos_y: 200},
		{pos_x: 1870, pos_y: 285},
		{pos_x: 1850, pos_y: 180},
		{pos_x: 1900, pos_y: 170},
		{pos_x: 2000, pos_y: 270},
		{pos_x: 3100, pos_y: 170},
		{pos_x: 3260, pos_y: 200},
		{pos_x: 3100, pos_y: 285},
		{pos_x: 3200, pos_y: 180},
		{pos_x: 3690, pos_y: 170},
		{pos_x: 3600, pos_y: 270},
	];

	// Background fishes from left to right
	bgFishesRight = [
		{pos_x: 0, pos_y: 100},
		{pos_x: 70, pos_y: 130},
		{pos_x: 20, pos_y: 115},
		{pos_x: 95, pos_y: 100},
		{pos_x: 55, pos_y: 90},
		{pos_x: 155, pos_y: 110},
		{pos_x: -500, pos_y: 60},
		{pos_x: -430, pos_y: 90},
		{pos_x: -480, pos_y: 110},
		{pos_x: -415, pos_y: 80},
		{pos_x: -445, pos_y: 130},
		{pos_x: -540, pos_y: 70},
		{pos_x: -900, pos_y: 115},
		{pos_x: -970, pos_y: 100},
		{pos_x: -1200, pos_y: 90},
		{pos_x: -700, pos_y: 110},
		{pos_x: -850, pos_y: 60},
		{pos_x: -910, pos_y: 90},
	];

	// Shark appearing coordinates
	sharks = [
		{pos_x: 300, pos_y: 20}, 
		{pos_x: 1700, pos_y: 10}, 
		{pos_x: 2500, pos_y: 70}
	];

	// Sand background coordinates
	wave = [
		{pos_x: -200},
		{pos_x: 300},
		{pos_x: 1200},
		{pos_x: 2050},
		{pos_x: 2350}
	];

    // Coordinates of plants and rocks
    plantsAndRocks = [
		{item: rock1, pos_x: -100, pos_y: -280},
		{item: rock1, pos_x: 1350, pos_y: -275},
		{item: rock1, pos_x: 3450, pos_y: -270},
		{item: seaplant10, pos_x: 10, pos_y: - 200},
		{item: seaplant10, pos_x: 1250, pos_y: - 140},
		{item: seaplant10, pos_x: 2100, pos_y: - 130},
		{item: seaplant9, pos_x: 80, pos_y: - 220},
		{item: seaplant9, pos_x: 1400, pos_y: - 200},
		{item: seaplant9, pos_x: 2300, pos_y: - 200},
		{item: seaplant9, pos_x: 2850, pos_y: - 200},
		{item: seaplant7, pos_x: 540, pos_y: - 150},
		{item: seaplant7, pos_x: 1800, pos_y: - 140},
		{item: seaplant7, pos_x: 3370, pos_y: - 130},
		{item: seaplant6, pos_x: -120, pos_y: - 120},
		{item: seaplant6, pos_x: 640, pos_y: - 160},
		{item: seaplant6, pos_x: 1680, pos_y: - 160},
		{item: seaplant6, pos_x: 2200, pos_y: - 150},
		{item: seaplant6, pos_x: 2700, pos_y: - 130},
		{item: seaplant6, pos_x: 3750, pos_y: - 130},
		{item: seaplant5, pos_x: 270, pos_y: - 145},
		{item: seaplant5, pos_x: 1500, pos_y: - 135},
		{item: seaplant5, pos_x: 2100, pos_y: - 135},
		{item: seaplant5, pos_x: 2400, pos_y: - 145},
		{item: seaplant5, pos_x: 2800, pos_y: - 145},
		{item: seaplant5, pos_x: 3600, pos_y: - 125},
		{item: seaplant4, pos_x: 0, pos_y: - 160},
		{item: seaplant4, pos_x: 150, pos_y: - 160},
		{item: seaplant4, pos_x: 450, pos_y: - 150},
		{item: seaplant4, pos_x: 870, pos_y: - 150},
		{item: seaplant4, pos_x: 1300, pos_y: - 150},
		{item: seaplant4, pos_x: 3050, pos_y: - 130},
		{item: seaplant4, pos_x: 3450, pos_y: - 130},
		{item: seaplant2, pos_x: 200, pos_y: - 100},
		{item: seaplant2, pos_x: 700, pos_y: - 100},
		{item: seaplant2, pos_x: 2150, pos_y: - 80},
		{item: seaplant2, pos_x: 3000, pos_y: - 80},
		{item: seaplant2, pos_x: 3550, pos_y: - 75},
		{item: seaplant2, pos_x: 3700, pos_y: - 75},
		{item: seaplant3, pos_x: -10, pos_y: - 110},
		{item: seaplant3, pos_x: 1600, pos_y: - 120},
		{item: seaplant3, pos_x: 2600, pos_y: - 120},
		{item: seaplant1, pos_x: 100, pos_y: - 110},
		{item: seaplant1, pos_x: 800, pos_y: - 110},
		{item: seaplant1, pos_x: 1400, pos_y: - 110},
		{item: seaplant1, pos_x: 1700, pos_y: - 110},
		{item: seaplant8, pos_x: 600, pos_y: - 110},
		{item: seaplant8, pos_x: 1300, pos_y: - 100},
		{item: seaplant8, pos_x: 2900, pos_y: - 100},
		{item: seaplant8, pos_x: 3500, pos_y: - 90},
		{item: rock2, pos_x: 400, pos_y: - 40},
		{item: rock2, pos_x: 1230, pos_y: - 35},
		{item: dino, pos_x: 2600, pos_y: 30}
	];

	// Collectables have different height. The character must jumt to reach them.
	collectables = [
		{pos_x: 520, pos_y: floorPos_y -170, isFound: false},
		{pos_x: 2200, pos_y: floorPos_y - 150, isFound: false},
		{pos_x: 920, pos_y: floorPos_y - 200, isFound: false},
		{pos_x: 1520, pos_y: floorPos_y -150, isFound: false},
		{pos_x: 1920, pos_y: floorPos_y -160, isFound: false},
		{pos_x: 2700, pos_y: floorPos_y -160, isFound: false},
	];

    restartAvailable = false;
	
	// Coordinates of the flag
	flagpole = {
		pos_x: 3500,
		isReached: false
	};

	// Creates enemy from constructor
	enemies = [];
	enemies.push(new Enemy(650, floorPos_y, 100))
	enemies.push(new Enemy(2500, floorPos_y, 100))

	// Restarts background music
	if(!backgroundMusic.isPlaying()) {
		backgroundMusic.play();
	};
};


// Enemy constructor
function Enemy(x, y, range) {
	this.x = x;
	this.y = y;
	this.range = range;

	this.currentX = x;
	this.inc = 1;
	this.moveL = 0;
	this.moveR = 0;
	this.checkContact = function(gc_x, gc_y){
		var d = dist(gc_x, gc_y, this.currentX, this.y);
		if (d<20){
			return true;
		}
		return false;

	};

	this.update = function() {
		this.currentX += this.inc;
		this.moveL += this.inc/5;
		this.moveR -= this.inc/5;
		if(this.currentX >= this.x + this.range) {
			this.inc = -1;
		}
		else if(this.currentX < this.x) {
			this.inc = +1;
		};
	};

	this.draw = function()  {
		this.update();

		stroke(188, 29, 29); //dark red color
		strokeCap(ROUND);
		strokeWeight(6);

		//right hand
		bezier(
			this.currentX + 129, this.y-10, 
			this.currentX + 135, this.y-12, 
			this.currentX + 140, this.y-15, 
			this.currentX + 145, this.y-20);

		//left hand
		bezier(
			this.currentX + 67, this.y-10, 
			this.currentX + 61, this.y-12, 
			this.currentX + 56, this.y-15, 
			this.currentX + 51, this.y-20);
		
		//left leg
		beginShape();
		vertex(this.currentX + 71, this.y-5);
		vertex(this.currentX + 56, this.y-1);
		vertex(this.currentX + 60, this.y+7);
		endShape();
		
		//right leg
		beginShape();
		vertex(this.currentX + 125, this.y-5);
		vertex(this.currentX + 140, this.y-1);
		vertex(this.currentX + 136, this.y+7);
		endShape();
		
		noStroke();
		fill(188, 29, 29);
		rect(this.currentX + 105, this.y-40, 10, 20);
		rect(this.currentX + 86, this.y-40, 10, 20);

		//body
		fill(228, 67, 65); //red
		ellipse(this.currentX + 100, this.y-10, 70, 35);

		fill(228, 67, 65); //red
		
		//left claw
		beginShape();
		vertex(this.currentX + 52, this.y-20);
		bezier(
			this.currentX + this.moveL + 46, this.y-50, 
			this.currentX + 86, this.y-25, 
			this.currentX + 46, this.y-20, 
			this.currentX + 51, this.y-20, 
			this.currentX + 21, this.y-20);

		bezier(
			this.currentX + 35, this.y-50, 
			this.currentX + 20, this.y-40, 
			this.currentX + 20, this.y-10, 
			this.currentX + 50, this.y-20, 
			this.currentX + 50, this.y-20);
		endShape();
		
		//right claw
		beginShape();
		vertex(this.currentX + 142, this.y-20);
		bezier(
			this.currentX + this.moveR + 150, this.y-50, 
			this.currentX + 110, this.y-25, 
			this.currentX + 150, this.y-20, 
			this.currentX + 145, this.y-20, 
			this.currentX + 175, this.y-20); 
		bezier(
			this.currentX + 160, this.y-50, 
			this.currentX + 175, this.y-40, 
			this.currentX + 175, this.y-10, 
			this.currentX + 145, this.y-20, 
			this.currentX + 115, this.y-20);
		endShape();

		//eyes
		fill(188, 29, 29);
		ellipse(this.currentX + 111, this.y-40, 20, 20);
		ellipse(this.currentX + 89, this.y-40, 20, 20);
		fill(255);
		ellipse(this.currentX + 111, this.y-38, 17, 17);
		ellipse(this.currentX + 89, this.y-38, 17, 17);
		fill(0, 0, 0); 
		ellipse(this.currentX + 111, this.y-37, 12, 12);
		ellipse(this.currentX + 89, this.y-37, 12, 12);
		fill(255);
		ellipse(this.currentX + 109, this.y-40, 5, 5);
		ellipse(this.currentX + 87, this.y-40, 5, 5);
		noFill();
	}
};


