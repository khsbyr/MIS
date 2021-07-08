import React, { useEffect, useState } from "react";
import "antd/dist/antd.css";
import { Button, Row, Col, Form, Input, Select } from "antd";
import { LogIn } from "./Login.style";
import { useTranslation } from "react-i18next";
import Partner from "./components/Partner";
import { postService, getService } from "../../service/service";
import { requireFieldFocus } from "../../tools/Tools";
import { isShowLoading } from "../../context/Tools";

function Register() {
  const { t } = useTranslation();
  const [userRoles, setUserRoles] = useState([]);
  const [userOrgs, setUserOrgs] = useState([]);
  const { Option } = Select;

  useEffect(() => {
    getService("/role/getAdmin").then((result) => {
      setUserRoles(result);
    });
  }, []);

  const onChangeRole = (code) => {
    console.log(code);
    getService(`/organization/getByRole/${code}`).then((result) => {
      setUserOrgs(result || [])
    })
  };

  const requestNewUser = (values) => {
    isShowLoading(true);
    const saveData = {
        orgId: values.orgId,
        firstname: values.name,
        email: values.email,
        userRole: { id: values.code },
    }
    console.log(JSON.stringify(saveData));
    // postService("/signUpRequest/save/9", saveData).then(result => {
    //     message.success("Таны хүсэлтийг хүлээн авлаа. ")
    //     window.location.href = "/"
    // }).finally(() => isShowLoading(false))
  };

  return (
    <Row>
      <Partner></Partner>
      <Col xs={24} md={24} lg={9} style={{ backgroundColor: "#F8F8F8" }}>
        <LogIn>
          <Form
            name="normal_login"
            className="login-form"
            initialValues={{
              remember: true,
            }}
            onFinish={requestNewUser}
            onFinishFailed={requireFieldFocus}
          >
            <Form.Item>
              <p className="title">{t("register_system")}</p>
            </Form.Item>
            <Form.Item>
              <p className="subTitle">{t("email")}</p>
            </Form.Item>
            <Form.Item
              name="email"
              className="underline"
              rules={[
                {
                  type: "email",
                  message: "И-мэйл буруу байна!",
                },
                {
                  required: true,
                  message: "Энэ хэсгийг заавал бөглөнө үү!",
                },
              ]}
            >
              <Input placeholder={t("email")} bordered={false} />
            </Form.Item>
            <Form.Item>
              <p className="subTitle">{t("username")}</p>
            </Form.Item>
            <Form.Item
              name="username"
              className="underline"
              rules={[
                {
                  required: true,
                  message: "Please input your Username!",
                },
              ]}
            >
              <Input placeholder={t("username")} bordered={false} />
            </Form.Item>
            <Form.Item>
              <p className="subTitle">{t("user_role")}</p>
            </Form.Item>
            <Form.Item name="code" className="underline">
              <Select
                placeholder="Хэрэглэгчийн төрөл"
                style={{ width: "100%" }}
                bordered={false}
                onChange={onChangeRole}
                allowClear
              >
                {userRoles &&
                  userRoles.map((userRole, index) => (
                    <Option key={index} value={userRole.id}>
                      {userRole.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <p className="subTitle">{t("organization")}</p>
            </Form.Item>
            <Form.Item name="orgId" className="underline">
              <Select
                placeholder="Байгууллага"
                style={{ width: "100%" }}
                bordered={false}
                allowClear
              >
                {userOrgs &&
                  userOrgs.map((orgDatas, index) => (
                    <Option key={index} value={orgDatas.id}>
                      {orgDatas.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <p className="subTitle">{t("password")}</p>
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your Password!",
                },
              ]}
            >
              <Input.Password
                type="password"
                placeholder="**************"
                bordered={false}
                className="underline"
              />
            </Form.Item>
            <Form.Item>
              <p className="subTitle">{t("confirm_pass")}</p>
            </Form.Item>
            <Form.Item
              name="password1"
              rules={[
                {
                  required: true,
                  message: "Please input your Password!",
                },
              ]}
            >
              <Input.Password
                type="password"
                placeholder="**************"
                bordered={false}
                className="underline"
              />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button"
              >
                {t("register")}
              </Button>
            </Form.Item>
            <Form.Item>
              <p className="copyright">{t("rights_reserved")}</p>
            </Form.Item>
          </Form>
        </LogIn>
      </Col>
    </Row>
  );
}

export default Register;
