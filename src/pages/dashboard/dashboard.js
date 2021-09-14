import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React, { useState } from 'react';
import mapDataMongolia from './mapDataMongolia';
import DashboardDetail from './more/dashboardDetail';
import { getService } from '../../service/service';

require('highcharts/modules/map')(Highcharts);

function dashboard() {
  const [aimagList, setAimagList] = useState();

  const data = [
    ['mn-da', 9],
    ['mn-ub', 1],
    ['mn-hg', 17],
    ['mn-uv', 22],
    ['mn-dg', 11],
    ['mn-og', 10],
    ['mn-hn', 4],
    ['mn-bh', 15],
    ['mn-ar', 16],
    ['mn-dz', 18],
    ['mn-ga', 19],
    ['mn-hd', 21],
    ['mn-bo', 20],
    ['mn-bu', 14],
    ['mn-er', 12],
    ['mn-sl', 7],
    ['mn-oh', 13],
    ['mn-du', 17],
    ['mn-to', 5],
    ['mn-gs', 6],
    ['mn-dd', 2],
    ['mn-sb', 3],
  ];

  const list = aimagList && aimagList.soums;

  const mapOptions = {
    chart: {
      align: 'left',
      backgroundColor: '#283047',
      map: mapDataMongolia,
      resetZoomButton: {
        position: {
          align: 'left',
          x: 100,
          y: 100,
        },
      },
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
            e.point.zoomTo();
            getService(`aimag/get/${e.point.value}`).then(result => {
              if (result) {
                setAimagList(result || []);
              }
            });
          },
        },
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
    <div style={{ backgroundColor: '#283047', height: '100%' }}>
      <HighchartsReact
        options={mapOptions}
        constructorType="mapChart"
        highcharts={Highcharts}
        containerProps={{
          style: { height: '100vh' },
        }}
      />
      <DashboardDetail list={list} />
    </div>
  );
}

export default dashboard;
