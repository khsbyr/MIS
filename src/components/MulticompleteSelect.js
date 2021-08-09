import { Select } from 'antd';
import { React, useState } from 'react';

export default function MulticompleteSelect(props) {
  const { Option } = Select;
  const { data, value, disabled, viewField, valueField } = props;
  const [size, setSize] = useState([]);

  const multiple = props.mode || '';
  const placeholder = props.placeholder || 'Сонгох';
  const children = [];
  for (let i = 10; i < 36; i++) {
    children.push(
      <Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>
    );
  }
  const handleSizeChange = e => {
    setSize(e.target.value);
  };
  return (
    <Select
      mode="multiple"
      style={{ width: '100%' }}
      placeholder={placeholder}
      defaultValue={[]}
      value={value}
      size={size || 'small'}
      onChange={props.onChange}
    >
      {children}
    </Select>
  );
}
