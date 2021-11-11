import { Col, Row } from 'antd';
import React from 'react';
import Activity from './components/activity';
import Finance from './components/finance';
import ProjectImplementer from './components/projectImplementer';
import ProjectInnovation from './components/projectInnovation';
import ProjectPurpose from './components/projectPurpose';
import ProjectRationale from './components/projectRationale';
import Result from './components/result';
import SocietyActivity from './components/societyActivity';
import SocietyImpactActivity from './components/societyImpactActivity';
import ContentWrapper from './more/briefDraft.style';

const BriefDraft = props => (
  <ContentWrapper>
    <Row gutter={[40, 30]}>
      <Col xs={24} md={24} lg={24}>
        <ProjectRationale projectId={props.projectId} />
      </Col>
      <Col xs={24} md={24} lg={24}>
        <ProjectPurpose projectId={props.projectId} />
      </Col>
      <Col>
        <Activity projectId={props.projectId} />
      </Col>
      <Col>
        <SocietyActivity projectId={props.projectId} />
      </Col>
      <Col>
        <SocietyImpactActivity projectId={props.projectId} />
      </Col>
      <Col>
        <ProjectInnovation projectId={props.projectId} />
      </Col>
      <Col>
        <ProjectImplementer />
      </Col>
      <Col>
        <Finance projectId={props.projectId} />
      </Col>
      <Col style={{ marginBottom: '80px' }}>
        <Result projectId={props.projectId} />
      </Col>
    </Row>
  </ContentWrapper>
);

export default BriefDraft;
