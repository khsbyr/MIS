import { Select } from 'antd';
import { React } from 'react';

export default function AutocompleteSelect(props) {
  const { Option } = Select;
  const { data, value, disabled, viewField, valueField, size, defaultValue } =
    props;
  const placeholder = props.placeholder || 'Сонгох';

  return (
    <Select
      showSearch
      disabled={disabled}
      style={{ width: '100%' }}
      placeholder={placeholder}
      value={value}
      defaultValue={defaultValue}
      optionFilterProp="children"
      maxTagCount="responsive"
      size={size || 'small'}
      onChange={props.onChange}
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
