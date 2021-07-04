import { Select } from "antd";
import { React } from "react";

export default function AutocompleteSelect(props) {
  const { Option } = Select;
  const { data, value, disabled, viewField, valueField } = props;
  const mode = props.mode || "";
  const placeholder = props.placeholder || "Сонгох";
  // function onChange(value) {
  //   props.onChange(value);
  // }

  return (
    <Select
      showSearch
      mode={mode}
      disabled={disabled}
      style={{ width: "100%" }}
      placeholder={placeholder}
      value={value}
      optionFilterProp="children"
      maxTagCount="responsive"
      size="small"
      filterOption={(input, option) =>
        option.children?.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
      // onChange={onChange}
    >
      {data &&
        data.map((z, index) => (
          <Option key={index} value={valueField ? z[valueField] : z.id}>
            {viewField ? z[viewField] : z.name}
          </Option>
        ))}
    </Select>
  );
}
