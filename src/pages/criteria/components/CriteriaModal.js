import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Radio, Space, InputNumber } from "antd";
import { RadioButton } from 'primereact/radiobutton';
import { getService, postService, putService } from "../../../service/service";
import { errorCatch } from "../../../tools/Tools";
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
    const { Criteriacontroller, isModalVisible, isEditMode } = props;
    const [form] = Form.useForm();
    const [value, setValue] = React.useState(1);
    useEffect(() => {
        if (isEditMode) {
            let percentIndicator = Criteriacontroller.criteriaIndicator.percentIndicator ?  Criteriacontroller.criteriaIndicator.percentIndicator.value : '';
            let quantityIndicator = Criteriacontroller.criteriaIndicator.quantityIndicator ?  Criteriacontroller.criteriaIndicator.quantityIndicator.value : '';
            let formulaIndicator = Criteriacontroller.criteriaIndicator.formulaIndicator ?  Criteriacontroller.criteriaIndicator.formulaIndicator.value : '';

            form.setFieldsValue({ 
                ...Criteriacontroller,
            });
            setValue( percentIndicator ? 2 : quantityIndicator ? 1 : formulaIndicator ? 3 : '' );
        }

    }, []);

    const onChange = e => {
        console.log('radio checked', e.target.value);
        setValue(e.target.value);
    };

    const save = () => {
        form
            .validateFields()
            .then((values) => {
                values.criteriaIndicator = {
                    percentIndicator: {value: values.percentIndicatorr},
                };


                console.log(values);
                if (isEditMode) {
                    putService(
                        "criteria/update/" + Criteriacontroller.id,
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
                        <InputNumber style={{ width: "100%" }} />

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
                        <InputNumber style={{ width: "100%" }} />

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
                        <InputNumber style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item
                        label="Шалгуур үзүүлэлтийн төрөл"
                    >
                    </Form.Item>

                    <Form.Item
                        name="percentIndicatorr"
                        label="Шалгуур үзүүлэлтийн төрөл"
                        rules={[
                            {
                                required: false,
                            },
                        ]}
                    >
                        <Radio.Group value={value} onChange={onChange} className="radioButton">
                            <Space direction="vertical">
                                <Radio value={1} >                      
                                    Тоо
                                    {value === 1 ? <InputNumber style={{ width: 100, marginLeft: 10 }} /> : null}                            
                                </Radio>
                                <Radio value={2} >
                                    Хувь
                                    {value === 2 ? <InputNumber value={Criteriacontroller.criteriaIndicator.percentIndicator.value} style={{ width: 100, marginLeft: 10 }} /> : null}
                                </Radio>
                                <Radio value={3}>
                                    Томъё
                                    {value === 3 ? <InputNumber style={{ width: 100, marginLeft: 10 }} /> : null}
                                </Radio>
                            </Space>
                        </Radio.Group>
                    </Form.Item>
                </Form>
            </Modal>
        </div >
    );
}
