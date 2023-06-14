import React from "react";

import "./PlayerList.css";

export function PlayerList(props) {
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
        <h3>Player List (Round: {props.state.currentRound+1})</h3>
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
          </>
        )}
      </div>
  );
}
// function PlayerList(props) {
//   const renderAdded = (player) => {
//     return (
//         <div key={player.index} className="container-list success">
//           <div
//             style={{
//               maxHeight: "21px",
//               overflow: "auto",
//             }}
//           >
//             {player.index+1}. <strong>{player.playerName}</strong>:{" "}
//             {player.playerAccount}
//           </div>
//         </div>
//     );
//   };
//   return (
//     <div className="container-main" style={{ borderTop: "1px solid" }}>
//       <div className="container-item info">
//         <center>Player List</center>
//       </div>
//       {props.players.length < 1 ? (
//         <div className="container-item alert">
//           <center>No players added.</center>
//         </div>
//       ) : (
//         <div
//           className="container-item"
//           style={{
//             display: "block",
//             backgroundColor: "#DDFFFF",
//           }}
//         >
//           {props.players.map(renderAdded)}
//         </div>
//       )}
//     </div>
//   );
// }

export default PlayerList;
