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
          <h3><a href={"/show/"+submission.hashId} className="submission-id">{submission.title}</a></h3>
          <div className="submission-authors">{submission.fullName}</div> 
          <div className="submission-date"><small className="text-muted">
            Published on: {new Date(submission.timestamp*1000).toLocaleDateString('en-EN', 
            { year: 'numeric', month: 'long', day: 'numeric' })}</small></div>
      </div>);
  }

  render() {
    return (
      <div>
        <IntroJumbo/>
        <div className="mt-5 latest-preprints">
          <h2>Latest Pre-prints</h2>
          <div className="submissions">
          <Loader loaded={!this.state.loadingRecentSubmissions}>
            {this.state.recentSubmissions.map((submission) => this.renderSubmission(submission))}
          </Loader>
          </div>
          </div>
      </div>
    );
  }
}

export default RecentSubmissions;
