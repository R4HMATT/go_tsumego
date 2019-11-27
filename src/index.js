import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
    return (                      //()=> should be function() {alert('click');}
      <button className="square" onClick={() => props.onClick()}>
        {props.value}
      </button>
    );
}

var boardSize = 9

class Board extends React.Component {


  renderSquare(i,j) {
    return (
    <Square
        value={this.props.squares[i][j]}
        onClick={() => this.props.onClick(i,j)}
    />
    )
  }

  renderRows(dim) {
    // dimension
    var rows = Array(dim).fill(null);
    for (let i = 0; i < dim; i++) {
      let row = Array(dim).fill(null);
      for (let j = 0; j < dim; j++) {
          row[j] = this.renderSquare(i,j);
      }
      rows[i] = <div className="board-row">{row}</div>
    }
    return ( rows );
  }

  render() {
    var rows = this.renderRows(9);
    return (
      <div>
        {rows}

        {/*
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquarehttps://www.youtube.com/watch?v=H6dv6G1FWxk(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
        */}
      </div>
      );
    }
}

class Block extends React.Component {
  constructor(props) {
    super(props);
    {props.team}
    this.state = {
      liberties: [],
      pieces: [],
    }
  }
}


class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: makeSquaresDoubleArray(boardSize),
      }],
      blocks: {},
      stepNumber: 0,
      xIsNext: true,
      dim: 9,
    }
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  //playPiece(i, j)


  // @i, j is location of board piece we are calculating liberties for
  // @squares is the 2-D array of pieces representing the game-state, we are considering
  calculateLiberties(i, j, team, squares, frontier) {
    // frontier contains the squares already visited, so that we dont visit them again
    // had to contatenate as string to use hash
    // need to rewrite this using a queue structure
    let pointKey = i.toString() + j.toString()
    frontier[pointKey] = true
    let maxSize = this.state.dim;

    let sameTeam = team
    let piece;
    let count = 0;
    
    // should refactor this to its own function instead of doing it for each i, j combo xD
    if (i !== 0) {

      piece = squares[i-1][j];
      let newPieceKey = (i-1).toString() + j.toString()
      if (piece === null && !frontier[newPieceKey]) {
        count += 1;
      }
      else if (piece === sameTeam && frontier[newPieceKey] !== true) {
        count += this.calculateLiberties(i-1, j, sameTeam, squares, frontier);
      }
    };

    if (i !== this.state.dim - 1) {
      piece = squares[i + 1][j];
      let newPieceKey = (i+1).toString() + j.toString()
      if (piece === null && !frontier[newPieceKey]) {
        count += 1;
      }
      else if (piece === sameTeam && frontier[newPieceKey] !== true) {
        count += this.calculateLiberties(i+1, j, sameTeam, squares, frontier);
      }
    };

    if (j !==  0) {
      piece = squares[i][j-1];

      let newPieceKey = (i).toString() + (j-1).toString()
      if (piece === null && !frontier[newPieceKey]) {
        count += 1;
      }
      else if (piece === sameTeam && frontier[newPieceKey] !== true) {
        count += this.calculateLiberties(i, j-1, sameTeam, squares, frontier);
      }
    };

    if (j !== this.state.dim - 1) {
      piece = squares[i][j+1];
      let newPieceKey = i.toString() + (j+1).toString()
      if (piece === null && !frontier[newPieceKey]) {
        count += 1;
      }
      else if (piece === sameTeam && frontier[newPieceKey] !== true) {
        count += this.calculateLiberties(i, j+1, sameTeam, squares, frontier);
      }
    };
   
    return count;
    
  };

  // will check to see if the space (i,j) can be played (i.e. is not in a zero liberty spot)
  checkPlayable(i,j, team) {
    // oTeam is otherTeam
    let oTeam = team;

    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    
    let isTrue = true;

    //if (i === 0 || i === boardSize-1) {

    // // top left corner case
    // if (i === 0 && j === 0) {
    //   return (squares[i+1][j] === oTeam && squares[i][j+1] === oTeam) ? false : true;
    // }
    // // top right corner
    // else if (i === 0 && j === 8) {
    //   return (squares[i+1][j] === oTeam && squares[i][j-1] === oTeam) ? false : true;
    // }
    // // bottom left corner
    // else if (i === 8 && j === 0) {
    //   return (squares[i-1][j] === oTeam && squares[i][j+1] === oTeam) ? false : true;
    // }
    // // bottom right corner
    // else if (i === 8 && j === 8) {
    //   return (squares[i-1][j] === oTeam && squares[i][j-1] === oTeam ? false : true)
    // }

    // // on the top side case
    // else if (i === 0) {
    //   return (squares[i+1][j] === oTeam && squares[i][j+1] === oTeam &&
    //     squares[i][j-1]) ? false : true;
    // }
    // // bottom side case
    // else if (i === 8) {
    //   return (squares[i-1][j] === oTeam && squares[i][j+1] === oTeam &&
    //     squares[i][j-1]) ? false : true;
    // }

    // // left side case
    // else if (j === 0) {
    //   return (squares[i+1][j] === oTeam && squares[i][j+1] === oTeam &&
    //     squares[i+1][j] === oTeam) ? false : true;
    // }

    // else if (j === 8) {
    //   return (squares[i+1][j] === oTeam && squares[i-1][j] === oTeam &&
    //     squares[i][j-1] === oTeam) ? false : true;
    // }

    // else {
    //   return (squares[i+1][j] === oTeam && squares[i-1][j] === oTeam &&
    //     squares[i][j-1] === oTeam && squares[i][j+1] == oTeam) ? false : true;

    // }
    let calcLib = this.calculateLiberties(i, j, team, squares, {});
    return calcLib > 0


  }

  handleClick(i,j) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    var curTeam = this.state.xIsNext ? 'X' : 'O';
    var oTeam = this.state.xIsNext ? 'O' : 'X';
    console.log("handleclick")
    // checks if game is over, that place is on the board already, or if there are no liberties left
    if (!(squares[i][j] || this.checkPlayable(i,j, curTeam)) || calculateWinner(squares) ) {
      return;
    }


    //var newBlock = <Block team={this.state.xIsNext ? 'X' : 'O'} />
    this.state.blocks[(i,j)] = <Block team={this.state.xIsNext ? 'X' : 'O'} />
    squares[i][j] = curTeam;

    console.log(i,j)
    if (i !== 0) {
      if ((squares[i-1][j] === oTeam) && this.calculateLiberties(i-1, j, oTeam, squares, {}) === 0) {
        console.log("i !== 0")
        // replace squares = null to a new recursive Delete function
        squares[i-1][j] = null
      }
    };

    if (i !== this.state.dim - 1) {
      if ((squares[i+1][j] === oTeam) && this.calculateLiberties(i+1,j, oTeam, squares, {}) === 0) {
        console.log("i !== 8")
        squares[i+1][j] = null
      }
    };

    if (j !== 0) {
      if ((squares[i][j-1] === oTeam) && this.calculateLiberties(i,j-1, oTeam, squares, {}) === 0) {
        console.log("j !== 0")
        squares[i][j-1] = null
      }
    };

    if (j !== this.state.dim - 1) {
      if ((squares[i][j+1] === oTeam) && this.calculateLiberties(i,j+1, oTeam, squares, {}) === 0) {
        console.log("j !== 8")
        squares[i][j+1] = null
      }
    };


    this.setState({
      history: history.concat([{
      squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }


  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? 'X' : 'O');
    }


    return (
      <div className="game">
        <div className="game-board">
          <Board
          squares={current.squares}
          onClick={(i,j) => this.handleClick(i,j)} 
          />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <ol>{ moves }</ol>
        </div>
        {/*<button className="reset" onClick={() => this.setState({
          history: [{squares: Array(9).fill(null)},],
          xIsNext: true,})}>
        {"reset"}
        </button>*/}

      </div>
    );
  }
}

// ========================================

  function makeSquaresDoubleArray(dim) {
    // dim is dimension
    // symmetric board
    var board = Array(dim).fill(null);
    for (let i = 0; i < dim; i++) {
      board[i] = Array(dim).fill(null);
    }
    return board;
  }


  function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}


ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
