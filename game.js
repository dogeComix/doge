
const uw = require('you-win')
const {Phone, World, Sprite, Text, Polygon} = uw

// Load everything we need
await uw.begin()

// Make the world
var world = new World
world.title = ''
world.background = 'green'
var score=0
var level=new Text
var levelNumber=1
var levelScore=1

var today = new Date(); 
var shotTime = new Date(today.getTime()-1000)

// Now we can start making Sprites!
world.width=300
world.height=460

level.text='level: '+levelNumber
level.scale=2
level.posX=150
level.posY=230
level.opacity=0.5

var xVel = 1
var bike=new Sprite
bike.flipped=true
bike.costume='🏍'
bike.posY=50
bike.forever(()=>{ 
    bike.posX+=xVel
    if (world.width<bike.posX){
        xVel=-1
        bike.flipped=false
    }
    if (0>bike.posX){
        xVel=1
        bike.flipped=true
    }
})

var dead=false

world.onTap(e=>{    
    var expiryTime=new Date(new Date().getTime() - 500)
    if (dead==false && shotTime<expiryTime){  
        shotTime=new Date()
        var bullet=new Sprite
        bullet.costume='👾'
        bullet.scale=0.25
        bullet.posX=bike.posX
        bullet.posY=bike.posY
        bullet.forever(()=>{
            bullet.posY+=2
        
        })
    }
        
})

function createEnemy(yPos,xPos,speed,){
    
    var enemy=new Sprite
    enemy.costume='💣'
    enemy.scale=0.4
    enemy.posY=yPos
    enemy.posX=xPos
    enemy.forever(()=>{ 
        
        enemy.posX+=speed
        if (world.width<enemy.posX){
            speed=speed*-1
            
        }
        if (0>enemy.posX){
            speed=speed*-1
            
        }
        setInterval(()=>{
            enemy.posY-=0.1
            
        },5000);
        for(var other of enemy.getTouchingFast()){
            if (other.costume=='👾') {
                enemy.costume='💥'
                other.destroy()
                score++
                levelScore++
                setTimeout(() => {
                    enemy.destroy()
                }, 500);
                
            }
        }
        for(let other of enemy.getTouchingFast()){
            if (other.costume=='🏍') {
                other.costume='💥'
                other.scale=3
                dead=true
                var hiscoreText=new Text
                setTimeout(() => { 
                    other.destroy()
                    var gameOver=new Text
                    gameOver.text='game over!'
                    gameOver.fill='red'
                    gameOver.posY=310
                    var scoreText=new Text
                    scoreText.text='score:'+score
                    scoreText.fill='red'
                    scoreText.posY=270
                    var highScore=localStorage.getItem('highScore')
                    if (score>highScore){
                        highScore=score
                        localStorage.setItem('highScore',highScore)   
                    }
                    hiscoreText.text='highscore:'+highScore
                    hiscoreText.fill='red'
                    
                }, 500);
                
                
                hiscoreText.text=localStorage.getItem(highscore)+highscore
            }
        }
    })
}

createEnemy(400,17,0.2)
createEnemy(350,220,0.4)
createEnemy(375,uw.randomInt(0,world.width),0.1)
createEnemy(390,230,0.4)
createEnemy(340,84,0.1)
createEnemy(365,uw.randomInt(0,world.width),0.2)
createEnemy(330,uw.randomInt(0,world.width),0.2)
createEnemy(320,220,0.4)
createEnemy(310,39,0.1)
createEnemy(300,uw.randomInt(0,world.width),0.4)
createEnemy(410,132,0.1)
createEnemy(420,uw.randomInt(0,world.width),0.2)
var label=new Text
label.posX=150
label.posY=10

label.forever(()=>{
    label.text='score:'+score
})

function rainbowStop(h) 
    {
    let f= (n,k=(n+h*12)%12) => .5-.5*Math.max(Math.min(k-3,9-k,1),-1);  
    let rgb2hex = (r,g,b) => "#"+[r,g,b].map(x=>Math.round(x*255).toString(16).padStart(2,0)).join('');
    return ( rgb2hex(f(0), f(8), f(4)) );
    }

setInterval(()=>{
    if (dead==false){
            createEnemy(uw.randomInt(300,400),uw.randomInt(0,world.width),uw.randomInt(0.1,0.4))

    world.forever(()=>{
        if (levelScore>10){
            levelNumber++
            level.text='level: '+levelNumber
            levelScore=1
    world.background = rainbowStop(levelNumber*0.5)

            }
        })
    }
},2000);
