import React from 'react';
import Highcharts from 'highcharts';
import PropTypes from 'prop-types';
import './style.css';

class LineChartComponent extends React.PureComponent {
  constructor() {
    super();
    this.chart = null;
  }

  componentDidMount() {
    const { title, symbol, colors, xAxisTitle, dataSource, yAxisTitle } = this.props;
    this.chart = Highcharts.chart('svg-chart', {
      chart: {
        type: 'column'
      },
      plotOptions: {
        series: {
          events: {
            legendItemClick: function (e) {
              let len = this.chart.series.filter(val => (val.visible === true));
              if (this.visible && (len.length === 1)) {
                return false;
              } else {
                return true;
              }
            }
          }
        }
      },
      title: {
        text: title
      },
      tooltip: {
        formatter: function () {
          return '<b>' + this.series.name + ': ' + this.y + symbol + '</b><br />' + this.x;
        }
      },
      colors: colors,
      legend: {
        align: 'left',
        verticalAlign: 'middle',
        layout: 'vertical',
        itemMarginTop: 5,
        itemMarginBottom: 5,
      },
      yAxis: {
        title: {
          text: yAxisTitle
        },
        labels: {
          format: '{value}' + symbol
        },
      },
      xAxis: {
        categories: xAxisTitle
      },
      credits: {
        enabled: false
      },
      series: dataSource.map((value, i) =>
        ({
          id: i,
          name: value.name,
          data: value.data,
          showInLegend: true,
          symbol: 'square'
        })
      )
    });
  }


  showGraph = (id, checked) => {
    checked ? this.chart.get(id).show() : this.chart.get(id).hide();
  }

  render() {
    return (
      <React.Fragment>
        <div id='svg-chart' />
        {
          this.props.dataSource.map((value, i) => {
            return (
              <label key={i} style={{ color: this.props.colors[i % (this.props.colors.length)] }}>{value.name}
                <input type='checkbox'
                  onChange={(e) => this.showGraph(i, e.target.checked)}
                  defaultChecked={true} />&nbsp; &nbsp;
              </label>);
          })
        }
      </React.Fragment>
    );
  }
}

LineChartComponent.defaultProps = {
  title: '',
  colors: ["#7cb5ec", "#434348", "#90ed7d", "#f7a35c", "#8085e9", "#f15c80", "#e4d354", "#2b908f", "#f45b5b", "#91e8e1"],
  xAxisTitle: ['% from yesterday', '% from previous 30 days', '% from previous year'],
  symbol: '%',
  yAxisTitle: 'Values'
};

LineChartComponent.propTypes = {
  title: PropTypes.string,
  dataSource: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(PropTypes.number).isRequired,
  })).isRequired,
  colors: PropTypes.arrayOf(PropTypes.string),
  xAxisTitle: PropTypes.arrayOf(PropTypes.string),
  symbol: PropTypes.string,
  yAxisTitle: PropTypes.string,
}


export default LineChartComponent;
