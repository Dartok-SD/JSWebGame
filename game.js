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
var STICKY_THRESHOLD = 0.0004
var ground = {x:0, y:425, width: canvas.width, height: 30, mode:-1, restitution:0.2};
var level = [ground,{x : 200, y:350, width: 90, height: 30, mode:-1, restitution:0.2},
    {x:350,y:350,width:50,height:100, mode:-1, restitution:0.2}, {x:550, y:350,width:100,height:100, mode:-1, restitution:0.2},
    {x:350,y:250,width:50,height:100,mode:0, restitution:0.2}];
// var y = 400;
// var x = 30;
var dx = 0;
var dy = 0;
console.log("Game");
// wallCollision();
// var didCollide = groundCollision();
// headCollision();
// wallCollision();
// if(!didCollide[0]){
// } else {
//     if(dy > 0){
//         player.y = didCollide[1].y-player.width;
//         notDoubleJumped = true;
//     }
// }
// console.log("Dx",dx);
function draw(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    gravity();
    userInteraction();
    collisionDetection();
    // console.log("DY: " + dy);
    player.y+=dy;
    player.x += dx;
    if(grounded){
        console.log("Grounded");
    }
    drawGround();
    drawLevel();
    drawPlayer();
}
// Sometimes there is a bug that causes jump to be infinite
function userInteraction(){
    changeMode();
    dx = dxSpeed();
    jump();
}
function capJump(){
    if(dy<-15){
        dy = -15;
    }
}
// function collisionDetection(l2,t2,r2,b2){
//     var l1 = player
// }
function collisionDetection(){
    for(let i = 0; i < level.length;i++){
        if(collisionTest(player,level[i])){
            // console.log("Collision Detected");
            collisionResolution(level[i]);
        }
    }
}
function collisionTest(object1, object2){
    var l1 = object1.x;
    var t1 = object1.y;
    var r1 = object1.x+object1.width;
    var b1 = object1.y+object1.height;

    var l2 = object2.x;
    var t2 = object2.y;
    var r2 = object2.x+object2.width;
    var b2 = object2.y+object2.height;

    return !(b1 < t2 || t1 > b2 || r1 < l2 || l1 > r2);

}
function collisionResolution(entity){
    var pMidX = player.x + player.width/2;
    var pMidY = player.y + player.height/2;
    var aMidX = entity.x + entity.width/2;
    var aMidY = entity.y + entity.height/2;

    var normalX = (aMidX - pMidX)/(entity.width/2);
    var normalY = (aMidY - pMidY)/(entity.height/2);

    var absDX = Math.abs(normalX);
    var absDY = Math.abs(normalY);
    if (Math.abs(absDX - absDY) < .1) {

        // If the player is approaching from positive X
        if (normalX < 0) {

            // Set the player x to the right side
            player.x = entity.x + entity.width;

            // If the player is approaching from negative X
        } else {

            // Set the player x to the left side
            player.x = entity.x - player.width;
        }

        // If the player is approaching from positive Y
        if (normalY < 0) {

            // Set the player y to the bottom
            player.y = entity.y + entity.height;

            // If the player is approaching from negative Y
        } else {

            // Set the player y to the top
            player.y = entity.y - player.height;
            grounded = true;
        }

        // Randomly select a x/y direction to reflect velocity on
        if (Math.random() < .5) {

            // Reflect the velocity at a reduced rate
            dx = -dx * entity.restitution;

            // If the objectâ€™s velocity is nearing 0, set it to 0
            // STICKY_THRESHOLD is set to .0004
            if (Math.abs(dx) < STICKY_THRESHOLD) {
                dx = 0;
            }
        } else {

            dy = -dy * entity.restitution;
            if (Math.abs(dy) < STICKY_THRESHOLD) {
                dy = 0;
            }
        }

        // If the object is approaching from the sides
    } else if (absDX > absDY) {

        // If the player is approaching from positive X
        if (normalX < 0) {
            player.x = entity.x + entity.width;

        } else {
            // If the player is approaching from negative X
            player.x = entity.x - player.width;
        }

        // Velocity component
        dx = -dx * entity.restitution;

        if (Math.abs(dx) < STICKY_THRESHOLD) {
            dx = 0;
        }

        // If this collision is coming from the top or bottom more
    } else {

        // If the player is approaching from positive Y
        if (normalY < 0) {
            player.y = entity.y + entity.width;

        } else {
            // If the player is approaching from negative Y
            player.y = entity.y - player.height;
            // grounded = true;
        }

        // Velocity component
        dy = -dy * entity.restitution;
        if (Math.abs(dy) < STICKY_THRESHOLD) {
            dy = 0;
        }
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