import React, { Component } from 'react';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';
import {Bootstrap, Grid, Row, Col, Tabs, Tab, Nav, Button} from 'react-bootstrap'



function cartImage(url, i, deleteme)  {
  return (
    <div>
      <h3>{i}</h3>
      <img className="deleteImage" src="https://cdn3.iconfinder.com/data/icons/ui-essential-elements-dark-buttons/110/DeleteDustbin-512.png"
       onClick={() => deleteme(i)}/>
      <img className="cartImage" src={url}/>
    </div>
  );
};


class Popup extends Component {    
  state = {
    imageURLs : []
  };

  
  
  componentDidMount() {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'getImage') {
      console.log("get image!!!")
      console.log(request)
      let newURLs = [...this.state.imageURLs];
    newURLs.push(request.url);
    this.setState({
      imageURLs: newURLs,
    });
    console.log(newURLs)
    localStorage.setItem('imageURLs', JSON.stringify(newURLs))

  }
});

  
    if (localStorage.getItem("imageURLs") !== null) {
        let URLs = JSON.parse(localStorage.getItem("imageURLs"));
        console.log(URLs)
        this.setState({
            imageURLs: URLs,
        });
    }

    }

    deletePersonClickedHandler = idx => {
    console.log('should delete', idx);
    let newURLs = [...this.state.imageURLs];
    newURLs.splice(idx, 1);
    this.setState({
      imageURLs: newURLs,
    });
    localStorage.setItem("imageURLs", JSON.stringify(newURLs))
  };



  render() {
    return (
      <div>
        <div>
          <Tabs defaultActiveKey="home" id="uncontrolled-tab-example">
            <Tab eventKey="home" title="Home" >
              <div className="cart">
                <div>
                  {this.state.imageURLs.map((url, idx) => {
                    return (
                      cartImage(url, idx, this.deletePersonClickedHandler)
                    );
                  })}
                </div>
                
              </div>
            </Tab>
            <Tab eventKey="profile" title="Profile">
            </Tab>
            <Tab eventKey="Add" title="+">
            </Tab>
          </Tabs>
        </div>
        <Button>View Cart</Button>
      </div>
    );
  }
}





export default Popup;
