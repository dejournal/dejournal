import React, {Component} from 'react'

import {Form, FormControl, Button} from 'react-bootstrap';

var Loader = require('react-loader');


class SubmitForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loadingVersion: false,
      loadingPrice: false,
      fullName: '',
      title: '',
      text: '',
      price: ''
    };
  }

  componentDidMount() {
    if (this.props.match.params.id) {
      this.loadSubmission(this.props.match.params.id);
    }
  }

  componentWillMount() {
    this.loadPrice();
  }

  loadSubmission(hashId) {
    return new Promise((resolve, reject) => {
      this.setState({loadingVersion: true});
      let submission = {};
      this.props.hashStoreContractInstance.getPaperByID(hashId).then((values) => {
        submission.sender = values[0];
        submission.hashContent = values[1];
        submission.timestamp = values[2].toNumber();
        submission.hashId = hashId;
        if (submission.timestamp === 0) {
          this.setState({loadingVersion: false});
          this.props.addNotification("Cannot find the paper", "error");
          return reject("No paper found")
        }
        this.setState({submission: submission});
        this.setState({loadingVersion: false});
        resolve(submission);
      }).catch((err) => {
        this.setState({loadingVersion: false});
        return reject(err);
      });
    });
  }

  loadPrice() {
    console.log(this.props)
    this.props.hashStoreContractInstance.price().then((result) => { 
      this.setState({price: result.toString()});
      }
    )
  }

  //Take file input from user
  captureFile =(event) => {
    event.stopPropagation()
    event.preventDefault()
    const file = event.target.files[0]
    let reader = new window.FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => this.convertToBuffer(reader)
  };

  //Convert the file to buffer to store on IPFS 
  convertToBuffer = async(reader) => {
    //file is converted to a buffer for upload to IPFS
    const buffer = await Buffer.from(reader.result);
    //set this buffer-using es6 syntax
    this.setState({buffer});
  };

  saveText() {
    let {fullName, title, text} = this.state;
    let data = {fullName, title, text};
    let {buffer} = this.state;

    this.setState({savingText: true});

    this.props.ipfs.add(buffer, (err, fileHash) => {
      if (err) {
        this.setState({savingText: false});
        return this.props.addNotification(err.message, "error");
      }
      data.file=fileHash;
      console.log("IPFS file hash:", fileHash);

      

      this.props.ipfs.addJSON(data, (err, hash) => {
        if (err) {
          this.setState({savingText: false});
          return this.props.addNotification(err.message, "error");
        }

        console.log("Saved to IPFS", data);
        console.log("IPFS hash:", hash);
        console.log("eth address:", this.props.web3.eth.defaultAccount);
        console.log("eth address:", this.props.hashStoreContractInstance);

        if(this.props.match.params.id) {
          this.props.hashStoreContractInstance.saveNewVersion(hash, this.props.match.params.id, {from: this.props.web3.eth.defaultAccount, value: this.state.price, gas: 200000}).then((result) => {
            /* if(result.receipt.status !== "0x1"){ // can be used after byzantium to check status
              throw new Error("Transaction failed");
            } */
  
            this.setState({savingText: false});
            console.log('Data saved successfully, Tx:', result.tx);
            let log = result.logs[0];
            let hashId = log.args._hashId.toNumber();
            this.props.addNotification(`New version saved successfully ! Submission ID: ${hashId}`, "success");
            //this.props.onSubmit(hashId);
          }).catch((err) => {
            this.setState({savingText: false});
            this.props.addNotification(err.message, "error");
          });

        } else {

        this.props.hashStoreContractInstance.saveNewPaper(hash, {from: this.props.web3.eth.defaultAccount, value: this.state.price, gas: 200000}).then((result) => {
          /* if(result.receipt.status !== "0x1"){ // can be used after byzantium to check status
            throw new Error("Transaction failed");
          } */

          this.setState({savingText: false});
          console.log('Data saved successfully, Tx:', result.tx);
          let log = result.logs[0];
          let hashId = log.args._hashId.toNumber();
          this.props.addNotification(`Data saved successfully ! Submission ID: ${hashId}`, "success");
          //this.props.onSubmit(hashId);
        }).catch((err) => {
          this.setState({savingText: false});
          this.props.addNotification(err.message, "error");
        });
      }
      });
    });
  }

  updateInputValue(e, field) {
    this.setState({[field]: e.target.value});
  }

  validForm() {
    if (!this.props.hashStoreContractInstance) {
      return false;
    }

    return this.state.fullName && this.state.title && this.state.text && this.state.buffer;
  }

  render() {
    return (
      <div className="SubmitForm">
        {this.props.match.params.id ? (
        <h3> Adding new version to {this.props.match.params.id} </h3>    
            ) : (
              <h3> Choose file to publish on Dejournal </h3> 
            )      
            }
        <Loader loaded={!this.state.loadingVersion}>
          {this.props.match.params.id && !this.state.submission ? (
            <h5>No paper found.</h5>
          ) : ( 
          <div>
        <h5>Submission price: {this.props.web3.utils.fromWei(this.state.price, 'ether')} ETH</h5>
        <Form>
        <Form.Group controlId="formGroupTitle">
        <FormControl required type = "text" onChange = {e => this.updateInputValue(e, 'title')} 
              placeholder = "Title" value={this.state.title}/>
        </Form.Group>
        <Form.Group controlId="formGroupAuthors">
        <FormControl required type = "text" onChange = {e => this.updateInputValue(e, 'fullName')} 
              placeholder = "Authors" value={this.state.fullName}/>
        </Form.Group>
        <Form.Group controlId="formGroupAbstract">
        <FormControl required as = "textarea" onChange = {e => this.updateInputValue(e, 'text')} 
              placeholder = "Abstract" value={this.state.text}/>
        </Form.Group>
        <Form.Group controlId="formGroupFile">
          <FormControl required           
            type = "file"
            onChange = {this.captureFile}
          />
          </Form.Group>
          

          <Loader loaded={!this.state.savingText}>
          <Button
            type="submit" className="pure-button pure-input-1-2 button-success"
            disabled={!this.validForm() || this.state.savingText} 
            onClick={() => this.saveText()}>
              Submit             
          </Button>
          </Loader>
      
        </Form>
        </div>
          )
       }
        </Loader>
      </div>
    );
  }
}

export default SubmitForm;
