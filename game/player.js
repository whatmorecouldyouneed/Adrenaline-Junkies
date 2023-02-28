function Sprinter(skill, color) { 

    this.distance = 0; // distance traveled by the runner
    this.speed = 0; // acceleration (amount of velocity gained each "stride")
    this.velocity = 0; // "momentum"
  
    /** AI variables */
    this.skill = skill; // chance of correctly striding
    this.previousKey = null;
  
    this.color = color;
    this.finished = false; // whether to recieve input or draw the time
    this.time = 0; // stopwatch
  }
  
  /**
   * draws the runners
   */
 Sprinter.prototype.draw = function(lane, laneWidth) {
    var x = (lane * laneWidth) + (laneWidth / 2); // calculate x position
    var y = height - this.distance; // calculate y position
    fill(this.color);
    stroke(255);
    strokeWeight(2);
    ellipse(x, y, laneWidth / 2);
    if (this.finished && !this.timeLogged) {
        // draw the time
        console.log(`Lane ${lane + 1}'s time: ${(this.time / 1000).toFixed(2)} seconds`);
        this.timeLogged = true;
    }
};

  
  
  
  /**
   * handles distance based upon velocity (adrenaline),
   * handles velocity based upon speed & resistance
   * handles finish, stops stopwatch
   */
  
  Sprinter.prototype.update = function() {
  
    if (this.finished) {
      // don't allow movement
      return;
    } else {
  
      if (this.finished = (this.distance > height)) // set whether the runner finished the race
        this.time = new Date().getTime() - startTime; // stop stopwatch
    }
  
    /* move the Sprinter */
    this.velocity = (this.velocity > 3) ? 3 : this.velocity; // constrain velocity
  
    this.distance += this.velocity; // movement
    this.velocity += this.speed; // acceleration
    this.velocity *= 0.99; // resistance
    this.speed = 0; // reset acceleration
  };
  
  /**
   * handles key press & previousKey
   * accelerates the runner
   */
  Sprinter.prototype.run = function(key) {
  
    if (this.previousKey != null) { // only if they've strided in the past
  
      // LEFT_ARROW = 37, RIGHT_ARROW = 39
      if (this.previousKey != key && (this.previousKey === 37 || this.previousKey === 39) && (key === 37 || key === 39)) {
        // they've tapped the correct key
  
        this.speed += (this.velocity / 75 + 0.06); // accelerate
      } else {
        // they've pressed the wrong key
  
        /* cut off momentum */
        this.speed = 0;
        this.velocity = 0;
      }
  
    } else {
      // no previous key press
  
      this.speed += (this.velocity / 75 + 0.06);
    }
  
    // keep track of key
    this.previousKey = key;
  };
  