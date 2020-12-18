
class Puissance4 {
   
    constructor(element_id, rows=6, cols=7) {
      this.rows = rows;
      this.cols = cols;
      this.board = Array(this.rows);
      for (let i = 0; i < this.rows; i++) {
        this.board[i] = Array(this.cols).fill(0);
      }
      this.turn = 1;
      this.moves = 0;
      this.winner = null;
      this.score = [];
      this.element = document.querySelector(element_id);
      this.button = document.getElementById('newGame');
      this.moveContainer = document.getElementById('move');
      this.button.addEventListener('click', (event) => this.newGame());
      this.element.addEventListener('click', (event) => this.handle_click(event));
      this.render();
    }
    
    render() {
      let table = document.createElement('table');
      for (let i = this.rows - 1; i >= 0; i--) {
        let tr = table.appendChild(document.createElement('tr'));
        for (let j = 0; j < this.cols; j++) {
          let td = tr.appendChild(document.createElement('td'));
          let colour = this.board[i][j];
          if (colour)
            td.className = 'player' + colour;
            td.dataset.column = j;
        }
      }
      this.element.innerHTML = '';
      this.element.appendChild(table);
      this.moveContainer.innerHTML = this.moves;
    }

    pawnPosition(column){
        let row;
        for(let i = 0; i<6; i++){
            if(this.board[i][column] == 0){
                row = i;
                break;
            }
        }
        if(row == undefined){
            return null;
        }else{
            this.setColor(row, column, this.turn);
            return row;
        }
    }

    setColor(row, column, player){
        this.board[row][column] = player;
        this.moves++;
    }


  

    handle_click(event){
        let column = event.target.dataset.column;
        if(column){
            if(this.turn === 1){
                this.turn = 2;
            }else{
                this.turn = 1;
            }
            event.target.className = this.player;
        let row = this.pawnPosition(parseInt(column));
        if(row === null){
            window.alert("La colonne est pleine !");
        }else{          
            this.render();
            var check = this.winGame(row, column);
            if(this.winner != null){
                if (window.confirm("La partie est terminée ! Recommencez ?")) {
                    this.newGame();                  
                }              
            }else if(this.winner === 0){
                if (window.confirm("Match nul ! Recommencez ?")) {
                    this.newGame();                  
                }
            }else if(check){
                this.winner = this.turn;
                this.score.push({player:this.turn, score:this.moves});
                if (window.confirm("Bravo au joueur "+this.winner + " Recommencez ?")) {
                    this.newGame();                  
                }
                console.log(this.score);   
              
            }
        }
        }
            
    }

    winGame(row, column){
        this.nullGame();
        let count = 0;
        for (let i = 0; i < this.cols; i++) {
            if(this.board[row][i] == this.turn && this.board[row][i+1] == this.turn || this.board[row][i] == this.turn && this.board[row][i-1] == this.turn){
                count = count +1;  
            }else{
                count = 0;
            }

            if(count >= 4){
                return true;
            }
        }

        count = 0;
        for(let i = 0; i<this.rows; i++){
            if(this.board[i+1] && this.board[i][column] == this.turn && this.board[i+1][column] == this.turn || this.board[i-1] && this.board[i][column] == this.turn && this.board[i-1][column] == this.turn){
                count = count+1;
            }else{
                count = 0;
            }

            if(count >= 4){
                return true;
            }
        }

        //Diagonal Vertical
        count = 0;
        for (let i = 0; i <= this.cols - parseFloat(column); i++) {
            var diagonalRowVertical = parseFloat(row) - i;
            var diagonalColumnVertical = parseFloat(column) + i;
            if(this.board[diagonalRowVertical] && this.board[row][column] == this.turn && this.board[diagonalRowVertical][diagonalColumnVertical] == this.turn){
                count = count+1;
            }else{
                count = 0;
            }

            if(count >= 4){
                return true;
            }
        }

        count = 0;
        for (let i = 0; i <= parseFloat(column); i++) {
            if(column>0 && row>0){
                var diagonalRowHorizontal = parseFloat(row) - i;
                var diagonalColumnHorizontal =parseFloat(column) - i;
                if(this.board[diagonalRowHorizontal] && this.board[row][column] == this.turn && this.board[diagonalRowHorizontal][diagonalColumnHorizontal] == this.turn){
                    count = count+1;
                }else{
                count = 0;
            }
            }
            if(count >= 4){
                return true;
            }            
        }

        return false;

    }

    nullGame(){
        var count = 0;
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if(this.board[row][col] != 0){
                    count = count + 1;
                }
            } 
        }
        if(count === 42){
            this.winner = 0;
        } 
    }


    newGame(){
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.board[row][col] = 0;
            } 
        }
        this.winner = null;
        this.moves = 0;
        this.render();
    }

   
  
}



  
  let p4 = new Puissance4('#gameBoard');