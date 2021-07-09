import { DownOutlined } from "@ant-design/icons";
import { faFileExcel, faPlus, faPrint } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Col, Row } from "antd";
import { React } from "react";
export default function Button () {

  // function onChange(value) {
  //   props.onChange(value);
  // }

  return (
    <Row gutter={[0, 15]}>
    <Col xs={8} md={8} lg={6}>
        <DatePicker
            onChange={onChange}
            bordered={false}
            suffixIcon={<DownOutlined />}
            placeholder="Select year"
            picker="year"
            className="DatePicker"
            style={{
                width: "120px",
                color: "black",
                cursor: "pointer",
            }}
        />
    </Col>
    <Col xs={8} md={8} lg={6}>
        <Button type="text" icon={<FontAwesomeIcon icon={faPrint} />} >Хэвлэх </Button>
    </Col>
    <Col xs={8} md={8} lg={6}>
        <Button type="text" className="export" icon={<FontAwesomeIcon icon={faFileExcel} />} >
            Экспорт
        </Button>
    </Col>
    <Col xs={8} md={8} lg={6}>
        <Button type="text" className="export" icon={<FontAwesomeIcon icon={faPlus} />} onClick={add}>
            Нэмэх
        </Button>
    </Col>
</Row>
  );
}
