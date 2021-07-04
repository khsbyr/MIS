import { Col, Form, Input, Modal, Row, Select } from "antd";
import React, { useEffect, useState } from "react";
import { getService, postService, putService } from "../../../service/service";
import { errorCatch } from "../../../tools/Tools";
import AutocompleteSelect from "../../components/Autocomplete";
// const layout = {
//   labelCol: {
//     span: 10,
//   },
//   wrapperCol: {
//     span: 14,
//   },
// };
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
export default function UserModal(props) {
  const { Usercontroller, isModalVisible, isEditMode } = props;
  const [ setStateController ] = useState([]);
  const [form] = Form.useForm();
  const { Option } = Select;
  const [ stateCountry, setStateCountry] = useState([]);
  const [stateAimag, setStateAimag] = useState([]);
  const [stateSum, setStateSum] = useState([]);
  // const [stateBag, setStateBag] = useState([]);

  useEffect(() => {
    // getService("user/get", {
    // }).then((result) => {
    //   if (result) {
    //     setStateController(result.content || []);
    //   }
    // });

    if (isEditMode) {
      // getService("user/get" + Usercontroller.id).then((result) => {
      //   Usercontroller.userServiceId = result.userService.id;
        form.setFieldsValue({ ...Usercontroller });
      // });
    }
  }, []);
  useEffect(() => {
    getService("country/get")
    .then((result) => {
      if (result) {
        setStateCountry(result || []);
      }
    });
    if (isEditMode) {
      form.setFieldsValue({ ...Usercontroller });
    }

  }, []);
  useEffect(() => {
    getService("aimag/getList/107", {})
    .then((result) => {
      if (result) {
        setStateAimag(result || []);
      }
    });
    if (isEditMode) {
      form.setFieldsValue({ ...Usercontroller });
    }
  }, []);
  // useEffect(() => {
  //   if (Usercontroller.id) onChangeCountry(Usercontroller.id);
  // }, [stateCountry, Usercontroller.id]);

  // const onChangeCountry = () => {
  //   getService('aimag/get').then((result) => {
  //   })
  // };
  const save = () => {
    form
      .validateFields()
      .then((values) => {
        if (isEditMode) {
          putService("user/update" + Usercontroller.id, values)
            .then((result) => {
              props.close(true);
            })
            .catch((error) => {
              errorCatch(error);
            });
        } else {
            debugger
          postService("user/saveByAdmin/", values)
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
        title="Хэрэглэгч бүртгэх"
        okText="Хадгалах"
        cancelText="Буцах"
        width={1000}
        alignItems="center"
        visible={isModalVisible}
        onOk={save}
        onCancel={() => props.close()}
      >
        <Form
          form={form}
          labelAlign={"left"}
          name="nest-messages"
          layout="vertical"
          validateMessages={validateMessages}
        >
          <Row gutter={32}>
          <Col xs={24} md={24} lg={6}>
              <Form.Item label="Нэр:" name="firstname">
                <Input placeholder="Нэр..." />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={6}>
              <Form.Item label="Овог:" name="lastname">
                <Input placeholder="Овог..." />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={6}>
              <Form.Item label="Регистрийн дугаар:" name="register">
                <Input placeholder="Регистрийн дугаар..." />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={6}>
              <Form.Item label="Нас:" name="age">
                <Input type="number" placeholder="Нас..." />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={32}>
            <Col xs={24} md={24} lg={6}>
              <Form layout="vertical">
                <Form.Item label="Хүйс:" name="gender">
                  <Select placeholder="Хүйс..." allowClear>
                    <Option value="1">Эрэгтэй</Option>
                    <Option value="2">Эмэгтэй</Option>
                  </Select>
                </Form.Item>
              </Form>
            </Col>
            <Col xs={24} md={24} lg={6}>
              <Form layout="vertical">
                <Form.Item label="Харьяа байгууллагын нэр:" name="organiztaion">
                  <Select placeholder="Харьяа байгууллагын нэр..." allowClear>
                    <Option value="Харьяа байгууллагын нэр">uls</Option>
                  </Select>
                </Form.Item>
              </Form>
            </Col>
            <Col xs={24} md={24} lg={6}>
              <Form.Item
                label="Албан тушаал:"
                name="position"
              >
                <Input
                  placeholder="Албан тушаал..."
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={6}>
              <Form.Item label="Утасны дугаар:" name="phoneNumber">
                <Input placeholder="Утасны дугаар..."/>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={32}>
          <Col xs={24} md={24} lg={6}>
            <Form layout="vertical">
                <Form.Item
                name="name"
                layout="vertical"
                label="Улс:"

              >
                <AutocompleteSelect
                  valueField="code"
                  data={stateCountry}
                  // onChange={onChangeCountry}
                />
              </Form.Item>
              </Form>
            </Col>
            <Col xs={24} md={24} lg={6}>
            <Form layout="vertical">
                <Form.Item
                name="name"
                layout="vertical"
                label="Аймаг, Нийслэл:"

              >
                <AutocompleteSelect
                  valueField="code"
                  data={stateAimag}
                  // onChange={onChangeCountry}
                />
              </Form.Item>
              </Form>
            </Col>
            <Col xs={24} md={24} lg={6}>
            <Form layout="vertical">
                <Form.Item label="Сум, Дүүрэг:">
                  <Select placeholder="Сум, Дүүрэг:..." allowClear>
                    <Option value=""></Option>
                  </Select>
                </Form.Item>
              </Form>
            </Col>
            <Col xs={24} md={24} lg={6}>
            <Form layout="vertical">
                <Form.Item label="Баг, Хороо:">
                  <Select placeholder="Баг, Хороо:..." allowClear>
                    <Option value=""></Option>
                  </Select>
                </Form.Item>
              </Form>
            </Col>
          </Row>
          <Row gutter={32}>
            <Col xs={24} md={24} lg={6}>
              <Form.Item label="Хаяг:" name="hayg">
                <Input type="text" />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={6}>
              <Form.Item label="Эрх" name="role">
              <Select placeholder="Эрх:..." allowClear>
                    <Option value=""></Option>
                  </Select>              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={6}>
              <Form.Item label="Password" name="password">
              <Input.Password />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={6}>
              <Form.Item label="Оруулсан мэдээлэл үнэн болно." name="check">
                <Input type="checkbox" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={32}>

          <Col xs={24} md={24} lg={6}>
              <Form.Item label="Нэвтрэх нэр:" name="username">
                <Input placeholder="Нэвтрэх нэр..." />
              </Form.Item>
            </Col>
            </Row>
        </Form>

        {/* <Form.Item
            name="upIndicator"
            label="Нас"
            rules={[
              {
                required: false,
              },
            ]}
          >
            <Input />
          </Form.Item> */}
      </Modal>
    </div>
  );
}
