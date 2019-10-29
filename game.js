var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
var aPressed = false;
var grounded = true;
var hasReleased = true;
var releaseMode = false;
var notDoubleJumped = true;
var modes = ["normal", "double", "dash"];
var currentMode = 0;
var red = 0;
var blue = 255;
var green = 0;
var player = {x: 30, y: 400, width: 25, height: 25};
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
    else if(e.key == "Up" || e.key == "ArrowUp"){
        upPressed = true;
    }
    else if(e.key == "Down" || e.key == "ArrowDown"){
        downPressed = true;
    }
    else if(e.key == "a" || e.key == "A"){
        aPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    }
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
    else if(e.key == "Up" || e.key == "ArrowUp"){
        upPressed = false;
        hasReleased = true;
    }
    else if(e.key == "Down" || e.key == "ArrowDown"){
        downPressed = false;
    }
    else if(e.key == "a" || e.key == "A"){
        aPressed = false;
        releaseMode = false;

    }
}

var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");
var ground = {x:0, y:425, width: canvas.width, height: 30, mode:-1};
var level = [ground,{x : 200, y:350, width: 90, height: 30, mode:-1},
    {x:350,y:350,width:50,height:100, mode:-1}, {x:550, y:350,width:100,height:100, mode:-1}, {x:350,y:250,width:50,height:100,mode:0}];
// var y = 400;
// var x = 30;
var dx = 0;
var dy = 0;
console.log("Game");
function draw(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    gravity();
    dx = dxSpeed();
    // wallCollision();
    jump();
    // var didCollide = groundCollision();
    // headCollision();
    // wallCollision();
    capJump();
    player.y+=dy;
    // if(!didCollide[0]){
    // } else {
    //     if(dy > 0){
    //         player.y = didCollide[1].y-player.width;
    //         notDoubleJumped = true;
    //     }
    // }
    // console.log("Dx",dx);
    player.x += dx;
    changeMode();
    drawGround();
    drawLevel();
    drawPlayer();
}
// Sometimes there is a bug that causes jump to be infinite
function capJump(){
    if(dy<-15){
        dy = -15;
    }
}
function drawLevel(){
    for(var i = 0; i < level.length; i++){
        context.beginPath();
        context.rect(level[i].x, level[i].y, level[i].width, level[i].height);
        let r = 0, g= 0,b = 0;
        if(level[i].mode == 0){
            b = 255;
        }
        if(level[i].mode == 1){
            r = 255;
        }
        if(level[i].mode == 2){
            g = 255;
        }
        context.fillStyle  = "rgb(" + r + "," + g + "," + b+ ")";
        context.fill();
        context.closePath();
    }
}
// function wallCollision(){
//     for(var i = 0; i < level.length;i++){
//         if(player.y  + player.height > level[i].y && player.x + player.width+ dx > level[i].x
//             && player.y <level[i].y +level[i].height && player.x + dx < level[i].x + level[i].width ) {
//             // let a = level[i].x-(player.x+player.width);
//             console.log("Two values: ",((player.x+player.width)-level[i].x),((level[i].x+level[i].width)-player.x));
//             dx = Math.min(((player.x+player.width)-level[i].x),((level[i].x+level[i].width)-player.x));
//             // player.x = level[i].x -  player.width;
//         }
//         // else if(player.y + dy > level[i].y && player.x + dx < level[i].x + level[i].width
//         //     && player.y + player.height +dy <level[i].y +level[i].height  && player.x + player.width+ dx > level[i].x) {
//         //     dx = ((player.x+player.width)-level[i].x);
//         // }
//     }
// }
// function groundCollision(){
//     for(var i = 0; i < level.length;i++){
//         if(player.y + player.height + dy > level[i].y && player.x + player.width+ dx > level[i].x &&
//         player.x  + dx < level[i].x + level[i].width) {
//             grounded = true;
//             return [true, level[i]];
//         }
//     }
//     grounded = false;
//     return [false,0];
// }
// function headCollision(){
//     console.log("head collision");
//     for(var i = 0; i < level.length;i++){
//         if(player.y + dy < level[i].y + level[i].height && player.x + player.width+ dx > level[i].x &&
//             player.x  + dx < level[i].x + level[i].width && player.y + player.height + dy > level[i].y) {
//             dy = (player.y - (level[[i].y+level[i].height]));
//         }
//     }
// }
function drawPlayer(){
    context.beginPath();
    context.rect(player.x, player.y, player.width, player.height);
    context.fillStyle  = "rgb(" + red + "," + green + "," + blue+ ")";
    context.fill();
    context.closePath();
    context.beginPath();
    context.rect(player.x, player.y, player.width, player.height);
    context.strokeStyle   = "rgb(" + 0 + "," + 0 + "," + 0 + ")";
    context.stroke();
    context.closePath();
}
function drawGround(){
    context.beginPath();
    context.rect(ground.x, ground.y, ground.width, ground.height);
    context.fillStyle  = "rgb(" + 0 + "," + 0 + "," + 0+ ")";
    context.fill();
    context.closePath();
}
function gravity(){
    if(!grounded){
        dy +=1;
    }
}
function jump(){
    if(upPressed && grounded) {
        dy = -15;
        console.log("upPressed and Grounded");
        grounded = false;
        hasReleased = false;
    } else if(hasReleased && upPressed && notDoubleJumped && currentMode == 1){
        dy = -15;
        notDoubleJumped = false
    }
}
function changeMode(){
    if(aPressed && !releaseMode){
        releaseMode = true;
        currentMode = (currentMode + 1) % 3;
        if(currentMode == 0){
            red = 0;
            green = 0;
            blue = 255;
        }
        if(currentMode == 1){
            red = 255;
            green = 0;
            blue = 0;
        }
        if(currentMode == 2){
            red = 0;
            green = 255;
            blue = 0;
        }


    }
}
function dxSpeed(){
    if(rightPressed && leftPressed){
        return 0;
    }
    else if(rightPressed){
        if(currentMode == 2){
            return 7;
        }
        return 4;
    }
    else if(leftPressed){
        if(currentMode == 2){
            return -7;
        }
        return -4;
    } else {
        return 0;
    }
}
setInterval(draw,12);