import { Col, Form, Input, message, Modal, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';
import { getService, postService, putService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import validateMessages from '../../../tools/validateMessage';
import ContentWrapper from './components/trainingProgram.style';

const { Option } = Select;
const layout = {
  labelCol: {
    span: 20,
  },
  wrapperCol: {
    span: 22,
  },
};

export default function TrainingProgramModal(props) {
  const { Trainingprogramcontroller, isModalVisible, isEditMode, trainingID } =
    props;
  const [form] = Form.useForm();
  const [stateTrainers, setStateTrainers] = useState(false);
  const [TrainingTopics, setTrainingTopics] = useState();
  const [TopicId, setTopicId] = useState();
  const [RespoUsers, setRespoUsers] = useState([]);

  const resp = Trainingprogramcontroller?.resPersonTrainingTopics?.map(
    z => z.resPersonName
  );

  useEffect(() => {
    getService(`trainingTeam/getListWithoutOverlap/${trainingID}`).then(
      result => {
        if (result) {
          setStateTrainers(result.content || []);
        }
      }
    );

    getService(`trainingProgram/getList/${trainingID}`).then(result => {
      if (result) {
        setTrainingTopics(result || []);
      }
    });
    if (isEditMode) {
      setTopicId(Trainingprogramcontroller.trainingProgram.id);
      setRespoUsers(resp);
      form.setFieldsValue({
        ...Trainingprogramcontroller,
        startDate: Trainingprogramcontroller
          ? Trainingprogramcontroller.startDate
          : '',
      });
    }
  }, []);

  const save = () => {
    form
      .validateFields()
      .then(values => {
        values.trainingTopic = {
          trainingProgram: { id: TopicId },
          topic: values.topic,
          time: values.time,
        };
        values.names = RespoUsers;
        if (isEditMode) {
          putService(
            `trainingTopic/update/${Trainingprogramcontroller.id}`,
            values
          )
            .then(() => {
              message.success('Амжилттай хадгаллаа');
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService(`trainingTopic/post`, values)
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

  const handleSearch = value => {
    getService(
      `trainingTeam/getListWithoutOverlap/${trainingID}?search=user.fullName:*${value}*`
    ).then(result => {
      if (result) {
        setStateTrainers(result.content);
      }
    }, 500);
  };

  function selectTopic(value) {
    setTopicId(value);
  }

  function handleChange(value) {
    setRespoUsers(value);
  }

  return (
    <div>
      <Modal
        title="Сургалтын сэдэв бүртгэх"
        okText="Хадгалах"
        cancelText="Буцах"
        width={600}
        alignItems="center"
        visible={isModalVisible}
        onOk={save}
        onCancel={() => props.close()}
      >
        <ContentWrapper>
          <Form
            form={form}
            labelAlign="left"
            {...layout}
            layout="vertical"
            name="nest-messages"
            validateMessages={validateMessages}
          >
            <Row>
              <Col xs={24} md={24} lg={24}>
                <Row>
                  <Col xs={24} md={24} lg={24}>
                    <Form.Item
                      label="Хөтөлбөр:"
                      rules={[
                        {
                          required: true,
                        },
                      ]}
                    >
                      <Select
                        placeholder="Хөтөлбөр сонгох"
                        style={{ width: '100%' }}
                        allowClear
                        onChange={selectTopic}
                        defaultValue={
                          isEditMode
                            ? Trainingprogramcontroller.trainingProgram.id
                            : ''
                        }
                      >
                        {TrainingTopics &&
                          TrainingTopics.map((z, index) => (
                            <Option key={index} value={z.id}>
                              {z.operation}
                            </Option>
                          ))}
                      </Select>
                    </Form.Item>
                    <Form.Item label="Цаг:" name="time">
                      <Input placeholder="09:00-10:00" />
                    </Form.Item>
                    <Form.Item label="Сэдэв:" name="topic">
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="responsiblePersonName"
                      layout="vertical"
                      label="Сургагч багшийн нэр:"
                    >
                      {isEditMode ? (
                        <Select
                          mode="tags"
                          size="middle"
                          style={{ width: '100%' }}
                          placeholder="Сургагч багшийн нэр"
                          onSearch={handleSearch}
                          filterOption={false}
                          defaultActiveFirstOption={false}
                          notFoundContent={null}
                          onChange={handleChange}
                          defaultValue={resp}
                        >
                          {stateTrainers &&
                            stateTrainers.map((z, index) => (
                              <Option key={index} value={z.user.firstname}>
                                {z.user.firstname}
                              </Option>
                            ))}
                        </Select>
                      ) : (
                        <Select
                          mode="tags"
                          size="middle"
                          style={{ width: '100%' }}
                          placeholder="Сургагч багшийн нэр"
                          onSearch={handleSearch}
                          filterOption={false}
                          defaultActiveFirstOption={false}
                          notFoundContent={null}
                          onChange={handleChange}
                        >
                          {stateTrainers &&
                            stateTrainers.map((z, index) => (
                              <Option key={index} value={z.user.firstname}>
                                {z.user.firstname}
                              </Option>
                            ))}
                        </Select>
                      )}
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
