import React, { useEffect, useState } from "react";
import { Modal, Form, Input, DatePicker } from "antd";
import { getService, postService, putService } from "../../../../service/service";
import { errorCatch } from "../../../../tools/Tools";
import AutocompleteSelect from "../../../../components/Autocomplete";
import ContentWrapper from "./cv.styled";
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
export default function ExperienceModal(props) {
    const { CvExperienceController, isModalVisibleExperience, isEditMode } = props;
    const [form] = Form.useForm();
    useEffect(() => {
        if (isEditMode) {
            form.setFieldsValue({ ...CvExperienceController });
        }
    }, []);
    const save = () => {
        form
            .validateFields()
            .then((values) => {
                if (isEditMode) {
                    putService(
                        "expierence/update/" + CvExperienceController.id,
                        values
                    )
                        .then((result) => {
                            props.close(true);
                        })
                        .catch((error) => {
                            errorCatch(error);
                        })
                } else {
                    postService("expierence/post/" + CvExperienceController.id, values)
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
                title="Ажлын туршлага"
                okText="Хадгалах"
                cancelText="Буцах"
                width={600}
                alignItems="center"
                visible={isModalVisibleExperience}
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
                            name="position"
                            label="Албан тушаал:"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="organizationName"
                            label="Байгууллагын нэр:"

                        >
                            <Input />
                        </Form.Item>
                        {/* <Form.Item
                            name="hiredDate"
                            label="Ажилд орсон огноо:"
                            rules={[
                                {
                                    required: true,
                                },
                            ]}

                        >
                            <Input />
                        </Form.Item> */}
                    </Form>
                </ContentWrapper>
            </Modal>
        </div >
    );
}
