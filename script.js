const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const player = {
    x: 50,
    y: 300,
    width: 50,
    height: 50,
    speed: 5,
    dx: 0,
    dy: 0,
    gravity: 0.5,
    jumpPower: -10,
    isJumping: false
};

const keys = {
    right: false,
    left: false,
    up: false
};

const obstacles = [];
const collectibles = [];

function drawPlayer() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawObstacles() {
    ctx.fillStyle = 'red';
    obstacles.forEach(obstacle => {
        ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
    });
}

function drawCollectibles() {
    ctx.fillStyle = 'green';
    collectibles.forEach(collectible => {
        if (!collectible.collected) {
            ctx.fillRect(collectible.x, collectible.y, collectible.width, collectible.height);
        }
    });
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function newPos() {
    player.dy += player.gravity;
    player.y += player.dy;

    if (player.y + player.height > canvas.height) {
        player.y = canvas.height - player.height;
        player.dy = 0;
        player.isJumping = false;
    }

    player.x += player.dx;

    if (player.x < 0) {
        player.x = 0;
    } else if (player.x + player.width > canvas.width) {
        player.x = canvas.width - player.width;
    }

    if (keys.right) {
        player.dx = player.speed;
    } else if (keys.left) {
        player.dx = -player.speed;
    } else {
        player.dx = 0;
    }

    if (keys.up && !player.isJumping) {
        player.dy = player.jumpPower;
        player.isJumping = true;
    }
}

function isColliding(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

function handleCollisions() {
    obstacles.forEach(obstacle => {
        if (isColliding(player, obstacle)) {
            if (player.dx > 0) {
                player.x = obstacle.x - player.width;
            } else if (player.dx < 0) {
                player.x = obstacle.x + obstacle.width;
            }
            player.dx = 0;
        }
    });

    collectibles.forEach(collectible => {
        if (isColliding(player, collectible) && !collectible.collected) {
            collectible.collected = true;
        }
    });
}

let level = 1;

function generateLevel() {
    obstacles.length = 0;
    collectibles.length = 0;

    const maxObstacles = Math.min(level, 10);
    const maxCollectibles = Math.min(level, 5);

    for (let i = 0; i < maxObstacles; i++) {
        let obstacle = {
            x: Math.random() * (canvas.width - 50),
            y: canvas.height - 50,
            width: 50,
            height: Math.random() * (player.height + 30)
        };
        obstacles.push(obstacle);
    }

    for (let i = 0; i < maxCollectibles; i++) {
        let collectible;
        do {
            collectible = {
                x: Math.random() * (canvas.width - 20),
                y: canvas.height - 20,
                width: 20,
                height: 20,
                collected: false
            };
        } while (obstacles.some(obstacle => isColliding(obstacle, collectible)));

        collectibles.push(collectible);
    }
}

function checkLevelCompletion() {
    if (collectibles.every(collectible => collectible.collected)) {
        level++;
        generateLevel();
    }
}

function update() {
    clear();
    drawPlayer();
    drawObstacles();
    drawCollectibles();
    newPos();
    handleCollisions();
    checkLevelCompletion();
    requestAnimationFrame(update);
}

function keyDown(e) {
    if (e.key === 'ArrowRight' || e.key === 'Right') {
        keys.right = true;
    } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        keys.left = true;
    } else if (e.key === 'ArrowUp' || e.key === 'Up') {
        keys.up = true;
    }
}

function keyUp(e) {
    if (e.key === 'ArrowRight' || e.key === 'Right') {
        keys.right = false;
    } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        keys.left = false;
    } else if (e.key === 'ArrowUp' || e.key === 'Up') {
        keys.up = false;
    }
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

generateLevel();
update();