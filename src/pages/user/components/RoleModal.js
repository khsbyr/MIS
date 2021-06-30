import React from 'react';
import { Modal, Button, Form, Input, Checkbox } from 'antd';
import { requireFieldFocus } from '../../../tools/Tools';

const layout = {
    labelCol: {
        span: 8,
    },
    wrapperCol: {
        span: 16,
    },
};
const tailLayout = {
    wrapperCol: {
        offset: 8,
        span: 16,
    },
};

export default function RoleModal(props) {
    const { visible, isEditMode, editValue } = props
    const [form] = Form.useForm();

    React.useEffect(() => {
        if (isEditMode) {
            form.setFieldsValue(editValue)
        }
    }, [isEditMode, editValue])

    return (
        <Modal
            title="Хэрэглэгчйн дүр бүртгэх"
            visible={visible}
            footer={false}
            onCancel={() => props.close(false)}
            width={450}
        >
            <Form
                {...layout}
                form={form}
                name="user"
                initialValues={{
                    isActive: true,
                }}
                onFinish={(values) => {
                    const formData = form.getFieldValue()
                    props.save({ ...values, id: formData.id })
                }}
                onFinishFailed={requireFieldFocus}
            >
                <Form.Item label="Дүрийн код" name="code" rules={[{ required: true, message: '' }]}>
                    <Input />
                </Form.Item>
                <Form.Item label="Дүрийн нэр" name="name" rules={[{ required: true, message: '' }]}>
                    <Input />
                </Form.Item>
                <Form.Item {...tailLayout} name="isActive" valuePropName="checked">
                    <Checkbox>Идэвхтэй эсэх</Checkbox>
                </Form.Item>
                <div style={{ textAlign: 'right' }}>
                    <Button htmlType="button" style={{ marginRight: 8 }} onClick={() => props.close()}>Болих</Button>
                    <Button type="primary" htmlType="submit" >Хадгалах</Button>
                </div>
            </Form>
        </Modal>
    )
}
