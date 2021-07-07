import React from "react";
import "antd/dist/antd.css";
import { Row, Col, Carousel } from "antd";
import TextWrapper from "../Login.style";
import {useTranslation} from 'react-i18next';

function Partner() {

  const {t} = useTranslation();

  const contentStyle = {
    height: '180px',
    fontSize: '16px',
    color: '#103154',
    textAlign: 'left',
  };

  return (
    <Col
        xs={0}
        md={0}
        lg={15}
        style={{ backgroundColor: "white", height: "100vh" }}
    >
        <TextWrapper>
        <h2 className="title">
            {t("login_title")}  
        </h2>
        <h3 className="subTitle">{t("login_subtitle")}</h3>
        <h2 className="title" style={{ marginTop: "50px" }}>
        {t("project_background")}
        </h2>
        <Carousel auto style={{height:"160px", width:"510px"}}>
            <div>           
            <p style={contentStyle}>
            {t("background_content")}
            </p>             
            </div>
            <div>
            <p style={contentStyle}>
            {t("background_content")}
            </p>  
            </div>
            <div>
            <h3 style={contentStyle}>3</h3>
            </div>
        </Carousel> 
        <Row gutter={[32]}>
        <Col>
        <h2 style={{ marginTop: "80px", marginBottom: "30px", color: "#103154", fontSize: "20px" }}>
        {t("partner")}
        </h2>
        <Row gutter={[32,32]}>
            <Col>
            <img
                src="/images/svg/logo3.svg"
                className="icon"
                alt="card-icon"
                />
            </Col>
            <Col>
            <img
                src="/images/svg/logo4.svg"
                className="icon"
                alt="card-icon"
                style={{
                height: "80%"
                }}
                />
            </Col>
        </Row>
        </Col>

        <Col>
        <h2 className="title" style={{ marginTop: "80px", marginBottom: "30px",  color: "#103154", fontSize: "20px"  }}>
        {t("sanhuujuulegch")}
        </h2>
        <Row gutter={[32,32]}>
        <Col >
            <img
                src="/images/svg/logo2.svg"
                className="icon"
                alt="card-icon"
            
            />
            </Col>
            <Col>
            <img
                src="/images/svg/logo1.svg"
                className="icon"
                alt="card-icon"
            />
            </Col>
        </Row>
        </Col>
        </Row>
        </TextWrapper>
    </Col>
  );
}

export default Partner;
