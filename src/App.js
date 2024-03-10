import React, { Component } from 'react';
import ReactGA from 'react-ga';
import $ from 'jquery';
import './App.css';
import Blog from './Blog'

class App extends Component {

  constructor(props){
    super(props);
    ReactGA.initialize('UA-110570651-1');
    ReactGA.pageview(window.location.pathname);
  }

  componentDidMount(){
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
