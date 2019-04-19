import React, { Component } from 'react';
import moment from 'moment';

class MyTime extends Component {
  constructor() {
    super();
  }

  convertUTCtolocal = (date) => {
    console.log('[toLocal] UTC: ' + date);
    let utcObj=moment.utc(date).format(); //is used to convert to consider input as UTC if timezone offset is not passed
    var local = moment(utcObj).format('YYYY-MM-DD HH:mm:ss');
    console.log('[toLocal] Local:' + local);
  }

  // convertlocaltoUTC = (date) => {
  //   console.log('[toUTC] Local: ' + date);
  //   var UTCObj = moment.utc(date).format('YYYY-MM-DD HH:mm:ss');
  //   console.log('[toUTC] UTC:' + UTCObj);
  //   return UTCObj;
  // }

  render() {
    return (
      <div>
        {// formating date should contain timezone
        }
        {this.convertUTCtolocal('2019-02-02 12:12:12')}
        {//this.convertlocaltoUTC(moment().format())
        }
        <br />
      </div>
    )
  }
}

export default MyTime;
