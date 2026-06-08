export class UI {
    constructor(game){
        this.game = game;
        this.fontSize = 30;
        this.fontFamily = 'Creepster';
        this.livesImage = document.getElementById('lives');
    }

    // Nova Tela de Apresentação (Menu Inicial)
    drawStatusMenu(context) {
        context.save();
        
        // Fundo escurecido suave para destacar o texto sobre o background do jogo
        context.fillStyle = 'rgba(0, 0, 0, 0.7)';
        context.fillRect(0, 0, this.game.width, this.game.height);

        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;
        context.shadowColor = 'black';
        context.fillStyle = '#ff3333'; // Vermelho gótico/neon para o título
        context.textAlign = 'center';

        // 1. TÍTULO DO JOGO
        context.font = '60px ' + this.fontFamily;
        context.fillText('CRIATURAS DA NOITE', this.game.width * 0.5, 90);

        // 2. SINOPSE
        context.fillStyle = 'white';
        context.font = '18px Arial'; // Fonte limpa para leitura da sinopse
        const sinopseG1 = "Sob a névoa do luar, criaturas profanas despertaram para reivindicar a noite.";
        const sinopseG2 = "Corra, sobreviva e enfrente os monstros antes que seu tempo acabe.";
        context.fillText(sinopseG1, this.game.width * 0.5, 150);
        context.fillText(sinopseG2, this.game.width * 0.5, 175);

        // 3. TUTORIAL DE CONTROLES
        // Caixa de Controles
        context.fillStyle = 'rgba(255, 255, 255, 0.1)';
        context.fillRect(this.game.width * 0.2, 210, this.game.width * 0.6, 140);
        
        context.fillStyle = '#ffcc00';
        context.font = '22px ' + this.fontFamily;
        context.fillText('TUTORIAL DE CONTROLES COM COLO', this.game.width * 0.5, 240);

        context.fillStyle = 'white';
        context.font = '16px Arial';
        context.fillText('Movimentação: Setas Direcionais  OU  Teclas [ W, A, S, D ]', this.game.width * 0.5, 280);
        context.fillText('Ações / Pular: Tecla [ ENTER ]  OU  [ BARRA DE ESPAÇO ]', this.game.width * 0.5, 310);
        context.font = '12px Arial';
        context.fillStyle = '#aaaaaa';
        context.fillText('Modo desenvolvedor: Pressione [ G ] para ativar o Debug', this.game.width * 0.5, 335);

        // 4. BOTÃO PARA INICIAR
        context.fillStyle = '#4CAF50'; // Verde chamativo
        context.fillRect(this.game.width * 0.35, 385, this.game.width * 0.3, 50);

        context.fillStyle = 'white';
        context.font = '24px ' + this.fontFamily;
        context.shadowColor = 'black';
        context.fillText('Pressione ESPAÇO ou ENTER para Iniciar', this.game.width * 0.5, 418);

        context.restore();
    }

    draw(context){
        context.save();
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;
        context.shadowColor = 'white';
        context.shadowBlur = 0;
        context.font = this.fontSize + 'px ' + this.fontFamily; 
        context.textAlign = 'left';
        context.fillStyle = this.game.fontColor;

        // Pontuação
        context.fillText('Score: ' + this.game.score, 20, 50);

        // Tempo
        context.font = this.fontSize * 0.8 + 'px ' + this.fontFamily;
        context.fillText('Time: ' + (this.game.time * 0.001).toFixed(1), 20, 80);

        // Vidas
        for(let i = 0; i < this.game.lives; i++){
            context.drawImage(this.livesImage, 25 * i + 20, 95, 25, 25);
        }

        // Mensagens de Game Over
        if(this.game.gameOver){
            context.textAlign = 'center';
            context.font = this.fontSize * 2 + 'px ' + this.fontFamily;
            if(this.game.score > this.game.winningScore){
                context.fillText('Boo-yah', this.game.width * 0.5, this.game.height * 0.5 - 20);
                context.font = this.fontSize * 0.7 + 'px ' + this.fontFamily;
                context.fillText('Do que as criaturas da noite tem medo? VOCÊ!!!!!', this.game.width * 0.5, this.game.height * 0.5 + 20);
            } else {
                context.fillText('Amor à primeira mordida?', this.game.width * 0.5, this.game.height * 0.5 - 20);
                context.font = this.fontSize * 0.7 + 'px ' + this.fontFamily;
                context.fillText('Não, mais sorte na proxima!!', this.game.width * 0.5, this.game.height * 0.5 + 20);
            }
        }
        context.restore();
    }
          }
