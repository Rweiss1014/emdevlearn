// Simple Maze Game with Custom Sprite
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game constants
const TILE_SIZE = 48;
const CANVAS_WIDTH = 960;
const HUD_HEIGHT = 90;
const GRID_HEIGHT = 12; // 12 rows for single screen view
const CANVAS_HEIGHT = HUD_HEIGHT + (GRID_HEIGHT * TILE_SIZE); // 90 + 576 = 666px
const GRID_WIDTH = CANVAS_WIDTH / TILE_SIZE;  // 20

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;

// Different maze layouts for each level (0 = floor, 1 = wall) - 12 rows for single screen fit
const mazes = [
  // Level 1: Simple open maze with few obstacles
  [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,1,1,0,0,0,1,1,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  // Level 2: More obstacles
  [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,1,0,0,0,1,1,0,0,1,1,0,0,0,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  // Level 3: Even more challenging
  [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,0,0,1,0,0,1,1,0,0,1,0,0,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,0,1,0,0,0,1,0,0,1,0,0,0,1,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,0,1,1,0,0,0,0,0,0,1,1,0,0,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,0,1,0,0,1,1,1,1,0,0,1,0,0,1,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ],
  // Level 4: Most challenging
  [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,1,0,1,0,1,1,0,1,0,1,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,1,0,0,1,1,0,0,0,0,1,1,0,0,1,0,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,0,1,0,0,0,1,1,1,1,0,0,0,1,0,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,0,1,0,1,1,0,0,0,0,0,0,1,1,0,1,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
  ]
];

let maze = mazes[0]; // Start with level 1 maze

// Multi-level game structure - correct answers in different spots each level (12 rows = 0-11)
const levels = [
  {
    question: "What makes a good team member?",
    enemyCount: 1,
    answers: [
      { text: "Listening", x: 6, y: 7, correct: true, collected: false }, // Middle-left area
      { text: "Gossip", x: 12, y: 4, correct: false, collected: false },
      { text: "Ego", x: 17, y: 9, correct: false, collected: false },
      { text: "Blaming", x: 10, y: 10, correct: false, collected: false }
    ]
  },
  {
    question: "Best way to handle conflict?",
    enemyCount: 2,
    answers: [
      { text: "Collaborate", x: 16, y: 3, correct: true, collected: false }, // Upper-right area
      { text: "Avoid it", x: 5, y: 6, correct: false, collected: false },
      { text: "Blame", x: 10, y: 8, correct: false, collected: false },
      { text: "Yell", x: 8, y: 10, correct: false, collected: false }
    ]
  },
  {
    question: "How to build trust?",
    enemyCount: 3,
    answers: [
      { text: "Honesty", x: 4, y: 10, correct: true, collected: false }, // Lower-left area
      { text: "Secrets", x: 11, y: 4, correct: false, collected: false },
      { text: "Lies", x: 16, y: 7, correct: false, collected: false },
      { text: "Hiding", x: 8, y: 9, correct: false, collected: false }
    ]
  },
  {
    question: "Key to productivity?",
    enemyCount: 4,
    answers: [
      { text: "Focus", x: 14, y: 8, correct: true, collected: false }, // Middle-right area
      { text: "Multitask", x: 5, y: 4, correct: false, collected: false },
      { text: "Distract", x: 10, y: 10, correct: false, collected: false },
      { text: "Procrastinate", x: 17, y: 6, correct: false, collected: false }
    ]
  },
  {
    question: "You completed all levels!",
    enemyCount: 0,
    answers: []
  }
];

// Game state
let currentLevel = 0;
let lives = 3;
let score = 0;
let invincible = false;
let flashTimer = 0;
let animTime = 0; // For animations
let showLevelPopup = false;
let levelPopupText = '';
let levelPopupTimer = 0;
let gamePaused = false; // Pause when user navigates away
let enemiesFrozen = false;
let freezeTimer = 0;

// Gem state
let gems = [];

// Key/Lock state
let keyVisible = false;
let lockVisible = false;
let keyCollected = false;
let keyPosition = { x: 0, y: 0 };
let lockPosition = { x: 0, y: 0 };

// Get current question and answers
let question = levels[currentLevel].question;
let answers = levels[currentLevel].answers;

// Player state
const player = {
  x: 1.5,  // Grid position (column)
  y: 1.5,  // Grid position (row)
  speed: 0.1,
  size: 40
};

// Function to generate enemies based on level
function generateEnemies(count) {
  const enemyPositions = [
    { x: 18.5, y: 1.5 },
    { x: 18.5, y: 10.5 },
    { x: 1.5, y: 10.5 },
    { x: 10, y: 6 }
  ];

  const newEnemies = [];
  for (let i = 0; i < Math.min(count, 4); i++) {
    newEnemies.push({
      x: enemyPositions[i].x,
      y: enemyPositions[i].y,
      speed: 0.03,
      size: 40,
      dirX: 0,
      dirY: 0,
      nextDirChange: 0
    });
  }
  return newEnemies;
}

// Start with enemies from level 1
let enemies = generateEnemies(levels[currentLevel].enemyCount);

// Function to generate random gem positions (avoid walls and player spawn)
function generateGems() {
  const newGems = [];
  for (let i = 0; i < 4; i++) {
    let x, y;
    let validPosition = false;

    // Keep trying until we find a valid floor position
    while (!validPosition) {
      x = Math.floor(Math.random() * (GRID_WIDTH - 2)) + 1; // Avoid outer walls
      y = Math.floor(Math.random() * (GRID_HEIGHT - 2)) + 1;

      // Check if it's a floor tile and not too close to player spawn
      if (maze[y][x] === 0 && (Math.abs(x - 1.5) > 2 || Math.abs(y - 1.5) > 2)) {
        validPosition = true;
      }
    }

    newGems.push({
      x: x + 0.5,
      y: y + 0.5,
      collected: false,
      type: i // Which gem image to use
    });
  }
  return newGems;
}

// Generate gems for level 1
gems = generateGems();

// Keyboard state
const keys = {
  ArrowUp: false,
  ArrowDown: false,
  ArrowLeft: false,
  ArrowRight: false,
  w: false,
  a: false,
  s: false,
  d: false
};

// Load sprites and sounds
const characterImg = new Image();
characterImg.src = 'game/assets/character_yellow_front.png';

const slimeImg = new Image();
slimeImg.src = 'game/assets/slime_block_walk_a.png';

const heartImg = new Image();
heartImg.src = 'game/assets/heart.png';

// Load gem images
const gemImgs = [];
const gemColors = ['blue', 'green', 'red', 'yellow'];
gemColors.forEach(color => {
  const gemImg = new Image();
  gemImg.src = `game/assets/gem_${color}.png`;
  gemImgs.push(gemImg);
});

// Load key and lock images
const keyImg = new Image();
keyImg.src = 'game/assets/key.png';

const lockImg = new Image();
lockImg.src = 'game/assets/lock.png';

const hurtSound = new Audio('game/assets/sfx_hurt.ogg');

// Event listeners for keyboard
window.addEventListener('keydown', (e) => {
  if (keys.hasOwnProperty(e.key)) {
    keys[e.key] = true;
    e.preventDefault();
  }
});

window.addEventListener('keyup', (e) => {
  if (keys.hasOwnProperty(e.key)) {
    keys[e.key] = false;
  }
});

// Mobile touch controls
function setupMobileControls() {
  const controlsDiv = document.createElement('div');
  controlsDiv.id = 'mobileControls';
  controlsDiv.innerHTML = `
    <div class="dpad">
      <button class="dpad-btn dpad-up" data-key="ArrowUp">↑</button>
      <button class="dpad-btn dpad-down" data-key="ArrowDown">↓</button>
      <button class="dpad-btn dpad-left" data-key="ArrowLeft">←</button>
      <button class="dpad-btn dpad-right" data-key="ArrowRight">→</button>
      <div class="dpad-center"></div>
    </div>
  `;

  document.querySelector('.game-wrap').appendChild(controlsDiv);

  // Handle touch events
  const buttons = controlsDiv.querySelectorAll('.dpad-btn');
  buttons.forEach(btn => {
    btn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const key = btn.getAttribute('data-key');
      keys[key] = true;
    });

    btn.addEventListener('touchend', (e) => {
      e.preventDefault();
      const key = btn.getAttribute('data-key');
      keys[key] = false;
    });

    // Also support mouse for testing
    btn.addEventListener('mousedown', (e) => {
      e.preventDefault();
      const key = btn.getAttribute('data-key');
      keys[key] = true;
    });

    btn.addEventListener('mouseup', (e) => {
      e.preventDefault();
      const key = btn.getAttribute('data-key');
      keys[key] = false;
    });
  });

  // Reset all keys when touch is cancelled
  document.addEventListener('touchend', () => {
    keys.ArrowUp = false;
    keys.ArrowDown = false;
    keys.ArrowLeft = false;
    keys.ArrowRight = false;
  });
}

// Make canvas responsive
function resizeCanvas() {
  const container = document.querySelector('.game-wrap');
  const containerWidth = container.clientWidth;
  const scale = Math.min(containerWidth / CANVAS_WIDTH, 1);

  canvas.style.width = (CANVAS_WIDTH * scale) + 'px';
  canvas.style.height = (CANVAS_HEIGHT * scale) + 'px';
}

window.addEventListener('resize', resizeCanvas);

// Check if position collides with wall
function isWall(x, y) {
  const col = Math.floor(x);
  const row = Math.floor(y);

  if (row < 0 || row >= maze.length || col < 0 || col >= maze[0].length) {
    return true;
  }

  return maze[row][col] === 1;
}

// Check collision with proper bounds (prevents sprite overlap with walls)
function checkCollision(x, y) {
  // Check center point and points around the sprite perimeter
  const offset = 0.35; // ~40% of a tile = keeps sprite from overlapping walls

  // Check center
  if (isWall(x, y)) return true;

  // Check 4 corners around the sprite
  if (isWall(x - offset, y - offset)) return true; // top-left
  if (isWall(x + offset, y - offset)) return true; // top-right
  if (isWall(x - offset, y + offset)) return true; // bottom-left
  if (isWall(x + offset, y + offset)) return true; // bottom-right

  return false;
}

// Update player position
function update() {
  let dx = 0;
  let dy = 0;

  if (keys.ArrowUp || keys.w) dy -= 1;
  if (keys.ArrowDown || keys.s) dy += 1;
  if (keys.ArrowLeft || keys.a) dx -= 1;
  if (keys.ArrowRight || keys.d) dx += 1;

  // Normalize diagonal movement
  if (dx !== 0 && dy !== 0) {
    dx *= 0.707;
    dy *= 0.707;
  }

  // Try to move horizontally with proper collision
  const newX = player.x + dx * player.speed;
  if (!checkCollision(newX, player.y)) {
    player.x = newX;
  }

  // Try to move vertically with proper collision
  const newY = player.y + dy * player.speed;
  if (!checkCollision(player.x, newY)) {
    player.y = newY;
  }

  // Update invincibility
  if (invincible) {
    flashTimer++;
    if (flashTimer > 120) { // 2 seconds at 60fps
      invincible = false;
      flashTimer = 0;
    }
  }

  // Update level popup timer
  if (showLevelPopup && levelPopupTimer > 0) {
    levelPopupTimer--;
    if (levelPopupTimer <= 0) {
      showLevelPopup = false;
    }
  }

  // Update freeze timer
  if (enemiesFrozen && freezeTimer > 0) {
    freezeTimer--;
    if (freezeTimer <= 0) {
      enemiesFrozen = false;
    }
  }

  // Update enemies (only if not frozen)
  if (!enemiesFrozen) {
    updateEnemies();
  }

  // Check collision with enemies
  checkEnemyCollision();

  // Check collision with answers
  checkAnswerCollision();

  // Check collision with gems
  checkGemCollision();

  // Check collision with key
  if (keyVisible && !keyCollected) {
    checkKeyCollision();
  }

  // Check collision with lock
  if (lockVisible && keyCollected) {
    checkLockCollision();
  }
}

// Check if player collects an answer
function checkAnswerCollision() {
  answers.forEach(answer => {
    if (answer.collected) return;

    const dist = Math.sqrt(
      Math.pow((player.x - answer.x) * TILE_SIZE, 2) +
      Math.pow((player.y - answer.y) * TILE_SIZE, 2)
    );

    if (dist < 35) {
      answer.collected = true;

      if (answer.correct) {
        score += 100;

        // Spawn key and lock on opposite sides
        keyPosition = { x: 2.5, y: 2.5 }; // Left side
        lockPosition = { x: 17.5, y: 9.5 }; // Right side
        keyVisible = true;
        lockVisible = true;
        keyCollected = false;

        // Show brief message
        levelPopupText = '✓ Correct!\nFind the key and unlock!';
        showLevelPopup = true;
        levelPopupTimer = 120; // Show for 2 seconds
      } else {
        score -= 50;
        lives--;

        // Play hurt sound for wrong answer
        hurtSound.currentTime = 0;
        hurtSound.play().catch(e => console.log('Audio play failed:', e));

        if (lives <= 0) {
          levelPopupText = 'Game Over!\nFinal Score: ' + score + '\nRefreshing...';
          showLevelPopup = true;
          levelPopupTimer = 180;

          setTimeout(() => {
            lives = 3;
            score = 0;
            currentLevel = 0;
            question = levels[currentLevel].question;
            answers = levels[currentLevel].answers;
            maze = mazes[0];
            enemies = generateEnemies(levels[currentLevel].enemyCount);
            player.x = 1.5;
            player.y = 1.5;
            showLevelPopup = false;
          }, 3000);
        }
      }
    }
  });
}

// Check if player collects a gem
function checkGemCollision() {
  gems.forEach(gem => {
    if (gem.collected) return;

    const dist = Math.sqrt(
      Math.pow((player.x - gem.x) * TILE_SIZE, 2) +
      Math.pow((player.y - gem.y) * TILE_SIZE, 2)
    );

    if (dist < 30) {
      gem.collected = true;
      score += 50; // Gem points

      // Freeze enemies for 2 seconds (120 frames at 60fps)
      enemiesFrozen = true;
      freezeTimer = 120;
    }
  });
}

// Check if player collects the key
function checkKeyCollision() {
  const dist = Math.sqrt(
    Math.pow((player.x - keyPosition.x) * TILE_SIZE, 2) +
    Math.pow((player.y - keyPosition.y) * TILE_SIZE, 2)
  );

  if (dist < 30) {
    keyCollected = true;
    keyVisible = false; // Key travels with player now
  }
}

// Check if player unlocks with the key
function checkLockCollision() {
  const dist = Math.sqrt(
    Math.pow((player.x - lockPosition.x) * TILE_SIZE, 2) +
    Math.pow((player.y - lockPosition.y) * TILE_SIZE, 2)
  );

  if (dist < 30) {
    // Unlock! Advance to next level
    lockVisible = false;
    keyCollected = false;

    currentLevel++;
    if (currentLevel >= levels.length - 1) {
      // Completed all levels!
      levelPopupText = '🎉 Congratulations!\nYou completed all levels!\nFinal Score: ' + score;
      currentLevel = levels.length - 1;
    } else {
      levelPopupText = '🔓 Unlocked!\nAdvancing to Level ' + (currentLevel + 1);
    }

    showLevelPopup = true;
    levelPopupTimer = 180;

    // Load next level
    setTimeout(() => {
      question = levels[currentLevel].question;
      answers = levels[currentLevel].answers;
      maze = mazes[Math.min(currentLevel, mazes.length - 1)];
      enemies = generateEnemies(levels[currentLevel].enemyCount);
      gems = generateGems(); // Regenerate gems for new level
      player.x = 1.5;
      player.y = 1.5;
    }, 100);
  }
}

// Simple AI for enemies
function updateEnemies() {
  enemies.forEach(enemy => {
    enemy.nextDirChange--;

    // Change direction periodically or when stuck
    if (enemy.nextDirChange <= 0) {
      // Simple chase AI - move towards player
      const dx = player.x - enemy.x;
      const dy = player.y - enemy.y;

      // Choose primary direction
      if (Math.abs(dx) > Math.abs(dy)) {
        enemy.dirX = dx > 0 ? 1 : -1;
        enemy.dirY = 0;
      } else {
        enemy.dirX = 0;
        enemy.dirY = dy > 0 ? 1 : -1;
      }

      enemy.nextDirChange = 60 + Math.random() * 60; // Change direction every 1-2 seconds
    }

    // Try to move in current direction with proper collision
    const newX = enemy.x + enemy.dirX * enemy.speed;
    const newY = enemy.y + enemy.dirY * enemy.speed;

    if (!checkCollision(newX, enemy.y)) {
      enemy.x = newX;
    } else {
      enemy.nextDirChange = 0; // Hit wall, change direction
    }

    if (!checkCollision(enemy.x, newY)) {
      enemy.y = newY;
    } else {
      enemy.nextDirChange = 0; // Hit wall, change direction
    }
  });
}

// Check if player collides with any enemy
function checkEnemyCollision() {
  if (invincible) return;

  enemies.forEach(enemy => {
    const dist = Math.sqrt(
      Math.pow((player.x - enemy.x) * TILE_SIZE, 2) +
      Math.pow((player.y - enemy.y) * TILE_SIZE, 2)
    );

    if (dist < 30) {
      lives--;
      invincible = true;
      flashTimer = 0;

      // Play hurt sound
      hurtSound.currentTime = 0;
      hurtSound.play().catch(e => console.log('Audio play failed:', e));

      if (lives <= 0) {
        alert('Game Over! Refresh to play again.');
        lives = 3; // Reset
        player.x = 1.5;
        player.y = 1.5;
      }
    }
  });
}

// Render the game
function render() {
  animTime += 0.05;

  // Clear canvas with gradient background
  const bgGradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
  bgGradient.addColorStop(0, '#0F1117');
  bgGradient.addColorStop(1, '#1a0f2e');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Draw subtle grid pattern in background
  ctx.strokeStyle = 'rgba(106, 47, 232, 0.05)';
  ctx.lineWidth = 1;
  for (let i = 0; i < CANVAS_WIDTH; i += 48) {
    ctx.beginPath();
    ctx.moveTo(i, HUD_HEIGHT);
    ctx.lineTo(i, CANVAS_HEIGHT);
    ctx.stroke();
  }
  for (let i = HUD_HEIGHT; i < CANVAS_HEIGHT; i += 48) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(CANVAS_WIDTH, i);
    ctx.stroke();
  }

  // Draw maze (offset down by HUD_HEIGHT)
  for (let row = 0; row < maze.length; row++) {
    for (let col = 0; col < maze[row].length; col++) {
      if (maze[row][col] === 1) {
        // Animated pulsing glow
        const glowIntensity = 15 + Math.sin(animTime + col + row) * 5;

        // Draw wall with animated glow effect
        ctx.shadowBlur = glowIntensity;
        ctx.shadowColor = '#6A2FE8';
        ctx.fillStyle = '#2A1F4A';
        ctx.fillRect(
          col * TILE_SIZE + 2,
          row * TILE_SIZE + HUD_HEIGHT + 2,
          TILE_SIZE - 4,
          TILE_SIZE - 4
        );

        // Inner glow with gradient
        const gradient = ctx.createLinearGradient(
          col * TILE_SIZE,
          row * TILE_SIZE + HUD_HEIGHT,
          col * TILE_SIZE + TILE_SIZE,
          row * TILE_SIZE + HUD_HEIGHT + TILE_SIZE
        );
        gradient.addColorStop(0, '#2A1F4A');
        gradient.addColorStop(1, '#1B1F2A');

        ctx.shadowBlur = 8;
        ctx.shadowColor = '#E44FD6';
        ctx.fillStyle = gradient;
        ctx.fillRect(
          col * TILE_SIZE + 4,
          row * TILE_SIZE + HUD_HEIGHT + 4,
          TILE_SIZE - 8,
          TILE_SIZE - 8
        );

        // Reset shadow
        ctx.shadowBlur = 0;
      }
    }
  }

  // Draw gems (offset by HUD_HEIGHT)
  gems.forEach((gem, index) => {
    if (gem.collected) return;

    const gx = gem.x * TILE_SIZE;
    const gy = gem.y * TILE_SIZE + HUD_HEIGHT;

    // Floating animation
    const floatOffset = Math.sin(animTime * 3 + index) * 2;

    // Draw gem with glow
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#FFD700';

    if (gemImgs[gem.type] && gemImgs[gem.type].complete) {
      ctx.drawImage(gemImgs[gem.type], gx - 20, gy - 20 + floatOffset, 40, 40);
    } else {
      // Fallback
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(gx, gy + floatOffset, 15, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
  });

  // Draw key (if visible and not collected)
  if (keyVisible && !keyCollected) {
    const kx = keyPosition.x * TILE_SIZE;
    const ky = keyPosition.y * TILE_SIZE + HUD_HEIGHT;

    ctx.shadowBlur = 15;
    ctx.shadowColor = '#FFD700';

    if (keyImg.complete) {
      ctx.drawImage(keyImg, kx - 24, ky - 24, 48, 48);
    } else {
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(kx - 15, ky - 15, 30, 30);
    }
    ctx.shadowBlur = 0;
  }

  // Draw lock
  if (lockVisible) {
    const lx = lockPosition.x * TILE_SIZE;
    const ly = lockPosition.y * TILE_SIZE + HUD_HEIGHT;

    ctx.shadowBlur = 15;
    ctx.shadowColor = '#FF4444';

    if (lockImg.complete) {
      ctx.drawImage(lockImg, lx - 24, ly - 24, 48, 48);
    } else {
      ctx.fillStyle = '#FF4444';
      ctx.fillRect(lx - 15, ly - 15, 30, 30);
    }
    ctx.shadowBlur = 0;
  }

  // Draw collectible answers (offset by HUD_HEIGHT)
  // Make text BIGGER and easier to read
  const isMobile = window.innerWidth <= 768;
  const baseBubbleSize = isMobile ? 45 : 35; // Increased from 35/28
  const fontSize = isMobile ? 20 : 16; // Increased from 16/13

  ctx.font = `bold ${fontSize}px Orbitron, monospace, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  answers.forEach((answer, index) => {
    if (answer.collected) return;

    const ax = answer.x * TILE_SIZE;
    // Floating animation
    const floatOffset = Math.sin(animTime * 2 + index) * 3;
    const ay = answer.y * TILE_SIZE + HUD_HEIGHT + floatOffset;

    // Pulsing size - larger on mobile
    const pulseSize = baseBubbleSize + Math.sin(animTime * 3 + index) * 2;

    // All bubbles same color (neutral cyan) - no hint which is correct!
    const bubbleColor = '#19D4FF';
    const glowColor = '#19D4FF';

    // Outer glow ring
    ctx.shadowBlur = 20;
    ctx.shadowColor = glowColor;
    ctx.fillStyle = bubbleColor + '40'; // Semi-transparent
    ctx.beginPath();
    ctx.arc(ax, ay, pulseSize + 5, 0, Math.PI * 2);
    ctx.fill();

    // Main bubble with gradient
    const bubbleGradient = ctx.createRadialGradient(ax - 5, ay - 5, 5, ax, ay, pulseSize);
    bubbleGradient.addColorStop(0, '#6DD5FA');
    bubbleGradient.addColorStop(1, bubbleColor);

    ctx.shadowBlur = 15;
    ctx.fillStyle = bubbleGradient;
    ctx.beginPath();
    ctx.arc(ax, ay, pulseSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw text with shadow - BIGGER & BOLDER
    ctx.shadowBlur = 3;
    ctx.shadowColor = 'rgba(0,0,0,0.5)';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(answer.text, ax, ay);
    ctx.shadowBlur = 0;
  });

  // Draw enemies (offset by HUD_HEIGHT)
  enemies.forEach((enemy, index) => {
    const ex = enemy.x * TILE_SIZE;
    const ey = enemy.y * TILE_SIZE + HUD_HEIGHT;

    // Draw shadow under enemy
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(ex, ey + enemy.size / 3, enemy.size / 3, enemy.size / 6, 0, 0, Math.PI * 2);
    ctx.fill();

    // Change glow based on frozen state
    if (enemiesFrozen) {
      ctx.shadowBlur = 20;
      ctx.shadowColor = '#19D4FF'; // Blue glow when frozen
    } else {
      ctx.shadowBlur = 15 + Math.sin(animTime * 2 + index) * 5;
      ctx.shadowColor = '#10B981'; // Green glow normally
    }

    // Draw with tint
    ctx.save();
    ctx.globalCompositeOperation = 'source-over';

    if (slimeImg.complete) {
      ctx.drawImage(
        slimeImg,
        ex - enemy.size / 2,
        ey - enemy.size / 2,
        enemy.size,
        enemy.size
      );

      // Add tint overlay (blue if frozen, green if not)
      ctx.globalCompositeOperation = 'multiply';
      ctx.fillStyle = enemiesFrozen ? '#19D4FF' : '#10B981';
      ctx.fillRect(ex - enemy.size / 2, ey - enemy.size / 2, enemy.size, enemy.size);

      ctx.globalCompositeOperation = 'source-over';
    } else {
      // Fallback
      ctx.fillStyle = enemiesFrozen ? '#19D4FF' : '#10B981';
      ctx.beginPath();
      ctx.arc(ex, ey, enemy.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    ctx.shadowBlur = 0;
  });

  // Draw player with flash effect (offset by HUD_HEIGHT)
  const px = player.x * TILE_SIZE;
  const py = player.y * TILE_SIZE + HUD_HEIGHT;

  // Draw shadow under player
  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
  ctx.beginPath();
  ctx.ellipse(px, py + player.size / 3, player.size / 3, player.size / 6, 0, 0, Math.PI * 2);
  ctx.fill();

  // Flash effect when invincible
  if (!invincible || Math.floor(flashTimer / 10) % 2 === 0) {
    if (characterImg.complete) {
      // Glow effect around player
      if (invincible) {
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#19D4FF';
      }

      // Draw the sprite centered on player position
      ctx.drawImage(
        characterImg,
        px - player.size / 2,
        py - player.size / 2,
        player.size,
        player.size
      );

      ctx.shadowBlur = 0;
    } else {
      // Fallback if image not loaded
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(px, py, player.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Draw key following player if collected
  if (keyCollected) {
    const keyOffsetX = 15;
    const keyOffsetY = -10;
    const floatOffset = Math.sin(animTime * 4) * 2;

    ctx.shadowBlur = 10;
    ctx.shadowColor = '#FFD700';

    if (keyImg.complete) {
      ctx.drawImage(keyImg, px + keyOffsetX, py + keyOffsetY + floatOffset, 32, 32);
    } else {
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(px + keyOffsetX, py + keyOffsetY + floatOffset, 20, 20);
    }
    ctx.shadowBlur = 0;
  }

  // Draw HUD background with gradient
  const hudGradient = ctx.createLinearGradient(0, 0, 0, HUD_HEIGHT);
  hudGradient.addColorStop(0, 'rgba(26, 15, 46, 0.98)');
  hudGradient.addColorStop(1, 'rgba(15, 17, 23, 0.98)');
  ctx.fillStyle = hudGradient;
  ctx.fillRect(0, 0, CANVAS_WIDTH, HUD_HEIGHT);

  // Draw decorative corner elements
  ctx.strokeStyle = '#E44FD6';
  ctx.lineWidth = 3;
  ctx.shadowBlur = 8;
  ctx.shadowColor = '#E44FD6';

  // Top-left corner
  ctx.beginPath();
  ctx.moveTo(10, 20);
  ctx.lineTo(10, 10);
  ctx.lineTo(20, 10);
  ctx.stroke();

  // Top-right corner
  ctx.beginPath();
  ctx.moveTo(CANVAS_WIDTH - 10, 20);
  ctx.lineTo(CANVAS_WIDTH - 10, 10);
  ctx.lineTo(CANVAS_WIDTH - 20, 10);
  ctx.stroke();

  ctx.shadowBlur = 0;

  // Draw border line with glow
  ctx.strokeStyle = '#6A2FE8';
  ctx.shadowBlur = 10;
  ctx.shadowColor = '#6A2FE8';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, HUD_HEIGHT - 1);
  ctx.lineTo(CANVAS_WIDTH, HUD_HEIGHT - 1);
  ctx.stroke();
  ctx.shadowBlur = 0;

  // Responsive HUD text sizes
  const hudQuestionSize = isMobile ? 18 : 22;
  const hudScoreSize = isMobile ? 20 : 24;
  const hudLivesSize = isMobile ? 18 : 20;

  // Draw level indicator and question at top with glow
  ctx.shadowBlur = 8;
  ctx.shadowColor = '#E44FD6';
  ctx.fillStyle = '#E44FD6';
  ctx.font = `bold ${hudQuestionSize}px Orbitron, monospace, sans-serif`;
  ctx.textAlign = 'center';
  const levelText = currentLevel < levels.length - 1 ? `Level ${currentLevel + 1}: ${question}` : question;
  ctx.fillText(levelText, CANVAS_WIDTH / 2, 30);
  ctx.shadowBlur = 0;

  // Draw score box with border
  ctx.strokeStyle = '#19D4FF';
  ctx.lineWidth = 2;
  ctx.strokeRect(15, 45, 150, 35);

  // Draw decorative corners for score box
  ctx.shadowBlur = 5;
  ctx.shadowColor = '#19D4FF';
  const cornerSize = 10;

  // Top-left corner
  ctx.beginPath();
  ctx.moveTo(15 + cornerSize, 45);
  ctx.lineTo(15, 45);
  ctx.lineTo(15, 45 + cornerSize);
  ctx.stroke();

  // Top-right corner
  ctx.beginPath();
  ctx.moveTo(165 - cornerSize, 45);
  ctx.lineTo(165, 45);
  ctx.lineTo(165, 45 + cornerSize);
  ctx.stroke();

  // Bottom-left corner
  ctx.beginPath();
  ctx.moveTo(15, 80 - cornerSize);
  ctx.lineTo(15, 80);
  ctx.lineTo(15 + cornerSize, 80);
  ctx.stroke();

  // Bottom-right corner
  ctx.beginPath();
  ctx.moveTo(165, 80 - cornerSize);
  ctx.lineTo(165, 80);
  ctx.lineTo(165 - cornerSize, 80);
  ctx.stroke();

  ctx.fillStyle = '#19D4FF';
  ctx.font = `bold ${hudScoreSize}px Orbitron, monospace, sans-serif`;
  ctx.textAlign = 'left';
  ctx.fillText('Score: ' + score, 25, 68);
  ctx.shadowBlur = 0;

  // Draw lives box with border
  ctx.strokeStyle = '#FF4444';
  ctx.strokeRect(CANVAS_WIDTH - 170, 45, 155, 35);

  // Draw decorative corners for lives box
  ctx.shadowBlur = 5;
  ctx.shadowColor = '#FF4444';
  const livesBoxLeft = CANVAS_WIDTH - 170;
  const livesBoxRight = CANVAS_WIDTH - 15;

  // Top-left corner
  ctx.beginPath();
  ctx.moveTo(livesBoxLeft + cornerSize, 45);
  ctx.lineTo(livesBoxLeft, 45);
  ctx.lineTo(livesBoxLeft, 45 + cornerSize);
  ctx.stroke();

  // Top-right corner
  ctx.beginPath();
  ctx.moveTo(livesBoxRight - cornerSize, 45);
  ctx.lineTo(livesBoxRight, 45);
  ctx.lineTo(livesBoxRight, 45 + cornerSize);
  ctx.stroke();

  // Bottom-left corner
  ctx.beginPath();
  ctx.moveTo(livesBoxLeft, 80 - cornerSize);
  ctx.lineTo(livesBoxLeft, 80);
  ctx.lineTo(livesBoxLeft + cornerSize, 80);
  ctx.stroke();

  // Bottom-right corner
  ctx.beginPath();
  ctx.moveTo(livesBoxRight, 80 - cornerSize);
  ctx.lineTo(livesBoxRight, 80);
  ctx.lineTo(livesBoxRight - cornerSize, 80);
  ctx.stroke();

  ctx.textAlign = 'right';
  ctx.fillStyle = '#FF4444';
  ctx.font = `bold ${hudLivesSize}px Orbitron, monospace, sans-serif`;
  ctx.fillText('Lives:', CANVAS_WIDTH - 115, 68);

  if (heartImg.complete && heartImg.naturalWidth > 0) {
    // Enable smoothing for heart images (they're not pixel art)
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    for (let i = 0; i < lives; i++) {
      // Slight bounce animation on hearts
      const bounce = Math.sin(animTime * 4 + i) * 1;
      ctx.drawImage(heartImg, CANVAS_WIDTH - 105 + (i * 38), 47 + bounce, 32, 32);
    }
    // Disable smoothing again for pixel art sprites
    ctx.imageSmoothingEnabled = false;
  } else {
    // Fallback to text hearts
    ctx.fillStyle = '#FF4444';
    ctx.fillText('♥'.repeat(lives), CANVAS_WIDTH - 20, 68);
  }

  ctx.shadowBlur = 0;

  // Draw in-game level popup overlay
  if (showLevelPopup) {
    // Semi-transparent overlay
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Popup box
    const boxWidth = 500;
    const boxHeight = 200;
    const boxX = (CANVAS_WIDTH - boxWidth) / 2;
    const boxY = (CANVAS_HEIGHT - boxHeight) / 2;

    // Box background with gradient
    const popupGradient = ctx.createLinearGradient(boxX, boxY, boxX, boxY + boxHeight);
    popupGradient.addColorStop(0, '#1B1F2A');
    popupGradient.addColorStop(1, '#0F1117');
    ctx.fillStyle = popupGradient;
    ctx.fillRect(boxX, boxY, boxWidth, boxHeight);

    // Box border with glow
    ctx.strokeStyle = '#E44FD6';
    ctx.lineWidth = 3;
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#E44FD6';
    ctx.strokeRect(boxX, boxY, boxWidth, boxHeight);
    ctx.shadowBlur = 0;

    // Popup text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 28px Orbitron, monospace, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    const lines = levelPopupText.split('\n');
    const lineHeight = 40;
    const startY = boxY + boxHeight / 2 - ((lines.length - 1) * lineHeight) / 2;

    lines.forEach((line, index) => {
      ctx.fillText(line, CANVAS_WIDTH / 2, startY + index * lineHeight);
    });
  }
}

// Game loop
function gameLoop() {
  if (!gamePaused) {
    update();
    render();
  }
  requestAnimationFrame(gameLoop);
}

// Wait for all images to load before starting
let imagesLoaded = 0;
const totalImages = 10; // character, slime, heart, 4 gems, key, lock

function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    console.log('All images loaded, starting game');
    setupMobileControls();
    resizeCanvas();
    gameLoop();
  }
}

characterImg.onload = imageLoaded;
slimeImg.onload = imageLoaded;
heartImg.onload = imageLoaded;
keyImg.onload = imageLoaded;
lockImg.onload = imageLoaded;

// Load gem images
gemImgs.forEach((gemImg, index) => {
  gemImg.onload = imageLoaded;
  gemImg.onerror = () => {
    console.error(`Failed to load gem ${gemColors[index]} image`);
    imageLoaded();
  };
});

// Error handling
characterImg.onerror = () => {
  console.error('Failed to load character sprite');
  imageLoaded();
};
slimeImg.onerror = () => {
  console.error('Failed to load slime sprite');
  imageLoaded();
};
heartImg.onerror = () => {
  console.error('Failed to load heart image');
  imageLoaded();
};
keyImg.onerror = () => {
  console.error('Failed to load key image');
  imageLoaded();
};
lockImg.onerror = () => {
  console.error('Failed to load lock image');
  imageLoaded();
};

// Pause game when user navigates away from game section
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      // Canvas is visible - resume game
      gamePaused = false;
      console.log('Game resumed');
    } else {
      // Canvas is not visible - pause game
      gamePaused = true;
      console.log('Game paused');
    }
  });
}, {
  threshold: 0.1 // Trigger when at least 10% of canvas is visible
});

// Start observing the canvas
observer.observe(canvas);
