import "./SpinWheel.css";
import WheelComponent from "react-wheel-of-prizes";
import React from "react";

import swal from 'sweetalert';


export default function SpinWheel(props) {
  const segments = []
  const adminTransfer = async (winner) => {
    if(props.state.isAdmin !== true) {
      swal({
        title: "Permission Denied",
        text: 'Allowed only for Admin.',
        icon: "error"
      })
      return;
    }
    let options = {
      from: props.state.account,
    }
    let winnerSplit = winner.split(".");
    await props.state.LuckyDrawInstance.methods
      .adminTransfer(winnerSplit[0]-1)
      .send(options);
    window.location.reload();
  };
  for (let i = 0; i < props.state.players.length; i++) {
    segments.push( (props.state.players[i].index+1)+"."+props.state.players[i].playerName)
  }

  const segColors = ["#EE4040", "#F0CF50", "#815CD1", "#3DA5E0", "#34A24F"];
  const onFinished = (winner) => {
    swal({
      title: "Congratulations!!",
      text: 'the winner is "'+ winner + '"',
      icon: "success",
      buttons: {
        confirm: "Confirm",
        cancel: true,
      },
    }).then(function(isConfirm) {
      if (isConfirm) {
        adminTransfer(winner)
      } else {
        return;
      }
    });
  };
  return (
    <div className="SpinWheel">
      <h2>Lucky Draw</h2>
      <div>
        <WheelComponent
          segments={segments}
          segColors={segColors}
          onFinished={(winner) => onFinished(winner)}
          primaryColor="black"
          contrastColor="white"
          buttonText="Spin"
          isOnlyOnce={false}
          size={250}
          upDuration={200}
          downDuration={800}
          fontFamily="Arial"
        />
      </div>
      {/* <h2>Start editing to see some magic happen!</h2> */}
    </div>
  );
}
