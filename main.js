const FPS = 10; // More FPS = More vel.

var canvas;
var player;
var seed;

var score = 0;
var best_score = 0;

const TILESIZE = 16; // Size of ONE tile
const MAX_TILES = 16; // Max TILES in screen

const WIDTH = TILESIZE * MAX_TILES; // TILESIZE x AMOUNT OF TILES = SCREEN WIDTH x HEIGHT = 16 x 16
const HEIGHT = TILESIZE * MAX_TILES; // Same here

class Player{
    constructor(x, y){ // x and y initial pos.
        this.x=x;
        this.y=y;
        this.cell=[]; // Variable used to store the actual snake pos to draw it all in the screen.
        this.moving= {
            left: false,
            right: false,
            up: false,
            down: false
        };
        this.is_moving=false;
        this.length=0; // Total snake length
    }

    move(){
        // Simple moving system. VX and VY = 32 Tiles every frame.
        if(this.moving.left === true){
            this.x = this.x - TILESIZE;
        } else if(this.moving.right === true){
            this.x = this.x + TILESIZE;
        } else if(this.moving.up === true){
            this.y = this.y - TILESIZE;
        } else if(this.moving.down === true){
            this.y = this.y + TILESIZE;
        }

        // If the snake gets out of the limits it will be draw in the opposite side (X or Y)
        if(this.getTileX() > MAX_TILES){
            this.x = 0;
        }
        if(this.getTileY() > MAX_TILES){
            this.y = 0;
        }
        if(this.getTileX() < 0){
            this.x = MAX_TILES * TILESIZE;
        }
        if(this.getTileY() < 0){
            this.y = MAX_TILES * TILESIZE;
        }
        
        // Store every snake position.
        this.cell.unshift({x: this.getTileX(), y: this.getTileY()})

        if(this.cell.length > this.length){
            this.cell.pop();
        }
    }

    // Get the actual snake pos. in X/Y values / Tilesize. (Value in GRID)
    getTileX(){
        return this.x / TILESIZE;
    }

    getTileY(){
        return this.y / TILESIZE;
    }

    draw(){
        this.cell.forEach((cell) => {
            canvas.ctx.fillRect(cell.x * TILESIZE, cell.y * TILESIZE, 16, 16);
        });
        canvas.ctx.fillRect(this.x, this.y, 16, 16);
    }

    coll(){
        this.cell.forEach((cell, index) => {
            if(index != 0){ // if it's not the head...
                // And the head of the snake collides to any part of his body...
                if(this.getTileX() === cell.x && this.getTileY() === cell.y && this.is_moving === true){
                    confirm("GAME OVER...");
                    // Sets the scoreboard
                    best_score = (score > best_score)?score:best_score;
                    score = 0;
                    document.getElementById("best_score").innerHTML = best_score.toString();
                    document.getElementById("score").innerHTML = "0";
                    // Starts a new game with the same player variable
                    player = new Player(0, 0);
                }
            }
        });
    }
}

class Seed{
    constructor(){
        this.eaten = true;
        this.x = 0;
        this.y = 0;
    }

    random(){
        // Draws a random seed inside the canvas.
        if(this.eaten === true){
            score++;
            document.getElementById("score").innerHTML = score.toString();
            this.x = Math.floor(Math.random() * WIDTH/TILESIZE);
            this.y = Math.floor(Math.random() * HEIGHT/TILESIZE);
            this.eaten = false;
        }
        canvas.ctx.fillStyle = "Red";
        canvas.ctx.fillRect(this.x*TILESIZE, this.y*TILESIZE, 16, 16);
    }

    // Detect if player collides with a seed
    detect(){
        if(player.getTileX() === this.x && player.getTileY() === this.y){
            this.eaten = true;
            player.length++;
        }
    }
}


class Canvas{
    constructor(){
        this.canvas = document.getElementById("canvas");
        this.ctx = this.canvas.getContext("2d");
    }

    // If is called: Draws the grid on canvas
    debug(ctx){
        for(let x = 0; x < WIDTH/TILESIZE; x++){
            for(let y = 0; y < HEIGHT/TILESIZE; y++){
                ctx.lineWidth = 1;
                ctx.strokeStyle = 'gray';
                ctx.strokeRect(x*TILESIZE, y*TILESIZE, TILESIZE, TILESIZE);
            }
        }
    }

    clear(){
        this.canvas.width = WIDTH;
        this.canvas.height = HEIGHT;
        //this.debug(this.ctx);
    }
}

function Init(){
    canvas = new Canvas();
    player = new Player(0, 0);
    seed = new Seed();
    Run();
}

function Run(){
    setInterval(() => {
        Main();
    }, 1000/FPS);
}

function Main(){
    canvas.clear();
    player.move();
    seed.detect();
    player.draw();
    player.coll();
    seed.random();
}

document.addEventListener("keydown", (event) => {
    switch(event.keyCode){
        case 68: // Left (D)
            player.moving.left = false;
            player.moving.right = true;
            player.moving.up = false;
            player.moving.down = false;
            player.is_moving = true;
            break;
        case 65: // Right (A)
            player.moving.left = true;
            player.moving.right = false;
            player.moving.up = false;
            player.moving.down = false;
            player.is_moving = true;
            break;
        case 83: // Down (S)
            player.moving.left = false;
            player.moving.right = false;
            player.moving.up = false;
            player.moving.down = true;
            player.is_moving = true;
            break;
        case 87: // Up (W)
            player.moving.left = false;
            player.moving.right = false;
            player.moving.up = true;
            player.moving.down = false;
            player.is_moving = true;
            break;
    }
})