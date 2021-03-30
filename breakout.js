(function () {
    drawTable();

    let level = [
        '**************',
        '**************',
        '**************',
        '**************'
    ];

    let username;
    let load = true;
    let point = 0;
    let cpuPlayer = true;
    let isGameRunning = true;
    let keyboardClientX = 0;
    let acceleration1 = 3;
    let acceleration2 = -3;

    let gameLoop;
    let gameSpeed = 20;
    let ballMovementSpeed = 3;

    let bricks = [];
    let bricksMargin = 1;
    let bricksWidth = 0;
    let bricksHeight = 18;
    let score = 0;
    let lives = 3;

    let ball = {
        width: 6,
        height: 6,
        left: 0,
        top: 0,
        speedLeft: 0,
        speedTop: 0
    };

    let paddle = {
        width: 100,
        height: 6,
        left: (document.getElementById('breakout').offsetWidth / 2) - 30,
        top: document.getElementById('breakout').offsetHeight - 40
    };

    function drawTable() {
        document.body.style.background = '#0E5CAD';
        document.body.style.font = '18px Orbitron';
        document.body.style.color = '#FFF';

        let breakout = document.createElement('div');
        let paddle = document.createElement('div');
        let ball = document.createElement('div');

        breakout.id = 'breakout';
        breakout.style.width = '800px';
        breakout.style.height = '600px';
        breakout.style.position = 'fixed';
        breakout.style.left = '50%';
        breakout.style.top = '50%';
        breakout.style.transform = 'translate(-50%, -50%)';
        breakout.style.background = '#000000';

        paddle.id = 'paddle';
        paddle.style.background = '#E80505';
        paddle.style.position = 'absolute';
        paddle.style.boxShadow = '0 15px 6px -2px rgba(0,0,0,.6)';

        ball.className = 'ball';
        ball.style.position = 'absolute';
        ball.style.background = '#FFF';
        ball.style.boxShadow = '0 15px 6px -1px rgba(0,0,0,.6)';
        ball.style.borderRadius = '50%';
        ball.style.zIndex = '9';

        breakout.appendChild(paddle);
        breakout.appendChild(ball);

        document.body.appendChild(breakout);
    }

    function removeElement(element) {
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    }

    function buildLevel() {
        let arena = document.getElementById('breakout');

        for (let row = 0; row < level.length; row++) {
            for (let column = 0; column <= level[row].length; column++) {

                if (!level[row][column] || level[row][column] === ' ') {
                    continue;
                }

                bricksWidth = (arena.offsetWidth - bricksMargin * 2) / level[row].length;

                bricks.push({
                    left: bricksMargin * 2 + (bricksWidth * column),
                    top: bricksHeight * row + 60,
                    width: bricksWidth - bricksMargin * 2,
                    height: bricksHeight - bricksMargin * 2,
                    removed: false
                });
            }
        }
    }

    function removeBricks() {
        document.querySelectorAll('.brick').forEach(function (brick) {
            removeElement(brick);
        });
    }

    function createBricks() {
        removeBricks();

        let arena = document.getElementById('breakout');

        bricks.forEach(function (brick, index) {

            if (brick.removed == false) {
                let element = document.createElement('div');

                element.id = 'brick-' + index;
                element.className = 'brick';
                element.style.left = brick.left + 'px';
                element.style.top = brick.top + 'px';
                element.style.width = brick.width + 'px';
                element.style.height = brick.height + 'px';
                element.style.background = '#FFFFFF';
                element.style.position = 'absolute';
                element.style.boxShadow = '0 15px 20px 0px rgba(0,0,0,.4)';

                arena.appendChild(element)
            }

        });
    }

    function updateObjects() {
        ball.left += ball.speedLeft;
        document.getElementById('paddle').style.width = paddle.width + 'px';
        document.getElementById('paddle').style.height = paddle.height + 'px';
        document.getElementById('paddle').style.left = paddle.left + 'px';
        document.getElementById('paddle').style.top = paddle.top + 'px';

        document.querySelector('.ball').style.width = ball.width + 'px';
        document.querySelector('.ball').style.height = ball.height + 'px';
        document.querySelector('.ball').style.left = ball.left + 'px';
        document.querySelector('.ball').style.top = ball.top + 'px';

        let newDomEl = document.querySelector('.ball').cloneNode(true);
        newDomEl.classList.remove("ball");
        breakout.appendChild(newDomEl);

        setTimeout(() => {
            removeElement(newDomEl)
        }, 100)

    }

    function resetBall() {
        let arena = document.getElementById('breakout');

        ball.left = (arena.offsetWidth / 2) - (ball.width / 2);
        ball.top = (arena.offsetHeight / 1.6) - (ball.height / 2);
        ball.speedLeft = 1;
        ball.speedTop = ballMovementSpeed;

        if (Math.round(Math.random() * 1)) {
            ball.speedLeft = -ballMovementSpeed;
        }

        document.querySelector('.ball').style.left = ball.left + 'px';
        document.querySelector('.ball').style.top = ball.top + 'px';
    }

    function movePaddle(clientX) {
        let arena = document.getElementById('breakout');
        let arenaRect = arena.getBoundingClientRect();
        let arenaWidth = arena.offsetWidth;
        let mouseX = clientX - arenaRect.x;
        let halfOfPaddle = document.getElementById('paddle').offsetWidth / 2;

        if (mouseX <= halfOfPaddle) {
            mouseX = halfOfPaddle;
        }

        if (mouseX >= arenaWidth - halfOfPaddle) {
            mouseX = arenaWidth - halfOfPaddle;
        }

        paddle.left = mouseX - halfOfPaddle;
    }

    function detectCollision() {
        if (ball.top + ball.height >= paddle.top &&
            ball.top + ball.height <= paddle.top + paddle.height &&
            ball.left >= paddle.left &&
            ball.left <= paddle.left + paddle.width
        ) {
            ball.speedTop = -ball.speedTop;
        }

        for (let i = 0; i < bricks.length; i++) {
            let brick = bricks[i];

            if (ball.top + ball.height >= brick.top &&
                ball.top <= brick.top + brick.height &&
                ball.left + ball.width >= brick.left &&
                ball.left <= brick.left + brick.width &&
                !brick.removed
            ) { 
                randomNumber();
                if(randomNumber() == 5){
                    lives += 1;
                    document.getElementById("lives").innerText = "Remaining lives: " + lives;
                    alert("Congratulations! You earned a life. To continue click OK.")
                }

                ball.speedTop = -ball.speedTop;
                brick.removed = true;
                let b = document.getElementById('brick-' + i);
                removeElement(b);
                score += 5;
                point = score;
                if (score === 280) {
                    alert("Congratulations!")
                    window.location.reload()
                }
                document.getElementById("score").innerText = "Your score: " + score;
                if (ball.speedLeft > 0) {
                    ball.speedLeft = acceleration1;
                    acceleration1 += 3;
                } else {
                    ball.speedLeft = acceleration2;
                    acceleration2 -= 3;
                }
                break;
            }
        }
    }

    function drawScoreBoard() {
        let scoreDiv = document.createElement("div");
        scoreDiv.id = "score";
        scoreDiv.style = "float: right;";
        scoreDiv.innerText = "Your score: " + score;
        document.body.appendChild(scoreDiv);
    }

    function drawLives() {
        let remainingLives = document.createElement("div");
        remainingLives.id = "lives";
        remainingLives.style = "margin-right: 50%";
        remainingLives.style = "margin-left: 45%";
        remainingLives.innerText = "Remaining lives: " + lives;
        document.body.appendChild(remainingLives);
    }

    function start() {

        if (!cpuPlayer) {
            username = prompt("Please enter your username.")
        }
        if (!load) {
            let loadInfo = localStorage.getItem(username)
            let loadObj = JSON.parse(loadInfo);
            lives = loadObj.lives;
            score = loadObj.point;
            bricks = loadObj.bricks;
        }

        function moveBall() {

            detectCollision();

            if (ball.speedTop >= 0 && cpuPlayer) {
                paddle.left = ball.left - paddle.width / 2;
            }

            let arena = document.getElementById('breakout');

            ball.top += ball.speedTop;

            if (ball.left <= 0 || ball.left + ball.width >= arena.offsetWidth) {
                ball.speedLeft = -ball.speedLeft;
            }

            if (ball.top <= 0 || ball.top + ball.height >= arena.offsetHeight) {
                ball.speedTop = -ball.speedTop;
            }

            if (ball.top + ball.height >= arena.offsetHeight) {
                lives -= 1;
                if (lives === 0) {
                    isGameRunning = false;
                    scoreObj = {
                        username: username,
                        point: point
                    }
                    localStorage.setItem(username, JSON.stringify(scoreObj))
                    alert("Game Over")
                    window.location.reload();
                }
                document.getElementById("lives").innerText = "Remaining lives: " + lives;
                resetBall();
            }
        }

        let saveButton = document.createElement("button");
        saveButton.innerHTML = "SAVE";
        saveButton.addEventListener("click", function () {
            let gameSaveObject = {
                lives: lives,
                point: point,
                bricks: bricks
            }
            localStorage.setItem(username, JSON.stringify(gameSaveObject))
            alert("Game Saved.")
            window.location.reload();
        })

        function startGameLoop() {
            gameLoop = setInterval(function () {
                if (isGameRunning) {
                    moveBall();
                    updateObjects();
                }
            }, gameSpeed);
        }

        function setEvents() {
            if (!cpuPlayer) {
                document.addEventListener('mousemove', function (event) {
                    movePaddle(event.clientX);
                    keyboardClientX = event.clientX;
                });
            }
            document.addEventListener('keydown', function (e) {
                if (e.keyCode == '37' && !cpuPlayer) {
                    keyboardClientX -= 15;
                    movePaddle(keyboardClientX);
                } else if (e.keyCode == '39' && !cpuPlayer) {
                    keyboardClientX += 15;
                    movePaddle(keyboardClientX);
                } else if (e.keyCode == '27') {
                    isGameRunning = !isGameRunning;
                    document.body.appendChild(saveButton);
                }
            })
        }

        function startGame() {
            resetBall();
            createBricks();
            updateObjects();
            drawScoreBoard();
            drawLives();
        }
        setEvents();
        startGame();
        startGameLoop();
    }

    function randomNumber(){
        return Math.floor((Math.random() * 10) + 1);
    }

    let startButton = document.createElement("button");
    startButton.innerText = "START";
    document.body.appendChild(startButton);

    startButton.addEventListener("click", buttons);

    function buttons() {

        let youButton = document.createElement("button");
        youButton.innerText = "YOU";
        youButton.style.background = "#FFC300";
        document.body.appendChild(youButton);

        let cpuButton = document.createElement("button");
        cpuButton.innerText = "CPU";
        cpuButton.style.background = "#FF5733";
        document.body.appendChild(cpuButton);

        let loadButton = document.createElement("button");
        loadButton.innerText = "LOAD";
        loadButton.style.background = "white";
        document.body.appendChild(loadButton);

        cpuButton.addEventListener("click", function () {
            buildLevel();
            start();
        });
        youButton.addEventListener("click", function () {
            buildLevel();
            cpuPlayer = false;
            start();
        });
        loadButton.addEventListener("click", function () {
            cpuPlayer = false;
            load = false;
            start();
        });
    }

    (function () {

        let scoreEl = document.createElement("div");
        scoreEl.style = "float: right; margin-top: 150px; margin-right: 50px;"
        scoreEl.innerHTML = "<h1>All Scores</h1>";
        document.body.appendChild(scoreEl);

        for (let key in localStorage) {
            let loadInfo = localStorage.getItem(key)
            let loadObj = JSON.parse(loadInfo);
            if(loadObj == null){
                break;
            }
            if (loadObj.point >= 0 && loadObj.username !== undefined) {
                scoreEl.innerHTML += loadObj.username + ": " + loadObj.point + "<br>";
            }
        }
    })();

})();