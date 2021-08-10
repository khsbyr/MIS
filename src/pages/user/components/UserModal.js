import { Col, Form, Input, Modal, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { getService, postService, putService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import AutoCompleteSelect from '../../../components/Autocomplete';
import validateMessages from '../../../tools/validateMessage';

export default function UserModal(props) {
  const { Usercontroller, isModalVisible, isEditMode } = props;
  const [form] = Form.useForm();
  const [stateCountry, setStateCountry] = useState([]);
  const [stateAimag, setStateAimag] = useState([]);
  const [stateSum, setStateSum] = useState([]);
  const [stateBag, setStateBag] = useState([]);
  const [stateTrue, setStateTrue] = useState([]);
  const [stateOrg, setStateOrg] = useState([]);
  const [stateRole, setStateRole] = useState([]);

  useEffect(() => {
    getService('organization/get').then(result => {
      if (result) {
        setStateOrg(result.content || []);
      }
    });

    getService('role/get').then(result => {
      if (result) {
        setStateRole(result || []);
      }
    });

    getService('country/get').then(result => {
      if (result) {
        setStateCountry(result || []);
      }
    });

    getService('aimag/get').then(result => {
      if (result) {
        setStateAimag(result || []);
      }
    });

    if (Usercontroller !== undefined) {
      if (Usercontroller.address) {
        getService(`soum/getList/${Usercontroller.address.aimag.id}`).then(
          result => {
            if (result) {
              setStateSum(result || []);
            }
          }
        );

        getService(`bag/getList/${Usercontroller.address.soum.id}`).then(
          result => {
            if (result) {
              setStateBag(result || []);
            }
          }
        );
      }
    }

    if (isEditMode) {
      setStateTrue(Usercontroller.isTrue);
      form.setFieldsValue({
        ...Usercontroller,
        CountryID: Usercontroller.address
          ? Usercontroller.address.country.id
          : '',
        AimagID: Usercontroller.address ? Usercontroller.address.aimag.id : '',
        SoumID: Usercontroller.address ? Usercontroller.address.soum.id : '',
        BagID: Usercontroller.address ? Usercontroller.address.bag.id : '',
        AddressDetail: Usercontroller.address
          ? Usercontroller.address.addressDetail
          : '',
        RoleID: Usercontroller.role ? Usercontroller.role.id : '',
        GenderID: Usercontroller.gender ? Usercontroller.gender.id : '',
      });
    }
  }, [Usercontroller, form, isEditMode]);

  const getAimag = countryId => {
    getService(`aimag/getList/${countryId}`, {}).then(result => {
      if (result) {
        setStateAimag(result || []);
      }
    });
  };

  const selectCountry = value => {
    getAimag(value);
  };

  const getSum = aimagId => {
    getService(`soum/getList/${aimagId}`, {}).then(result => {
      if (result) {
        setStateSum(result || []);
      }
    });
  };

  const selectAimag = value => {
    getSum(value);
  };

  const getBag = sumID => {
    getService(`bag/getList/${sumID}`, {}).then(result => {
      if (result) {
        setStateBag(result || []);
      }
    });
  };

  const selectSum = value => {
    getBag(value);
  };

  const onChangeCheckBox = e => {
    setStateTrue(e.target.checked);
  };

  const save = () => {
    form
      .validateFields()
      .then(values => {
        values.role = {
          id: values.roleId,
        };
        values.address = {
          country: {
            id: values.CountryID,
          },
          aimag: {
            id: values.AimagID,
          },
          soum: {
            id: values.SoumID,
          },
          bag: {
            id: values.BagID,
          },
          addressDetail: values.AddressDetail,
        };
        values.organization = {
          id: values.orgId,
        };
        values.isTrue = true;

        if (isEditMode) {
          putService(`user/update/${Usercontroller.id}`, values)
            .then(() => {
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService('/user/post', values)
            .then(() => {
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        }
      })
      .catch(info => {
        errorCatch(info);
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
          labelAlign="left"
          name="nest-messages"
          layout="vertical"
          validateMessages={validateMessages}
        >
          <Row gutter={24}>
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
              <Form.Item
                name="orgId"
                layout="vertical"
                label="Харьяа байгууллагын нэр:"
              >
                <AutoCompleteSelect
                  valueField="id"
                  size="medium"
                  data={stateOrg}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xs={24} md={24} lg={6}>
              <Form.Item label="Албан тушаал:" name="position">
                <Input placeholder="Албан тушаал..." />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={6}>
              <Form.Item label="Утасны дугаар:" name="phoneNumber">
                <Input placeholder="Утасны дугаар..." />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={6}>
              <Form.Item label="И-мэйл хаяг:" name="email">
                <Input placeholder="И-мэйл хаяг..." />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={6}>
              <Form.Item
                size="large"
                name="roleId"
                layout="vertical"
                label="Эрх:"
              >
                <AutoCompleteSelect
                  valueField="id"
                  data={stateRole}
                  size="medium"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xs={24} md={24} lg={6}>
              <Form.Item label="Улс:" name="CountryID">
                <AutoCompleteSelect
                  valueField="id"
                  data={stateCountry}
                  size="medium"
                  onChange={value => selectCountry(value)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={6}>
              <Form.Item
                name="AimagID"
                layout="vertical"
                label="Аймаг, Нийслэл:"
              >
                <AutoCompleteSelect
                  valueField="id"
                  data={stateAimag}
                  size="medium"
                  onChange={value => selectAimag(value)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={6}>
              <Form.Item name="SoumID" layout="vertical" label="Сум, Дүүрэг:">
                <AutoCompleteSelect
                  valueField="id"
                  data={stateSum}
                  size="medium"
                  onChange={value => selectSum(value)}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={6}>
              <Form.Item name="BagID" layout="vertical" label="Баг, Хороо:">
                <AutoCompleteSelect
                  valueField="id"
                  data={stateBag}
                  size="medium"
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={18}>
            <Col xs={24} md={24} lg={12}>
              <Form.Item label="Хаяг:" name="AddressDetail">
                <Input.TextArea
                  placeholder="Хаяг"
                  style={{
                    width: '100%',
                    height: '100px',
                  }}
                />
              </Form.Item>
            </Col>
            <Col xs={24} md={24} lg={6}>
              <Form.Item label="Оруулсан мэдээлэл үнэн болно." name="isTrue">
                <Input
                  type="checkbox"
                  onChange={onChangeCheckBox}
                  checked={stateTrue}
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
}
