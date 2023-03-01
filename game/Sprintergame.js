const SPRINTER_COUNT = 8; // how many lanes there are, including the player

var runners = []; // lineup
var runner; // player

var laneWidth; // width of each lane

var startTime; // beginning of the game
var countdown; // countdown before the game starts

function setup() {
  createCanvas(800, 600);
  
  /* initialize countdown */
  countdown = 3;

  /* initialize opponents */
  var opponentColor = randomColor(); // color of opponents
  for (var i = 1; i < SPRINTER_COUNT; i++) {
    // push opponents
    runners.push(new Sprinter(random(0.075) + 0.1, opponentColor));
  }

  /* initialize player */
  runner = new Sprinter(0, invertColor(opponentColor));
  runners.splice(Math.floor(runners.length / 2), 0, runner);

  /* initialize stopwatch */
  laneWidth = width / runners.length;
}

function draw() {
  background('#dd1111');
  
  if (countdown > 0) {
    textSize(100);
    textAlign(CENTER, CENTER);
    fill(255);
    text(countdown, width/2, height/2);
    
    if (frameCount % 60 == 0) { // update every second
      countdown--;
    }
  } else {
    handleTrack();
    stride();
  }
}

/**
 * handle user input
 */
function keyPressed() {
  if (countdown == 0) {
    runner.run(keyCode);
  }
}

/**
 * AI for opponents
 */
function stride() {
  for (var r = 0; r < runners.length; r++) {
    // loop through runners

    if (random() < runners[r].skill) {
      // calculate the speed of the runner
      // take a stride

      if (!runners[r].previousKey) {
        runners[r].previousKey = LEFT_ARROW; // set a default value for the first stride
      }

      // LEFT_ARROW + RIGHT_ARROW = 76, therefore;
      // 76 - LEFT_ARROW = RIGHT_ARROW &
      // 76 - RIGHT_ARROW = LEFT_ARROW
      runners[r].run(76 - runners[r].previousKey);
    }
  }
}


/**
 * draws & updates runners
 * draws lanes
 */
function handleTrack() {
  for (var r = 0; r < runners.length; r++) {
    /* draw & update runners */
    runners[r].draw(r, laneWidth);
    runners[r].update();

    /* draw lanes */
    var x1 = r * laneWidth; // inner line
    var x2 = r * laneWidth + laneWidth; // outer line

    stroke("#f7f5f5");
    strokeWeight(3);

    line(x1, 0, x1, height);
    line(x2, 0, x2, height);
  }
}

/**
 * returns a random color
 */
function randomColor() {
  return color(random(255), random(255), random(255));
}

/**
 * returns an inverted color of the passed col
 */
function invertColor(col) {
  var r = 255 - red(col);
  var g = 255 - green(col);
  var b = 255 - blue(col);
  return color(r, g, b);
}