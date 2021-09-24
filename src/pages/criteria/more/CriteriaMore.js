import { Tabs } from 'antd';
import React from 'react';
import { useParams } from 'react-router-dom';
import ContentWrapper from '../../project/more/projectInfo.style';
import CriteriaDetail from './tabs/CriteriaDetail';
import CriteriaTrainning from './tabs/CriteriaTrainning';
import CriteriaProject from './tabs/CriteriaProject';
import IndicatorsReport from '../../other/IndicatorsReport';

const { TabPane } = Tabs;
const tabPosition = 'top';

export default function CriteriaMore() {
  const { id } = useParams();

  return (
    <ContentWrapper>
      <Tabs tabPosition={tabPosition}>
        <TabPane tab="Үндсэн мэдээлэл" key="1">
          <CriteriaDetail id={id} />
        </TabPane>
        <TabPane tab="Сургалт" key="2">
          <CriteriaTrainning id={id} />
        </TabPane>
        <TabPane tab="Төсөл" key="3">
          <CriteriaProject id={id} />
        </TabPane>
        <TabPane tab="Тэжээл" key="4">
          Content 5
        </TabPane>
        {id === `10` ||
        id === `27` ||
        id === `28` ||
        id === `11` ||
        id === `29` ||
        id === `30` ||
        id === `33` ? (
          <TabPane tab="Үр дүн" key="5">
            <IndicatorsReport id={id} />
          </TabPane>
        ) : (
          ''
        )}
      </Tabs>
    </ContentWrapper>
  );
}
