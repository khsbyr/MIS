import React, { useEffect, useState } from "react";
import { Modal, Form, Input , Table, Button, DatePicker} from "antd";
import { getService, postService, putService } from "../../../../service/service";
import { errorCatch } from "../../../../tools/Tools";
import { DownOutlined, SearchOutlined, CopyOutlined, InboxOutlined, UploadOutlined , UserOutlined } from "@ant-design/icons";
import { faCalendarAlt, faEnvelope, faHome, faPhone, faUser, faUserEdit } from "@fortawesome/free-solid-svg-icons";
import { Row, Col, Select, Option,Upload } from "antd";
import AutocompleteSelect from "../../../components/Autocomplete";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
const dataSource = [
    {
      key: '1',
      name: 'Mike',
      age: 32,
      address: '10 Downing Street',
    },
    {
      key: '2',
      name: 'John',
      age: 42,
      address: '10 Downing Street',
    },
  ];
  
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
  ];

const { Dragger } = Upload;
const layout = {
    labelCol: {
        span: 10,
    },
    wrapperCol: {
        span: 14,
    },
};
const validateMessages = {
    required: "${label} хоосон байна!",
    types: {
        email: "${label} is not a valid email!",
        number: "${label} is not a valid number!",
    },
    number: {
        range: "${label} must be between ${min} and ${max}",
    },
};
export default function CvModal(props) {
    const { Usercontroller, isModalVisible, isEditMode } = props;
    const [stateController, setStateController] = useState([]);
    const [form] = Form.useForm();
    const { Option } = Select;
    const { RangePicker } = DatePicker;
    useEffect(() => {
        getService("criteria/get", {
            search: "status:true",
        }).then((result) => {
            if (result) {
                setStateController(result.content || []);
            }
        });

        if (isEditMode) {
            getService("criteria/get" + Usercontroller.id).then((result) => {
                Usercontroller.userServiceId = result.userService.id
                form.setFieldsValue({ ...Usercontroller });
            })

        }
    }, []);
    const save = () => {
        form
            .validateFields()
            .then((values) => {
                values.userService = { id: values.userServiceId }
                if (isEditMode) {
                    putService(
                        "criteria/put" + Usercontroller.id,
                        values
                    )
                        .then((result) => {
                            props.close(true);
                        })
                        .catch((error) => {
                            errorCatch(error);
                        })
                } else {
                    postService("criteria/post", values)
                        .then((result) => {
                            props.close(true);
                        })
                        .catch((error) => {
                            errorCatch(error);
                        });
                }
            })
            .catch((info) => {
                console.log("Validate Failed:", info);
            });
    };
    return (
        <div>
            <Modal
                title="Сургагч багшийн CV бүртгэх"
                okText="Хадгалах"
                cancelText="Буцах"
                width={1200}
                alignItems="center"
                visible={isModalVisible}
                onOk={save}
                onCancel={() => props.close()}
            >
          <h2 className="title">1. Хувь хүний мэдээлэл</h2>
            <Row gutter={[30,30]}>
                
                <Col xs={24} md={24} lg={4}>
                    <Dragger {...props} style={{}}>
                        <p className="ant-upload-drag-icon">
                        <InboxOutlined />
                        </p>
                        <p className="ant-upload-hint">
                        Зураг оруулах
                        </p>
                    </Dragger>            
                </Col>
                <Col xs={24} md={24} lg={2}>
                </Col>
                <Col xs={24} md={24} lg={9}>
                    <Form>
                        <Form.Item>                   
                            <Input className="FormItem" placeholder="Овог, нэр:" prefix={<FontAwesomeIcon icon={faUser}/>}/>
                        </Form.Item>
                    </Form>
                    <Form>
                        <Form.Item>
                            <Input className="FormItem" placeholder="Төрсөн огноо:" prefix={<FontAwesomeIcon icon={faCalendarAlt}/>}/>
                        </Form.Item>
                    </Form>
                    <Form>
                        <Form.Item>
                            <Input className="FormItem"placeholder="Регистрийн дугаар:" prefix={<FontAwesomeIcon icon={faUserEdit}/>}/>
                        </Form.Item>
                    </Form>
                </Col>

                <Col xs={24} md={24} lg={9}>
                <Form>
                    <Form.Item>
                            <Input className="FormItem"placeholder="Хаяг:" prefix={<FontAwesomeIcon icon={faHome}/>}/>
                    </Form.Item>
                    </Form>
                    <Form>
                        <Form.Item>
                            <Input className="FormItem" placeholder="Утас, факс:" prefix={<FontAwesomeIcon icon={faPhone}/>}/>
                        </Form.Item>
                    </Form>
                    <Form>
                        <Form.Item>
                            <Input className="FormItem" placeholder="И-мэйл хаяг:" prefix={<FontAwesomeIcon icon={faEnvelope}/>}/>
                        </Form.Item>
                    </Form>
                </Col>
            </Row>

            <h2 className="title">2. Ажлын зорилго</h2>
            <Row>
                <Col xs={24} md={24} lg={22}>
                    <Form layout="vertical">
                        <Form.Item> 
                            <Input.TextArea 
                                placeholder="(Горилж буй ажлын зорилгоо товч бичнэ үү)"
                                style={{
                                    width: "100%",
                                    height: "110px",                                  
                                }}
                            />
                        </Form.Item>
                    </Form>
                </Col>
            </Row>

            <h2 className="title">3. Боловсрол</h2>
            <Row >
                <Col xs={24} md={24} lg={22}>
                    <Table dataSource={dataSource} columns={columns} />
                </Col>
            </Row>

            <h2 className="title">4. Ажлын туршлага</h2>
            <Row >
                <Col xs={24} md={24} lg={22}>
                    <Table dataSource={dataSource} columns={columns} />
                </Col>
            </Row>

            <h2 className="title">5. Зөвлөх үйлчилгээний ажлын туршлага</h2>
            <Row >
                <Col xs={24} md={24} lg={22}>
                    <Table dataSource={dataSource} columns={columns} />
                </Col>
            </Row>

            <h2 className="title">6. Башгийн ажлын туршлага</h2>
            <Row >
                <Col xs={24} md={24} lg={22}>
                    <Table dataSource={dataSource} columns={columns} />
                </Col>
            </Row>

            <h2 className="title">10. Ур чадвар</h2>
            <Row >
                <Col xs={24} md={24} lg={22}>
                    <Input.TextArea 
                        placeholder="(Өөрийн давуу тал, ур чадвараа нэрлэнэ үү)"
                        style={{
                            width: "100%",
                            height: "140px"
                        }}
                    />
                </Col>
            </Row>
            <Row>
                <Col xs={24} md={24} lg={22}>
                    <Form.Item style={{marginTop: "20px"}}>
                        <Button type="primary" htmlType="submit" className="button">
                        Хадгалах
                        </Button>
                    </Form.Item>
                </Col>
            </Row>
            </Modal>
        </div >
    );
}
