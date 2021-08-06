import { Tabs } from 'antd';
import React from 'react';
import ContentWrapper from '../criteria.style';

const { TabPane } = Tabs;
const tabPosition = 'top';

export default function CriteriaDetail() {
  return (
    <ContentWrapper>
      <Tabs tabPosition={tabPosition}>
        <TabPane tab="Үндсэн мэдээлэл" key="1">
          Content 1
        </TabPane>
        <TabPane tab="Сургалт" key="2">
          Content 2
        </TabPane>
        <TabPane tab="Төсөл" key="3">
          Content 3
        </TabPane>
        <TabPane tab="MAKHIS" key="4">
          Content 4
        </TabPane>
        <TabPane tab="Төсөл" key="5">
          Content 5
        </TabPane>
      </Tabs>
    </ContentWrapper>
  );
}
