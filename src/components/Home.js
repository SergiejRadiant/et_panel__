import React, { Component } from 'react';
import { Link } from 'react-router-dom';


export default class Home extends Component {
  render() {
    return (
      <div className="content-wrap">
        <div className="content">
          <h1>Welcome to EXT Panel</h1>
          <p>EXT Panel is a user-friendly application for the company Express Transfers. It helps you perform all necessary operations with orders, set your work schedule.</p>
          <p>Application has ability to inform users about new changes in all existing orders or new orders in realtime.</p>

          <h3>The following sections are available:</h3>
          <div className="sections">
            {this.props.links.map(l => {
              return (
                <Link to={l.href} className="button grey" key={l.href}>{l.name}</Link>
              )
            })}
          </div>
          <h3>With best regards</h3>
          <p>We hope this application makes your work a little bit easier.</p>
        </div>
      </div>
    );
  }
}