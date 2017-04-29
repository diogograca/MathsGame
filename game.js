  // Set the width and height of the scene.
  var width = 1920;
  var height = 1080;

  // Make sure we maintain the correct aspect ratio.
  window.addEventListener('resize', function() {
    resize();
  }.bind(this), false);

  // Setup the rendering surface.
  var renderer = new PIXI.CanvasRenderer(width, height);
  renderer.autoResize = true;
  renderer.backgroundColor = 0x85aae5; //Sets the background for the canvas

  // var divMain = document.getElementById("Main");
  document.body.appendChild(renderer.view);

  var questionSquare;
  var firstNumber;
  var secondNumber;
  var operator;
  var result;
  var incorrectResult1;  
  var incorrectResult2;
  var resultBallon;
  var resultBallon2;
  var resultBallon3;
  var ballonline1;
  var ballonline2;
  var ballonline3;
  var resultText1;
  var resultText2;
  var resultText3;
  var livesRemainingText;
  var currentScoreText;
  var ballonWidth = 20;
  var ballonHeight = 30;
  var results = [];
  var currentScore = 0;
  var livesRemaining = 5;
  var scoreMessage;
  var cloud;
  var equationMessage;
  var hasGameStarted = false;
  var velocity = 0.5;
  // Create the main stage to draw on.
  var stage = new PIXI.Stage();

  var gameStartScene = new PIXI.Container();

  var gameScene = new PIXI.Container();

  var gameOverScene = new PIXI.Container();

  operator = "+";
  // Start running the game.  

  setup();

  /*
   * Build the scene and begin animating.
   */
   function setup() {
    resize();
    //Loads images  
    PIXI.loader
    .add("images/cloud.png")   
    .load(loadImages);
    // Initialise all the scenes
    createAllScenes();
    // Begin the first frame
    gameLoop();
  }

  function loadImages(){
    cloud = new PIXI.Sprite(
      PIXI.loader.resources["images/cloud.png"].texture
      );
     
    cloud.y = (height / 2) - height * 0.2;


    gameScene.addChild(cloud);
  }


  /*
   * This function creates the start up Screen
   */
  function createStartUpScene() {

    var fontSizeText = 32;
    var levelMessage = new PIXI.Text(
      "Please choose one of the below", {
        fontFamily: "Arial",
        fontSize: fontSizeText,
        fill: "white"
      });
    //sets the position  
    levelMessage.position.set(width * 0.4, 20);
    //Adds to the stage
    gameStartScene.addChild(levelMessage);

    var xpos = width * 0.41;
    var ypos = 90;
    var marginForBoxes = 40;
    var boxWidth = width * 0.2;
    var boxHeight = height * 0.1;
    var borderSize = 4;
    var borderColour = 0x99CCFF;
    var cornerRadious = 10;
    //TODO need to find a way to measure the string and centering the text instead of hard coded values
    //Not essential, but nice to implement it
    drawRoundedRect(borderSize, borderColour, 1, 0xFF9933, xpos, ypos, boxWidth, boxHeight, cornerRadious, "+", "Addition", xpos, ypos + (boxHeight / 2) - (fontSizeText / 2));
    ypos += boxHeight + marginForBoxes;
    drawRoundedRect(borderSize, borderColour, 1, 0xFF9933, xpos, ypos, boxWidth, boxHeight, cornerRadious, "-", "Subtraction", xpos, ypos + (boxHeight / 2) - (fontSizeText / 2));
    ypos += boxHeight + marginForBoxes;
    drawRoundedRect(borderSize, borderColour, 1, 0xFF9933, xpos, ypos, boxWidth, boxHeight, cornerRadious, "*", "Multiplication", xpos, ypos + (boxHeight / 2) - (fontSizeText / 2));
    ypos += boxHeight + marginForBoxes;
    drawRoundedRect(borderSize, borderColour, 1, 0xFF9933, xpos, ypos, boxWidth, boxHeight, cornerRadious, "/", "Division", xpos, ypos + (boxHeight / 2) - (fontSizeText / 2));
  }
  /*
   * Function that creates the game over scene
   */
   function createGameOverScene() {
    var gameOverText = "GAME OVER";
    var gameOverMessage = new PIXI.Text(
      gameOverText, {
        fontFamily: "Arial",
        fontSize: 32,
        fill: "white"
      });
    //sets the position  
    gameOverMessage.position.set(width * 0.4, 150);
    //Adds to the stage
    gameOverScene.addChild(gameOverMessage);

    var scoreText = "You scored: " + currentScore + " points!"; 
    scoreMessage = new PIXI.Text(
      scoreText, {
        fontFamily: "Arial",
        fontSize: 28,
        fill: "white"
      });
    //sets the position  
    scoreMessage.position.set(width * 0.4 - 25, 190);
    //Adds to the stage
    gameOverScene.addChild(scoreMessage);

    var boxWidth = width * 0.2;
    var boxHeight = height * 0.1;
    var xpos = width * 0.35;
    var ypos = 240;

    var roundBox = new PIXI.Graphics();
    roundBox.lineStyle(4, 0x99CCFF, 1);
    roundBox.beginFill(0xFF9933);
    roundBox.drawRoundedRect(0, 0, boxWidth,boxHeight, 10);
    roundBox.endFill();
    roundBox.x = xpos;
    roundBox.y = ypos;
    roundBox.interactive = true;
    roundBox.buttonMode = true;
    roundBox.on('click', (e) => {
      //handle event
      playAgain();
    });
    roundBox.on('touchstart', (e) => {
      //handle event
      playAgain();
     
    });

    gameOverScene.addChild(roundBox);

    var playAgainText =  "Play Again!" ;
    //Button Text
    var message = new PIXI.Text(
      playAgainText, {
        fontFamily: "Arial",
        fontSize: 32,
        fill: "white"
      }
      );

    message.position.set(xpos + (boxWidth / 2) - measureString(playAgainText,'Arial', 32) , ypos + 40);
    gameOverScene.addChild(message);
  }

  function playAgain(){
    gameOverScene.visible = false;
    //resets the number of lives remaining
    livesRemaining = 5;
    currentScore = 0;
    gameStartScene.visible = true;
  }

  /*
   * This function shows the game scene
   */
   function showGameScene() {
    gameStartScene.visible = false;
    clearDownCurrentBallons();
    gameScene.visible = true;

    createNewEquation();
  }
  /*
   * This function draws a rounded Rect
   */
   function drawRoundedRect(borderWidth, borderCoLour, borderTransparency, fillColour,
    xpos, ypos, width, height, cornerRadius, operatorValue, buttonText,
    xposButton, yposButton) {
    //Button  
    var roundBox = new PIXI.Graphics();
    roundBox.lineStyle(4, 0x99CCFF, 1);
    roundBox.beginFill(fillColour);
    roundBox.drawRoundedRect(0, 0, width, height, cornerRadius);
    roundBox.endFill();
    roundBox.x = xpos;
    roundBox.y = ypos;
    roundBox.interactive = true;
    roundBox.buttonMode = true;
    roundBox.on('click', (e) => {
     //handle event
     startClick(operatorValue);
   });
    roundBox.on('touchstart', (e) => {
      //handle event
      startClick(operatorValue);
    });

    gameStartScene.addChild(roundBox);
    //Button Text
    var message = new PIXI.Text(
      buttonText, {
        fontFamily: "Arial",
        fontSize: 32,
        fill: "white"
      }
      );

    var textWidth = measureString(buttonText,"Arial",32);

    xposButton += (width / 2) - (textWidth);
    message.position.set(xposButton, yposButton);
    gameStartScene.addChild(message);

  }

  /*
  * This functions measures a string
  */
  function measureString(txt, fontname, fontsize){
    // Create dummy span
    this.e = document.createElement('span');
    // Set font-size
    this.e.style.fontSize = fontsize;
    // Set font-face / font-family
    this.e.style.fontFamily = fontname;
    // Set text
    this.e.innerHTML = txt;
    document.body.appendChild(this.e);
    // Get width NOW, since the dummy span is about to be removed from the document
    var w = this.e.offsetWidth;
    // Cleanup
    document.body.removeChild(this.e);
    // Return the lenght
    return w;
  }

  /*
  * THis function is called by on click or on touch of the game start 
  */
  function startClick(operatorValue){
    operator = operatorValue;
    startUpGameScene();
    showGameScene();
    hasGameStarted = true;
  }

  /*
   * This function adds all the scenes to the stage
   */
   function createAllScenes() {
    stage.addChild(gameStartScene);
    gameScene.visible = false;
    stage.addChild(gameScene);
    startUpGameScene();
    gameOverScene.visible = false;
    stage.addChild(gameOverScene);

    createStartUpScene();
    createGameOverScene();
  }
  /*
   * This function starts the game scene
   */
   function startUpGameScene() {
    clearDownCurrentBallons();
    // creates the first equation
    createNewEquation();
    //Display the remaining lives
    displayLives();
    // Displays Scores
    displayScore();
  }

  /*
   * Display the remaining lives 
   */
   function displayLives() {
    //removes the current message to write a new one
    gameScene.removeChild(livesRemainingText);

    livesRemainingText = new PIXI.Text(
      "Lives Remaining: " + livesRemaining, {
        fontFamily: "Arial",
        fontSize: 32,
        fill: "black"
      }
      );

    // sets the equation message position
    livesRemainingText.position.set(width - 300, 20);
    //Adds to the stage
    gameScene.addChild(livesRemainingText);
  }

  /*
   * Display the current score 
   */
   function displayScore() {
    //removes the current message to write a new one
    gameScene.removeChild(currentScoreText);

    currentScoreText = new PIXI.Text(
      "Current Score: " + currentScore, {
        fontFamily: "Arial",
        fontSize: 32,
        fill: "black"
      }
      );

    // sets the equation message position
    currentScoreText.position.set(20, 20);
    //Adds to the stage
    gameScene.addChild(currentScoreText);
  }

  /*
   * Function that picks the a new equation and draws the elements
   */
   function createNewEquation() {
    // gets the equation
    getEquation();
     //creates the question square
    createQuestionCloud();
    //draws results ballons
    drawResultBallons();
  }

  /*
   * Draws the question square
   */
   function createQuestionCloud() {

    //Adds to the stage
    //gameScene.addChild(cloud);

    equationMessage = new PIXI.Text(
      firstNumber + " " + operator + " " + secondNumber + " =", {
        fontFamily: "Arial",
        fontSize: 32,
        fill: "black"
      }
      );
    // sets the equation message position
    equationMessage.position.set(250, (height / 2)  - height * 0.07);
    //Adds to the stage
    gameScene.addChild(equationMessage);
  }

  /*
   * Functions that draws the ballon results
   */
   function drawResultBallons() {
    var minNumber = 0;
    var maxNumber;
    var i;
    var message;
    var ballonWidth = 40;
    var ballonHeight = 60;
    var ballonColour = 0xe51616;
    var lineColour = 0x000000;
    var ballonLineLength = 150;

    //FIRST RESULT
    resultBallon = new PIXI.Graphics();
    resultBallon.beginFill(ballonColour);
    resultBallon.lineStyle(1, lineColour, 1);
    resultBallon.drawEllipse(width * 0.4, height, ballonWidth, ballonHeight);
    resultBallon.endFill();
    resultBallon.interactive = true;
    resultBallon.buttonMode = true;
    resultBallon.on('click', (event) => {
      //handle event
      checkAnswer(resultText1._text);
    });
    resultBallon.on('touchstart', (event) => {
      //handle event
      checkAnswer(resultText1._text);
    });
    //Adds to the stage
    gameScene.addChild(resultBallon);

    maxNumber = results.length - 1;
    i = getRandomInt(minNumber, maxNumber);
    message = results[i];

    //draws the result text
    resultText1 = new PIXI.Text(
      message, {
        fontFamily: "Arial",
        fontSize: 32,
        fill: "white"
      }
      );

    ballonline1 = new PIXI.Graphics();
    ballonline1.lineStyle(1, 0x000000, 1);
    ballonline1.moveTo(0, 0);
    ballonline1.lineTo(0, ballonLineLength);
    ballonline1.x = (width * 0.4);
    ballonline1.y = height + ballonHeight;
    gameScene.addChild(ballonline1);
    //removes from the array to ensure the same answer is not picked
    results.splice(i, 1);

    resultText1.position.set((width * 0.4) - measureString(message,'Arial', 32), height - 10);
    //Adds to the stage
    gameScene.addChild(resultText1);

    //SECOND RESULT
    maxNumber = results.length - 1;
    i = getRandomInt(minNumber, maxNumber);
    message = results[i];

    resultBallon2 = new PIXI.Graphics();
    resultBallon2.beginFill(ballonColour);
    resultBallon2.lineStyle(1, lineColour, 1);
    resultBallon2.drawEllipse(width * 0.55, height, ballonWidth, ballonHeight);
    resultBallon2.endFill();
    resultBallon2.interactive = true;
    resultBallon2.buttonMode = true;
    resultBallon2.on('click', (e) => {
      //handle event
      checkAnswer(resultText2._text);
    });
    resultBallon2.on('touchstart', (event) => {
      //handle event
      checkAnswer(resultText2._text);
    });

    //Adds to the stage
    gameScene.addChild(resultBallon2);

    //draws the result text
    resultText2 = new PIXI.Text(
      message, {
        fontFamily: "Arial",
        fontSize: 32,
        fill: "white"
      }
      );
    //removes from the array to ensure the same answer is not picked
    results.splice(i, 1);

    resultText2.position.set((width * 0.55) - measureString(message,'Arial', 32), height - 10);
    //Adds to the stage
    gameScene.addChild(resultText2);

    ballonline2 = new PIXI.Graphics();
    ballonline2.lineStyle(1, 0x000000, 1);
    ballonline2.moveTo(0, 0);
    ballonline2.lineTo(0, ballonLineLength);
    ballonline2.x = (width * 0.55);
    ballonline2.y = height + ballonHeight;
    gameScene.addChild(ballonline2);

    //THIRD RESULT
    maxNumber = results.length - 1;
    i = getRandomInt(minNumber, maxNumber);
    message = results[i];

    resultBallon3 = new PIXI.Graphics();
    resultBallon3.beginFill(ballonColour);
    resultBallon3.lineStyle(1, lineColour, 1);
    resultBallon3.drawEllipse(width * 0.7, height, ballonWidth, ballonHeight);
    resultBallon3.endFill();
    resultBallon3.interactive = true;
    resultBallon3.buttonMode = true;
    resultBallon3.on('click', (event) => {
      //handle event
      checkAnswer(resultText3._text);
    });
    resultBallon3.on('touchstart', (event) => {
      //handle event
      checkAnswer(resultText3._text);
    });
    //Adds to the stage
    gameScene.addChild(resultBallon3);

    //draws the result text
    resultText3 = new PIXI.Text(
      message, {
        fontFamily: "Arial",
        fontSize: 32,
        fill: "white"
      }
      );
    //removes from the array to ensure the same answer is not picked
    results.splice(i, 1);

    resultText3.position.set((width * 0.7) - measureString(message,'Arial', 32), height - 10);
    //Adds to the stage
    gameScene.addChild(resultText3);

    ballonline3 = new PIXI.Graphics();
    ballonline3.lineStyle(1, 0x000000, 1);
    ballonline3.moveTo(0, 0);
    ballonline3.lineTo(0, ballonLineLength);
    ballonline3.x = (width * 0.7);
    ballonline3.y = height + ballonHeight;
    gameScene.addChild(ballonline3);

    // ensures the array is empty
    results = [];
  }
  /*
   * Function that checks if the answers is the correct result
   */
   function checkAnswer(answer) {
    if (answer == result) {
      // Clears the stage
      clearDownCurrentBallons();
      //creates a new equation
      createNewEquation();
      //Increments current score
      currentScore += 1;
      //Displays new Score
      displayScore();
      //Increase Speed
      velocity += 0.1;
    } else {
      livesRemaining -= 1;
      displayLives();
    }
  }

  function ballonsGone() {
    livesRemaining -= 1;
    displayLives();
    // Clears the stage
    clearDownCurrentBallons();
    //creates a new equation
    createNewEquation();
  }

  /*
   * Function that clear down the current equation from the stage
   */
   function clearDownCurrentBallons() {
    gameScene.removeChild(resultBallon);
    gameScene.removeChild(resultBallon2);
    gameScene.removeChild(resultBallon3);
    gameScene.removeChild(resultText1);
    gameScene.removeChild(resultText2);
    gameScene.removeChild(resultText3);
    gameScene.removeChild(ballonline1);
    gameScene.removeChild(ballonline2);
    gameScene.removeChild(ballonline3);
    gameScene.removeChild(equationMessage);
  }

  /*
   * Function that gets a random equation depending on the operator
   */
   function getEquation() {
    var maxNumber;
    var minNumber = 0;
    var i;

    switch (operator) {
      case "+":
      maxNumber = (equations[0].additions.length) - 1;
      i = getRandomInt(minNumber, maxNumber);

      firstNumber = equations[0].additions[i].firstNumber;
      secondNumber = equations[0].additions[i].secondNumber;
      result = equations[0].additions[i].correctResult;
      incorrectResult1 = equations[0].additions[i].incorrectResult1;
      incorrectResult2 = equations[0].additions[i].incorrectResult2;

      results.push(result);
      results.push(incorrectResult1);
      results.push(incorrectResult2);

      break;
      case "-":
      maxNumber = (equations[0].subtractions.length) - 1;
      i = getRandomInt(minNumber, maxNumber);

      firstNumber = equations[0].subtractions[i].firstNumber;
      secondNumber = equations[0].subtractions[i].secondNumber;
      result = equations[0].subtractions[i].correctResult;
      incorrectResult1 = equations[0].subtractions[i].incorrectResult1;
      incorrectResult2 = equations[0].subtractions[i].incorrectResult2;

      results.push(result);
      results.push(incorrectResult1);
      results.push(incorrectResult2);

      break;
      case "*":
      maxNumber = (equations[0].multiplications.length) - 1;
      i = getRandomInt(minNumber, maxNumber);

      firstNumber = equations[0].multiplications[i].firstNumber;
      secondNumber = equations[0].multiplications[i].secondNumber;
      result = equations[0].multiplications[i].correctResult;
      incorrectResult1 = equations[0].multiplications[i].incorrectResult1;
      incorrectResult2 = equations[0].multiplications[i].incorrectResult2;

      results.push(result);
      results.push(incorrectResult1);
      results.push(incorrectResult2);

      break;
      case "/":
      maxNumber = (equations[0].divisions.length) - 1;
      i = getRandomInt(minNumber, maxNumber);

      firstNumber = equations[0].divisions[i].firstNumber;
      secondNumber = equations[0].divisions[i].secondNumber;
      result = equations[0].divisions[i].correctResult;
      incorrectResult1 = equations[0].divisions[i].incorrectResult1;
      incorrectResult2 = equations[0].divisions[i].incorrectResult2;

      results.push(result);
      results.push(incorrectResult1);
      results.push(incorrectResult2);

      break;
    }
  }
  /*
   * Function that moves the ballons up
   */
   function resultBallonsPositions() {
    resultBallon.y -= velocity;
    resultText1.y -= velocity;
    ballonline1.y -= velocity;
    resultBallon2.y -= velocity;
    resultText2.y -= velocity;
    ballonline2.y -= velocity;
    resultBallon3.y -= velocity;
    resultText3.y -= velocity;
    ballonline3.y -= velocity;
    
    if (resultBallon.y == height * -1) {
      ballonsGone();
    }
  }
  /*
   * Function that checks if it is game over
   */
   function gameOverCheck() {
    if (livesRemaining === 0) {
      gameScene.visible = false;
      gameOverScene.visible = true;
      scoreMessage.text = "You Scored " + currentScore + " points!";
      hasGameStarted = false;
      velocity = 0.5;
    }
  }
  /*
   * Function that resizes the game depending on the window size 
   */
   function resize() {
    var ratio = 1080 / 1920;
    var docWidth = document.body.clientWidth;
    var docHeight = document.body.clientHeight;

    if (docHeight / docWidth < ratio) {
      renderer.view.style.height = '100%';
      renderer.view.style.width = 'auto';
    } else {
      renderer.view.style.width = '100%';
      renderer.view.style.height = 'auto';
    }
  }

  /*
   * Function that returns a random number between the max and the min
   */
   function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  /*
   * Fires at the end of the gameloop to reset and redraw the canvas.
   */
   function gameLoop() {
    //Loop this function 60 times per second
    requestAnimationFrame(gameLoop);

    if (hasGameStarted === true) {
      //Checks if it's gameover
      gameOverCheck();
      //positiones the results ballons
      resultBallonsPositions();
    }
    // Render the stage for the current frame.
    renderer.render(stage);
  }