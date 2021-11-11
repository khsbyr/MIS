import { Tabs } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';
import ContentWrapper from '../../training/more/TrainingInfo.style';
import Service from '../service';
import Doctor from '../doctor';
import Certificate from '../certificate';

const { TabPane } = Tabs;
const tabPosition = 'top';

export default function MakhisMore() {
  const { id } = useParams();
  return (
    <ContentWrapper>
      <Tabs tabPosition={tabPosition}>
        <TabPane tab="Үйлчилгээ" key="1">
          <Service id={id} />
        </TabPane>
        <TabPane tab="Мэргэжилтэн" key="2">
          <Doctor id={id} />
        </TabPane>
        <TabPane tab="Малын гарал үүслийн гэрчилгээ" key="3">
          <Certificate id={id} />
        </TabPane>
      </Tabs>
    </ContentWrapper>
  );
}
