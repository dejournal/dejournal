

import React, {Component} from 'react'


import {Jumbotron} from 'react-bootstrap';

import '../App.css'
import '../css/bootstrap.css';

class IntroJumbo extends Component {
  render() {
    return (
            <Jumbotron>
              <h1>Dejournal Dapp</h1>
              <p>Dejournal is a <b>Distributed Application (Dapp)</b> running on the Ethereum Blockchain.
                <br/>
                It allows you to :
              </p>
              <ul>
                <li>
                  Publish scientific papers on the InterPlanetary
                  File System (<a href="https://ipfs.io/" target="_blank" rel="noopener noreferrer">IPFS</a> )
                </li>
                <li>
                  Receive a receipt for your text submission
                </li>
                <li>
                  Prove time of submission (via block timestamp)
                </li>
              </ul>
              </Jumbotron>
              
    );
  }
}

export default IntroJumbo
