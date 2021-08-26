import { Tabs } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';
import ContentWrapper from '../criteria.style';
import CriteriaDetail from './tabs/CriteriaDetail';
import CriteriaTrainning from './tabs/CriteriaTrainning';
import CriteriaProject from './tabs/CriteriaProject';

const { TabPane } = Tabs;
const tabPosition = 'top';

export default function CriteriaMore() {
  const { id } = useParams();
  return (
    <ContentWrapper>
      <Tabs tabPosition={tabPosition}>
        <TabPane tab="Үндсэн мэдээлэл" key="1">
          <CriteriaDetail id={id} />
        </TabPane>
        <TabPane tab="Сургалт" key="2">
          <CriteriaTrainning id={id} />
        </TabPane>
        <TabPane tab="Төсөл" key="3">
          <CriteriaProject id={id} />
        </TabPane>
        <TabPane tab="MAKHIS" key="4">
          Content 4
        </TabPane>
        <TabPane tab="Тэжээл" key="5">
          Content 5
        </TabPane>
      </Tabs>
    </ContentWrapper>
  );
}
