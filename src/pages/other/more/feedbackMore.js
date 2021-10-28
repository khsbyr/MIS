import { Tabs } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';
import ContentWrapper from '../../training/more/TrainingInfo.style';
import FileUpload from '../fileUpload';

const { TabPane } = Tabs;
const tabPosition = 'top';

export default function MakhisMore() {
  const { id } = useParams();
  return (
    <ContentWrapper>
      <Tabs tabPosition={tabPosition}>
        <TabPane tab="Хавсралт файл" key="1">
          <FileUpload id={id} />
        </TabPane>
      </Tabs>
    </ContentWrapper>
  );
}
