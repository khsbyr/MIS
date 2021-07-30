import { Select } from 'antd';
import { React } from 'react';

export default function AutocompleteSelect(props) {
  const { Option } = Select;
  const { data, value, disabled, viewField, valueField, size } = props;
  const mode = props.mode || '';
  const placeholder = props.placeholder || 'Сонгох';

  return (
    <Select
      showSearch
      mode={mode}
      disabled={disabled}
      style={{ width: '100%' }}
      placeholder={placeholder}
      value={value}
      optionFilterProp="children"
      maxTagCount="responsive"
      size={size || 'small'}
      // filterOption={(input, option) =>
      //   option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
      // }
      onChange={props.onChange}
    >
      {data &&
        data.map((z, index) => (
          <Option key={index} value={valueField ? z[valueField] : z.id}>
            {viewField ? z[viewField] : z.name}
            {viewField ? z[viewField] : z.register}
          </Option>
        ))}
    </Select>
  );
}
