import { Tabs } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import ContentWrapper from './TrainingInfo.style';
import Organization from '../tabs/organization';
import TrainingTeam from '../tabs/plan';
import Attendance from '../tabs/attendance';
import TrainingReport from '../tabs/trainingReport';
import Guidelines from '../tabs/guidelines';
import TrainingProgram from '../tabs/trainingProgram';
import Budget from '../tabs/budget';
import TrainingTest from '../tabs/testAggregation';

const { TabPane } = Tabs;
const tabPosition = 'top';

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
          <Guidelines id={id} />
        </TabPane>
        <TabPane tab={t('training_team')} key="3">
          <TrainingTeam id={id} />
        </TabPane>
        <TabPane tab={t('training_program')} key="4">
          <TrainingProgram id={id} />
        </TabPane>
        <TabPane tab={t('attendance_registration')} key="5">
          <Attendance id={id} />
        </TabPane>
        <TabPane tab={t('test_aggregation')} key="6">
          <TrainingTest id={id} />
        </TabPane>
        <TabPane tab={t('training_report')} key="7">
          <TrainingReport id={id} />
        </TabPane>
        <TabPane tab={t('training_budget')} key="8">
          <Budget id={id} />
        </TabPane>
      </Tabs>
    </ContentWrapper>
  );
}
