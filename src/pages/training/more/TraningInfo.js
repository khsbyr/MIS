import { Tabs } from 'antd';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { getService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import ContentWrapper from './TrainingInfo.style';
import Organization from '../tabs/organization';
import CV from '../tabs/cv';
import Attendance from '../tabs/attendance';
import TrainingReport from '../tabs/trainingReport';
import Guidelines from '../tabs/guidelines';
import TrainingProgram from '../tabs/trainingProgram';
import Budget from '../tabs/budget';
import TrainingTest from '../tabs/testAggregation';
import { useTrainingStore } from '../../../context/TrainingContext';
import { useToolsStore } from '../../../context/Tools';
import FileUpload from '../tabs/fileUpload';

const { TabPane } = Tabs;
const tabPosition = 'top';

export default function TraningInfo() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { setIsShowLoader } = useToolsStore();
  const toolsStore = useToolsStore();
  const { setTrainingList } = useTrainingStore();

  useEffect(() => {
    setIsShowLoader(true);
    getService(`/training/get/${id}`)
      .then(result => {
        setTrainingList(result);
      })
      .finally(setIsShowLoader(false))
      .catch(error => {
        errorCatch(error);
        setIsShowLoader(false);
      });
  }, []);
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
          <CV />
        </TabPane>
        <TabPane tab={t('training_program')} key="4">
          <TrainingProgram id={id} />
        </TabPane>
        {toolsStore.user.role?.roleLevel?.id === 3 ? (
          ''
        ) : (
          <TabPane tab={t('training_budget')} key="8">
            <Budget id={id} />
          </TabPane>
        )}
        <TabPane tab={t('attendance_registration')} key="5">
          <Attendance id={id} />
        </TabPane>
        <TabPane tab={t('test_aggregation')} key="6">
          <TrainingTest id={id} />
        </TabPane>
        <TabPane tab={t('training_report')} key="7">
          <TrainingReport id={id} />
        </TabPane>
        <TabPane tab="Хавсралт файл" key="9">
          <FileUpload id={id} />
        </TabPane>
      </Tabs>
    </ContentWrapper>
  );
}
