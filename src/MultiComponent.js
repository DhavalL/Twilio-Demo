import React, { Component } from 'react';
import LineChartComponent from './LineChartComponent';
import MyTime from './MyTime';

class MultiComponent extends Component {
  constructor() {
    super();

    this.data = [{
      name: 'New Members',
      data: [20, -25, 30],
    }, {
      name: 'New Providers',
      data: [15, 20, -34],
    }, {
      name: 'New Facilities',
      data: [5, -33, 35],
    },
    {
      name: 'New Procedures',
      data: [-60, 70, 50],
    },
    {
      name: 'New Companies',
      data: [10, 22, -66],
    }];
  }

  render() {
    return (
<>
       <LineChartComponent
         dataSource={this.data}
       />
      <MyTime />
</>
    )
  }
}

export default MultiComponent;
