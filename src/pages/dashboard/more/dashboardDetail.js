import { Button, Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import ContentWrapper from './map.style';
import { getService } from '../../../service/service';
import { useToolsStore } from '../../../context/Tools';

function dashboardDetail(props) {
  const aimagList = props.list;
  const [list, setList] = useState([]);
  const toolsStore = useToolsStore();

  useEffect(() => {
    getService('training/getDashboardInfo?aimagId=0&soumId=0').then(result => {
      if (result) {
        toolsStore.setIsAimag(false);
        setList(result);
      }
    });
  }, []);

  function onClick(value) {
    toolsStore.setIsAimag(false);
    getService(
      `training/getDashboardInfo?aimagId=${value.aimagId}&soumId=${value.id}`
    ).then(result => {
      if (result) {
        setList(result);
      }
    });
  }

  return (
    <div>
      <ContentWrapper>
        <Row style={{ marginTop: '0%', marginLeft: '12%' }}>
          <Col span={24}>
            {aimagList?.map(z => (
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
          <Col lg={15}>
            <h1 className="title">Сургалт</h1>
            <Row gutter={20}>
              <Col lg={12}>
                <div className="body">
                  Нийт сургалтын тоо
                  <p className="total">
                    {toolsStore.isAimag
                      ? props.status?.trainingNumbers
                      : list.trainingNumbers}
                  </p>
                </div>
              </Col>
              <Col lg={12}>
                <div className="body">
                  Гүйцэтгэлийн хувь
                  <p className="total">
                    {toolsStore.isAimag
                      ? props.status?.performPercent
                      : list.performPercent}{' '}
                    %
                  </p>
                </div>
              </Col>
              <Col lg={24}>
                <div className="body2">
                  Сургалтанд хамрагдагсдын тоо
                  <p className="total2">
                    {toolsStore.isAimag
                      ? props.status?.trainingParticipantsNumbers
                      : list.trainingParticipantsNumbers}
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

export default dashboardDetail;
