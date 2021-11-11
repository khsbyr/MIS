import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import React, { useState } from 'react';
import { Tabs } from 'antd';
import mapDataMongolia from './mapDataMongolia';
import DashboardDetail from './more/dashboardDetail';
import { getService } from '../../service/service';
// import DashboardCriteria from './more/dashboardCriteria';
import DashboardProject from './more/dashboardProject';
import ContentWrapper from './more/dashboard.style';
import { useToolsStore } from '../../context/Tools';

require('highcharts/modules/map')(Highcharts);

const { TabPane } = Tabs;

function dashboard() {
  const [aimagList, setAimagList] = useState();
  const [aimagListProject, setAimagListProject] = useState();
  const [statusList, setStatusList] = useState();
  const tabPosition = 'top';
  const toolsStore = useToolsStore();
  const [Buteemjit, setButeemjit] = useState();
  const [Innovation, setInnovation] = useState();
  const [Tejeel, setTejeel] = useState();
  const [MalEmneleg, setMalEmneleg] = useState();

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

  const list = aimagList && aimagList;

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

    series: [
      {
        events: {
          click(e) {
            // e.point.zoomTo();
            toolsStore.setIsAimag(true);
            getService(`training/getSoums/${e.point.value}`).then(result => {
              if (result) {
                setAimagList(result || []);
              }
            });
            getService(
              `training/getDashboardInfo?aimagId=${e.point.value}&soumId=0`
            ).then(result => {
              if (result) {
                setStatusList(result);
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
          select: {
            color: 'blue',
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
  };

  const mapOptionss = {
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

    series: [
      {
        events: {
          click(e) {
            // e.point.zoomTo();
            toolsStore.setIsAimag2(true);
            getService(`project/getSoums/${e.point.value}`).then(result => {
              if (result) {
                setAimagListProject(result || []);
              }
            });
            getService(
              `farmer/getProjectDashboardInfo?projectTypeId=1&aimagId=${e.point.value}&soumId=0`
            ).then(result => {
              if (result) {
                setButeemjit(result);
              }
            });
            getService(
              `farmer/getProjectDashboardInfo?projectTypeId=2&aimagId=${e.point.value}&soumId=0`
            ).then(result => {
              if (result) {
                setInnovation(result);
              }
            });
            getService(
              `farmer/getProjectDashboardInfo?projectTypeId=3&aimagId=${e.point.value}&soumId=0`
            ).then(result => {
              if (result) {
                setTejeel(result);
              }
            });
            getService(
              `farmer/getProjectDashboardInfo?projectTypeId=4&aimagId=${e.point.value}&soumId=0`
            ).then(result => {
              if (result) {
                setMalEmneleg(result);
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
          select: {
            color: 'blue',
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
  };

  return (
    <ContentWrapper>
      <Tabs tabPosition={tabPosition}>
        <TabPane tab="Сургалт" key="1">
          <HighchartsReact
            options={mapOptions}
            constructorType="mapChart"
            highcharts={Highcharts}
            containerProps={{
              style: { height: '100vh' },
            }}
          />
          <DashboardDetail list={list} status={statusList} />
        </TabPane>
        <TabPane tab="Төсөл" key="2">
          <HighchartsReact
            options={mapOptionss}
            constructorType="mapChart"
            highcharts={Highcharts}
            containerProps={{
              style: { height: '100vh' },
            }}
          />
          <DashboardProject
            aimagListProject={aimagListProject}
            Buteemjit={Buteemjit}
            Innovation={Innovation}
            Tejeel={Tejeel}
            MalEmneleg={MalEmneleg}
          />
        </TabPane>
        {/* <TabPane tab="Шалгуур үзүүлэлт" key="3">
          <DashboardCriteria />
        </TabPane> */}
      </Tabs>
    </ContentWrapper>
  );
}

export default dashboard;
