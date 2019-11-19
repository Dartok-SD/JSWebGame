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
var STICKY_THRESHOLD = 0.004;
var ground = {x:0, y:425, width: canvas.width, height: 50, mode:-1, restitution:0.1};
var level = [ground,{x : 200, y:350, width: 90, height: 50, mode:-1, restitution:0.2},
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
    player.y+=dy;
    player.x += dx;
    // console.log("DY: " + dy);

    // if(grounded){
    //     console.log("Grounded");
    // }
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
            // console.log("Collision Detected with " + i);
            var l1 = player.x;
            var t1 = player.y;
            var r1 = player.x+player.width;
            var b1 = player.y+player.height;

            var l2 = level[i].x;
            var t2 = level[i].y;
            var r2 = level[i].x+level[i].width;
            var b2 = level[i].y+level[i].height;
            // console.log(b1 < t2);
            // console.log(b1);
            // console.log(t2);
            // console.log("Old velocity: dx " + dx + " dy " + dy);
            collisionResolution(level[i]);
            // console.log("New velocity: dx " + dx + " dy " + dy);
        }
    }
}
function collisionTest(object1, object2){
    var l1 = object1.x + dx;
    var t1 = object1.y + dy;
    var r1 = object1.x+object1.width + dx;
    var b1 = object1.y+object1.height + dy;

    var l2 = object2.x;
    var t2 = object2.y;
    var r2 = object2.x+object2.width;
    var b2 = object2.y+object2.height;

    return !(b1 <= t2 || t1 >= b2 || r1 <= l2 || l1 >= r2);

}
function collisionResolution(entity){
    var pMidX = player.x + player.width*.5;
    var pMidY = player.y + player.height*.5;
    var aMidX = entity.x + entity.width*.5;
    var aMidY = entity.y + entity.height*.5;
    var tempDy = dy;
    var tempDx = dx;

    if (dy > 0) {
        player.y = entity.y - player.height;
        dy = 0;
        grounded = true;
    } else {
        player.y = entity.y + entity.height;
        dy = 0;
    }
    if(dx > 0) {
        if(collisionTest(player, entity)){
            player.x = entity.x - player.width;
            dx = 0;
        }
    } else {
        if(collisionTest(player, entity)){
            player.x = entity.x + entity.width;
            dx = 0;
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
    if(dy < 20){
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