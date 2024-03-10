import React, { Component } from 'react';
import './App.css';
import Blog from './Components/Blog'

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
