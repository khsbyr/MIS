import { Button, Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { useToolsStore } from '../../../context/Tools';
import { getService } from '../../../service/service';
import ContentWrapper from './map.style';

function dashboardProject(props) {
  const { aimagListProject } = props;
  const toolsStore = useToolsStore();
  const [ListButeemjit, setListButeemjit] = useState([]);
  const [ListInnovation, setListInnovation] = useState([]);
  const [ListTejeel, setListTejeel] = useState([]);
  const [ListMalEmneleg, setListMalEmneleg] = useState([]);

  useEffect(() => {
    getService(
      'farmer/getProjectDashboardInfo?projectTypeId=1&aimagId=0&soumId=0'
    ).then(result => {
      if (result) {
        toolsStore.setIsAimag2(false);
        setListButeemjit(result);
      }
    });
    getService(
      'farmer/getProjectDashboardInfo?projectTypeId=2&aimagId=0&soumId=0'
    ).then(result => {
      if (result) {
        toolsStore.setIsAimag2(false);
        setListInnovation(result);
      }
    });
    getService(
      'farmer/getProjectDashboardInfo?projectTypeId=3&aimagId=0&soumId=0'
    ).then(result => {
      if (result) {
        toolsStore.setIsAimag2(false);
        setListTejeel(result);
      }
    });
    getService(
      'farmer/getProjectDashboardInfo?projectTypeId=4&aimagId=0&soumId=0'
    ).then(result => {
      if (result) {
        toolsStore.setIsAimag2(false);
        setListMalEmneleg(result);
      }
    });
  }, []);

  function onClick(value) {
    toolsStore.setIsAimag2(false);
    getService(
      `farmer/getProjectDashboardInfo?projectTypeId=1&aimagId=${value.aimagId}&soumId=${value.id}`
    ).then(result => {
      if (result) {
        setListButeemjit(result);
      }
    });
    getService(
      `farmer/getProjectDashboardInfo?projectTypeId=2&aimagId=${value.aimagId}&soumId=${value.id}`
    ).then(result => {
      if (result) {
        setListInnovation(result);
      }
    });
    getService(
      `farmer/getProjectDashboardInfo?projectTypeId=3&aimagId=${value.aimagId}&soumId=${value.id}`
    ).then(result => {
      if (result) {
        setListTejeel(result);
      }
    });
    getService(
      `farmer/getProjectDashboardInfo?projectTypeId=4&aimagId=${value.aimagId}&soumId=${value.id}`
    ).then(result => {
      if (result) {
        setListMalEmneleg(result);
      }
    });
  }

  return (
    <div>
      <ContentWrapper>
        <Row style={{ marginTop: '0%', marginLeft: '10%' }}>
          <Col span={24}>
            {aimagListProject?.map(z => (
              <Button
                type="primary"
                className="scale"
                style={{
                  marginLeft: '10px',
                  marginTop: '20px',
                  width: '200px',
                  height: '60px',
                  // background: 'none',
                  // borderColor: '#36577a',
                }}
                onClick={() => onClick(z)}
              >
                {z.name}
              </Button>
            ))}
          </Col>
        </Row>
        <Row justify="space-between" style={{ marginTop: '5%' }}>
          <Col lg={1} />

          <Col lg={9}>
            <h1 className="titleTusul">Бүтээмжит түншлэлийн хамтын шийдэл</h1>
            <Row gutter={20}>
              <Col lg={12}>
                <div className="bodyTusul">
                  Нийт төслийн тоо
                  <p className="total">
                    {toolsStore.isAimag2
                      ? props.Buteemjit?.projectNumbers
                      : ListButeemjit.projectNumbers}
                  </p>
                </div>
              </Col>
              <Col lg={12}>
                <div className="bodyTusul">
                  Гүйцэтгэлийн хувь
                  <p className="total">
                    {toolsStore.isAimag2
                      ? props.Buteemjit?.performPercent
                      : ListButeemjit.performPercent}{' '}
                    %
                  </p>
                </div>
              </Col>
              <Col lg={24}>
                <div className="body2Tusul">
                  Төсөлд хамрагдагсдын тоо
                  <p className="total2">
                    {toolsStore.isAimag2
                      ? props.Buteemjit?.projectFarmersNumbers
                      : ListButeemjit.projectFarmersNumbers}
                  </p>
                </div>
              </Col>
            </Row>
          </Col>

          <Col lg={9}>
            <h1 className="titleTusul">
              МАА-н инноваци шингээсэн үйлчилгээ үзүүлэх загвар
            </h1>
            <Row gutter={20}>
              <Col lg={12}>
                <div className="bodyTusul">
                  Нийт төслийн тоо
                  <p className="total">
                    {toolsStore.isAimag2
                      ? props.Innovation?.projectNumbers
                      : ListInnovation.projectNumbers}
                  </p>
                </div>
              </Col>
              <Col lg={12}>
                <div className="bodyTusul">
                  Гүйцэтгэлийн хувь
                  <p className="total">
                    {toolsStore.isAimag2
                      ? props.Innovation?.performPercent
                      : ListInnovation.performPercent}{' '}
                    %
                  </p>
                </div>
              </Col>
              <Col lg={24}>
                <div className="body2Tusul">
                  Төсөлд хамрагдагсдын тоо
                  <p className="total2">
                    {toolsStore.isAimag2
                      ? props.Innovation?.projectFarmersNumbers
                      : ListInnovation.projectFarmersNumbers}
                  </p>
                </div>
              </Col>
            </Row>
          </Col>
          <Col lg={1} />
        </Row>

        <Row justify="space-between" style={{ marginTop: '1%' }}>
          <Col lg={1} />

          <Col lg={9}>
            <h1 className="titleTusul">Тэжээл үйлдвэрлэлийн дэд төсөл</h1>
            <Row gutter={20}>
              <Col lg={12}>
                <div className="bodyTusul">
                  Нийт төслийн тоо
                  <p className="total">
                    {toolsStore.isAimag2
                      ? props.Tejeel?.projectNumbers
                      : ListTejeel.projectNumbers}
                  </p>
                </div>
              </Col>
              <Col lg={12}>
                <div className="bodyTusul">
                  Гүйцэтгэлийн хувь
                  <p className="total">
                    {toolsStore.isAimag2
                      ? props.Tejeel?.performPercent
                      : ListTejeel.performPercent}{' '}
                    %
                  </p>
                </div>
              </Col>
              <Col lg={24}>
                <div className="body2Tusul">
                  Төсөлд хамрагдагсдын тоо
                  <p className="total2">
                    {toolsStore.isAimag2
                      ? props.Tejeel?.projectFarmersNumbers
                      : ListTejeel.projectFarmersNumbers}
                  </p>
                </div>
              </Col>
            </Row>
          </Col>

          <Col lg={9}>
            <h1 className="titleTusul">Мал эмнэлэгийг дэмжих хөтөлбөр</h1>
            <Row gutter={20}>
              <Col lg={12}>
                <div className="bodyTusul">
                  Нийт төслийн тоо
                  <p className="total">
                    {toolsStore.isAimag2
                      ? props.MalEmneleg?.projectNumbers
                      : ListMalEmneleg.projectNumbers}
                  </p>
                </div>
              </Col>
              <Col lg={12}>
                <div className="bodyTusul">
                  Гүйцэтгэлийн хувь
                  <p className="total">
                    {toolsStore.isAimag2
                      ? props.MalEmneleg?.performPercent
                      : ListMalEmneleg.performPercent}
                  </p>
                </div>
              </Col>
              <Col lg={24}>
                <div className="body2Tusul">
                  Төсөлд хамрагдагсдын тоо
                  <p className="total2">
                    {toolsStore.isAimag2
                      ? props.MalEmneleg?.projectFarmersNumbers
                      : ListMalEmneleg.projectFarmersNumbers}
                  </p>
                </div>
              </Col>
            </Row>
          </Col>
          <Col lg={1} />
        </Row>
      </ContentWrapper>
    </div>
  );
}

export default dashboardProject;
