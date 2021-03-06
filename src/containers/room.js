import React from "react";
import { ActionCableConsumer } from "@thrash-industries/react-actioncable-provider";
import AllUsers from "../components/allUsers";
import GameText from "../components/gameText";
import NavBar from "../components/navBar";
import { Container, Row, Col } from "react-bootstrap";


export class room extends React.Component {
  state = {
    currentPlayer: "",
    currentQuestion: "",
    reshufflingUsers: false,
    reshufflingQuestions: false,
    allUsers: [],
  };

  handleReceived = (resp) => {
    if (this.props.gameStarted === false) {
      this.props.startGame();
    }
    const currentPlayer = resp.currentPlayer;
    const currentQuestion = resp.currentQuestion;
    const reshufflingUsers = resp.reshufflingUsers;
    const reshufflingQuestions = resp.reshufflingQuestions;
    const allUsers = resp.allUsers;

    this.setState({
      currentPlayer: currentPlayer.username,
      currentQuestion: currentQuestion,
      reshufflingUsers: reshufflingUsers,
      reshufflingQuestions: reshufflingQuestions,
      allUsers: allUsers,
    });
  };

  handleClick = () => {
    const reqObj = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: {
          room: this.props.match.params.id,
          currentPlayer: this.state.currentPlayer,
        },
        question: {
          id: this.state.currentQuestion.id,
        },
      }),
    };
    fetch(`http://localhost:3000/users/select/foo`, reqObj);
  };

  handleStartClick = () => {
    const reqObj = {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: {
          room: this.props.match.params.id,
        },
      }),
    };
    fetch(`http://localhost:3000/users/start/foo`, reqObj);
  };

  startButton = () => {
    if (
      this.props.gameStarted === false &&
      this.props.currentUser.id === this.props.hostID
    ) {
      return (
        <div>
          <button className="startBtn" onClick={this.handleStartClick}>
            <h3 className="mainBtnText">START GAME</h3>
          </button>
        </div>
      );
    }
  };

  hostButton = () => {
    if (this.props.currentUser.id === this.props.hostID) {
      return (
        <button className="MainBtn" onClick={this.handleClick}>
          <h3 className="mainBtnText">NEXT QUESTION</h3>
        </button>
      );
    } else {
      return null;
    }
  };

  playerButton = () => {
    if (this.props.currentUser.id === this.props.hostID) {
      return null;
    } else if (this.props.currentUser.username === this.state.currentPlayer) {
      return (
        <button className="MainBtn" onClick={this.handleClick}>
          <h3 className="playerBtnText">NEXT QUESTION</h3>
        </button>
      );
    } else {
      return null;
    }
  };

  logoutBtn = () => {
    let id = this.props.currentUser.id;
    const reqObj = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        user: {
          id: id,
        },
      }),
    };
    fetch(`http://localhost:3000/users/${id}`, reqObj)
      .then((resp) => resp.json())
      .then((user) => {
        localStorage.removeItem("token");
        this.props.history.push(`/`);
      });
  };

  endGameBtn = () => {
    let id = this.props.match.params.id;
    const reqObj = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        room: {
          id: id,
        },
      }),
    };
    fetch(`http://localhost:3000/rooms/${id}`, reqObj)
      .then((resp) => resp.json())
      .then((room) => {
        this.props.endGame();
        localStorage.removeItem("token");
        this.props.history.push(`/`);
      });
  };

  resetUsersAndQuestionsShuffle = () => {
    this.setState({
      reshufflingUsers: false,
      reshufflingQuestions: false,
    });
  };

  resetUsersShuffle = () => {
    this.setState({
      reshufflingUsers: false,
    });
  };

  resetQuestionsShuffle = () => {
    this.setState({
      reshufflingQuestions: false,
    });
  };

  screenText = () => {
    if (this.props.gameStarted === true) {
      return (
        <div>
          <GameText
            currentPlayer={this.state.currentPlayer}
            currentQuestion={this.state.currentQuestion}
            reshufflingUsers={this.state.reshufflingUsers}
            reshufflingQuestions={this.state.reshufflingQuestions}
            resetUsersShuffle={this.resetUsersShuffle}
            resetQuestionsShuffle={this.resetQuestionsShuffle}
            resetUsersAndQuestionsShuffle={this.resetUsersAndQuestionsShuffle}
            playerButton={this.playerButton}
            hostButton={this.hostButton}
          />
        </div>
      );
    }
    if (
      this.props.gameStarted === false &&
      this.props.currentUser.id === this.props.hostID
    ) {
      return (
        <h2 className="welcomeTextHost">
          As the <span className="welcomeTextHostSpan">host</span>, you can
          start the game whenever your party is ready!
        </h2>
      );
    } else if (this.props.gameStarted === false) {
      return (
        <h2 className="welcomeTextUser">
          The host,{" "}
          <span className="welcomeTextUserSpan">{this.props.hostName}</span>,
          will start the game soon!
        </h2>
      );
    }
  };

  render() {
    return (
      <div className= "container-fluid">
        <Row>
          <NavBar
            room={this.props.roomName}
            logoutBtn={this.logoutBtn}
            endGameBtn={this.endGameBtn}
            currentUser={this.props.currentUser.id}
            host={this.props.hostID}
            player={this.props.currentUser.username}
          ></NavBar>
        </Row>
        <br></br>
        <AllUsers
          users={this.state.allUsers}
          gameStarted={this.props.gameStarted}
        ></AllUsers>
        <ActionCableConsumer
          channel={{
            channel: "UsersChannel",
            room: this.props.match.params.id,
          }}
          onReceived={this.handleReceived}
        >
          <br></br>
          {this.screenText()}
          <br></br>
          {this.startButton()}
        </ActionCableConsumer>
      </div>
    );
  }
}

export default room;
