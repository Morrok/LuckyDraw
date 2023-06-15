// Node modules
import React, { Component } from "react";
import { Link } from "react-router-dom";

// Components
import Navbar from "../Navbar/Navigation";
import SpinWheel from "../SpinWheel/SpinWheel";


// Contract
import getWeb3 from "../../getWeb3";

// CSS
import "./LuckyDrawPage.css";
import LuckyDraw from "../../contracts/LuckyDraw.json";

export default class LuckyDrawPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      LuckyDrawInstance: undefined,
      account: null,
      web3: null,
      isAdmin: false,
      players: [],
      winner: []
    };
  }
  componentDidMount = async () => {
    if (!window.location.hash) {
      window.location = window.location + "#loaded";
      window.location.reload();
    }
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = LuckyDraw.networks[networkId];
      const instance = new web3.eth.Contract(
        LuckyDraw.abi,
        deployedNetwork && deployedNetwork.address
      );
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({
        web3: web3,
        LuckyDrawInstance: instance,
        account: accounts[0],
      });
      
      const adminAccount = await this.state.LuckyDrawInstance.methods.owner().call();
      if (this.state.account === adminAccount) {
        this.setState({ isAdmin: true });
      }

      // Total number of players
      const accountCount = await this.state.LuckyDrawInstance.methods
        .accountCount()
        .call();
      this.setState({ accountCount: accountCount });
      const currentRound = await this.state.LuckyDrawInstance.methods
        .currentRound()
        .call();
      this.setState({ currentRound: currentRound });

      // Loading players details
      for (let i = 0; i < this.state.accountCount; i++) {
        const player = await this.state.LuckyDrawInstance.methods
          .accounts(currentRound, i)
          .call();
        const playerName = await this.state.LuckyDrawInstance.methods
          .mappingAcctName(currentRound, player)
          .call();
        console.log(playerName)
        console.log(player)
        this.state.players.push({
          index: i,
          playerName: playerName,
          playerAccount: player
        });
      }

      for (let i = 0; i < this.state.currentRound; i++) {
        const winner = await this.state.LuckyDrawInstance.methods
        .winner(i)
        .call();
        this.state.winner.push({
          round: i,
          winnerAccount: winner.value_address,
          winnerName: winner.value_name
        });
      }
      this.setState({ players: this.state.players });
      this.setState({ winner: this.state.winner });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  render() {
   
    if (!this.state.web3) {
      return (
        <>
          <Navbar />
          <center>Loading Web3, accounts, and contract...</center>
        </>
      );
    }
    
    return (
      <>
        <Navbar />
        <br />
        <div>
         
          {this.state.accountCount < 6 ? (
             
            <div className="container-item attention">
              <center>
                <h3>Waiting on player.</h3>
                <p>Spin Wheel will be displayed once the player has registered.</p>
                <p>Go to register {"(if not already)"}.</p>
                <br />
                <Link
                  to="/"
                  style={{ color: "black", textDecoration: "underline" }}
                >
                  Register Page
                </Link>
              </center>
            </div>
            
          ) : null
          }
          {displayResults(this.state.players, this.state.winner, this.state)}
        </div>
      </>
    );
  }
}


export function displayResults(players, winner, state) {
  const renderResults = (winner) => {
    return (
      <tr key={winner.round}>
        <td>{winner.round+1}</td>
        <td>{winner.winnerName}</td>
        <td>{winner.winnerAccount}
          {winner.winnerName === '' ? (
            <p style={{ color: "red" }}>(This game has been cancelled)</p>
          ) : null }
        </td>
      </tr>
    );
  };
  return (
    <>
      {players.length === 6 ? (
         <SpinWheel state={state}/>
      ) : null}
      <div className="container-main" style={{ borderTop: "1px solid" }}>
        <h4>Results History</h4>
        {/* <small>Total players: {players.length}</small> */}
        {winner.length < 1 ? (
          <div className="container-item attention">
            <center>No winner.</center>
          </div>
        ) : (
          <>
            <div className="container-item">
              <table>
                <tbody>
                  <tr>
                    <th>Round</th>
                    <th>Winner Name</th>
                    <th>Address</th>
                  </tr>
                  {winner.map(renderResults)}
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
    </>
  );
}
