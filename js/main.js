const ROWS = 10;
const COLUMNS = 10;

const CELL_SIZE = 50;
const CELL_MARGIN =2;
const GAME_PADDING = 5;
const START_COOLDOWN= 300;
const LEVEL_COOLDOWN = 10;

const FOOD_COLOR = '#099B09';
const BAD_FOOD_COLOR = '#FF1300'
const SNAKE_COLOR = '#3642D7';
const FREE_COLOR = '#C3C4BF';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');


canvas.width = CELL_SIZE*COLUMNS+(COLUMNS-1)*CELL_MARGIN+2*GAME_PADDING;
canvas.height = CELL_SIZE*ROWS+(ROWS-1)*CELL_MARGIN+2*GAME_PADDING;;


let map = createGameMap(COLUMNS, ROWS);

getRandomFreeCell(map).food = true;


const cell = getRandomFreeCell(map)
cell.snake = true;

let snake =[cell];

let snakeDirect = 'up';
let nextSnakeDirect = 'up';

let prevTick = 0;
let play = true;
let cooldown = START_COOLDOWN;

requestAnimationFrame(loop);

function loop(timestep){
    requestAnimationFrame(loop);
    
    clearCanvas()
    
    if(prevTick+cooldown <= timestep && play){
        prevTick = timestep;
        snakeDirect = nextSnakeDirect;
        moveSnake();
           
        const head = snake[0];
        const tail = snake[snake.length - 1];
    
        
        if(head.food){
            head.food = false;
            snake.push(tail);
            
            getRandomFreeCell(map).food = true;
            cooldown -= LEVEL_COOLDOWN; 
            if(snake.length===2){
                addBadFood()
            }       
        } 
        
        else if(head.badFood ){
            head.badFood = false;
            snake.pop(tail);
            if(snake.length===1){
                for (const cell of map.flat()){
                    cell.badFood = false;
                }
            } else{
                addBadFood()
            }
            
            cooldown += LEVEL_COOLDOWN;
            
        }
        
        else{
           let isEnd = false;
            for(let i = 1; i < snake.length; i++){
                if (snake[i] === snake[0]){
                    isEnd = true;
                    break           
                }
            }

            if(isEnd){
                play = false;
            }
        }
   
    }
      
    drawGameMap(map);
    showState();
    
    if(!play){
        drawPaused();
    }
}

document.addEventListener('keydown', function(event){
    if(event.key === 'ArrowUp'){
        if(snake.length === 1 || snakeDirect === 'left' || snakeDirect === 'right'){
            nextSnakeDirect = 'up' 
        }
    }
    else if(event.key === 'ArrowDown'){
        if(snake.length === 1 || snakeDirect === 'left' || snakeDirect === 'right'){
            nextSnakeDirect = 'down'    
        }
    }
    else if(event.key === 'ArrowLeft'){
        if(snake.length === 1 || snakeDirect === 'up' || snakeDirect === 'down'){
            nextSnakeDirect = 'left'
        }
    }
    else if(event.key === 'ArrowRight'){
        if(snake.length === 1 || snakeDirect === 'up' || snakeDirect === 'down'){
            nextSnakeDirect = 'right'       
        }
    }
    else if (event.key ==='Enter'){
        if (play){
            return
        }
        
        init();
    }
})