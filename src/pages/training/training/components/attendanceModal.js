import React, { useEffect, useState } from "react";
import { Modal, Form, Input, DatePicker } from "antd";
import { getService, postService, putService } from "../../../../service/service";
import { errorCatch } from "../../../../tools/Tools";
import AutocompleteSelect from "../../../components/Autocomplete";
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
    const { Attendancecontroller, isModalVisible, isEditMode } = props;
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
            getService("criteria/get" + Attendancecontroller.id).then((result) => {
                Attendancecontroller.userServiceId = result.userService.id
                form.setFieldsValue({ ...Attendancecontroller });
            })

        }
    }, []);
    const save = () => {
        form
            .validateFields()
            .then((values) => {
                values.userService = { id: values.userServiceId }
                if (isEditMode) {
                    putService(
                        "criteria/put" + Attendancecontroller.id,
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
                title="Ирцийн бүртгэл"
                okText="Хадгалах"
                cancelText="Буцах"
                width={600}
                alignItems="center"
                visible={isModalVisible}
                onOk={save}
                onCancel={() => props.close()}
            >
                <Form
                    form={form}
                    labelAlign={"left"}
                    {...layout}
                    name="nest-messages"
                    validateMessages={validateMessages}
                >
                 
                    <Form.Item
                        name="name"
                        label="Суралцагийн нэр:"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="work"
                        label="Ажил эрхлэлт:"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
              <Form.Item
                name="contact"
                label="Холбогдох утас, мэйл, хаяг:"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="RD"
                label="Регистрийн дугаар"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
            
                </Form>
            </Modal>
        </div >
    );
}
