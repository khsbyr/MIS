import { Tabs } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import ContentWrapper from './projectInfo.style';
import BriefDraft from '../briefDraft';
import MainInfo from '../mainInfo';

const { TabPane } = Tabs;
const tabPosition = 'top';
const tabPosition2 = 'top';

export default function projectInfo() {
  const { t } = useTranslation();
  const { id } = useParams();
  return (
    <ContentWrapper>
      <Tabs tabPosition={tabPosition2}>
        <TabPane tab="Хураангуй төсөл" key="1">
          <Tabs tabPosition={tabPosition}>
            <TabPane tab="Үндсэн мэдээлэл" key="2">
              <MainInfo />
            </TabPane>
            <TabPane tab="Товч төсөл" key="3">
              <BriefDraft />
            </TabPane>
            <TabPane tab="Хөрөнгө оруулалт" key="4" />
            <TabPane tab="Орлого зардал" key="5" />
            <TabPane tab="Түншлэгч байгууллага" key="6" />
            <TabPane tab="Хавсралт файл" key="7" />
          </Tabs>
        </TabPane>
        <TabPane tab="Дэлгэрэнгүй төсөл" key="8" disabled>
          Дэлгэрэнгүй төсөл
        </TabPane>
      </Tabs>
    </ContentWrapper>
  );
}
