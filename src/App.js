import React, { Component } from 'react';
import './App.css';
import Messages from './components/Messages';
import Input from './components/Input';

function randomName() {
  const first_names = [
    "Bobo", "Dozo", "Damir", "Kornilije", "Margo", "Ragnar", "Obama", "Teemo",
    "John", "Cxaxukluth", "Yog-Sothoth", "Davor", "Vojko", "Ronald", "Vladimir", "Joinko",
    "Jozo", "Suiiiii", "Vrhovni General", "Geralt", "Kocka", "Jusef", "Labudije", "Zoos"
  ];
  const last_names = [
    "Dodo", "Bono", "Skoljikević", "Kornilijus", "Butter", "Ok", "Obama", "Sotona",
    "Johnson", "The Ancient One", "Skelić", "V", "McDonald", "Vlado", "Boinko",
    "Bozo", "II", "Tito", "Of Rivia", "Labud", "Poporko", " Gospodar Vremena"
  ];
  const first_name = first_names[Math.floor(Math.random() * first_names.length)];
  const last_name = last_names[Math.floor(Math.random() * last_names.length)];
  return first_name + " " + last_name;
}

class App extends Component {
  state = {
    messages: [],
    member: {
      username: randomName(),
    }
  }

  constructor() {
    super();
    this.drone = new window.Scaledrone(process.env.REACT_APP_SCALEDRONE_ROOM_KEY, { 
      data: this.state.member
    });
    this.drone.on('open', error => {
      if (error) {
        return console.error(error);
      }
      const member = {...this.state.member};
      member.id = this.drone.clientId;
      this.setState({member});
    });
    const room = this.drone.subscribe("observable-room");
    room.on('data', (data, member) => {
      const messages = this.state.messages;
      messages.push({member, text: data});
      this.setState({messages});
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1 className='App-header-title'>The Backrooms</h1>
        </div>
        <Messages
          messages={this.state.messages}
          currentMember={this.state.member}
        />
        <Input
          onSendMessage={this.onSendMessage}
        />
      </div>
    );
  }

  onSendMessage = (message) => {
    this.drone.publish({
      room: "observable-room",
      message
    });
  }

}

export default App;
