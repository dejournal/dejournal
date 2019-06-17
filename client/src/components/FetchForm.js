import React, {Component} from 'react'

import {Button} from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap'

var Loader = require('react-loader');

class FetchForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loadingSubmission: false,
      submission: null
    };
  }

  componentDidMount() {
    this.loadSubmissionById(this.props.match.params.id);
  }

  componentWillMount() {
  }

  async loadSubmissionById(hashId) {
    this.setState({loadingSubmission: true, submission: null});
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
    return new Promise((resolve, reject) => {
      let submission = {};
      this.props.hashStoreContractInstance.getPaperByID(hashId).then((values) => {
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
          if (submission.versionsLength > 1) {
            submission.versions = [];
            for (let i=0;i<submission.versionsLength; i++) {
              await this.props.hashStoreContractInstance.getVersionByID(hashId,i).then((val) => {
                submission.versions.push(val.toNumber())
              })
            }
          }
          resolve(submission);
        });
      }).catch((err) => {
        return reject(err);
      });
    });
  }

  renderVersions(version) {
    return (
      <span key={version}>
      <a href={"/show/"+version}>{version}</a>&nbsp;
      </span>
    )
  }

  renderSubmission(submission) {

    return (
      <div className="submission" key={submission.hashId}>
        <div className="pure-g">
          <div className="pure-u-8-24">
            <label className="submission-label">Id:</label>
            <span className="submission-id">{submission.hashId}</span>
          </div>
          <div className="pure-u-8-24">
            <label className="submission-label">Title:</label>
            <span className="submission-title">{submission.title}</span>
          </div>
          <div className="pure-u-8-24">
            <label className="submission-label">Full Name:</label>
            <span className="submission-full-name">{submission.fullName}</span>
          </div>
          <div className="pure-u-5-5">
            <p className="submission-text">{submission.text}</p>
          </div>
          <div className="pure-u-5-5">
            <label className="submission-label">Sent from:</label>
            <span className="submission-sender">{submission.sender}</span>
          </div>
          <div className="pure-u-5-5">
            <label className="submission-label">IPFS Hash:</label>
            <a className="submission-hash-content" target="_blank" rel="noopener noreferrer"
               href={`https://ipfs.infura.io:5001/api/v0/cat/${submission.hashContent}`}>{submission.hashContent}</a>
          </div>
          <div className="pure-u-5-5">
            <label className="submission-label">Timestamp:</label>
            <span className="submission-timestamp">{new Date(submission.timestamp * 1000).toISOString()}</span>
          </div>
          <div className="pure-u-5-5">
            <label className="submission-label">Versions:</label>
            <span className="submission-timestamp">{submission.versions.map((version) => this.renderVersions(version))}</span>
          </div>
          <div className="pure-u-5-5">
          <LinkContainer to={"/submit/"+this.props.match.params.id}>
          <Button>Add version</Button></LinkContainer>
          </div>
        </div>
      </div>);
  }

  updateHashId(e) {
    this.setState({'hashId': e.target.value});
  }

  render() {
    return (
      <div className="FetchForm">
        <h3>Fetch Submission</h3>
        <div className="Papers">
          <Loader loaded={!this.state.loadingSubmission}>
            {this.state.submission ? this.renderSubmission(this.state.submission) : null}
          </Loader>
        </div>
      </div>
    );
  }
}

export default FetchForm;
