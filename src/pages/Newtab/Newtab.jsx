import React, { Component } from 'react';
import './Newtab.css';
import Gallery from 'react-grid-gallery';


class Newtab extends Component {
  state = {
    reactVersion: '16.10',
    webpackVersion: '4',
    imageURLs : [],
  };

  componentDidMount(){
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.type === 'getImage') { 
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
      } 
      if (request.type === 'cartInfo'){
        this.setState(
        {
          imageURLs :  request.state,
          cart: request.cart
        })
      }
    });
  }

  calculateImages = () => {
    var images = [];
    if (this.state.imageURLs){
      this.state.imageURLs.map((url, idx) => {
        images.push({src: url, thumbnail: url, thumbnailWidth: 180, thumnailHeight:'auto'})
      })
    }
    return images
  }

  render() {
    const { reactVersion, webpackVersion } = this.state;
    return (
      <div className="NewtabContainer">
        <Gallery images={this.calculateImages()}/>
      </div>
    );
  }


}

export default Newtab;
