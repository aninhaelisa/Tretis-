var canvas = document.getElementById("tetris");
var context = canvas.getContext("2d"); 

const pieces = 'TJLOSZI';

context.scale(20,20); 

var arena = createMatrix(12,20) 

var player = {
    pos: {x: 0 , y: 0},
    matrix: null,
    score : 0 ,
}
var timpCadere = 0 ; 
var intervalCadere = 1000 ; 

var lastTime = 0 ; 

function createMatrix (w , h ) { 
    const matrix = [] ; 
    while(h--) {
        matrix.push(new Array(w).fill(0)) ; 
    }
    return matrix ; 
}

function createPiece(type) {
    if ( type === 'T' ) {
        return [
            [0,0,0],
            [6,6,6],
            [0,6,0],
        ];
    } 
    if( type === 'O') {
        return [
            [4,4],
            [4,4],
        ];
    }
    if(type === 'L') {
        return [
            [0,3,0],
            [0,3,0],
            [0,3,3],
        ];
    }
    if( type === 'J') {
        return [
            [0,2,0],
            [0,2,0],
            [2,2,0],
        ];
    }
    if( type === 'I') {
        return [
            [0,1,0,0],
            [0,1,0,0],
            [0,1,0,0],
            [0,1,0,0],
        ];
    }
    if( type === 'S') {
        return [
            [0,5,5],
            [5,5,0],
            [0,0,0],
        ];
    }
    if( type === 'Z') {
        return [
            [7,7,0],
            [0,7,7],
            [0,0,0],
        ];
    }
}

function drawMatrix(matrix , miscare){
    matrix.forEach((row , y) => {      
        row.forEach((value,x) => {
            if(value !== 0 ) {
                if(value === 1 ) {
                    context.fillStyle = "#66ccff";
                }
                if(value === 2 ) {
                    context.fillStyle = "#0000cc";
                }
                if(value === 3 ) {
                    context.fillStyle = "#ff6600";
                }
                if(value === 4 ) {
                    context.fillStyle = "#ffff00";
                }
                if(value === 5 ) {
                    context.fillStyle = "#66ff33";
                }
                if(value === 6 ) {
                    context.fillStyle = "#7a0099";
                }
                if(value === 7 ) {
                    context.fillStyle = " #ff0000";
                }

                context.fillRect(x + miscare.x,
                    y + miscare.y,
                    1,1);
            }
        });
        });
}

function draw() {
    context.fillStyle = "#000";
    context.fillRect(0,0,canvas.width,canvas.height);

    drawMatrix(arena , {x: 0 , y: 0 });
    drawMatrix(player.matrix , player.pos);
}

function update( time = 0 ){  
    var deltaTime = time - lastTime; 
    lastTime = time ; 

    timpCadere += deltaTime; 
    if (timpCadere > intervalCadere ){
         playerDrop();
    }

    draw(); 
    requestAnimationFrame(update);
}

function updateScore() { 
    document.getElementById('Score').innerText = player.score ; 
}

function lipeste(arena , player) {
    player.matrix.forEach((row,y) => {
        row.forEach((value , x ) =>{
            if ( value !== 0 ) {
                arena[y + player.pos.y][x+player.pos.x] = value ; 
            }
        })
    })
} 

function ciocnire(arena, player) { 
    const m = player.matrix;
    const o = player.pos;
    for (let y = 0; y < m.length; ++y) {
        for (let x = 0; x < m[y].length; ++x) {
            if (m[y][x] !== 0 &&
               (arena[y + o.y] &&
                arena[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function rotate(matrix, dir) { 
    for (let y = 0; y < matrix.length; ++y) {
        for (let x = 0; x < y; ++x) { 
            [
                matrix[x][y],        
                matrix[y][x],      
            ] = [
                matrix[y][x],
                matrix[x][y],
            ];
        }
    }

    if (dir > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
}

function arenaSweep() { 
    let rowCount = 1;                                 
    outer: for (let y = arena.length -1; y > 0; --y) {
        for (let x = 0; x < arena[y].length; ++x) {
            if (arena[y][x] === 0) {
                continue outer;
            }
        }

        const row = arena.splice(y, 1)[0].fill(0);
        arena.unshift(row);
        ++y;

        player.score += rowCount * 10;
        rowCount *= 2;
    }
}

function playerMove(dir) { 
    player.pos.x += dir ; 
    if(ciocnire(arena , player ) ) {
        player.pos.x -= dir ; 
    }
}

function playerReset() { 
    player.matrix = createPiece(pieces[pieces.length * Math.random() | 0]);
    player.pos.y = 0;
    player.pos.x = (arena[0].length / 2 | 0) -
                   (player.matrix[0].length / 2 | 0);
    if( ciocnire(arena , player )) {
        arena.forEach(row => row.fill(0)); 
        player.score = 0 ; 
    }
}

function playerDrop() {
    player.pos.y ++;
    if( ciocnire( arena , player )) {
        player.pos.y -- ; 
        lipeste(arena , player ) ; 
        playerReset();
        arenaSweep();
        updateScore();
    }
    timpCadere = 0 ;
}

function playerRotate(dir){ 
    var pos = player.pos.x ; 
    let ups = 1 ; 
    rotate(player.matrix , dir ) ; 
    while ( ciocnire(arena , player)) {
        player.pos.x += ups ; 
        ups = -(ups + (ups > 0 ? 1 : -1))
        if(ups > player.matrix[0].lenght ) {
            rotate(player.matrix , -dir);
            player.pos.x = pos ; 
            return ; 
        }
    }
}

document.addEventListener('keydown' , event => { 
    if ( event.keyCode === 37 ) {              
        playerMove(-1) ; 
    }
    if(event.keyCode === 39 ) {
        playerMove(1) ; 
    }
    if(event.keyCode == 40 ) {
        playerDrop();
    }
    if(event.keyCode == 65 ) {
        playerRotate(1) ; 
    }
    if(event.keyCode == 68 ) {
        playerRotate(-1) ; 
    }

});
updateScore();
playerReset();
update(); 