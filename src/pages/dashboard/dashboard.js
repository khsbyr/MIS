import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React, { useState } from 'react';
import ReactDOMServer, { renderToStaticMarkup } from 'react-dom/server';
import mapDataMongolia from './mapDataMongolia';
import DashboardDetail from './more/dashboardDetail';
import { getService } from '../../service/service';
import CountryInfo from './more/countryInfo';

require('highcharts/modules/map')(Highcharts);

let tooltipEnabled = true;

function dashboard() {
  const [aimagList, setAimagList] = useState();

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

  const list = aimagList && aimagList.soums.map(z => z.name);
  const listt = aimagList?.soums?.map(({ name }) => `${name}`).join('|');

  const [chartOptions, setChartOptions] = useState({
    chart: {
      align: 'left',
      backgroundColor: '#283047',
      map: mapDataMongolia,
      resetZoomButton: {
        position: {
          align: 'left', // by default
          // verticalAlign: 'top', // by default
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
      resetZoomButton: {
        position: {
          align: 'left', // by default
          // verticalAlign: 'top', // by default
          x: 100,
          y: 100,
        },
      },
      buttonOptions: {
        theme: {
          r: 8,
        },
        verticalAlign: 'top',
      },
    },

    tooltip: {
      // headerFormat: `<span style="font-size:30px">{point.y:.1f}</span><table>`,
      // pointFormat: '<tr><td style="color:"#fff";padding:0">{}</td></tr>',
      // footerFormat: '</table>',
      positioner() {
        return { x: 80, y: 50 };
      },
      shared: true,
      useHTML: true,
      style: {
        color: 'white',
        fontSize: '30px',
        fontWeight: 'bold',
        // pointerEvents: 'auto',
      },
      borderColor: '#0C2074',
      backgroundColor: '#0C2074',
      // distance: 15,
      enabled: false,
      formatter() {
        const comment = list;
        return `-->${comment !== undefined ? comment : ''}`;
      },
      // formatter() {
      //   return renderToStaticMarkup(
      //     <span style={{ color: 'red' }}>asdasd</span>
      //   );
      // },
    },

    // tooltip: {
    //   formatter() {
    //     return ReactDOMServer.renderToString(<CountryInfo {...this} />);
    //   },
    // },

    series: [
      {
        // events: {
        //   click(e) {
        //     popup(e);
        //   },
        // },
        point: {
          events: {
            click: e => {
              getService(`aimag/get/${e.point.value}`).then(result => {
                if (result) {
                  setAimagList(result || []);
                }
              });
              setChartOptions({
                tooltip: {
                  enabled: tooltipEnabled,
                },
              });
              tooltipEnabled = !tooltipEnabled;
              e.point.zoomTo();
            },
          },
        },
        threshold: 0,
        cursor: 'pointer',
        borderWidth: 0.2,
        borderColor: '#283047',
        data,
        name: 'dasdasd',
        states: {
          select: {
            color: '#a4edba',
            borderColor: 'black',
            dashStyle: 'shortdot',
          },
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
  });

  return (
    <div>
      <HighchartsReact
        options={chartOptions}
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
