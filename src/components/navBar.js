import React, { Component } from "react";
import icebreakersv8 from "../logo/icebreakersv8.png";
import { Container, Row, Col } from "react-bootstrap";


export class navBar extends Component {
  logOutBtn = () => {
    if (this.props.currentUser === this.props.host) {
      return (
        <button className="LogoutBtn" onClick={this.props.endGameBtn}>
          End Game
        </button>
      );
    } else {
      return (
        <button className="LogoutBtn" onClick={this.props.logoutBtn}>
          Logout
        </button>
      );
    }
  };

  render() {
    return (
      <Row className="NavBar ">
        {/* <Row> */}
        <Col className="col-4">
        {this.logOutBtn()}
        </Col>
        <Col className="col-4 align-self-center">
        {/* <div className="NavBarTitle"> */}
          <img className="navLogo" src={icebreakersv8} alt="icebreakers logo" />
        {/* </div> */}
        </Col>
        <Col className="col-4 NavBarInfo">
          <div className="navBarInfoRoom">Room</div>
          <div className="navBarInfoName">{this.props.room} </div>
        </Col>
        {/* </Row> */}
      </Row>
    );
  }
}

export default navBar;


{/* <div className="NavBar">
{this.logOutBtn()}
<Col className="align-self-center">
{/* <div className="NavBarTitle"> */}
//   <img className="navLogo" src={icebreakersv8} alt="icebreakers logo" />
// {/* </div> */}
// </Col>
// <span className="NavBarInfo">
//   <div className="navBarInfoRoom">Room</div>
//   <div className="navBarInfoName">{this.props.room} </div>
// </span>
