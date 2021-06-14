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
// import {useTranslation} from 'react-i18next';

const {Header} = Layout;
const Headers = () => {

return(
<Header style={{ backgroundColor: "#103154" }}>
            <Row>
              <Col xs={24} md={15}>
                <p
                  style={{ color: "white", float: "left", marginLeft: "80px" }}
                >
                  <EnvironmentFilled /> Монгол Улс, Улаанбаатар, 1-р хороо,
                  Сүхбаатар дүүрэг, Парк плэйс оффис, 602 тоот
                </p>
              </Col>
              <Col xs={24} md={9}>
                <Row style={{ color: "white", cursor: "pointer" }}>
                  <Col span={6}>
                    <p>И-мэйл шалгах:</p>
                  </Col>
                  <Col span={6}>
                    <p>
                      <MailFilled /> info@lcp.mn
                    </p>
                  </Col>
                  <Col span={6}>
                    <p>
                      <PhoneFilled /> 70104041
                    </p>
                  </Col>
                  <Col span={6}>
                    <p>
                      <GlobalOutlined /> Монгол
                    </p>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Header>
          );

}
export default Headers