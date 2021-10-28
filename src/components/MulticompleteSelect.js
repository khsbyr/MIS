import { Select, Tooltip } from 'antd';
import { React, useState } from 'react';

export default function MulticompleteSelect(props) {
  const { Option } = Select;
  const { data, value, valueField, type, defaultValue } = props;
  const [size] = useState([]);

  const placeholder = props.placeholder || 'Сонгох';

  return (
    <Select
      showSearch
      mode="multiple"
      style={{ width: '100%' }}
      placeholder={placeholder}
      defaultValue={defaultValue}
      value={value}
      size={size || 'small'}
      maxTagCount="responsive"
      onChange={props.onChange}
      {...props}
    >
      {data &&
        data.map((z, index) => (
          <Option key={index} value={valueField ? z[valueField] : z.id}>
            <Tooltip placement="topLeft" title={z.name}>
              {z.code ? `${z.code}.${z.name}` : z.name}
            </Tooltip>
            {type === 1 ? z.firstname : z.fullName}
          </Option>
        ))}
    </Select>
  );
}
