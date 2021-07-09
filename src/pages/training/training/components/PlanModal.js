import { Col, DatePicker, Form, Input, Modal, Row, Select, Table, Upload } from "antd";
import React, { useEffect, useState } from "react";
import { postService, putService } from "../../../../service/service";
import { errorCatch } from "../../../../tools/Tools";
import ContentWrapper from "./guidelines.style";

const validateMessages = {
    required: "${label} хоосон байна!",
    types: {
        email: "${label} is not a valid email!",
        number: "${label} is not a valid number!",
    },
    number: {
        range: "${label} must be between ${min} and ${max}",
    },
};
export default function PlanModal(props) {
    const { Plancontroller, isModalVisible, isEditMode } = props;
    const [form] = Form.useForm();
    const [isUser, setIsUser] = useState(false);


    useEffect(() => {
        if (isEditMode) {
            form.setFieldsValue({ ...Plancontroller,
                UserFirstName: Plancontroller.user ? Plancontroller.user.firstname : Plancontroller.trainers.firstName,
                // TrainersFirstName: Plancontroller.trainers.firstName, 
                // setIsUser(Plancontroller)
            });
        }
    }, []);

    const save = () => {
        form
            .validateFields()
            .then((values) => {
                values.user = {firstname: values.UserFirstName};
                if (isEditMode) {
                    putService(
                        "trainingTeam/update/" + Plancontroller.id,
                        values
                    )
                        .then((result) => {
                            props.close(true);
                        })
                        .catch((error) => {
                            errorCatch(error);
                        })
                } else {
                    postService("trainingTeam/post", values)
                        .then((result) => {
                            props.close(true);
                        })
                        .catch((error) => {
                            errorCatch(error);
                        });
                }
            })
            .catch((info) => {
                console.log("Validate Failed:", info);
            });
    };
    return (
        <div>
            <Modal
                title="Сургалтын баг"
                okText="Хадгалах"
                cancelText="Буцах"
                width={1200}
                alignItems="center"
                visible={isModalVisible}
                onOk={save}
                onCancel={() => props.close()}
            >
                <ContentWrapper>
                    <Form
                        form={form}
                        labelAlign={"left"}
                        layout="vertical"
                        name="nest-messages"
                        validateMessages={validateMessages}
                    >
                        <Row gutter={30}>
                            <Col xs={24} md={24} lg={12}>
                                <Form.Item label="Хичээлийн сэдэв:" name="mission" rules={[
                                    {
                                        required: true,
                                    },
                                ]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={24} lg={12}>
                                <Form.Item label="Сургагч багшийн нэр:" name="UserFirstName" rules={[
                                    {
                                        required: true,
                                    },
                                ]}>
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </ContentWrapper>
            </Modal>
        </div >
    );
}
