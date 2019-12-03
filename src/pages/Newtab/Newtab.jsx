import React, { Component } from 'react';
import './Newtab.css';

class Newtab extends Component {
  state = {
    reactVersion: '16.10',
    webpackVersion: '4',
    imageURLs : []
  };

  componentDidMount(){

  console.log("send getCart")
  chrome.runtime.sendMessage("aaankadkkoepbdabimmlnojjkjclimcg", {type: "getCart"})

  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'getImage') { 
      console.log("get image!!!")
      console.log(request)
      let newURLs = this.state.imageURLs[request.cart];
      let newTotalURLs = this.state.imageURLs
    if (newURLs) {
        newURLs.push(request.url);
    } else {
        newURLs = [request.url];
    }
    newTotalURLs[request.cart] = newURLs
    this.setState({
      imageURLs: newTotalURLs,
      activeTab: request.cart
    });
    localStorage.setItem('imageURLs', JSON.stringify(newTotalURLs))
    localStorage.setItem('activeTab', request.cart)
    console.log("get", localStorage.getItem('imageURLs'))
  } 
  if (request.type === 'cartInfo'){
    console.log("get cart info")
    console.log(request.cart, request.state)
    this.setState(
    {
      imageURLs :  request.state,
      cart: request.cart
    }
   )
   console.log("state", this.state)
  }
    
  });

  }


  render() {
    const { reactVersion, webpackVersion } = this.state;
    console.log(this.state)
    return (
      <div className="NewtabContainer">
        <p>{this.state.cart}</p>
        {this.state.imageURLs.map((url, idx) => {
                    return (
                      <img src={url} />
                    );
                  })}
        
      </div>
    );
  }
}

export default Newtab;
