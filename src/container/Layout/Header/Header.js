import {
  EnvironmentFilled, MailFilled, PhoneFilled
} from "@ant-design/icons";
import { Col, Layout, Row, Select } from "antd";
import "antd/dist/antd.css";
import React from "react";
import { useTranslation } from "react-i18next";
import i18n from "../../../i18n";
import HeaderWrapper from "./Header.style";

const { Option } = Select;
const { Header } = Layout;
const Headers = () => {
  const { t, i18 } = useTranslation();
 
  function handleChange(value) {
    i18n.changeLanguage(value);
  }

  return (
    <HeaderWrapper>
      <Header
        style={{
          backgroundColor: "#103154",
          height: "50px",
          lineHeight: "50px",
        }}
      >
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
                <p className="texthide">{t("checkEmail")}:</p>
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
                <Select
                  defaultValue="MN"
                  style={{ width: 80, color: "blue" }}
                  onChange={handleChange}
                >
                  <Option value="mn">MN</Option>
                  <Option value="en">EN</Option>
                </Select>
              </Col>
            </Row>
          </Col>
        </Row>
      </Header>
    </HeaderWrapper>
  );
};
export default Headers;
