import { Col, Row } from 'antd';
import React from 'react';
import ContentWrapper from './map.style';

function dashboardDetail() {
  return (
    <ContentWrapper>
      <Row justify="space-between">
        <Col lg={1} />
        <Col lg={9}>
          <h1 className="title">Сургалт</h1>
          <Row gutter={20}>
            <Col lg={12}>
              <div className="body">
                Нийт сургалтын тоо <p className="total">24</p>
              </div>
            </Col>
            <Col lg={12}>
              <div className="body">
                Гүйцэтгэлийн хувь <p className="total">91%</p>
              </div>
            </Col>
            <Col lg={24}>
              <div className="body2">
                Сургалтанд хамрагдагсдын тоо <p className="total2">128</p>
              </div>
            </Col>
          </Row>
        </Col>

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
  );
}

export default dashboardDetail;
