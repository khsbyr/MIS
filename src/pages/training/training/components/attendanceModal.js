import { Form, Input, Modal } from "antd";
import React, { useEffect, useState } from "react";
import { getService, postService, putService } from "../../../../service/service";
import { errorCatch } from "../../../../tools/Tools";
<<<<<<< HEAD
import AutocompleteSelect from "../../../../components/Autocomplete";
=======
import ContentWrapper from "./attendance.style";

>>>>>>> 180b04277efd1db52bd08ea25f215bf6723c0149
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

        if (isEditMode) {

                form.setFieldsValue({ ...Attendancecontroller });
        }
    }, []);
    const save = () => {
        form
            .validateFields()
            .then((values) => {
                values.userService = { id: values.userServiceId }
                if (isEditMode) {
                    putService(
                        "participants/put" + Attendancecontroller.id,
                        values
                    )
                        .then((result) => {
                            props.close(true);
                        })
                        .catch((error) => {
                            errorCatch(error);
                        })
                } else {
                    postService("participants/post", values)
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
                <ContentWrapper>
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
                            name="jobDescription"
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
         
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="RD"
                            label="Регистрийн дугаар"
          
                        >
                            <Input />
                        </Form.Item>

                    </Form>
                </ContentWrapper>
            </Modal>
        </div >
    );
}
