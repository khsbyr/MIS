import { Col, Form, Input, message, Modal, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import {
  getService,
  postService,
  putService,
} from '../../../../service/service';
import { errorCatch } from '../../../../tools/Tools';
import validateMessages from '../../../../tools/validateMessage';
import ContentWrapper from './attendance.style';
import AttendanceModal from './attendanceModal';

const { Option } = Select;

export default function AttendanceCheckModal(props) {
  const { Attendancecontroller, isModalVisible, isEditMode, trainingID } =
    props;
  const [form] = Form.useForm();
  const [programList, setProgramList] = useState();
  const [visible, setVisible] = useState(false);
  const [programValue, setProgramValue] = useState();
  useEffect(() => {
    getService(`trainingProgram/get/${trainingID}`).then(result => {
      if (result) {
        setProgramList(result.content);
      }
    });
    if (isEditMode) {
      form.setFieldsValue({
        ...Attendancecontroller,
        register: Attendancecontroller,
        trainingProgramm: Attendancecontroller.trainingProgram.operation,
      });
    }
  }, []);

  const save = () => {
    form
      .validateFields()
      .then(values => {
        values.trainingProgramId = programValue;
        if (isEditMode) {
          putService(`participants/update/${Attendancecontroller.id}`, values)
            .then(() => {
              message.success('Амжилттай хадгаллаа');
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService('participants/post', values)
            .then(() => {
              message.success('Амжилттай хадгаллаа');
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

  const closeModal = () => {
    setVisible(false);
    props.close(true);
  };

  function registerValue(e) {
    if (isEditMode) {
      ('');
    } else if (e.target.value) {
      getService(
        `participants/get?search=user.register:${e.target.value}`
      ).then(result => {
        if (result.content[0]) {
          getService(
            `trainingProgram/getNotParticipated?trainingId=${trainingID}&register=${e.target.value}`
          ).then(results => {
            if (results) {
              setProgramList(results);
            }
          });
        } else {
          setVisible(true);
        }
      });
    }
  }

  function programID(e) {
    setProgramValue(e);
  }

  const handleSearch = value => {
    getService(
      `trainingProgram/get/${trainingID}?search=operation:*${value}*`
    ).then(result => {
      if (result) {
        setProgramList(result.content);
      }
    }, 500);
  };

  return (
    <div>
      <Modal
        title="Ирцийн бүртгэл"
        okText="Хадгалах"
        cancelText="Буцах"
        width={900}
        alignItems="center"
        visible={isModalVisible}
        onOk={save}
        onCancel={() => props.close()}
        maskClosable={false}
      >
        <ContentWrapper>
          <Form
            form={form}
            layout="vertical"
            labelAlign="left"
            name="nest-messages"
            validateMessages={validateMessages}
          >
            <Row gutter={[72]}>
              <Col xs={24} md={24} lg={12}>
                <Form.Item
                  name="register"
                  label="Регистр"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input onBlur={registerValue} />
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={12}>
                <Form.Item label="Хөтөлбөр:" name="trainingProgramm">
                  <Select
                    showSearch
                    placeholder="Хөтөлбөрийн нэрээр хайх"
                    onChange={programID}
                    size="small"
                    onSearch={handleSearch}
                    filterOption={false}
                    defaultActiveFirstOption={false}
                    notFoundContent={null}
                  >
                    {programList &&
                      programList.map((z, index) => (
                        <Option key={index} value={z.id}>
                          {z.operation}
                        </Option>
                      ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>
          {visible && (
            <AttendanceModal
              isModalVisible={visible}
              close={closeModal}
              isEditMode={isEditMode}
              trainingID={trainingID}
            />
          )}
        </ContentWrapper>
      </Modal>
    </div>
  );
}
