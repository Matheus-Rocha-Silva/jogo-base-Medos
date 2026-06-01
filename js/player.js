import { Sitting, Running, Jumping, Falling, Rolling, Diving, Hit } from './playerStates.js';
import { CollisionAnimation } from './collisionAnimation.js';
import { FloatingMessage } from './floatingMessages.js';

export class Player {
    constructor(game){
        this.game = game;
        this.width = 100;
        this.height = 91.3;
        this.x = 0;
        this.y = this.game.height - this.height - this.game.groundMargin;
        this.vy = 0;
        this.weight = 1;
        this.image = document.getElementById('player');
        this.frameX = 0;
        this.frameY = 0;
        this.maxFrame;
        this.fps = 20;
        this.frameInterval = 1000/this.fps;
        this.frameTimer = 0;
        this.speed = 0;
        this.maxSpeed = 10;
        this.states = [new Sitting(this.game), new Running(this.game), new Jumping(this.game), new Falling(this.game), new Rolling(this.game), new Diving(this.game), new Hit(this.game)];
        this.currentState = null;
        //this.currentState = this.states[0];
        //this.currentState.enter();
    }

    update(input, deltaTime){
        this.checkCollision();
        //Mudanças de estados do jogador
        //O método handleInput() fará a leitura do input e agirá de acordo
        this.currentState.handleInput(input); 

        //Movimento horizontal
        this.x += this.speed;
        if(input.includes('ArrowRight') && this.currentState !== this.states[6]) 
        this.speed = this.maxSpeed;
        else if(input.includes('ArrowLeft')  && this.currentState !== this.states[6]) this.speed = -this.maxSpeed;
        else this.speed = 0;

        // Limites horizontais
        if(this.x < 0) this.x = 0;
        if(this.x > this.game.width - this.width) this.x = this.game.width - this.width;
        
        //Movimento vertical
        //if(input.includes('ArrowUp') && this.onGround()) this.vy -= 20; Essa linha de código foi refatorada
        this.y += this.vy;
        if(!this.onGround()) this.vy += this.weight;
        else this.vy = 0;

        // Limites verticais
        if(this.y > this.game.height - this.height - this.game.groundMargin){
            this.y = this.game.height - this.height - this.game.groundMargin;
        }

        // animação de Sprites
        if(this.frameTimer > this.frameInterval){
            this.frameTimer = 0;
            if(this.frameX < this.maxFrame) this.frameX++;
            else this.frameX = 0;
        } else {
            this.frameTimer += deltaTime;
        }
        
    }

    draw(context){
        // condição para verificar modo debug, se for verdadeiro, desenha um retangulo no jogador
        if(this.game.debug) context.strokeRect(this.x, this.y, this.width, this.height);
        context.drawImage(this.image, this.frameX * this.width, this.frameY * this.height, this.width, this.height, this.x, this.y, this.width, this.height);
    }

    onGround(){
        return this.y >= this.game.height - this.height - this.game.groundMargin;
    }

    /** Método para controle de estados
     *  o 'this.currentState' recebe um index do arranjo this.states[i]
     *  após isso, ele utiliza um método que atribui este número a um estado
     *  específico chamado enter(), da classe playerStates
     */
    setState(state, speed){
        this.currentState = this.states[state];
        this.game.speed = this.game.maxSpeed * speed; // (Refatorado) Agora a depender do estado do jogador, a velocidade do jogo mudará de acordo
        this.currentState.enter();
    }

    // Metodo para checar colisão entre o jogador e os inimigos
    checkCollision(){
        this.game.enemies.forEach(enemy => {
            if( 
                enemy.x < this.x + this.width  &&
                enemy.x + enemy.width > this.x &&
                enemy.y < this.y + this.height &&
                enemy.y + enemy.height > this.y
            ){
                /** Dentro desse bloco, é implementado o estado de tontura caso haja colisao
                 * com um inimigo sem que esteja em modo de ataque
                 */
                enemy.markedForDeletion = true;
                this.game.collisions.push(new CollisionAnimation(this.game, enemy.x + enemy.width * 0.5, enemy.y + enemy.height * 0.5));
                if(this.currentState === this.states[4] || this.currentState === this.states[5]){
                    this.game.score++;
                    this.game.floatingMessages.push(new FloatingMessage('+1', enemy.x, enemy.y, 150, 50));
                } else {
                    this.setState(6, 0);
                    this.game.score -= 5;
                    this.game.lives--;
                    if(this.game.lives <= 0) this.game.gameOver = true;
                }
            } else {
                // Sem colisão
            }
        });
    }
}