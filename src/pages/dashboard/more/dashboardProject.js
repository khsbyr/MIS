import { Button, Col, Row } from 'antd';
import React from 'react';
import ContentWrapper from './map.style';

function dashboardProject(props) {
  const aimagList = props.list;

  return (
    <div>
      <ContentWrapper>
        <Row style={{ marginTop: '0%', marginLeft: '10%' }}>
          <Col span={24}>
            {aimagList?.map(z => (
              <Button
                type="primary"
                style={{
                  marginLeft: '10px',
                  marginTop: '20px',
                  width: '200px',
                  height: '60px',
                  backgroundColor: '#36577a',
                  borderColor: '#36577a',
                }}
              >
                {z.name}
              </Button>
            ))}
          </Col>
        </Row>

        <Row justify="space-between" style={{ marginTop: '5%' }}>
          <Col lg={1} />

          <Col lg={9}>
            <h1 className="title">Төсөл</h1>
            <Row gutter={20}>
              <Col lg={12}>
                <div className="body">
                  Нийт төслийн тоо <p className="total">24</p>
                </div>
              </Col>
              <Col lg={12}>
                <div className="body">
                  Гүйцэтгэлийн хувь <p className="total">91%</p>
                </div>
              </Col>
              <Col lg={24}>
                <div className="body2">
                  Төсөлд хамрагдагсдын тоо <p className="total2">128</p>
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
