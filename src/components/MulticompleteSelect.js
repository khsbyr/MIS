import { Select } from 'antd';
import { React, useState } from 'react';

export default function MulticompleteSelect(props) {
  const { Option } = Select;
  const { data, value, viewField, valueField } = props;
  const [size] = useState([]);

  const placeholder = props.placeholder || 'Сонгох';

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
    >
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
