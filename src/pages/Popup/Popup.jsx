import React, { Component } from 'react';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';
import {Bootstrap, Grid, Row, Col, Tabs, Tab, Nav, Button} from 'react-bootstrap'
import Gallery from 'react-grid-gallery';




function cartImage(url, i, deleteme)  {
  return (
    <div className="cartItem">
      <img className="deleteImage" src="http://files.softicons.com/download/toolbar-icons/flatastic-icons-part-1-by-custom-icon-design/png/256x256/delete1.png"
       onClick={() => deleteme(i)}/>
      <img className="cartImage" src={url}/>
    </div>
  );
};


class Popup extends Component {   

  state = {
    imageURLs : {},
    tabs : [],
    activeTab : undefined,
    inputValue: '',
    images : []
  };


  componentDidMount() {

    chrome.storage.local.get('imageURLs', function(result){
          if (result['imageURLs']){
              this.setState({
              imageURLs: result['imageURLs'],
              });
          } else {
              if (localStorage.getItem("imageURLs") !== null) {
                  let URLs = JSON.parse(localStorage.getItem("imageURLs"));
                  this.setState({
                      imageURLs: URLs,
                  });
                  chrome.storage.local.set({'imageURLs': URLs});

              }
          }
      }.bind(this));
    


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
        chrome.storage.local.set({'imageURLs': newTotalURLs})
      } 
    });

    if (localStorage.getItem("tabs") !== null) {
        let tabs = JSON.parse(localStorage.getItem("tabs"));
        this.setState({
            tabs: tabs,
        });
    }

    if (localStorage.getItem("activeTab") !== null) {
        let activeTab = localStorage.getItem("activeTab");
        this.setState({
            activeTab: activeTab,
        });
    }

}    


    deleteImage = idx => {

      let newURLs = this.state.imageURLs[this.state.activeTab];
      newURLs.splice(idx, 1);
      let newTotalURLs = this.state.imageURLs
      newTotalURLs[this.state.activeTab] = newURLs
      this.setState({
        imageURLs: newTotalURLs,
      });
      localStorage.setItem("imageURLs", JSON.stringify(newTotalURLs))
      chrome.storage.local.set({'imageURLs': newTotalURLs})
    };

  newTab = activeTab =>  {
    this.setState({
      activeTab: activeTab,
    });
    localStorage.setItem('activeTab', activeTab)
    if (activeTab === "Add") {
      let newTabs = [...this.state.tabs];
        newTabs.push("untitled");
        this.setState({
          tabs: newTabs,
          activeTab: newTabs[newTabs.length-1]
        });
        localStorage.setItem("tabs", JSON.stringify(newTabs))
        localStorage.setItem('activeTab', newTabs[newTabs.length-1])
        this.updateMenu();
      }
  }

  deleteCart = idx => {
    let newTotalURLs = this.state.imageURLs
    newTotalURLs[this.state.tabs[idx]] = undefined
    let newTabs = [...this.state.tabs];
    newTabs.splice(idx, 1);
    this.setState({
      tabs: newTabs,
      activeTab : newTabs[0],
      imageURLs: newTotalURLs
    });
    localStorage.setItem("imageURLs", JSON.stringify(newTotalURLs))
    localStorage.setItem("tabs", JSON.stringify(newTabs))
    localStorage.setItem('activeTab', newTabs[0])
    chrome.storage.local.set({'imageURLs': newTotalURLs})
    this.updateMenu();
  }

  changeCartName = (idx, newName) => {
    let oldName = this.state.tabs[idx]
    let newTotalURLs = this.state.imageURLs
    newTotalURLs[newName] = this.state.imageURLs[oldName]
    newTotalURLs[oldName] = undefined
    let newTabs = [...this.state.tabs];
    newTabs[idx] = newName;
    this.setState({
      tabs: newTabs,
      imageURLs: newTotalURLs,
      activeTab: newName,
      inputValue: ""
    });
    localStorage.setItem("imageURLs", JSON.stringify(newTotalURLs))
    localStorage.setItem("tabs", JSON.stringify(newTabs))
    localStorage.setItem('activeTab', newName)
    chrome.storage.local.set({'imageURLs': newTotalURLs})
    this.updateMenu();
  }

  inputName = (idx, e) => {
    this.setState({
      inputValue: e.target.value,
    })
  }

  updateMenu = () => {
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, {type: 'updateMenu', menu: this.state.tabs});
    })
  }

  viewCart = idx => {
    var cart = this.state.tabs[idx]
    var imageURLs = this.state.imageURLs[this.state.tabs[idx]]
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
          chrome.tabs.sendMessage(tabs[0].id, {type: 'viewCart', cart: cart, imageURLs : imageURLs});
      })
  }



  render() {
    return (
      <div>
        <div>
          <Tabs activeKey={this.state.activeTab} id="uncontrolled-tab-example" onSelect={e => this.newTab(e)}>
            
            {this.state.tabs.map((tab, idx) => {
            if (this.state.imageURLs[tab]){
                return (
                <Tab eventKey={tab} title={tab} key={tab}>
                <div className="cart">
                    <Button size='sm' onClick={() => this.viewCart(idx)}>View</Button>
                    <Button size='sm' onClick={() => this.deleteCart(idx)}>Delete</Button>
                    <Button size='sm' onClick={() => this.changeCartName(idx,this.state.inputValue)}>Rename</Button>
                    <input type="text" placeholder = "new name" value={this.state.inputValue} onChange={e => this.inputName(idx, e)} />
                    
                    <div className="row">
                       <div className="column">
                        {this.state.imageURLs[tab].map((url, idx) => {
                            if (idx % 2 === 0) {
                                return (
                                <div key={idx}>{cartImage(url, idx, this.deleteImage)}
                                </div>
                                );
                            } 
                        })}
                        </div>
                        <div className="column">
                        {this.state.imageURLs[tab].map((url, idx) => {
                            if (idx % 2 === 1) {
                                return (
                                <div key={idx}>{cartImage(url, idx, this.deleteImage)}</div>
                                );
                            } 
                        })}
                        </div>
                    </div>
                </div>
                </Tab>
                );
            } else {
              return (
              <Tab eventKey={tab} title={tab} key={tab}>
              <div className="cart">
                  <Button size='sm' onClick={() => this.viewCart(idx)}>View</Button>
                  <Button size='sm' onClick={() => this.deleteCart(idx)}>Delete</Button>
                  <Button size='sm' onClick={() => this.changeCartName(idx,this.state.inputValue)}>Rename</Button>
                  <input type="text" placeholder = "new name" value={this.state.inputValue} onChange={e => this.inputName(idx, e)} />
              </div>
              </Tab>
              );
            }

            })}
            
            <Tab eventKey="Add" title="+" onSelect={() => this.newTab(0)}>
            </Tab>
          </Tabs>
        </div>
      </div>
    );
  }
}





export default Popup;
