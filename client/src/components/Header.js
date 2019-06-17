import React, { Component } from 'react';

import { LinkContainer } from 'react-router-bootstrap'
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';

class Header extends Component{
    render() {
        return (
            <header>
                <Navbar bg="light" expand="lg">
                <Navbar.Brand href="#home">Dejournal</Navbar.Brand>  
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    
                    <Nav className="mr-auto">
                    <LinkContainer to="/">
                    <Nav.Link to="/">Home</Nav.Link>
                    </LinkContainer>
                    <LinkContainer to="/submit">
                    <Nav.Link to="/submit">Submit</Nav.Link>
                    </LinkContainer>
                    </Nav>
                    <Navbar.Text className="justify-content-end">
                    Current Network:
                        <span
                        className={`network-name ${!this.props.loadingWeb3 && this.props.web3 ? 'green' : ''} ${!this.props.loadingWeb3 && !this.props.web3 ? 'red' : ''}`}>
                        {this.props.networkName}
                        </span>
                    </Navbar.Text>
                </Navbar.Collapse>
                </Navbar>        
                    

            </header>
        )
    }
}

export default Header;