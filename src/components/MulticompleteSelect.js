import { Select } from 'antd';
import { React, useState } from 'react';

export default function MulticompleteSelect(props) {
  const { Option } = Select;
  const { data, value, viewField, valueField } = props;
  const [size] = useState([]);

  const multiple = props.multiple || '';
  const placeholder = props.placeholder || 'Сонгох';
  const children = [];
  for (let i = 10; i < 36; i++) {
    children.push(
      <Option key={i.toString(36) + i}>{i.toString(36) + i},</Option>
    );
  }
  // function handleChange(value) {
  //   console.log(`Selected: ${value}`);
  // }
  // const handleSizeChange = e => {
  //   setSize(e.target.value);
  // };
  return (
    <Select
      showSearch
      mode="multiple"
      style={{ width: '100%' }}
      placeholder={placeholder}
      value={value}
      size={size || 'small'}
      maxTagCount="responsive"
      onChange={props.onChange}
      {...props}
      // onChange={handleChange}
    >
      {/* {children} */}
      {data &&
        data.map((z, index) => (
          <Option key={index} value={valueField ? z[valueField] : z.id}>
            {viewField ? z[viewField] : z.name}
            {viewField ? z[viewField] : z.fullName}
          </Option>
        ))}
    </Select>
  );
}
