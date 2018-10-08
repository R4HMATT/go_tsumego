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

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: makeSquaresDoubleArray(9),
      }],
      stepNumber: 0,
      xIsNext: true,
    }
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  handleClick(i,j) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    {/*
    if (calculateWinner(squares) || squares[i][j]) {
      return;
    }
    */}
    squares[i][j] = this.state.xIsNext ? 'X' : 'O'; 
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
