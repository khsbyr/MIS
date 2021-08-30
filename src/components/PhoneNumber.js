import React from 'react';
import { Form, Input } from 'antd';
import { PATTERN_PHONE } from '../constants/Pattern';

export default function PhoneNumber({
  name = 'phoneNumber',
  label = 'Утасны дугаар',
  childProps,
}) {
  return (
    <Form.Item
      name={name}
      label={label}
      labelAlign="left"
      rules={[
        { required: false, message: '' },
        { pattern: PATTERN_PHONE, message: 'Утасны дугаар буруу байна' },
      ]}
    >
      <Input placeholder="Утасны дугаар..." {...childProps} />
    </Form.Item>
  );
}
