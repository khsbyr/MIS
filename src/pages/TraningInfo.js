import { Tabs } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import ContentWrapper from './training/training/components/guidelines.style';
import Organization from './training/training/organization';
import TrainingTeam from './training/training/plan';
import Attendance from './training/training/attendance';
import TrainingReport from './training/training/trainingReport';

const { TabPane } = Tabs;
const tabPosition = 'left';

export default function TraningInfo() {
  const { t } = useTranslation();
  const { id } = useParams();
  return (
    <ContentWrapper>
      <Tabs tabPosition={tabPosition}>
        <TabPane tab={t('consulting_orga')} key="1">
          <Organization id={id} />
        </TabPane>
        <TabPane tab={t('training_intro')} key="2">
          Content of Tab 2
        </TabPane>
        <TabPane tab={t('training_team')} key="3">
          <TrainingTeam id={id} />
        </TabPane>
        <TabPane tab={t('cv_teachers')} key="4">
          Content of Tab 1
        </TabPane>
        <TabPane tab={t('training_program')} key="5">
          Content of Tab 2
        </TabPane>
        <TabPane tab={t('attendance_registration')} key="6">
          <Attendance id={id} />
        </TabPane>
        <TabPane tab={t('test_aggregation')} key="7">
          Content of Tab 1
        </TabPane>
        <TabPane tab={t('training_report')} key="8">
          <TrainingReport id={id} />
        </TabPane>
        <TabPane tab={t('training_budget')} key="9">
          Content of Tab 3
        </TabPane>
      </Tabs>
    </ContentWrapper>
  );
}
