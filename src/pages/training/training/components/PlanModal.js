import { Col, Form, Input, Menu, Modal, Row } from "antd";
import React, { useEffect, useState } from "react";
import AutoCompleteSelect from "../../../../components/Autocomplete";
import { getService, postService, putService } from "../../../../service/service";
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
    const [stateTrainers, setStateTrainers] = useState(false);
    const [stateUser, setStateUser] = useState([]);
    useEffect(() => {
        getService("user/get").then((result) => {
            if (result) {
              setStateUser(result.content || []);
            }
        });
        getService("trainers/get").then((result) => {
            if (result) {
                setStateTrainers(result.content || []);
            }
        });
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
                // values.user = {firstname: Plancontroller.user ? Plancontroller.user.firstname : ''};
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
                width={600}
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
                            <Col xs={24} md={24} lg={18}>
                                <Form.Item label="Сургалтанд гүйцэтгэх үүрэг:" name="mission" rules={[
                                    {
                                        required: true,
                                    },
                                ]}>
                                    <Input />
                                </Form.Item>
                                <Form.Item label="Сургагч багшийн нэр:" name="UserFirstName" rules={[
                                    {
                                        required: true,
                                    },
                                ]}>
                                    <AutoCompleteSelect      
                                        valueField="id"
                                        placeholder="Ажилчдаас сонгох"
                                        data={stateUser}
                                        // onChange={(value) => selectOrgs(value)}
                                    /> 
                                </Form.Item>
                                <Form.Item rules={[
                                    {
                                        required: true,
                                    },
                                ]}>
                                    <AutoCompleteSelect      
                                        valueField="id"
                                        placeholder="Сургагч багшаас сонгох"
                                        data={stateTrainers}
                                        // onChange={(value) => selectOrgs(value)}
                                    /> 
                                </Form.Item>
                            </Col>
                            <Col xs={24} md={24} lg={12}>

                            </Col>
                        </Row>
                    </Form>
                </ContentWrapper>
            </Modal>
        </div >
    );
}
