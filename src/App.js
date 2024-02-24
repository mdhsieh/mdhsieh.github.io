import React, { Component } from 'react';
import ReactGA from 'react-ga';
import $ from 'jquery';
import './App.css';
import About from './Components/About';
import Portfolio from './Components/Portfolio';

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      resumeData: {}
    };

    ReactGA.initialize('UA-110570651-1');
    ReactGA.pageview(window.location.pathname);

  }

  getResumeData(){
    $.ajax({
      url:'/resumeData.json',
      dataType:'json',
      cache: false,
      success: function(data){
        this.setState({resumeData: data});
      }.bind(this),
      error: function(xhr, status, err){
        console.log(err);
        alert(err);
      }
    });
  }

  componentDidMount(){
    this.getResumeData();
  }

  render() {
    return (
      <div className="App">
        <About data={this.state.resumeData.main}/>
        <Portfolio data={this.state.resumeData.portfolio}/>
      </div>
    );
  }
}

export default App;
