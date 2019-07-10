

import React, {Component} from 'react'


import {Jumbotron} from 'react-bootstrap';

import '../App.css'
import '../css/bootstrap.css';

class IntroJumbo extends Component {
  render() {
    return (
            <Jumbotron>
              <h1 className="display-3">Dejournal pre-prints</h1>
              <p className="lead">Publish scientific paper pre-prints 
                on <a href="https://www.ethereum.org/">Ethereum Blockchain</a> and <a href="https://ipfs.io/">IPFS</a>. 
                Dejournal makes scientific publishing open, transparent and decentralized.</p>
              </Jumbotron>
    );
  }
}

export default IntroJumbo
