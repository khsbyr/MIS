import { Button, Col, Layout, Row, Tabs } from 'antd';
import {
  faFileExcel,
  faPlus,
  faPrint,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import ContentWrapper from '../criteria.style';

const { TabPane } = Tabs;
const tabPosition = 'top';
const { Content } = Layout;

export default function CriteriaDetail() {
  return (
    <ContentWrapper>
      <div className="button-demo">
        <Layout className="btn-layout">
          <Content>
            <Row>
              <Col xs={24} md={24} lg={12}>
                <p className="title">Сургалт</p>
              </Col>
              <Col xs={24} md={24} lg={12}>
                <Row justify="end" gutter={[0, 15]}>
                  <Col xs={8} md={8} lg={3}>
                    <Button
                      type="text"
                      icon={<FontAwesomeIcon icon={faPrint} />}
                    >
                      Хэвлэх{' '}
                    </Button>
                  </Col>
                  <Col xs={8} md={8} lg={3}>
                    <Button
                      type="text"
                      className="export"
                      icon={<FontAwesomeIcon icon={faFileExcel} />}
                    >
                      Экспорт
                    </Button>
                  </Col>
                  <Col xs={8} md={8} lg={3}>
                    <Button
                      type="text"
                      className="export"
                      icon={<FontAwesomeIcon icon={faPlus} />}
                    >
                      Нэмэх
                    </Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Content>
        </Layout>
        <Tabs tabPosition={tabPosition}>
          <TabPane tab="Үндсэн мэдээлэл" key="1">
            Content 1
          </TabPane>
          <TabPane tab="Сургалт" key="2">
            Content 2
          </TabPane>
          <TabPane tab="Төсөл" key="3">
            Content 3
          </TabPane>
          <TabPane tab="MAKHIS" key="4">
            Content 4
          </TabPane>
          <TabPane tab="Төсөл" key="5">
            Content 5
          </TabPane>
        </Tabs>
      </div>
    </ContentWrapper>
  );
}
