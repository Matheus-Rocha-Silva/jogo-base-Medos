export class InputHandler{
    constructor(game){
        this.game = game;
        this.keys = [];
        
        window.addEventListener('keydown', e => {
            let key = e.key;

            // Normaliza os controles novos (WASD) e Espaço para o padrão que o Player já lê
            if (key === 'w' || key === 'W') key = 'ArrowUp';
            if (key === 's' || key === 'S') key = 'ArrowDown';
            if (key === 'a' || key === 'A') key = 'ArrowLeft';
            if (key === 'd' || key === 'D') key = 'ArrowRight';
            if (key === ' ') key = 'Enter'; // Transforma espaço em uma tecla de ação/pulo alternativa

            if((    key === 'ArrowDown'   ||
                    key === 'ArrowUp'     ||
                    key === 'ArrowLeft'   ||
                    key === 'ArrowRight'  ||
                    key === 'Enter'
                ) && this.keys.indexOf(key) === -1){
                this.keys.push(key);
            } else if (e.key === 'g' || e.key === 'G') { 
                // Mudei o debug para 'G' para não conflitar com o 'D' de andar para a direita
                this.game.debug = !this.game.debug;
            }
        });

        window.addEventListener('keyup', e => {
            let key = e.key;

            if (key === 'w' || key === 'W') key = 'ArrowUp';
            if (key === 's' || key === 'S') key = 'ArrowDown';
            if (key === 'a' || key === 'A') key = 'ArrowLeft';
            if (key === 'd' || key === 'D') key = 'ArrowRight';
            if (key === ' ') key = 'Enter';

            if(     key === 'ArrowDown'   ||
                    key === 'ArrowUp'     ||
                    key === 'ArrowLeft'   ||
                    key === 'ArrowRight'  ||
                    key === 'Enter'){
                this.keys.splice(this.keys.indexOf(key), 1);
            }
        });
    }
}
