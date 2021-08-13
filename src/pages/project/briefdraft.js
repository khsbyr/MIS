import React from 'react';
import { Input, Row, Col } from 'antd';
import ContentWrapper from './more/briefDraft.style';
import ProjectPurpose from './components/projectPurpose';
import Activity from './components/activity';
import SocietyActivity from './components/societyActivity';
import SocietyImpactActivity from './components/societyImpactActivity';
import ProjectInnovation from './components/projectInnovation';
import ProjectImplementer from './components/projectImplementer';
import Finance from './components/finance';
import Result from './components/result';

const { TextArea } = Input;

const BriefDraft = () => (
  <ContentWrapper>
    <h2 className="title">1. Төслийн үндэслэл болон тулгамдаж буй асуудал</h2>
    <Row gutter={[40, 30]}>
      <Col span={12}>
        <TextArea rows={4} />
      </Col>
      <Col span={12}>
        <TextArea rows={4} />
      </Col>
      <Col>
        <ProjectPurpose />
      </Col>
      <Col>
        <Activity />
      </Col>
      <Col>
        <SocietyActivity />
      </Col>
      <Col>
        <SocietyImpactActivity />
      </Col>
      <Col>
        <ProjectInnovation />
      </Col>
      <Col>
        <ProjectImplementer />
      </Col>
      <Col>
        <Finance />
      </Col>
      <Col>
        <Result />
      </Col>
    </Row>
  </ContentWrapper>
);

export default BriefDraft;
