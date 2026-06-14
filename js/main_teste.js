import { Player } from './player.js';
import { InputHandler } from './input_teste.js';
import { Background } from './background.js';
import { FlyingEnemy, ClimbingEnemy, GroundEnemy, FlyingEnemyGhost } from './enemies.js';
import { UI } from './UI_teste.js';

window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 900;
    canvas.height = 500;

    class Game{
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.groundMargin = 45; 
            this.speed = 0;
            this.maxSpeed = 3;
            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.UI = new UI(this);
            // Gerenciamento de Estado do Jogo
            this.gameState = 'MENU'; // Estados possíveis: 'MENU', 'JOGANDO'
            this.enemies = [];
            this.particles = [];
            this.collisions = []; 
            this.floatingMessages = [];
            this.maxParticles = 50;
            this.enemyTimer = 0;
            this.enemyInterval = 1000;
            this.debug = false; 
            this.score = 0;
            this.winningScore = 40;
            this.fontColor = 'black'; 
            this.time = 0;
            this.maxTime = 30000;
            this.gameOver = false;
            this.lives = 3; 
            this.player.currentState = this.player.states[0];
            this.player.currentState.enter();
        }

        update(deltaTime){
            // Se estiver no menu, não atualiza a lógica do jogo (tempo, colisões, inimigos)
            if (this.gameState === 'MENU') {
                // Inicia o jogo se a tecla de ação (Enter/Espaço) for pressionada
                if (this.input.keys.includes('Enter') || this.input.keys.includes(' ')) {
                    this.gameState = 'JOGANDO';
                }
                return;
            }

            this.time += deltaTime;
            if(this.time > this.maxTime) this.gameOver = true;
            this.background.update();
            this.player.update(this.input.keys, deltaTime);

            // Criar inimigos
            if(this.enemyTimer > this.enemyInterval){
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }
            
            this.enemies.forEach(enemy => {
                enemy.update(deltaTime); 
            });

            this.floatingMessages.forEach(message => {
                message.update(deltaTime); 
            });
            
            this.particles.forEach((particle) => {
                particle.update();
            });

            if (this.particles.length > this.maxParticles){
                this.particles.length = this.maxParticles;
            }

            this.collisions.forEach((collision) => {
                collision.update(deltaTime);
            });

            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
            this.particles = this.particles.filter(particle => !particle.markedForDeletion);
            this.collisions = this.collisions.filter(collision => !collision.markedForDeletion);
            this.floatingMessages = this.floatingMessages.filter(message => !message.markedForDeletion);
        }

        draw(context){
            // O fundo continua rodando estático no menu para dar ambiência
            this.background.draw(context);

            if (this.gameState === 'MENU') {
                this.UI.drawStatusMenu(context);
            } else {
                this.player.draw(context);

                this.enemies.forEach(enemy => {
                    enemy.draw(context);
                });

                this.particles.forEach(particle => {
                    particle.draw(context);
                });

                this.collisions.forEach(collision => {
                    collision.draw(context);
                });

                this.floatingMessages.forEach(message => {
                    message.draw(context); 
                });

                this.UI.draw(context);
            }
        }

        addEnemy(){
            if(this.speed > 0 && Math.random() < 0.5) this.enemies.push(new GroundEnemy(this));
            else if (this.speed > 0) this.enemies.push(new ClimbingEnemy(this));

            this.enemies.push(new FlyingEnemy(this));
            //this.enemies.push(new FlyingEnemyRaven(this));
            this.enemies.push(new FlyingEnemyGhost(this));
        }
    }

    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;

    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime; 
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        if(!game.gameOver) requestAnimationFrame(animate);
    }
    animate(0);
});
