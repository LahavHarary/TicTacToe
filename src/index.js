import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import 'bootstrap/dist/css/bootstrap.min.css';

// A function that is being used as the squares on the board
function Square(props) {
    // when calling the Square function the caller sends properties and get a square with the property back 
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
  
  // A class named Board, which is responsible for the board and creating squares
  class Board extends React.Component {
    // a renderSquare function which receives i (the index of the square)
    // the function creates a square (by using the Square function) which has 2 values: it's value and onClick method 
    renderSquare(i) {
      return (
        <Square
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
        />
      );
    }
  
    // Render function that creates squares no. 0-8  
    render() {
      return (
        // the render function creates a div and creates three seperated divs inside of it, each inner div includes three squares (0-2),(3-5),(6-8)
        <div>
          <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
          </div>
          <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
          </div>
          <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
          </div>
        </div>
      );
    }
  }
  
  // A class named Game, which is responsible for the entire game
  class Game extends React.Component {
      // going through ctor(props) and super ctor of props
    constructor(props) {
      super(props);
      // creating an element named state which has three attributes: history array filled with 9 arrays, stepNumber which tells us in which step are we.
      // xIsNext is a boolean varialbe which tells us if the turn belongs to X or O.
      this.state = {
        history: [
          {
            squares: Array(9).fill(null)
          }
        ],
        stepNumber: 0,
        xIsNext: true
      };
    }
    // handleClick function: creates three elements (history ,current,squares)
    handleClick(i) {
        // we are using the slice method for history to make sure that if we "go back in time" and then make a new move from that point we throw away all the "future history"
      const history = this.state.history.slice(0, this.state.stepNumber + 1); 
      const current = history[history.length - 1]; 
      // takes the "state" in which the squares are in at the moment
      const new_squares = current.squares.slice();

      // checking if the winner has been annouced or that the the current square that has been clicked is already taken
      if(calculateWinner(new_squares) != null)
      {
        window.alert("Hey, the game is OVER and there is clearly a winner..");
        return; 
      }
      if (new_squares[i] != null) {         
        window.alert("Hey, this row is taken");
        return; 
      }
      // otherwise, new_squares[i] will be equal to X or O according to the variable xIsNext
      new_squares[i] = this.state.xIsNext ? "X" : "O";
      // we will set the new state, we will copy the new_squares into the old squares
      this.setState({
        history: history.concat([
          {
            squares: new_squares
          }
        ]),
        // the number of the step will now be equal to the history.length
        stepNumber: history.length,
        // xIsNext will change (if X was used then Y , if Y was used then X using the ! operator)
        xIsNext: !this.state.xIsNext
      });
    }
  
    // A function in which helps us to jump to the current game history
    jumpTo(step) {
      this.setState({ 
        stepNumber: step,
        xIsNext: (step % 2) === 0 // if step%2 is 0 it means that x is the one that was played which means boolean value true will be in xIsNext else, false value will be in xIsNext
      });
    }
    
    // the render function of game class
    render() {

        // assign 3 varialbes (history, current, winner)
      const history = this.state.history;
      const current = history[this.state.stepNumber];
      const winner = calculateWinner(current.squares); // checks if a winner has been chosen.
    
      // creates the Go to move menu and allows the user to click on a cretin move and "go back in time"
      const moves = history.map((step, move) => { // map helps us map between the step and the move.
        const desc = move ?  
          'Go to move #' + move :
          'Go to game start';
          // in the beggining only the "Go to game start" is being presented to the user, later on after everyturn the "Go to move #" + the movenumber is presented
        return (
            // create a button with the jump to move onClick and the string presented from desc.
          <li key={move}>
            <button class="btn btn-primary" onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      });
      
      // status can be Winner + (X OR O) or Next Player: + (X OR O) according to winner variable 
      let status;
      if (winner != null) {
        status = "Winner: " + winner;
      } else {
        status = "Next player: " + (this.state.xIsNext ? "X" : "O");
      }

      // the render function returns the Board of the game which consist of two variables: status(which is the message that needs to be presented) and onClick function from game class
      return (
        <div className="game" style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
          <div className="game-board">
            <Board
              squares={current.squares}
              onClick={i => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }
  
  // ========================================
  
  ReactDOM.render(<Game />, document.getElementById("root"));
  
  //   Given an array of 9 squares, this function will check for a winner and return 'X', 'O', or null as appropriate.  function calculateWinner(squares) {
  function calculateWinner(squares) {
    
    // One of those is the winner in the game
    const lines = [
      [0, 1, 2], 
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }

    return null;
  }
  