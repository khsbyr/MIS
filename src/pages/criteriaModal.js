import React, {useState} from "react";
import ContentWrapper from "./criteria.style";
import { Row, Col, Input, Button, Modal, Form, InputNumber } from "antd";

export default function CriteriaModal()  {
    const [visible, setVisible] = useState(false);
    return(
        
        <ContentWrapper>          
            <Button type="primary" onClick={() => setVisible(true)}>
                Нэмэх
            </Button>
            <Modal
                title="Шалгуур үзүүлэлт бүртгэх "
                centered
                visible={visible}
                onOk={() => setVisible(false)}
                onCancel={() => setVisible(false)}
                width={1000}
            >
                <Row gutter={[50]}>
                <Col span={12}>
                    <Form layout="vertical">
                        <Form.Item label="Код /Дугаар/:" >                    
                            <Input placeholder="Код /Дугаар/:"/>
                        </Form.Item>
                    </Form>
                    <Form layout="vertical">
                        <Form.Item label="Шалгуур үзүүлэлтийн нэр:" >                    
                            <Input placeholder="Шалгуур үзүүлэлтийн нэр:"/>
                        </Form.Item>
                    </Form>
                    <Form layout="vertical">
                        <Form.Item label="Хүрэх үр дүн:" >                    
                            <InputNumber style={{ width: "20vw" }} placeholder="Хүрэх үр дүн:"/>
                        </Form.Item>
                    </Form>
                </Col>
                <Col span={12}>
                    <Form layout="vertical">
                        <Form.Item label="Үр дүнгийн биелэлт:" >                    
                            <InputNumber style={{ width: "20vw" }} placeholder="Үр дүнгийн биелэлт:"/>
                        </Form.Item>
                    </Form>
                    <Form layout="vertical">
                        <Form.Item label="Шалгуур үзүүлэлтийн төрөл:" >                    
                            <Input placeholder="Шалгуур үзүүлэлтийн төрөл:"/>
                        </Form.Item>
                    </Form>
                </Col>
                </Row>
            </Modal>
        </ContentWrapper>
    )
}

