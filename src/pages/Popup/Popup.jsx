import React, { Component } from 'react';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';
import {Bootstrap, Grid, Row, Col, Tabs, Tab, Nav, Button} from 'react-bootstrap'



function printURL() {
    console.log(chrome)
    chrome.storage.local.get("url", function(data) {
        if(typeof data.count == "undefined") {
            // That's kind of bad
            console.log("this is kind of bad")
        } else {
            // Use data.count
            console.log(data.url)
        }
    });
}


class Popup extends Component {
  state = {
    currentURL: ''
  };

  componentDidMount() {
  const url = localStorage.getItem('current_url');
  this.setState({ currentURL: url });
}

  render() {
  console.log("local storage", localStorage)
  console.log("add to cart", chrome.tabs)
    return (
      <div>
        <div>
          <Tabs defaultActiveKey="home" id="uncontrolled-tab-example">
            <Tab eventKey="home" title="Home" >
              <div className="cart">
                <p>
                Into the unknown
                Into the unknown
                Into the unknown
                (Oh)
                I can hear you but I won't
                Some look for trouble while others don't
                There's a thousand reasons I should go about my day
                And ignore your whispers which I wish would go away, oh
                Whoa
                You're not a voice, you're just a ringing in my ear
                And if I heard you, which I don't, I'm spoken for I fear
                Everyone I've ever loved is here within these walls
                I'm sorry, secret siren, but I'm blocking out your calls
                I've had my adventure, I don't need something new
                I'm afraid of what I'm risking if I follow you
                Into the unknown
                Into the unknown
                Into the unknown
                (Oh)
                (Oh)
                What do you want? 'Cause you've been keeping me awake
                Are you here to distract me so I make a big mistake?
                Or are you someone out there who's a little bit like me?
                Who knows deep down I'm not where I'm meant to be?
                Every day's a little harder as I feel your power grow
                Don't you know there's part of me that longs to go
                Into the unknown?
                Into the unknown
                Into the unknown
                (Oh)
                (Oh)
                Whoa
                Are you out there?
                Do you know me?
                Can you feel me?
                Can you show me?
                ooh
                (Ah) ooh
                (Ah) ooh
                (Ah) ooh
                (Ah) ooh
                (Ah) ooh
                Where are you going? Don't leave me alone
                How do I follow you
                Into the unknown?
                Woo!
                </p>
              </div>
            </Tab>
            <Tab eventKey="profile" title="Profile">
            </Tab>
            <Tab eventKey="Add" title="+">
            </Tab>
          </Tabs>
        </div>
        <Button>View Cart</Button>
        <Button id="addToCart" onClick={printURL}>Add to Cart</Button>
      </div>
    );
  }
}

export default Popup;
