import React from "react";
import "antd/dist/antd.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { Layout, Menu, Avatar, Dropdown, Icon,Divider } from "antd";
import {
  EnvironmentFilled,
  GlobalOutlined,
  PhoneFilled,
  MailFilled,

} from "@ant-design/icons";
import { Row, Col } from "antd";
import HeaderWrapper from "./Header.style";

// import {useTranslation} from 'react-i18next';

const {Header} = Layout;
const Headers = () => {

return(
    <HeaderWrapper>
      <Header style={{ backgroundColor: "#103154", height:"50px",lineHeight: "50px" }}>
        <Row>
          <Col xs={24} md={15} lg={15}>
            <p
              style={{ color: "white", float: "left", marginLeft: "80px" }}
              className="texthide"
            >
              <EnvironmentFilled /> Монгол Улс, Улаанбаатар, 1-р хороо,
              Сүхбаатар дүүрэг, Парк плэйс оффис, 602 тоот
            </p>
          </Col>
          <Col xs={24} md={24} lg={9}>
            <Row style={{ color: "white", cursor: "pointer" }}>
              <Col lg={6}>
                <p className="texthide">И-мэйл шалгах:</p>
              </Col>
              <Col lg={6}>
                <p className="texthide">
                  <MailFilled /> info@lcp.mn
                </p>
              </Col>
              <Col xs={12} lg={6} md={12}>
                <p className="textshow">
                  <PhoneFilled /> 70104041
                </p>
              </Col>
              <Col xs={12} lg={6} md={12}>
                <p className="textshow">
                  <GlobalOutlined /> Монгол
                </p>
              </Col>
            </Row>
          </Col>
        </Row>
      </Header>
    </HeaderWrapper>
      );

}
export default Headers