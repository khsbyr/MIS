import { Tabs } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProjectStore } from '../../../context/ProjectContext';
import { useToolsStore } from '../../../context/Tools';
import { getService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import BriefDraft from '../briefdraft';
import Investment from '../investment';
import MainInfo from '../mainInfo';
import ProjectOrg from '../projectOrganizations';
import FileUpload from '../fileUpload';
import ContentWrapper from './projectInfo.style';
import ProjectInfo from '../detailedProject/ProjectInfo';
import Implementation from '../detailedProject/Implementation';
import Monitoring from '../detailedProject/Monitoring';
import FileUploadDetailed from '../FileUploadDetailed';
import Rating from '../detailedProject/Rating';
import ParticipantsProject from '../detailedProject/ParticipantsProject';

const { TabPane } = Tabs;
const tabPosition = 'top';
const tabPosition2 = 'top';

export default function projectInfo() {
  const { id } = useParams();
  const { ProjectList, setProjectList } = useProjectStore();
  const [CriteriaList, setCriteriaList] = useState();
  const { setIsShowLoader } = useToolsStore();
  const toolsStore = useToolsStore();

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

    getService(`/projectCriteria/getCriteriaListByProjectId/${id}`)
      .then(result => {
        setCriteriaList(result);
      })
      .finally(setIsShowLoader(false))
      .catch(error => {
        errorCatch(error);
        setIsShowLoader(false);
      });
  }, []);

  const criteriaId = CriteriaList?.map(z => z.id);

  return (
    <ContentWrapper>
      <h1
        style={{
          marginLeft: '45px',
          marginRight: '45px',
          color: '#103154',
          fontWeight: '600',
          textAlign: 'right',
        }}
      >
        {ProjectList.projectName}{' '}
      </h1>
      <Tabs tabPosition={tabPosition2}>
        <TabPane tab="Төслийн мэдээлэл" key="1">
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
          </Tabs>
        </TabPane>

        <TabPane tab="Хураангуй төсөл" key="12">
          <FileUpload projectId={id} />
        </TabPane>

        {toolsStore.user.role.id === 21 || toolsStore.user.role.id === 19 ? (
          ''
        ) : (
          <TabPane tab="Дэлгэрэнгүй төсөл" key="14">
            <FileUploadDetailed projectId={id} />
          </TabPane>
        )}

        <TabPane tab="Шалгуур үзүүлэлт" key="16">
          <Tabs tabPosition={tabPosition}>
            {criteriaId?.join() === '14' ? (
              <TabPane tab="Сургалтанд хамрагдсан малчдын тоо" key="17">
                <ParticipantsProject projectId={id} criteriaId={14} />
              </TabPane>
            ) : (
              ''
            )}
            {criteriaId?.join() === '19' ? (
              <TabPane
                tab="Бүтээмжит түншлэлд хамрагдаж, ашиг хүртэж буй анхан шатны боловсруулагч (малчин) нарын тоо (тоо)"
                key="18"
              >
                <ParticipantsProject projectId={id} criteriaId={19} />
              </TabPane>
            ) : (
              ''
            )}
            {criteriaId?.join() === '14,19' ? (
              <>
                <TabPane tab="Сургалтанд хамрагдсан малчдын тоо" key="17">
                  <ParticipantsProject projectId={id} criteriaId={14} />
                </TabPane>
                <TabPane
                  tab="Бүтээмжит түншлэлд хамрагдаж, ашиг хүртэж буй анхан шатны боловсруулагч (малчин) нарын тоо (тоо)"
                  key="18"
                >
                  <ParticipantsProject projectId={id} criteriaId={19} />
                </TabPane>
              </>
            ) : (
              ''
            )}
            {criteriaId?.join() === '19,14' ? (
              <>
                <TabPane tab="Сургалтанд хамрагдсан малчдын тоо" key="17">
                  <ParticipantsProject projectId={id} criteriaId={14} />
                </TabPane>
                <TabPane
                  tab="Бүтээмжит түншлэлд хамрагдаж, ашиг хүртэж буй анхан шатны боловсруулагч (малчин) нарын тоо (тоо)"
                  key="18"
                >
                  <ParticipantsProject projectId={id} criteriaId={19} />
                </TabPane>
              </>
            ) : (
              ''
            )}
          </Tabs>
        </TabPane>

        <TabPane tab="Төслийн гүйцэтгэл" key="7">
          <Tabs tabPosition={tabPosition}>
            <TabPane tab="Үйл ажиллагаа" key="8">
              <ProjectInfo />
            </TabPane>
            <TabPane
              tab="Байгаль орчин нийгмийн менежментийн төлөвлөгөө"
              key="9"
            >
              <Implementation />
            </TabPane>
            <TabPane tab="Байгууллагын санхүүгийн мэдээлэл" key="10">
              Хөгжүүлэлт хийгдэж байна...
            </TabPane>
            <TabPane tab="Хөндлөнгийн хяналт-шинжилгээ, үнэлгээ" key="11">
              <Monitoring />
            </TabPane>
            <TabPane tab="Дотоод хяналт-шинжилгээ, үнэлгээ" key="15">
              <Rating />
            </TabPane>
          </Tabs>
        </TabPane>
      </Tabs>
    </ContentWrapper>
  );
}
