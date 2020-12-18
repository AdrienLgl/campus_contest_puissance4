
class Gameplay{

    constructor(element_id, playersName, gameplay, rows=6, cols=7) {

        //Instancie ttes les variables 

        this.emptyPosition = {pawn:[], empty:[], adverse:[]}; //Tableau des positions des pions
        this.gameplay = gameplay; //Gameplay sélectionné
        this.rows = rows;
        this.cols = cols;
        this.board = Array(this.rows); //Tableau avec toutes les valeurs des cases
        for (let i = 0; i < this.rows; i++) {
          this.board[i] = Array(this.cols).fill(0);
        }
        this.turn = 1; //Tour actuel 1 ou 2
        this.moves = 0; //Nombre de tour
        this.winner = null; //Gagnant de la game
        this.score = []; //Score des games
        document.getElementById('container').classList.add('block');
        this.playersName = playersName; //Récupère les noms des joueurs
        this.element = document.querySelector(element_id);
        this.buttonReset = document.getElementById('newGame');
        this.moveContainer = document.getElementById('move'); //Affichage du nombre de tours
        this.playerTurn = document.getElementById('player-turn'); //Affichage du joueur à jouer
        this.buttonReset.addEventListener('click', (event) => this.newGame()); //Créer une nouvelle game
        this.buttonMenu = document.getElementById('returnMenu');
        this.buttonMenu.addEventListener('click', (event) => new Menu()); //Créer un menu
        this.element.addEventListener('click', (event) => this.columnClick(event)); //Click sur une colonne
        this.render(); //Génère le tableau de jeu
    }

    render() { //Génère le tableau de jeu

        let table = document.createElement('table'); //Créer le tableau
        for (let i = this.rows - 1; i >= 0; i--) { //Associe les lignes en fonction des paramètres choisis
          let tr = table.appendChild(document.createElement('tr'));
          for (let j = 0; j < this.cols; j++) {
            let td = tr.appendChild(document.createElement('td'));
            let colour = this.board[i][j];
            if (colour) //Associe à la ligne une classe avec le nom du joueur
              td.className = 'player' + colour;
              td.dataset.column = j;
          }
        }

        this.element.innerHTML = '';
        this.element.appendChild(table);
        this.moveContainer.innerHTML = this.moves;
        if(this.turn == 2){
            this.playerTurn.innerHTML = this.playersName.player1;
        }else{
            this.playerTurn.innerHTML = this.playersName.player2;
        }
      }
  
      pawnPosition(column){ //Place le pion en bas de la colonne sélectionnée, sinon retourne undefined (colonne pleine)
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
  
      setColor(row, column, player){ //Génère la couleur du pion
          this.board[row][column] = player;
          this.moves++;
      }
  
  
      columnClick(event){
        //OnClick de la colonne
        let column = event.target.dataset.column;
        //Récupère la position de la colonne
        if(column){
            if(this.gameplay == "Duo"){ //Si gameplay 'Duo' alors tour à tour
            if(this.turn === 1){
                this.turn = 2;
            }else{ 
                this.turn = 1;
            }
                event.target.className = this.player;
                let row = this.pawnPosition(parseInt(column)); //Récupère la position du pion et génère la couleur
                this.getGameRules(row, column); //Vérifie les règles (partie terminée, colonne pleine...)

            }else{ //Si gameplay 'Bot' alors Player1 qui joue puis Bot
                this.turn = 1;
                event.target.className = this.player;
                let row = this.pawnPosition(parseInt(column));
                this.getGameRules(row, column);
                this.botPlay();
            }
        }       
    }
  
      winGame(row, column){
        //Vérification du match nul
        this.nullGame();
        //Vérification horizontale
        let count = 0;
        for (let i = 0; i < this.cols; i++) {
            if(this.board[row] && this.board[row][i] == this.turn && this.board[row][i+1] == this.turn || this.board[row] && this.board[row][i] == this.turn && this.board[row][i-1] == this.turn){
                count = count +1;  
            }else{
                count = 0;
            }
            if(count >= 4){
                console.log(2);
                return true;
            }
        }
        //Vérification verticale
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

        //Vérification diagonale de gauche à droite
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

    //Vérification diagonale de droite à gauche
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

        //Si vérification nulle
        return false;
  
    }
  
      nullGame(){
          var count = 0;
          //Compte le nombre de cases remplies
          for (let row = 0; row < this.rows; row++) {
              for (let col = 0; col < this.cols; col++) {
                  if(this.board[row][col] != 0){
                      count = count + 1;
                  }
              } 
          }
          //Si plateau rempli, alors match nul
          if(count === 42){
              this.winner = 0;
          } 
      }
  
  
      newGame(){
          //Génère une nouvelle partie
          for (let row = 0; row < this.rows; row++) {
              for (let col = 0; col < this.cols; col++) {
                  this.board[row][col] = 0;
              } 
          }
          this.winner = null;
          this.moves = 0;
          this.render();
      }

      botPlay(){
        //Gameplay du Bot
        //Le bot vérifie toutes les positions vides, la position de ses pions et celle de ceux de l'adversaire
        this.emptyPosition = {pawn:[], empty:[], adverse:[]}; 
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if(this.board[row][col] == 0){
                    this.emptyPosition.empty.push({row:row, column:col});
                }
                if(this.board[row][col] == 2){
                    this.emptyPosition.pawn.push({row:row, column:col});
                }
                if(this.board[row][col] == 1){
                    this.emptyPosition.adverse.push({row:row, column:col});
                }
            } 
        }
        
        //Génère son coup avec les futures coordonnées
        var position = this.getBotPosition(this.emptyPosition.empty, this.emptyPosition.pawn);
        this.turn = 2;
        let row = this.pawnPosition(parseInt(position.column)); //Lance son coup
        
        this.getGameRules(row,position.column); //Vérifie les règles (partie terminée, colonne pleine...)
      }


      getBotPosition(emptyPosition, pawnPosition){
        // Le bot va générer une position aléatoire sur toutes les cases disponible, puis il va tenter de contrer l'adversaire en fonction de ses coups précédents
        // S'il parvient à trouevr un contre, il change la position de son pion, sinon il laisse celle de départ
        var random = Math.floor(Math.random()*Math.floor(emptyPosition.length));
        var randomPawn = Math.floor(Math.random()*Math.floor(emptyPosition.length));
        if(pawnPosition[randomPawn] && emptyPosition[random].column >= pawnPosition[randomPawn].column + 4 || pawnPosition[randomPawn] && emptyPosition[random].column >= pawnPosition[randomPawn].column - 4){
            if(emptyPosition[random].row >= pawnPosition[randomPawn].row + 4 || emptyPosition[random].row >= pawnPosition[randomPawn].row - 4 ){
                var position = {row:emptyPosition[random].row, column:emptyPosition[random].column};
                position = this.blockAdverse(position);
                return position;
            }else{
                this.getBotPosition(emptyPosition, pawnPosition);
            }
        }else{
            //S'il ne trouve pas de contre, il retourne la position de départ qu'il avait choisie
            var position = {row:emptyPosition[random].row, column:emptyPosition[random].column };
            position = this.blockAdverse(position);
            return position;
        }
      }

      blockAdverse(position){
        //Le bot vérifie la position des pions de l'adversaire et regarde s'il peut contrer ou anticiper un coup en bloquant
        //Par exemple, si l'adversaire à 3 pions d'alignés, il va tenter de bloquer le coup
        var random = Math.floor(Math.random()*Math.floor(this.emptyPosition.adverse.length));
        var verticalCount = 0;
        var horizontalCount = 0;
        var length = this.emptyPosition.adverse.length;
          this.emptyPosition.adverse.forEach(element => {
              //Vérifie les lignes horizontales et verticales
              if(element.column == this.emptyPosition.adverse[length-1].column){
                verticalCount = verticalCount + 1;
                if(element.row == this.emptyPosition.adverse[length-1].row){
                    horizontalCount = horizontalCount +1;
                }
              }else if(element.row == this.emptyPosition.adverse[length-1].row){
                horizontalCount = horizontalCount +1;
              }else{
                  verticalCount = 0;
                  horizontalCount = 0;
              }
          });

          if(verticalCount >= 3){
            position = {row:this.emptyPosition.adverse[length-1].row+1, column:this.emptyPosition.adverse[length-1].column};
            if(this.checkEmpty(position)){
                //Vérifie si la position de contre est disponible
                return position;
            }
          }else if(horizontalCount >=3){
            position = {row:this.emptyPosition.adverse[length-1].row, column:this.emptyPosition.adverse[length-1].column+1};
            if(this.checkEmpty(position)){
                return position;
            }
          }else{
              //Si pas de contre, retourne la 1ère position
              return position;
          }
      }

      checkEmpty(position){
          //Vérifie si la position du pion est disponible
          this.emptyPosition.empty.forEach(element => {
              if(element.row == position.row && element.column == position.column){
                  return false;
              }
          });

        return true;
      }


      getGameRules(row, column){
        if(row === null && this.turn == 1){
            //Si pas de position libre dans la colonne alors colonne pleine 
            window.alert("La colonne est pleine !");
        }else{          
            this.render();
            var check = this.winGame(row, column);
            if(this.winner != null){
                //Si partie terminée
                if (window.confirm("La partie est terminée ! Recommencez ?")) {
                    this.newGame();                  
                }              
            }else if(this.winner === 0){
                //Si pas de winner alors Match Nul
                if (window.confirm("Match nul ! Recommencez ?")) {
                    this.score.push({player:'None', score:this.moves});
                    this.newGame();                  
                }
            }else if(check){
                //Vérifie si le coup joué par le joueur lui donne la victoire
                if(this.turn == 1){
                    this.winner = this.playersName.player1;
                }else{
                    this.winner = this.playersName.player2;
                }
                this.score.push({player:this.winner, score:this.moves});
                if (window.confirm("Bravo à "+this.winner + " Recommencez ?")) {
                    this.newGame();                  
                }
                console.log(this.score);   
            }
        }
      }
  
     
    
  }

  class LaunchGame{
    //Définit les paramètres de la game (players & gameplay)
    constructor(gameplay){
        if(gameplay === 1){
            this.player1 = "Player 1";
            this.player2 = "Bot";
            document.getElementById('player2').classList.remove('block');
            document.getElementById('player2').classList.add('none');

        }else{
            document.getElementById('player2').classList.remove('none');
            document.getElementById('player2').classList.add('block');
            this.player1 = "Player 1";
            this.player2 = "Player 2";
        }
        document.getElementById('input').classList.add('block');
        this.play = document.getElementById('play').addEventListener('click', (event) => this.getPlayerName(gameplay));

    }


    getPlayerName(gameplay){
        if(gameplay === 1){
            this.player1 = document.getElementById('player1').value;
            gameplay = "Bot";
        }else{
            this.player1 = document.getElementById('player1').value;
            this.player2 = document.getElementById('player2').value;
            gameplay = "Duo";
        }
        var playersName = {player1:this.player1, player2:this.player2};
        document.getElementById('menu').classList.remove('block');
        document.getElementById('menu').classList.add('none');
        let p4 = new Gameplay('#gameBoard', playersName, gameplay);
    }


}

class Menu{
    //Créer le menu
    constructor(){
        document.getElementById('container').classList.remove('block');
        document.getElementById('menu').classList.add('block');
    }
}

