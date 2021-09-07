import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React from 'react';
import mapDataMongolia from './mapDataMongolia';
import DashboardDetail from './more/dashboardDetail';

require('highcharts/modules/map')(Highcharts);

function dashboard() {
  function popup(e) {
    e.point.zoomTo();
  }

  const data = [
    ['mn-da', 0],
    ['mn-ub', 1],
    ['mn-hg', 2],
    ['mn-uv', 3],
    ['mn-dg', 4],
    ['mn-og', 5],
    ['mn-hn', 6],
    ['mn-bh', 7],
    ['mn-ar', 8],
    ['mn-dz', 9],
    ['mn-ga', 10],
    ['mn-hd', 11],
    ['mn-bo', 12],
    ['mn-bu', 13],
    ['mn-er', 14],
    ['mn-sl', 15],
    ['mn-oh', 16],
    ['mn-du', 17],
    ['mn-to', 18],
    ['mn-gs', 19],
    ['mn-dd', 20],
    ['mn-sb', 21],
  ];

  const mapOptions = {
    chart: {
      align: 'left',
      backgroundColor: '#283047',
      map: mapDataMongolia,
    },
    colorAxis: {
      min: 0,
      max: 21,
    },
    title: {
      text: '',
    },
    legend: { enabled: false },
    credits: {
      enabled: false,
    },

    plotOptions: {
      map: {
        tooltip: {
          headerFormat: '',
          pointFormat: '<b>{point.name}</b>',
        },
      },
    },
    mapNavigation: {
      enabled: true,
      buttonOptions: {
        theme: {
          r: 8,
        },
        verticalAlign: 'top',
      },
    },
    series: [
      {
        events: {
          click(e) {
            popup(e);
          },
        },
        color: 'green',
        threshold: 0,
        cursor: 'pointer',
        borderWidth: 0.2,
        borderColor: '#283047',
        data,
        name: 'dasdasd',
        states: {
          hover: {
            color: '#BADA55',
          },
        },
        dataLabels: {
          useHTML: true,
          style: {
            textOutline: 0,
            color: 'white',
            textShadow: false,
            fontSize: '14px',
            fontWeight: '300',
          },
          enabled: true,
          format: '{point.name}',
        },
      },
    ],
  };

  return (
    <div>
      <HighchartsReact
        options={mapOptions}
        constructorType="mapChart"
        highcharts={Highcharts}
        containerProps={{
          style: { height: '100vh' },
        }}
      />
      <DashboardDetail />
    </div>
  );
}

export default dashboard;
