import { DatePicker, Form, Input, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { getService, postService, putService } from "../../../../service/service";
import { errorCatch } from "../../../../tools/Tools";
import ContentWrapper from "./trainingProgram.style";

const layout = {
    labelCol: {
        span: 10,
    },
    wrapperCol: {
        span: 14,
    },
};
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
export default function TrainingProgramModal(props) {
    const { Trainingprogramcontroller, isModalVisible, isEditMode } = props;
    const [stateController, setStateController] = useState([]);
    const [form] = Form.useForm();
    useEffect(() => {
        getService("criteria/get", {
            search: "status:true",
        }).then((result) => {
            if (result) {
                setStateController(result.content || []);
            }
        });

        if (isEditMode) {
            getService("criteria/get" + Trainingprogramcontroller.id).then((result) => {
                form.setFieldsValue({ ...Trainingprogramcontroller });
            })

        }
    }, []);
    const save = () => {
        form
            .validateFields()
            .then((values) => {
                if (isEditMode) {
                    putService(
                        "criteria/put" + Trainingprogramcontroller.id,
                        values
                    )
                        .then((result) => {
                            props.close(true);
                        })
                        .catch((error) => {
                            errorCatch(error);
                        })
                } else {
                    postService("criteria/post", values)
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
                title="Сургалтын хөтөлбөр бүртгэх"
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
                    {...layout}
                    name="nest-messages"
                    validateMessages={validateMessages}
                >
                 
                    <Form.Item
                        name="uilAjillagaa"
                        label="Үйл ажиллагаа:"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="date"
                        label="Хэрэгжих хугацаа:"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <DatePicker />
                    </Form.Item>
              <Form.Item
                name="name"
                label="Хариуцах эзэн:"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="trainingMaterial"
                label="Сургалтын материал"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
            
                </Form>
                </ContentWrapper>
            </Modal>
        </div >
    );
}
