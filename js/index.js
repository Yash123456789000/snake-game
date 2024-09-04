// Game Constants & Variables
let inputDir = {x: 0, y: 0}; 
const foodSound = new Audio('music/food.mp3');
const gameOverSound = new Audio('music/gameover.mp3');
const moveSound = new Audio('music/move.mp3');
const musicSound = new Audio('music/music.mp3');
let speed = 5;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [
    {x: 13, y: 15}
];
let temp1=0;

food = {x: 6, y: 7};

// Game Functions
function main(ctime) {
    window.requestAnimationFrame(main);
    // console.log(ctime)
    if((ctime - lastPaintTime)/1000 < 1/speed){
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(snake) {
    // If you bump into yourself 
    for (let i = 1; i < snakeArr.length; i++) {
        if(snake[i].x === snake[0].x && snake[i].y === snake[0].y){
            return true;
        }
    }
    // If you bump into the wall
    if(snake[0].x >= 18 || snake[0].x <=0 || snake[0].y >= 18 || snake[0].y <=0){
        return true;
    }
        
    return false;
}

function isSafe(x,y){
    for(let i=0; i<snakeArr.length; i++){
        if(snakeArr[i].x == x && snakeArr[i].y == y){
            return false;
        }
    }
    return true;
}

function randCoorGen(){
    let x = Math.round(2 + 14* Math.random())
    let y = Math.round(2 + 14* Math.random())
    if(isSafe(x,y)){
        return [x, y];
    }
    else{
        let temp = randCoorGen();
        return temp;
    }
}

function movingFood(food){
    let foodDirx =  Math.round((-1) + 2* Math.random())
    let foodDiry =  Math.round((-1) + 2* Math.random())
    if(((food.x + foodDirx)>2 && (food.x + foodDirx)<18) && ((food.y + foodDiry)>2 && (food.y + foodDiry)<18) && isSafe((food.x + foodDirx),(food.y + foodDiry))){
        return [(food.x + foodDirx),(food.y + foodDiry)]
    }
    else{
        let temp = movingFood(food);
        return temp;
    }
}

function gameEngine(){
    // Part 1: Updating the snake array & Food
    if(isCollide(snakeArr)){
        gameOverSound.play();
        musicSound.pause();
        inputDir =  {x: 0, y: 0}; 
        alert("Game Over. Press any key to play again!");
        snakeArr = [{x: 13, y: 15}];
        musicSound.play();
        score = 0;
        speed = 5; 
        temp1=0;
    }

    // If you have eaten the food, increment the score and regenerate the food
    if(snakeArr[0].y === food.y && snakeArr[0].x === food.x){
        foodSound.play();
        score += 1;
        if(score >= 10){
            if(temp1==0){
                alert("From now food will also start to move, so be careful and quick!");
            }            
            let coor = randCoorGen();
            let a = coor[0];
            let b = coor[1];
            food = {x: a, y: b};
            setInterval(() => {
                food.x = movingFood(food)[0];
                food.y = movingFood(food)[1];
            }, (speed/2)*1000)
            temp1 += 1;
        }
        else{
            let coor = randCoorGen();
            let a = coor[0];
            let b = coor[1];
            food = {x: a, y: b};
        }
        speed += 0.2;
        if(score>hiscoreval){
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML = "High-Score: " + hiscoreval;
        }
        scoreBox.innerHTML = "Score: " + score;
        snakeArr.unshift({x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y});
        
    }


    // Moving the snake
    for (let i = snakeArr.length - 2; i>=0; i--) { 
        snakeArr[i+1] = {...snakeArr[i]};
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Part 2: Display the snake and Food
    // Display the snake
    board.innerHTML = "";
    snakeArr.forEach((e, index)=>{
        snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;

        if(index === 0){
            snakeElement.classList.add('head');
        }
        else{
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    });
    // Display the food
    foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food')
    board.appendChild(foodElement);


}


// Main logic starts here
musicSound.play();
let hiscore = localStorage.getItem("hiscore");
if(hiscore === null){
    hiscoreval = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval))
}
else{
    hiscoreval = JSON.parse(hiscore);
    hiscoreBox.innerHTML = "HiScore: " + hiscore;
}

window.requestAnimationFrame(main);
window.addEventListener('keydown', e =>{
    inputDir = {x: 0, y: 0} // Start the game
    moveSound.play();
    switch (e.key) {
        case "ArrowUp":
            console.log("ArrowUp");
            if(inputDir.y == 1){
                // inputDir.y = 1;
                break;
            }
            else{
                inputDir.x = 0;
                inputDir.y = -1;
                break;
            }
            

        case "ArrowDown":
            console.log("ArrowDown");
            if(inputDir.y == -1){
                // inputDir.y = -1;
                break;
            }
            else{
                inputDir.x = 0;
                inputDir.y = 1;
                break;
            }
            

        case "ArrowLeft":
            console.log("ArrowLeft");
            if(inputDir.x == 1){
                // inputDir.x = 1;
                break;
            }
            else{
                inputDir.x = -1; 
                inputDir.y = 0;
                break;    
            }

        case "ArrowRight":
            console.log("ArrowRight");
            if(inputDir.x == -1){
                // inputDir.x = -1;
                break;
            }
            else{
                inputDir.x = 1;
                inputDir.y = 0;
                break;
            }
            
        default:
            break;
    }

});
