import React, { Component } from 'react';
import * as d3 from 'd3';
import axios from 'axios';

class App extends Component {

  componentDidMount() {
    let arr = [
      {
        time: '1',
        userPerc: '0'
      },
      {
        time: '2',
        userPerc: '20'
      },
      {
        time: '3',
        userPerc: '25'
      },
      {
        time: '4',
        userPerc: '28'
      }];
    this.drawSplineChart(arr);
  }

  getIp = () => { 
    axios.get('https://api.ipify.org/?format=json').then((res) => {
      console.log(res.data.ip)
      return res.data.ip;
    }).catch((error) => {
      console.log(error);
    })
  }

  drawSplineChart = (data) => {
    var svgWidth = 600, svgHeight = 400;
    var margin = { top: 20, right: 20, bottom: 30, left: 50 };
    var width = svgWidth - margin.left - margin.right;
    var height = svgHeight - margin.top - margin.bottom;
    var svg = d3.select('svg')
      .attr("width", svgWidth)
      .attr("height", svgHeight)
      .style("border", '1px solid lightgray');

    var g = svg.append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")"
      );

    var x = d3.scaleLinear().rangeRound([0, width]);
    var y = d3.scaleLinear().rangeRound([height, 0]);
    var line = d3.line()
      .x(function (d) { return x(d.time) })
      .y(function (d) { return y(d.userPerc) })
    x.domain(d3.extent(data, function (d) { return d.time }));
    y.domain(d3.extent(data, function (d) { return d.userPerc }));

    g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .select(".domain")
      .remove();

    g.append("g")
      .call(d3.axisLeft(y))
      .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Users (%)");

    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 3)
      .attr("d", line);
  }
  render() {
    return (
      <div>
        <svg />
      </div>
    );
  }
}

export default App;
