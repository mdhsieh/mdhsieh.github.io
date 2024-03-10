import React, { Component } from 'react';
import $ from 'jquery';
import './App.css';
import Blog from './Blog'

class App extends Component {

  constructor(props){
    super(props);
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
