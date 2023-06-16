// Node modules
import React, { Component } from "react";
import { useForm } from "react-hook-form";


// Components
import Navbar from "./Navbar/Navigation";
import PlayerList from "./Player/PlayerList";

// Contract
import getWeb3 from "../getWeb3";
import LuckyDraw from "../contracts/LuckyDraw.json";

// CSS
import "./Home.css";
import swal from 'sweetalert';
import 'bootstrap/dist/css/bootstrap.css';

// const buttonRef = React.createRef();
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      LuckyDrawInstance: undefined,
      account: null,
      web3: null,
      adminAccount: null,
      isAdmin: false,
      players: []
    };
  }

  // refreshing once
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
      this.setState({ adminAccount: adminAccount });
      console.log("Admin: "+ this.state.adminAccount);

      // Total number of players
      const accountCount = await this.state.LuckyDrawInstance.methods
        .accountCount()
        .call();
      this.setState({ accountCount: accountCount });
      const currentRound = await this.state.LuckyDrawInstance.methods
        .currentRound()
        .call();
      this.setState({ currentRound: Number(currentRound) });

      // Loading players details
      for (let i = 0; i < this.state.accountCount; i++) {
        const player = await this.state.LuckyDrawInstance.methods
          .accounts(currentRound, i)
          .call();
        const playerName = await this.state.LuckyDrawInstance.methods
          .mappingAcctName(currentRound, player)
          .call();
        this.state.players.push({
          index: i,
          playerName: playerName,
          playerAccount: player
        });
      }
    
      this.setState({ players: this.state.players });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };


  // register and start election
  registerUser = async (data) => {
    if(Number(this.state.accountCount) === 6) {
      swal({
        title: "Register Failed",
        text: 'Limited to a total of 6 players per round.',
        icon: "error"
      })
      return;
    }
    for (let i = 0; i < this.state.players.length; i++) {
      if(this.state.account === this.state.players[i].playerAccount) {
        swal({
          title: "Register Failed",
          text: 'An account cannot register twice.',
          icon: "error"
        })
        return;
      }
    }
    let options = {
      from: this.state.account,
      value: 50000000000000000
    }
    await this.state.LuckyDrawInstance.methods
      .register(
        data.accountName
      )
      .send(options);
    window.location.reload();
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
        <div className="container-main"> <h2>Lucky Draw DApp</h2></div>
        <div className="container-item attention">
          <div className="text-left">
            <h4>Game rules</h4>
            <p style={{marginBottom: "0px"}}>1. Limited to a total of 6 players per round and each person can only register once per round.</p>
            <p style={{marginBottom: "0px"}}>2. Allow persons to register and pay a registration fee of 0.05 ETH per game.</p>
            <p style={{marginBottom: "0px"}}>3. The winner will receive the total registration fee of everyone and will be required to pay a game fee of 30% of their winnings.</p>
          </div>
        </div>
        <this.renderHome/>
        <div className="container-main" style={{ borderTop: "1px solid" }}>
            <h4>Admin Information</h4>
            <div className="container-item">
              <table>
                <tbody>
                  <tr>
                    <th>Address</th>
                  </tr>
                  <tr>
                    <td>
                      {this.state.adminAccount}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
        </div>
        
        <PlayerList state={this.state}/>
      </>
    );
  }

  renderHome = () => {
    const EMsg = (props) => {
      return <span style={{ color: "tomato" }}>{props.msg}</span>;
    };

    const Home = () => {
      // Contains of Home page
      const {
        handleSubmit,
        register,
        formState: { errors },
      } = useForm();

      const onSubmit = (data) => {
        this.registerUser(data);
      };
      return (
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
              <div className="container-main">
                {/* about-admin */}
                <div className="about-admin">
                  <h4>Registation</h4>
                  <div className="container-item center-items">
                    <div>
                      <label className="label-home">
                         Nick Name:
                        {errors.accountName && <EMsg msg="*required" />}
                        <input
                          className="input-home"
                          type="text"
                          placeholder="Your Name"
                          {...register("accountName", {
                            required: true,
                          })}
                        />
                        <div className="text-center">
                          <button className="btn btn-outline-primary" type="submit">
                            Register
                          </button>
                        </div>
                      </label>
                     
                    </div>
                  </div>
                </div>
              </div>
          </form>
        </div>
      );
    };
    return <Home />;
  };
}
