import { Tabs } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';
import ContentWrapper from '../../training/more/TrainingInfo.style';
import MainInfo from './mainInfo';
import Activity from './activity';
import PlanUser from './planUser';
import PlanReport from './planReport';

const { TabPane } = Tabs;
const tabPosition = 'top';

export default function PlanMore() {
  const { id } = useParams();
  return (
    <ContentWrapper>
      <Tabs tabPosition={tabPosition}>
        <TabPane tab="Үндсэн мэдээлэл" key="1">
          <MainInfo id={id} />
        </TabPane>
        <TabPane tab="Үйл ажиллагааны дэс дараалал, задаргаа" key="2">
          <Activity id={id} />
        </TabPane>
        <TabPane tab="Гүйцэтгэгчид" key="3">
          <PlanUser id={id} />
        </TabPane>
        <TabPane tab="Тайлан" key="4">
          <PlanReport id={id} />
        </TabPane>
      </Tabs>
    </ContentWrapper>
  );
}
