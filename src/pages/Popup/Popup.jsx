import React, { Component } from 'react';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';
import {Bootstrap, Grid, Row, Col, Tabs, Tab, Nav, Button} from 'react-bootstrap'



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
  };

  
  
  componentDidMount() {

  chrome.storage.local.get('imageURLs', function(result){
        if (result['imageURLs']){
            console.log("imageURLs from content")
            this.setState({
            imageURLs: result['imageURLs'],
            });
            console.log(result['imageURLs'])
        } else {
            console.log("imageURLs from localStorage")
            if (localStorage.getItem("imageURLs") !== null) {
                let URLs = JSON.parse(localStorage.getItem("imageURLs"));
                console.log(URLs)
                this.setState({
                    imageURLs: URLs,
                });
                chrome.storage.local.set({'imageURLs': URLs});

            }
        }
    }.bind(this));
    


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
    
  });


  
    
    if (localStorage.getItem("tabs") !== null) {
        let tabs = JSON.parse(localStorage.getItem("tabs"));
        this.setState({
            tabs: tabs,
        });
    }
    console.log(localStorage)
    if (localStorage.getItem("activeTab") !== null) {
        let activeTab = localStorage.getItem("activeTab");
        this.setState({
            activeTab: activeTab,
        });
    }

}    


    deleteImage = idx => {
    console.log('should delete', idx);
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
  console.log("delete cart", idx)
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
    this.updateMenu();
  }

  changeCartName = (idx, newName) => {
  console.log("change cart name", idx, newName)
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
  console.log("update menu")
    chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, {type: 'updateMenu', menu: this.state.tabs});
    })
  }

  viewCart = idx => {
  console.log("view cart")
  console.log(this.state.imageURLs, this.state.tabs[idx])
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

                    <Tab eventKey={tab} title={tab}>
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
                                          <div>{cartImage(url, idx, this.deleteImage)}</div>
                                    );
                                } 
                            })}
                            </div>
                            <div className="column">
                            {this.state.imageURLs[tab].map((url, idx) => {
                                if (idx % 2 === 1) {
                                    return (
                                          <div>{cartImage(url, idx, this.deleteImage)}</div>
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
            <Tab eventKey={tab} title={tab}>
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
