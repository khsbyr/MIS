import { faFileDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Tabs, Tooltip } from 'antd';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useToolsStore } from '../../../context/Tools';
// import TrainingTest from '../tabs/testAggregation';
import { useTrainingStore } from '../../../context/TrainingContext';
import { getService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import Attendance from '../tabs/attendance';
// import Budget from '../tabs/budget';
import CV from '../tabs/cv';
import FileUpload from '../tabs/fileUpload';
import Guidelines from '../tabs/guidelines';
import Organization from '../tabs/organization';
import TrainingProgram from '../tabs/trainingProgram';
import TrainingReport from '../tabs/trainingReport';
import TrainingTopic from '../tabs/trainingTopic';
import ContentWrapper from './TrainingInfo.style';

const { TabPane } = Tabs;
const tabPosition = 'top';

export default function TraningInfo() {
  const { t } = useTranslation();
  const { id } = useParams();
  const { setIsShowLoader } = useToolsStore();
  // const toolsStore = useToolsStore();
  const { TrainingList, setTrainingList } = useTrainingStore();

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

  function exportTraining(value) {
    window.open(`/exportTraining?trainingId=${value}`);
  }

  return (
    <ContentWrapper>
      <h1
        style={{
          marginLeft: '45px',
          marginRight: '45px',
          marginBottom: '10px',
          color: '#103154',
          fontWeight: '600',
          textAlign: 'right',
        }}
      >
        {TrainingList.name}
        <Tooltip title={t('export')} arrowPointAtCenter>
          <Button
            type="text"
            className="export"
            icon={<FontAwesomeIcon icon={faFileDownload} />}
            onClick={() => exportTraining(TrainingList.id)}
          >
            {' '}
          </Button>
        </Tooltip>
      </h1>

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
        <TabPane tab="Сургалтын сэдэв" key="6">
          <TrainingTopic id={id} />
        </TabPane>
        {/* {toolsStore?.user?.role?.roleLevel?.id === 3 ? (
          ''
        ) : (
          <TabPane tab={t('training_budget')} key="8">
            <Budget id={id} />
          </TabPane>
        )} */}
        <TabPane tab={t('attendance_registration')} key="5">
          <Attendance id={id} />
        </TabPane>
        {/* <TabPane tab={t('test_aggregation')} key="6">
          <TrainingTest id={id} />
        </TabPane> */}
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
