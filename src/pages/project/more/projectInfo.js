import { Tabs } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import ContentWrapper from './projectInfo.style';
import BriefDraft from '../briefDraft';
import MainInfo from '../mainInfo';

const { TabPane } = Tabs;
const tabPosition = 'top';

export default function projectInfo() {
  const { t } = useTranslation();
  const { id } = useParams();
  return (
    <ContentWrapper>
      <Tabs tabPosition={tabPosition}>
        <TabPane tab="Үндсэн мэдээлэл" key="1">
          <MainInfo />
        </TabPane>
        <TabPane tab="Товч төсөл" key="2">
          <BriefDraft />
        </TabPane>
        <TabPane tab="Хөрөнгө оруулалт" key="3" />
        <TabPane tab="Орлого зардал" key="4" />
        <TabPane tab="Зөвлөх байгууллага" key="5" />
        <TabPane tab="Хавсралт файл" key="6" />
        <TabPane tab="Дэлгэрэнгүй төсөл" key="7" />
      </Tabs>
    </ContentWrapper>
  );
}
