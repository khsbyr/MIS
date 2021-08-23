import { Tabs } from 'antd';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProjectStore } from '../../../context/ProjectContext';
import { useToolsStore } from '../../../context/Tools';
import { getService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import BriefDraft from '../briefDraft';
import Investment from '../investment';
import MainInfo from '../mainInfo';
import ProjectOrg from '../projectOrganizations';
import ContentWrapper from './projectInfo.style';

const { TabPane } = Tabs;
const tabPosition = 'top';
const tabPosition2 = 'top';

export default function projectInfo() {
  const { id } = useParams();
  const { ProjectList, setProjectList } = useProjectStore();
  const { setIsShowLoader } = useToolsStore();

  useEffect(() => {
    setIsShowLoader(true);
    getService(`/project/get/${id}`)
      .then(result => {
        setProjectList(result);
      })
      .finally(setIsShowLoader(false))
      .catch(error => {
        errorCatch(error);
        setIsShowLoader(false);
      });
  }, []);

  return (
    <ContentWrapper>
      <Tabs tabPosition={tabPosition2}>
        <TabPane tab="Хураангуй төсөл" key="1">
          <Tabs tabPosition={tabPosition}>
            <TabPane tab="Үндсэн мэдээлэл" key="2">
              <MainInfo projectId={id} />
            </TabPane>
            <TabPane tab="Товч төсөл" key="3">
              <BriefDraft projectId={id} />
            </TabPane>
            <TabPane tab="Хөрөнгө оруулалт" key="4">
              <Investment projectId={id} />
            </TabPane>
            <TabPane tab="Түншлэгч байгууллага" key="5">
              <ProjectOrg projectId={id} />
            </TabPane>
            <TabPane tab="Хавсралт файл" key="6" />
          </Tabs>
        </TabPane>
        {ProjectList?.projectStatus?.id === 1 ? (
          <TabPane tab="Дэлгэрэнгүй төсөл" key="7">
            Дэлгэрэнгүй төсөл
          </TabPane>
        ) : (
          <TabPane tab="Дэлгэрэнгүй төсөл" key="8" disabled />
        )}
      </Tabs>
    </ContentWrapper>
  );
}
