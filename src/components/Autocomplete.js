import { Select, Tooltip } from 'antd';
import { React } from 'react';

export default function AutocompleteSelect(props) {
  const { Option } = Select;
  const {
    data,
    value,
    disabled,
    viewField,
    valueField,
    size,
    defaultValue,
    type,
  } = props;

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
      allowClear
      filterOption={(input, option) =>
        option.children[0]?.props?.children
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      }
    >
      {data &&
        data.map((z, index) => (
          <Option key={index} value={valueField ? z[valueField] : z.id}>
            <Tooltip placement="topLeft" title={z.name}>
              {type === 2 ? `${z.code}.${z.name}` : z.name}
            </Tooltip>
            {viewField ? z[viewField] : z.fullName}
          </Option>
        ))}
    </Select>
  );
}
