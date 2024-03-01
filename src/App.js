import React, { Component } from 'react';
import ReactGA from 'react-ga';
import $ from 'jquery';
import './App.css';
import Blog from './Blog'

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      websiteData: {}
    };

    ReactGA.initialize('UA-110570651-1');
    ReactGA.pageview(window.location.pathname);

  }

  getwebsiteData(){
    $.ajax({
      url:'/websiteData.json',
      dataType:'json',
      cache: false,
      success: function(data){
        this.setState({websiteData: data});
      }.bind(this),
      error: function(xhr, status, err){
        console.log(err);
        alert(err);
      }
    });
  }

  componentDidMount(){
    this.getwebsiteData();
  }

  render() {
    return (
      <div className="App">
        <Blog/>
      </div>
    );
  }
}

export default App;
