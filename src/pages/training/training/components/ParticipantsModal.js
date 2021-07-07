import React, { useEffect, useState } from "react";
import { Modal, Form, Input, DatePicker } from "antd";
import { getService, postService, putService } from "../../../../service/service";
import { errorCatch } from "../../../../tools/Tools";
import AutocompleteSelect from "../../../components/Autocomplete";
import ContentWrapper from "./cv.styled";

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
export default function PaticipantsModal(props) {
    const { Composition, isModalVisible, isEditMode } = props;
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
            getService("criteria/get" + Composition.id).then((result) => {
                Composition.userServiceId = result.userService.id
                form.setFieldsValue({ ...Composition });
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
                        "criteria/put" + Composition.id,
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
                title="Сургалтын оролцогч"
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
                 
                    <Form.Item
                        name="name"
                        label="Нэр:"
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
                        label="Сургалтын үйл ажиллагаанд гүйцэтгэх үүрэг:"

                    >
                        <Input />
                    </Form.Item>
                </Form>
                </ContentWrapper>
            </Modal>
        </div >
    );
}
