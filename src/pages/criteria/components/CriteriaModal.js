import React, { useEffect, useState } from "react";
import { Modal, Form, Input } from "antd";
import { getService, postService, putService } from "../../../service/service";
import { errorCatch } from "../../../tools/Tools";
import AutocompleteSelect from "../../components/Autocomplete"
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
export default function CriteriaModal(props) {
    const { Usercontroller, isModalVisible, isEditMode } = props;
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
            getService("criteria/get" + Usercontroller.id).then((result) => {
                Usercontroller.userServiceId = result.userService.id
                form.setFieldsValue({ ...Usercontroller });
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
                        "criteria/put" + Usercontroller.id,
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
                title="Шалгуур үзүүлэлт бүртгэх"
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
                        label="Шалгуур үзүүлэлтийн нэр:"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="code"
                        label="Код:"
                        rules={[
                            {
                                required: true,
                            },
                        ]}
                    >
                        <Input />
                    </Form.Item>
              <Form.Item
                name="indicatorProcess"
                label="Хүрэх үр дүн:"
                rules={[
                  {
                    required: false,
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="upIndicator"
                label="Үр дүнгийн биелэлт"
                rules={[
                  {
                    required: false,
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
