import { Tabs } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';
import ContentWrapper from './projectInfo.style';
import BriefDraft from '../briefDraft';
import MainInfo from '../mainInfo';

const { TabPane } = Tabs;
const tabPosition = 'top';
const tabPosition2 = 'top';

export default function projectInfo() {
  const { id } = useParams();
  return (
    <ContentWrapper>
      <Tabs tabPosition={tabPosition2}>
        <TabPane tab="Хураангуй төсөл" key="1">
          <Tabs tabPosition={tabPosition}>
            <TabPane tab="Үндсэн мэдээлэл" key="2">
              <MainInfo projectId={id} />
            </TabPane>
            <TabPane tab="Товч төсөл" key="3">
              <BriefDraft />
            </TabPane>
            <TabPane tab="Хөрөнгө оруулалт" key="4" />
            <TabPane tab="Түншлэгч байгууллага" key="5" />
            <TabPane tab="Хавсралт файл" key="6" />
          </Tabs>
        </TabPane>
        <TabPane tab="Дэлгэрэнгүй төсөл" key="7" disabled>
          Дэлгэрэнгүй төсөл
        </TabPane>
      </Tabs>
    </ContentWrapper>
  );
}
