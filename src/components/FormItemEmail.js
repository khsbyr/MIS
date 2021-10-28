import React from 'react';
import { Form, Input } from 'antd';

export default function FormItemEmail(props) {
  const rules = props.rules || [];
  const inputprops = props.inputprops || {};

  return (
    <Form.Item
      label="Цахим шуудан"
      name="email"
      rules={[
        {
          type: 'email',
          message: 'И-мэйл буруу байна!',
        },
        {
          required: false,
          message: 'Энэ хэсгийг заавал бөглөнө үү!',
        },
        ...rules,
      ]}
    >
      <Input placeholder="Цахим шуудан" {...inputprops} />
    </Form.Item>
  );
}
