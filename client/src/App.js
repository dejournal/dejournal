import React, {Component} from 'react'
import HashStoreContract from './contracts/Dejournal.json'
import getWeb3 from './utils/getWeb3'

import { Route, BrowserRouter as Router, Switch } from 'react-router-dom'

import {Container, Row, Col} from 'react-bootstrap';

import SubmitForm from './components/SubmitForm';
import RecentSubmissions from './components/RecentSubmissions';
import FetchForm from './components/FetchForm';
import Header from './components/Header';



/*import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'*/
import './App.css'
import './css/bootstrap.css';



const contract = require('truffle-contract')

var NotificationSystem = require('react-notification-system');
var Loader = require('react-loader');

const IPFS = require('ipfs-mini');

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      web3: null,
      submitFormDisplayed: false,
      fetchFormDisplayed: false,
      recentSubmissionsDisplayed: false
    }
  }


  addNotification(message, level) {
    this._notificationSystem.addNotification({
      message: message,
      level: level,
      position: "br"
    });
  }

  componentWillMount() {

  }

  componentDidMount() {
    this.setupWeb3((err) => {
      if (err) {
        return console.log(err);
      }
      this.instantiateContract();
    });
    //this.instantiateContract();
    this.setupIpfs();
    this._notificationSystem = this.refs.notificationSystem;
    this.addNotification("Welcome to Dejournal !", "success")
  }

  setupWeb3(cb) {
    this.setState({loadingWeb3: true,loadingContract:true,});
    getWeb3.then(results => {
      let web3 = results.web3;
      if (!web3) {
        return this.setState({
          loadingWeb3: false,
          loadingContract: false,
          network: "Unknown",
          web3: null
        });
      }

      let networkName;
      web3.eth.net.getNetworkType((err, networkId) => {
        switch (networkId) {
          case "main":
            networkName = "Main";
            break;
          case "morden":
            networkName = "Morden";
            break;
          case "ropsten":
            networkName = "Ropsten";
            break;
          case "rinkeby":
            networkName = "Rinkeby";
            break;
          case "kovan":
            networkName = "Kovan";
            break;
          default:
            networkName = "Unknown";
        }

        this.setState({
          loadingWeb3: false,
          web3: web3,
          networkName: networkName
        });
        cb();
      });
    }).catch((err) => {
      this.setState({loadingWeb3: false, loadingContract: false,});
      console.log('Error finding web3.', err.message);
    });
  }

  setupIpfs() {
    const ipfs = new IPFS({host: 'ipfs.infura.io', port: 5001, protocol: 'https'});
    this.setState({ipfs: ipfs});
  }

  instantiateContract() {
    this.setState({loadingContract: true,});
    console.log("Loading contract")
    const hashStoreContract = contract(HashStoreContract);
    hashStoreContract.setProvider(this.state.web3.currentProvider);

    hashStoreContract.deployed().then((hashStoreContractInstance) => {
      this.setState({hashStoreContractInstance});
      this.setState({loadingContract: false,});
    }).catch((err) => {
      this.setState({loadingContract: false,});
      this.addNotification(err.message, "error");
    });
  }



  onSubmit(hashId) {
    this.setState({submitFormDisplayed: false});
  }

  showSubmitForm() {
    this.setState({submitFormDisplayed: true});
    this.setState({fetchFormDisplayed: false});
    this.setState({recentSubmissionsDisplayed: false});
  }

  showFetchForm() {
    this.setState({fetchFormDisplayed: true});
    this.setState({submitFormDisplayed: false});
    this.setState({recentSubmissionsDisplayed: false});
  }

  showRecentSubmissions() {
    this.setState({recentSubmissionsDisplayed: true});
    this.setState({fetchFormDisplayed: false});
    this.setState({submitFormDisplayed: false});
  }

  render() {
    let noNetworkError = (this.state.web3 ?
      <h3 className="no-network">The App is only live on Rinkeby Test Network, please setup MetaMask/Mist to connect to
        Rinkeby</h3> :
      <h3 className="no-network">You're not connected to an Ethereum network. Please install <a
        href="https://metamask.io/">MetaMask</a> or Mist</h3>);

    return (
      <div className="App">
        <Router>
        <NotificationSystem ref="notificationSystem"/>

        <Header web3={this.state.web3} loadingWeb3={this.state.loadingWeb3} networkName={this.state.networkName}/>

        <main>
            <Container>
              <div className="content">
              <Loader loaded={!this.state.loadingWeb3 && !this.state.loadingContract}>
              {this.state.web3 && ["Unknown", "Rinkeby"].includes(this.state.networkName) ?
              
                <Switch>
                <Route exact path={'/'} component={ (props) => <RecentSubmissions web3={this.state.web3} ipfs={this.state.ipfs}
                                    hashStoreContractInstance={this.state.hashStoreContractInstance}
                                    addNotification={this.addNotification.bind(this)} {...props}/>} />
                <Route path={'/submit/:id?'} component={ (props) => <SubmitForm web3={this.state.web3} ipfs={this.state.ipfs}
                                    hashStoreContractInstance={this.state.hashStoreContractInstance}
                                    addNotification={this.addNotification.bind(this)} {...props}/>} />
                <Route path={'/show/:id'} component={ (props) => <FetchForm web3={this.state.web3} ipfs={this.state.ipfs}
                                    hashStoreContractInstance={this.state.hashStoreContractInstance}
                                    addNotification={this.addNotification.bind(this)} {...props}/>} />
                </Switch>
              :
              noNetworkError
            }
              </Loader>
              </div>



          <div className="footer-grid">
            <Row>
              <Col>
              <em>Created by Dejournal - 2019</em>
              </Col>

              <Col>
              <a href="https://twitter.com/tilenkranjc">Twitter</a>
              </Col>

              <Col>
              <a href="https://github.com/tilenkranjc">Github</a>
              </Col>

            </Row>

            </div>
          </Container>
        </main>
        </Router>
      </div>
    );
  }
}

export default App
