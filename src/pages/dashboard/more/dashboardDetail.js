import { Col, Row } from 'antd';
import React from 'react';
import ContentWrapper from './map.style';

function dashboardDetail(props) {
  const numbers = props.list;
  // const listItems = numbers?.map(z => <li>{z}</li>);
  return (
    <div style={{ background: 'green' }}>
      <ContentWrapper>
        <Row style={{ marginTop: '-50%', marginLeft: '10%' }}>
          <Col span={24}>
            {/* <h1
            style={{
              color: 'white',
              width: '300px',
              height: '50px',
              background: 'green',
            }}
          >
            {listItems}
          </h1> */}
            {numbers?.map((z, index) => (
              <a
                key={index}
                href="/"
                className="btn"
                // key={index}
                // style={{
                //   width: '200px',
                //   height: '50px',
                //   background: 'green',
                //   display: 'inline',
                //   padding: '20px',
                //   marginLeft: '20px',
                // }}
              >
                {z}
              </a>
            ))}
          </Col>
        </Row>
        <Row justify="space-between" style={{ marginTop: '20%' }}>
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
    </div>
  );
}

export default dashboardDetail;
