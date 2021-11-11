import { Descriptions } from 'antd';
import React, { useEffect } from 'react';
import moment from 'moment';
import { useProjectStore } from '../../../context/ProjectContext';
import ContentWrapper from '../../project/more/briefDraft.style';
import { useToolsStore } from '../../../context/Tools';
import { getService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';

function mainInfo(props) {
  const { PlanList, setPlanList } = useProjectStore();
  const { setIsShowLoader } = useToolsStore();
  const toolsStore = useToolsStore();

  useEffect(() => {
    setIsShowLoader(true);
    getService(`/plan/get/${props.id}`)
      .then(result => {
        setPlanList(result);
      })
      .finally(setIsShowLoader(false))
      .catch(error => {
        errorCatch(error);
        setIsShowLoader(false);
      });
  }, []);

  return (
    <div>
      <ContentWrapper>
        <Descriptions bordered column={1}>
          <Descriptions.Item
            label="Төлөвлөгөөний нэр"
            contentStyle={{ width: '65%' }}
          >
            {PlanList?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Бүрэлдэхүүн хэсэг">
            {PlanList?.criteriaReference?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Огноо">
            {moment(PlanList?.startDate).format('YYYY-MM')}
          </Descriptions.Item>
          {/* <Descriptions.Item label="Дуусах огноо">
            {moment(PlanList?.endDate).format('YYYY-M-D')}
          </Descriptions.Item> */}
          {toolsStore.user.roleId === 13 ||
          toolsStore.user.roleId === 4 ||
          toolsStore.user.roleId === 15 ? (
            ''
          ) : (
            <Descriptions.Item label="Төслийн хөгжлийн зорилт, дунд хугацааны шалгуур үзүүлэлтэд хамаарах үр дүн">
              {PlanList?.target}
            </Descriptions.Item>
          )}
          {toolsStore.user.roleId === 13 ||
          toolsStore.user.roleId === 4 ||
          toolsStore.user.roleId === 15 ? (
            ''
          ) : (
            <Descriptions.Item label="Тайлбар">
              {PlanList?.description}
            </Descriptions.Item>
          )}
        </Descriptions>
      </ContentWrapper>
    </div>
  );
}

export default mainInfo;
