// Office Hero: The Soft Skills Sprint
// 60-second side-scrolling office game with soft-skills scenarios

const officeCanvas = document.getElementById('officeCanvas');
const officeCtx = officeCanvas.getContext('2d');

// Game constants
const TILE_SIZE = 16;
const SCALE = 4; // Display size: 16px * 4 = 64px
const DISPLAY_TILE_SIZE = TILE_SIZE * SCALE;
const CANVAS_WIDTH = 640;  // 10 tiles wide
const CANVAS_HEIGHT = 480; // 7.5 tiles tall
const GAME_DURATION = 60; // 60 seconds

officeCanvas.width = CANVAS_WIDTH;
officeCanvas.height = CANVAS_HEIGHT;

// Game state
let gameState = 'loading'; // loading, intro, playing, question, complete
let currentRoom = 0;
let trustScore = 0;
let gameTimer = GAME_DURATION;
let lastTime = 0;
let animTime = 0;
let gamePaused = false;

// Player state
const player = {
  x: 2 * DISPLAY_TILE_SIZE, // Start position (tile 2)
  y: 5 * DISPLAY_TILE_SIZE, // Floor level
  width: DISPLAY_TILE_SIZE,
  height: DISPLAY_TILE_SIZE,
  speed: 2,
  direction: 'right',
  frameIndex: 0,
  frameTimer: 0,
  moving: false
};

// Keyboard state
const keys = {
  ArrowLeft: false,
  ArrowRight: false,
  a: false,
  d: false
};

// Rooms layout (3 rooms, each 10 tiles wide = 30 tiles total)
// 0 = floor, 1 = wall, 2 = desk, 3 = plant, 4 = computer, 5 = vending machine
const roomLayouts = [
  // Room 1 - Entry area
  [
    [1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,2,0,0,3,0,0,1],
    [1,0,0,2,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [0,0,0,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,1,1,1]
  ],
  // Room 2 - Middle area
  [
    [1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,2,2,0,0,0,3,0,1],
    [1,0,4,4,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [0,0,0,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,1,1,1]
  ],
  // Room 3 - Final room
  [
    [1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,5,0,0,0,0,1],
    [1,0,0,0,5,0,2,2,0,1],
    [1,0,3,0,0,0,4,4,0,1],
    [1,0,0,0,0,0,0,0,0,1],
    [0,0,0,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,1,1,1]
  ]
];

// NPC positions and scenarios
const npcs = [
  {
    x: 6 * DISPLAY_TILE_SIZE,
    y: 5 * DISPLAY_TILE_SIZE,
    room: 0,
    name: "Jordan",
    talked: false,
    scenario: {
      title: "Deadline Management",
      question: "Jordan missed a deadline—what do you do?",
      answers: [
        { text: "Complain to the boss", correct: false },
        { text: "Ask what happened and offer help", correct: true },
        { text: "Do their work for them", correct: false }
      ]
    }
  },
  {
    x: 16 * DISPLAY_TILE_SIZE,
    y: 5 * DISPLAY_TILE_SIZE,
    room: 1,
    name: "Alex",
    talked: false,
    scenario: {
      title: "Conflict Resolution",
      question: "Your teammate blames you for an error—what do you do?",
      answers: [
        { text: "Defend yourself immediately", correct: false },
        { text: "Listen, then clarify facts", correct: true },
        { text: "Ignore them", correct: false }
      ]
    }
  },
  {
    x: 26 * DISPLAY_TILE_SIZE,
    y: 5 * DISPLAY_TILE_SIZE,
    room: 2,
    name: "Sam",
    talked: false,
    scenario: {
      title: "Collaboration",
      question: "A colleague has a different approach—how do you respond?",
      answers: [
        { text: "Insist your way is better", correct: false },
        { text: "Discuss both ideas and find common ground", correct: true },
        { text: "Let them do it their way without input", correct: false }
      ]
    }
  }
];

// Current NPC being interacted with
let currentNPC = null;

// Load sprite sheets
const officeSheet = new Image();
officeSheet.src = 'game/assets/Modern_Office_16x16.png';

const characterSheet = new Image();
characterSheet.src = 'game/assets/PixelOfficeAssets.png';

// Load sound effects
const correctSound = new Audio('game/assets/sfx_correct.ogg');
const wrongSound = new Audio('game/assets/sfx_wrong.ogg');

// Wait for images to load
let imagesLoaded = 0;
const totalImages = 2;

function imageLoaded() {
  imagesLoaded++;
  console.log(`Office Hero: Image loaded ${imagesLoaded}/${totalImages}`);
  if (imagesLoaded === totalImages) {
    console.log('Office Hero: All images loaded, starting game');
    gameState = 'intro';
    setupControls();
    resizeCanvas();
    gameLoop();
  }
}

officeSheet.onload = imageLoaded;
characterSheet.onload = imageLoaded;

officeSheet.onerror = () => {
  console.error('Failed to load office sprite sheet');
  imageLoaded();
};
characterSheet.onerror = () => {
  console.error('Failed to load character sprite sheet');
  imageLoaded();
};

// Setup keyboard controls
function setupControls() {
  window.addEventListener('keydown', (e) => {
    if (keys.hasOwnProperty(e.key)) {
      keys[e.key] = true;
      e.preventDefault();
    }
  });

  window.addEventListener('keyup', (e) => {
    if (keys.hasOwnProperty(e.key)) {
      keys[e.key] = false;
      e.preventDefault();
    }
  });
}

// Setup mobile controls
function setupMobileControls() {
  const leftBtn = document.getElementById('officeLeftBtn');
  const rightBtn = document.getElementById('officeRightBtn');

  if (leftBtn && rightBtn) {
    // Left button
    leftBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      keys.ArrowLeft = true;
    });
    leftBtn.addEventListener('touchend', () => {
      keys.ArrowLeft = false;
    });
    leftBtn.addEventListener('touchcancel', () => {
      keys.ArrowLeft = false;
    });

    // Right button
    rightBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      keys.ArrowRight = true;
    });
    rightBtn.addEventListener('touchend', () => {
      keys.ArrowRight = false;
    });
    rightBtn.addEventListener('touchcancel', () => {
      keys.ArrowRight = false;
    });
  }
}

// Responsive canvas sizing
function resizeCanvas() {
  const container = officeCanvas.parentElement;
  const containerWidth = container.clientWidth;

  if (containerWidth < CANVAS_WIDTH) {
    const scale = containerWidth / CANVAS_WIDTH;
    officeCanvas.style.width = containerWidth + 'px';
    officeCanvas.style.height = (CANVAS_HEIGHT * scale) + 'px';
  } else {
    officeCanvas.style.width = CANVAS_WIDTH + 'px';
    officeCanvas.style.height = CANVAS_HEIGHT + 'px';
  }
}

window.addEventListener('resize', resizeCanvas);

// Draw a tile from the sprite sheet
function drawTile(tileX, tileY, x, y) {
  officeCtx.drawImage(
    officeSheet,
    tileX * TILE_SIZE,
    tileY * TILE_SIZE,
    TILE_SIZE,
    TILE_SIZE,
    x,
    y,
    DISPLAY_TILE_SIZE,
    DISPLAY_TILE_SIZE
  );
}

// Check collision with walls
function checkCollision(x, y, width, height) {
  const leftTile = Math.floor(x / DISPLAY_TILE_SIZE);
  const rightTile = Math.floor((x + width - 1) / DISPLAY_TILE_SIZE);
  const topTile = Math.floor(y / DISPLAY_TILE_SIZE);
  const bottomTile = Math.floor((y + height - 1) / DISPLAY_TILE_SIZE);

  // Check which room we're in
  const roomIndex = Math.floor(x / (10 * DISPLAY_TILE_SIZE));
  if (roomIndex < 0 || roomIndex >= roomLayouts.length) return false;

  const room = roomLayouts[roomIndex];
  const localLeftTile = leftTile % 10;
  const localRightTile = rightTile % 10;

  // Check all corner tiles
  for (let tx = localLeftTile; tx <= localRightTile; tx++) {
    for (let ty = topTile; ty <= bottomTile; ty++) {
      if (ty >= 0 && ty < room.length && tx >= 0 && tx < room[0].length) {
        const tile = room[ty][tx];
        if (tile === 1 || tile === 2 || tile === 3 || tile === 5) { // Solid tiles
          return true;
        }
      }
    }
  }

  return false;
}

// Check if player is near an NPC
function checkNPCInteraction() {
  for (let npc of npcs) {
    if (npc.talked) continue;

    const dist = Math.abs(player.x - npc.x);
    if (dist < DISPLAY_TILE_SIZE * 1.5 && Math.abs(player.y - npc.y) < DISPLAY_TILE_SIZE) {
      return npc;
    }
  }
  return null;
}

// Update game logic
function update(deltaTime) {
  if (gameState !== 'playing') return;

  // Update timer
  gameTimer -= deltaTime;
  if (gameTimer <= 0) {
    gameTimer = 0;
    gameState = 'complete';
    showResults();
    return;
  }

  // Update animation time
  animTime += deltaTime;

  // Player movement
  player.moving = false;
  let dx = 0;

  if (keys.ArrowLeft || keys.a) {
    dx -= player.speed;
    player.direction = 'left';
    player.moving = true;
  }
  if (keys.ArrowRight || keys.d) {
    dx += player.speed;
    player.direction = 'right';
    player.moving = true;
  }

  // Try to move horizontally
  if (dx !== 0) {
    const newX = player.x + dx;
    // Check bounds (can move through all 3 rooms)
    if (newX >= 0 && newX <= (30 * DISPLAY_TILE_SIZE) - player.width) {
      if (!checkCollision(newX, player.y, player.width, player.height)) {
        player.x = newX;
      }
    }
  }

  // Update walk animation
  if (player.moving) {
    player.frameTimer += deltaTime;
    if (player.frameTimer > 0.2) {
      player.frameTimer = 0;
      player.frameIndex = (player.frameIndex + 1) % 2;
    }
  } else {
    player.frameIndex = 0;
  }

  // Update current room
  currentRoom = Math.floor(player.x / (10 * DISPLAY_TILE_SIZE));

  // Check NPC interaction
  const nearNPC = checkNPCInteraction();
  if (nearNPC && !nearNPC.talked) {
    gameState = 'question';
    currentNPC = nearNPC;
    showQuestion(nearNPC);
  }
}

// Show question overlay
function showQuestion(npc) {
  const overlay = document.getElementById('questionOverlay');
  const title = document.getElementById('qTitle');
  const text = document.getElementById('qText');
  const buttons = document.querySelectorAll('.answer-btn');

  title.textContent = npc.scenario.title;
  text.textContent = npc.scenario.question;

  buttons.forEach((btn, index) => {
    btn.textContent = npc.scenario.answers[index].text;
    btn.onclick = () => handleAnswer(index);
  });

  overlay.style.display = 'flex';
}

// Handle answer selection
function handleAnswer(answerIndex) {
  const answer = currentNPC.scenario.answers[answerIndex];
  const overlay = document.getElementById('questionOverlay');

  currentNPC.talked = true;

  if (answer.correct) {
    trustScore++;
    correctSound.currentTime = 0;
    correctSound.play().catch(e => console.log('Audio play failed:', e));
    showFeedback(true);
  } else {
    wrongSound.currentTime = 0;
    wrongSound.play().catch(e => console.log('Audio play failed:', e));
    showFeedback(false);
  }

  overlay.style.display = 'none';
  currentNPC = null;

  // Resume game after short delay
  setTimeout(() => {
    gameState = 'playing';
  }, 1000);
}

// Show visual feedback
function showFeedback(correct) {
  // TODO: Add sparkle or red flash animation
  console.log(correct ? 'Correct!' : 'Wrong!');
}

// Show results screen
function showResults() {
  const results = document.getElementById('resultsOverlay');
  const scoreText = document.getElementById('finalScore');
  const message = document.getElementById('resultMessage');

  scoreText.textContent = `Trust Score: ${trustScore}/3`;

  if (trustScore === 3) {
    message.textContent = "Perfect! You're a soft-skills master! 🏆";
  } else if (trustScore === 2) {
    message.textContent = "Great job! You build strong relationships! 🌟";
  } else if (trustScore === 1) {
    message.textContent = "Good start! Keep practicing those soft skills! 👍";
  } else {
    message.textContent = "Keep learning! Soft skills take practice! 💪";
  }

  results.style.display = 'flex';
}

// Restart game
function restartGame() {
  gameState = 'playing';
  currentRoom = 0;
  trustScore = 0;
  gameTimer = GAME_DURATION;
  player.x = 2 * DISPLAY_TILE_SIZE;
  player.y = 5 * DISPLAY_TILE_SIZE;
  npcs.forEach(npc => npc.talked = false);

  document.getElementById('resultsOverlay').style.display = 'none';
}

// Render game
function render() {
  // Clear canvas
  officeCtx.fillStyle = '#2A2F3A';
  officeCtx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  if (gameState === 'loading') {
    officeCtx.fillStyle = '#FFFFFF';
    officeCtx.font = '24px Orbitron, sans-serif';
    officeCtx.textAlign = 'center';
    officeCtx.fillText('Loading Office Hero...', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    return;
  }

  if (gameState === 'intro') {
    officeCtx.fillStyle = '#FFFFFF';
    officeCtx.font = '32px Orbitron, sans-serif';
    officeCtx.textAlign = 'center';
    officeCtx.fillText('Office Hero', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 40);
    officeCtx.font = '16px Orbitron, sans-serif';
    officeCtx.fillText('The Soft Skills Sprint', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2);
    officeCtx.fillText('Press any key to start', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 40);
    return;
  }

  // Calculate camera offset (follow player with bounds)
  let cameraX = player.x - CANVAS_WIDTH / 2;
  cameraX = Math.max(0, Math.min(cameraX, (30 * DISPLAY_TILE_SIZE) - CANVAS_WIDTH));

  // Render rooms
  for (let roomIdx = 0; roomIdx < 3; roomIdx++) {
    const room = roomLayouts[roomIdx];
    const roomOffsetX = roomIdx * 10 * DISPLAY_TILE_SIZE;

    for (let y = 0; y < room.length; y++) {
      for (let x = 0; x < room[y].length; x++) {
        const tile = room[y][x];
        const screenX = roomOffsetX + x * DISPLAY_TILE_SIZE - cameraX;
        const screenY = y * DISPLAY_TILE_SIZE;

        // Only render tiles on screen
        if (screenX > -DISPLAY_TILE_SIZE && screenX < CANVAS_WIDTH) {
          // Map tile IDs to sprite sheet positions
          if (tile === 0) {
            drawTile(0, 0, screenX, screenY); // Floor
          } else if (tile === 1) {
            drawTile(1, 0, screenX, screenY); // Wall
          } else if (tile === 2) {
            drawTile(3, 2, screenX, screenY); // Desk
          } else if (tile === 3) {
            drawTile(5, 3, screenX, screenY); // Plant
          } else if (tile === 4) {
            drawTile(4, 2, screenX, screenY); // Computer
          } else if (tile === 5) {
            drawTile(6, 4, screenX, screenY); // Vending machine
          }
        }
      }
    }
  }

  // Render NPCs
  for (let npc of npcs) {
    const screenX = npc.x - cameraX;
    const screenY = npc.y;

    if (screenX > -DISPLAY_TILE_SIZE && screenX < CANVAS_WIDTH) {
      // Draw NPC (using fallback for now)
      officeCtx.fillStyle = npc.talked ? '#10B981' : '#19D4FF';
      officeCtx.fillRect(screenX, screenY, DISPLAY_TILE_SIZE, DISPLAY_TILE_SIZE);

      // Draw name tag
      officeCtx.fillStyle = '#FFFFFF';
      officeCtx.font = '12px Arial';
      officeCtx.textAlign = 'center';
      officeCtx.fillText(npc.name, screenX + DISPLAY_TILE_SIZE / 2, screenY - 5);
    }
  }

  // Render player
  const playerScreenX = player.x - cameraX;
  officeCtx.fillStyle = '#FFD700';
  officeCtx.fillRect(playerScreenX, player.y, player.width, player.height);

  // Render HUD
  renderHUD();
}

// Render HUD
function renderHUD() {
  const padding = 10;

  // Timer
  officeCtx.fillStyle = 'rgba(15, 17, 23, 0.8)';
  officeCtx.fillRect(padding, padding, 150, 40);
  officeCtx.fillStyle = '#19D4FF';
  officeCtx.font = 'bold 18px Orbitron, sans-serif';
  officeCtx.textAlign = 'left';
  officeCtx.fillText(`Time: ${Math.ceil(gameTimer)}s`, padding + 10, padding + 27);

  // Trust score
  officeCtx.fillStyle = 'rgba(15, 17, 23, 0.8)';
  officeCtx.fillRect(CANVAS_WIDTH - 160, padding, 150, 40);
  officeCtx.fillStyle = '#10B981';
  officeCtx.font = 'bold 18px Orbitron, sans-serif';
  officeCtx.textAlign = 'right';
  officeCtx.fillText(`Trust: ${trustScore}/3`, CANVAS_WIDTH - padding - 10, padding + 27);
}

// Game loop
function gameLoop(currentTime = 0) {
  const deltaTime = (currentTime - lastTime) / 1000;
  lastTime = currentTime;

  if (!gamePaused) {
    if (gameState === 'intro') {
      // Wait for any key press to start
      if (keys.ArrowLeft || keys.ArrowRight || keys.a || keys.d) {
        gameState = 'playing';
      }
    } else if (gameState === 'playing') {
      update(deltaTime);
    }

    render();
  }

  requestAnimationFrame(gameLoop);
}

// Initialize on load
if (imagesLoaded === totalImages) {
  gameState = 'intro';
  setupControls();
  setupMobileControls();
  resizeCanvas();
  gameLoop();
}
