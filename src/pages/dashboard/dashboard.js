import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React from 'react';
import mapDataMongolia from './mapDataMongolia';
import ContentWrapper from './more/map.style';

require('highcharts/modules/map')(Highcharts);

function dashboard() {
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
    colorAxis: {
      min: 0,
      max: 8,
    },
    title: {
      text: 'MIS',
    },
    legend: { enabled: false },
    credits: {
      enabled: false,
    },
    chart: {
      align: 'left',
    },
    mapNavigation: {
      enabled: true,
      buttonOptions: {
        verticalAlign: 'bottom',
      },
    },
    series: [
      {
        events: {
          click(e) {
            e.point.zoomTo();
          },
        },
        cursor: 'pointer',
        mapData: mapDataMongolia,
        data,
        name: 'dasdasd',
        states: {
          hover: {
            color: '#BADA55',
          },
        },
        dataLabels: {
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
          style: { height: '650px' },
        }}
      />
    </div>
  );
}

export default dashboard;
