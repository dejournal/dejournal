import React, {Component} from 'react'

import {Button, Row, Col} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'

var Loader = require('react-loader');

class FetchForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loadingSubmission: false,
      submission: {
        versions:[]
      }
    };
  }

  componentDidMount() {
    this.loadSubmissionById(this.props.match.params.id);
  }

  componentWillMount() {
  }

  async loadSubmissionById(hashId) {
    this.setState({loadingSubmission: true, submission: {versions:[]}});
    try {
      let submission = await this.loadSubmission(hashId);
      this.setState({loadingSubmission: false, submission: submission});
    }
    catch (err) {
      this.setState({loadingSubmission: false});
      this.props.addNotification(err.message, "error");
    }
  }

  loadSubmission(hashId) {
    return new Promise(async (resolve, reject) => {
      let submission = {};
      this.props.hashStoreContractInstance.getPaperByID(hashId).then( async (values) => {
        if (values[0] === "0x0000000000000000000000000000000000000000") {
          return reject(new Error("Submission not found"));
        }

        submission.sender = values[0];
        submission.hashContent = values[1];
        submission.timestamp = values[2].toNumber();
        submission.versionsLength = values[3].toNumber();
        submission.hashId = hashId;
        this.props.ipfs.catJSON(submission.hashContent, async (err, data) => {
          if (err) {
            console.log(err);
            return resolve(submission);
          }

          submission.title = data.title;
          submission.text = data.text;
          submission.fullName = data.fullName;
          submission.file = data.file;
          submission.versions = [];
          //if (submission.versionsLength > 1) {
            
            for (let i=0;i<submission.versionsLength; i++) {
              await this.props.hashStoreContractInstance.getVersionByID(hashId,i).then(async (val) => {
                submission.versions.push(val.toNumber())
              })
            }
          //}
          resolve(submission);
        });
      }).catch((err) => {
        return reject(err);
      });
    });
  }

  renderVersions(version) {
    return (
      <ul className="mb-1">
      <li key={version}>
      <a href={"/show/"+version}>{version}</a>&nbsp;
      </li>
      </ul>
    )
  }

  renderSubmission(submission) {

    return (
      <div key={submission.hashId}>
        <Row>
        <Col>
        <h1>{submission.title}</h1>
        
        
        <div className="submission-authors">{submission.fullName}</div> 
        <div className="submission-date"><small className="text-muted">
            Published on: {new Date(submission.timestamp*1000).toLocaleDateString('en-EN', 
            { year: 'numeric', month: 'long', day: 'numeric' })}</small></div>

        <p className="mt-3 submission-abstract">{submission.text}</p>

        <div className="mb-3 submission-versions">Versions of this file: 
        {submission.versions.map((version) => this.renderVersions(version))}
        <LinkContainer to={"/submit/"+this.props.match.params.id}>
              <a href="#">Add version</a></LinkContainer>

        
        </div>

            

            <div className="submission-sender">
              <small className="text-muted">
              Sent from wallet: {submission.sender} <br/>
              Submission hash: {submission.hashContent} <br/>
              Manuscript hash: <a className="submission-hash-content" target="_blank" rel="noopener noreferrer"
               href={`https://ipfs.infura.io:5001/api/v0/cat/${submission.file}`}>{submission.file}</a> <br/>

              </small>

            </div>
            </Col>
            <Col xs={3}>
              <div className="my-3">
              <Button href={"https://ipfs.infura.io:5001/api/v0/cat/"+submission.file} 
              className="mt-3 btn-side btn-read" variant="primary" size="lg">Read</Button>
              </div>
              <div className="my-3">
              
              </div>
            </Col>
            </Row>
      </div>);
  }

  updateHashId(e) {
    this.setState({'hashId': e.target.value});
  }

  render() {
    return (
      <div className="show-submission">
          <Loader loaded={!this.state.loadingSubmission}>
            {this.state.submission ? this.renderSubmission(this.state.submission) : null}
          </Loader>
      </div>
    );
  }
}

export default FetchForm;
