import React from "react";

import "./PlayerList.css";
import swal from 'sweetalert';

export function PlayerList(props) {


  
  const onFinished = (winner) => {
    swal({
      title: "Cancel Game",
      text: 'Are you confirm to cancel this round?',
      icon: "warning",
      buttons: {
        confirm: "Confirm",
        cancel: true,
      },
    }).then(function(isConfirm) {
      if (isConfirm) {
        resetPlayer()
      } else {
        return;
      }
    });
  };
  const resetPlayer = async () => {
    let options = {
      from: props.state.account,
    }
    await props.state.LuckyDrawInstance.methods
      .adminReset()
      .send(options);
    window.location.reload();
  };
  const renderResults = (player) => {
    return (
      <tr key={player.index}>
        <td>{player.index+1}</td>
        <td>{player.playerName}</td>
        <td>{player.playerAccount}</td>
      </tr>
    );
  };
  return (
      <div className="container-main" style={{ borderTop: "1px solid" }}>
        <h4>Player List (Round: {props.state.currentRound+1})</h4>
        <small>Total players: {props.state.players.length}</small><br></br>
        
        {props.state.players.length < 1 ? (
          <div className="container-item attention">
            <center>No players.</center>
          </div>
        ) : (
          <>
            <div className="container-item">
              <table>
                <tbody>
                  <tr>
                    <th>No.</th>
                    <th>Player Name</th>
                    <th>Address</th>
                  </tr>
                  {props.state.players.map(renderResults)}
                </tbody>
              </table>
            </div>
            <div
              className="container-item"
              style={{ border: "1px solid black" }}
            >
              <center>That is all.</center>
            </div>
            {props.state.isAdmin === true ? (
              <div className="container-item">
                <button className="btn btn-outline-danger" type="button" onClick={onFinished}>
                  Cancel This Round
                </button>
              </div>
            ): null} 
          </>
        )}
      </div>
  );
}

export default PlayerList;
