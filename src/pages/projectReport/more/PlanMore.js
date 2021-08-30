import { Tabs } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';
import ContentWrapper from '../../training/more/TrainingInfo.style';
import MainInfo from './mainInfo';
import Activity from './activity';

const { TabPane } = Tabs;
const tabPosition = 'top';

export default function PlanMore() {
  const { id } = useParams();
  return (
    <ContentWrapper>
      <Tabs tabPosition={tabPosition}>
        <TabPane tab="Үндсэн мэдээлэл" key="1">
          <MainInfo />
        </TabPane>
        <TabPane tab="Үйл ажиллагаа" key="2">
          <Activity />
        </TabPane>
        <TabPane tab="Гүйцэтгэгчид" key="3">
          Content 4
        </TabPane>
        <TabPane tab="Тайлан" key="4">
          Content 4
        </TabPane>
      </Tabs>
    </ContentWrapper>
  );
}
