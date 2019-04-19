import React from 'react';
import Twilio from 'twilio-client';
import axios from 'axios';
import { map } from 'lodash';
import '../App.css';

const device = Twilio.Device;
export default class NewTwilio extends React.Component {
  constructor() {
    super();
    this.state = {
      number: 'Enter your number',
      onPhone: false,
      log: '',
      buttonVal: 'Call',
      displayBtn: false,
    }
  }

  deviceAvailability = () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      console.log("enumerateDevices() not supported.");
      return false;
    }
    // check availabilities of speaker and microphones.
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      if (map(devices, 'kind').includes('audioinput') && map(devices, 'kind').includes('audiooutput')) {
        console.log('Speaker and microphones are detected.')
        return true;
      } else {
        console.log('Speaker and microphones cannot be detected.');
        return false;
      }
    })
      .catch((err) => {
        console.log(err.name + ": " + err.message);
        return false;
      });
  }

  connectTwilio = () => {

  }

  getPermission = () => {

  }

  componentDidMount() {
    var self = this;
    // deviceAvailability().then({})
    // Fetch Twilio capability token from our php function
    axios.get('https://add-your-domain-in-ngrok.ngrok.io/accessToken.php').then((res) => {
      device.setup(res.data, {
        // Set Opus as our preferred codec. Opus generally performs better, requiring less bandwidth and
        // providing better audio quality in restrained network conditions. Opus will be default in 2.0.
        codecPreferences: ['opus', 'pcmu'],
        // Use fake DTMF tones client-side. Real tones are still sent to the other end of the call,
        // but the client-side DTMF tones are fake. This prevents the local mic capturing the DTMF tone
        // a second time and sending the tone twice. This will be default in 2.0.
        fakeLocalDTMF: true,
      });

    }).catch(err => {
      console.log(err);
      alert('Error in Token!')
      self.setState({ log: 'Could not fetch token, see console.log' });
    });

    // Error handling
    device.on('error', (error) => {
      let templog;
      switch (error.code) {
        case 31204:
          console.log('device Error: ', error);
          templog = 'Token parsing failed.';
          break;
        case 31201:
          console.log('device Error: ', error);
          templog = 'Device cannot be found. ' + error.message;
          break;
        default:
          console.log('Something went wrong', error);
          templog = 'Something went wrong';
      }
      this.setState({ log: templog, buttonVal: 'Call' });
    });

    // Configure event handlers for Twilio Device
    device.on('disconnect', () => {
      self.setState({
        onPhone: false,
        log: 'Call ended.'
      });
    });

    device.on('ready', () => {
      self.log = 'Connected';
      this.setState({ log: 'click to call', displayBtn: 'Calling' });
    });

    // debugger
    // console.log(navigator.permissions.query({ name: 'microphone' }));
    // navigator.permissions.query({ name: 'microphone' })
    //   .then((permissionObj) => {
    //     console.log(permissionObj);
    //     if (permissionObj.state === 'denied') {
    //       this.setState({ log: 'Please grant mic permission.' });
    //       return false;
    //     }
    //     else {
    //       console.log('Got stream, time diff :', Date.now() - now);
    //       navigator.permissions.query({ name: 'microphone' })
    //         .then((permissionObj) => {
    //           console.log(permissionObj.state);
    //           if (permissionObj.state === 'denied') {
    //             this.setState({ log: 'Please grant mic permission.' });
    //           }
    //           else if (permissionObj.state === 'granted') {
    //             self.setState({ permission: true })

    //             // Fetch Twilio capability token from our php function
    //             axios.get('https://aa1d63d7.ngrok.io/accessToken.php').then((res) => {
    //               device.setup(res.data, {
    //                 // Set Opus as our preferred codec. Opus generally performs better, requiring less bandwidth and
    //                 // providing better audio quality in restrained network conditions. Opus will be default in 2.0.
    //                 codecPreferences: ['opus', 'pcmu'],
    //                 // Use fake DTMF tones client-side. Real tones are still sent to the other end of the call,
    //                 // but the client-side DTMF tones are fake. This prevents the local mic capturing the DTMF tone
    //                 // a second time and sending the tone twice. This will be default in 2.0.
    //                 fakeLocalDTMF: true,
    //               });

    //               device.on('error', function (error) {
    //                 console.log('device Error: ' + error.message);
    //               });
    //               this.setState({ log: 'click to call' });
    //             }).catch(err => {
    //               debugger
    //               console.log(err);
    //               alert('Error in Token!')
    //               self.setState({ log: 'Could not fetch token, see console.log' });
    //             });

    //             // Configure event handlers for Twilio Device
    //             device.disconnect(function () {
    //               self.setState({
    //                 onPhone: false,
    //                 log: 'Call ended.'
    //               });
    //             });

    //             device.ready(function () {
    //               self.log = 'Connected';
    //             });
    //           }
    //         })
    //         .catch((error) => {
    //           debugger
    //           self.setState({ permission: false, log: 'Got query error :' + error })
    //           console.log('Got query error :', error);
    //         })
    //       debugger
    //     }
    //   })
    //   .catch((err) => {
    //     debugger
    //     this.setState({ log: 'GUM failed with error' });
    //     console.log('GUM failed with error, time diff: ', Date.now() - now, err);
    //   });


    // alert('There could be one of the reasons :\n1. Devices are not found.\n2. Browser does not support this feature.\n3. Your are not using site with https.');
    // console.log('There could be one of the reasons :\n1. Devices are not found.\n2. Browser does not support this feature.\n3. Your are not using site with https.');
    // this.setState({ log: 'Something went wrong. See console for errors.', displayBtn: false });

  }

  callFunc = () => {
    if (!this.state.onPhone) {
      try {
        device.connect({ number: this.state.number });
        this.setState({ onPhone: true });
      } catch (e) {
        console.log(e.message);
        this.setState({ log: 'Error occurred!' });
        return false;
      }
      this.setState({ log: 'calling', buttonVal: 'End' });
    } else {
      // hang up call in progress
      this.setState({ log: 'Disconnected', buttonVal: 'Call' });
      device.disconnectAll();
    }

  }

  render() {
    const { displayBtn } = this.state;
    return (
      <div className="dialer">
        {displayBtn && <button
          className={'btn' + (this.state.buttonVal === 'End' ? ' danger' : '')}
          onClick={this.callFunc}>{this.state.buttonVal}
        </button>}
        <div style={{ padding: '20px', margin: '10px' }}>{this.state.log}</div>
      </div>
    );
  }
}
