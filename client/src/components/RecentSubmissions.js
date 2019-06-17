import React, {Component} from 'react'

import IntroJumbo from './Jumbotron';

var Loader = require('react-loader');

class RecentSubmissions extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loadingRecentSubmissions:false,
      recentSubmissions: []
    };
  }

  componentWillMount() {
    this.loadRecentSubmissions();
  }

  async loadRecentSubmissions() {
    this.setState({loadingRecentSubmissions: true, recentSubmissions: []});
    try {
      let recentSubmissions = [];
      let lastHashId = await this.props.hashStoreContractInstance.lastPaperId();
      lastHashId = lastHashId.toNumber();
      const startHashId = Math.max(1, lastHashId - 5);
      for (let i = lastHashId; i >= startHashId; i--) {
        let submission = await this.loadSubmission(i);
        recentSubmissions.push(submission);
      }
      this.setState({loadingRecentSubmissions: false, recentSubmissions: recentSubmissions});
    }
    catch (err) {
      this.setState({loadingRecentSubmissions: false});
      this.props.addNotification(err.message, "error");
    }
  }

  loadSubmission(hashId) {
    return new Promise((resolve, reject) => {
      let submission = {};
      this.props.hashStoreContractInstance.getPaperByID(hashId).then((values) => {
        submission.sender = values[0];
        submission.hashContent = values[1];
        submission.timestamp = values[2].toNumber();
        submission.hashId = hashId;
        this.props.ipfs.catJSON(submission.hashContent, (err, data) => {
          if (err) {
            console.log(err);
            return resolve(submission);
          }

          submission.title = data.title;
          submission.text = data.text;
          submission.fullName = data.fullName;
          submission.file = data.file;
          resolve(submission);
        });
      }).catch((err) => {
        return reject(err);
      });
    });
  }

  renderSubmission(submission) {
    return (
      <div className="submission" key={submission.hashId}>
        <div className="pure-g">
          <div className="pure-u-8-24">
            <label className="submission-label">Id:</label>
            <a href={"/show/"+submission.hashId} className="submission-id">{submission.hashId}</a>
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
            <a className="submission-hash-content"   target="_blank" rel="noopener noreferrer" 
               href={`https://ipfs.infura.io:5001/api/v0/cat/${submission.hashContent}`}>{submission.hashContent}</a>
          </div>
          <div className="pure-u-5-5">
            <label className="submission-label">IPFS File Hash:</label>
            <a className="submission-filehash-content"   target="_blank" rel="noopener noreferrer" 
               href={`https://ipfs.infura.io:5001/api/v0/cat/${submission.file}`}>{submission.file}</a>
          </div>
          <div className="pure-u-5-5">
            <label className="submission-label">Timestamp:</label>
            <span className="submission-timestamp">{new Date(submission.timestamp*1000).toISOString()}</span>
          </div>
        </div>
      </div>);
  }

  render() {
    return (
      <div className="RecentSubmissions">
        <IntroJumbo/>
        <div className="pure-u-1-1">
          <h3>Recent Submissions</h3>
          <Loader loaded={!this.state.loadingRecentSubmissions}>
            {this.state.recentSubmissions.map((submission) => this.renderSubmission(submission))}
          </Loader>
        </div>
      </div>
    );
  }
}

export default RecentSubmissions;
