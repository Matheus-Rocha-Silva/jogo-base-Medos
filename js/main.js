import { Player } from './player.js';
import { InputHandler } from './input.js';
import { Background } from './background.js';
import { FlyingEnemy, ClimbingEnemy, GroundEnemy } from './enemies.js';
import { UI } from './UI.js';

window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 900;
    canvas.height = 500;

    class Game{
        constructor(width, height){
            this.width = width;
            this.height = height;
            this.groundMargin = 45; // Referente a margem do jogador com o chão
            this.speed = 0;
            this.maxSpeed = 3;
            this.background = new Background(this);
            this.player = new Player(this);
            this.input = new InputHandler(this);
            this.UI = new UI(this);
            this.enemies = [];
            this.particles = [];
            this.collisions = []; // Array para armazenar colisões
            this.floatingMessages = [];
            this.maxParticles = 50;
            this.enemyTimer = 0;
            this.enemyInterval = 1000;
            this.debug = false; // Propriedade para ativar modo debug
            this.score = 0;
            this.winningScore = 40;
            this.fontColor = 'black'; // Muda as cores do texto de Pontuaão
            this.time = 0;
            this.maxTime = 30000;
            this.gameOver = false;
            this.lives = 3; // Qtd. de vidas do jogador, podendo aumentar ou diminuir
            this.player.currentState = this.player.states[0];
            this.player.currentState.enter();
        }

        update(deltaTime){
            this.time += deltaTime;
            if(this.time > this.maxTime) this.gameOver = true;
            this.background.update();
            this.player.update(this.input.keys, deltaTime);

            // criar inimigos
            if(this.enemyTimer > this.enemyInterval){
                this.addEnemy();
                this.enemyTimer = 0;
            } else {
                this.enemyTimer += deltaTime;
            }
            
            // Método chamando a si mesmo no final para tratar a atualização dos inimigos
            // Condicional que remove objeto inimigo ao validar seu markedForDeletion
            this.enemies.forEach(enemy => {
                enemy.update(deltaTime); 
                //if(enemy.markedForDeletion) this.enemies.splice(this.enemies.indexOf(enemy), 1)
            });

            // Lidar com mensagens flutuantes
            this.floatingMessages.forEach(message => {
                message.update(deltaTime); 
            });
            
            // Lidar com particulas
            this.particles.forEach((particle, index) => {
                particle.update();
                //if(particle.markedForDeletion) this.particles.splice(index, 1);
            });

            if (this.particles.length > this.maxParticles){
                this.particles.length = this.maxParticles;
                // this.particles = this.particles.slice(0, this.maxParticles);
                // trecho refatorado
            }

            // Lidar com sprites de Colisão
            this.collisions.forEach((collision, index) => {
                collision.update(deltaTime);
                // if(collision.markedForDeletion) this.collisions.splice(index, 1);
            });

            this.enemies = this.enemies.filter(enemy => !enemy.markedForDeletion);
            this.particles = this.particles.filter(particle => !particle.markedForDeletion);
            this.collisions = this.collisions.filter(collision => !collision.markedForDeletion);
            this.floatingMessages = this.floatingMessages.filter(message => !message.markedForDeletion);

        }

        draw(context){
            this.background.draw(context);
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

        addEnemy(){
            // Condicional para controlar spawn de monstro planta de acordo com a velocidade de tela
            if(this.speed > 0 && Math.random() < 0.5) this.enemies.push(new GroundEnemy(this));
            else if (this.speed > 0) this.enemies.push(new ClimbingEnemy(this));

            this.enemies.push(new FlyingEnemy(this));
        }

    }

    const game = new Game(canvas.width, canvas.height);
    let lastTime = 0;

    function animate(timeStamp){
        // Calculo de tempo em que cada frame permanece na tela antes de ser trocado
        const deltaTime = timeStamp - lastTime; 
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.update(deltaTime);
        game.draw(ctx);
        if(!game.gameOver) requestAnimationFrame(animate);
    }
    animate(0);
});