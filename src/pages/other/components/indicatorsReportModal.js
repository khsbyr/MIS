/* eslint-disable no-nested-ternary */
import { UploadOutlined } from '@ant-design/icons';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Radio,
  Row,
  TreeSelect,
  Upload,
} from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  getService,
  postService,
  putService,
  updateFileServer,
  writeFileServer,
} from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import validateMessages from '../../../tools/validateMessage';
import ContentWrapper from './feedback.style';

const dummyRequest = ({ onSuccess }) => {
  setTimeout(() => {
    onSuccess('ok');
  }, 0);
};

const layout = {
  labelCol: {
    span: 20,
  },
  wrapperCol: {
    span: 24,
  },
};

const { TreeNode } = TreeSelect;

export default function IndicatorsReportModal(props) {
  const { IndicatorsReportcontroller, isModalVisible, isEditMode, criteriaID } =
    props;
  const [form] = Form.useForm();
  const [valueAddress, setValueAddress] = useState(undefined);
  const [stateAimag, setStateAimag] = useState([]);
  const [Date, setDate] = useState([]);
  const [isYesValue, setIsYesValue] = useState();
  const [fileList, setFileList] = useState([]);

  const defaultFileList =
    IndicatorsReportcontroller?.file && isEditMode
      ? [
          {
            uid: '-1',
            name: IndicatorsReportcontroller?.file?.fileName,
            status: 'done',
            url: IndicatorsReportcontroller?.file?.path,
          },
        ]
      : [];

  const ProjectChildrenAddress =
    IndicatorsReportcontroller &&
    IndicatorsReportcontroller.address.childrenAddress.map(
      item => item.soum.id
    );

  function handleUpload(info) {
    setFileList([info.file.originFileObj]);
  }

  function onDateChange(value) {
    setDate(value);
  }

  useEffect(() => {
    getService('aimag/get').then(result => {
      if (result) {
        setStateAimag(result || []);
      }
    });
    if (isEditMode) {
      setDate(IndicatorsReportcontroller.date);
      setValueAddress(ProjectChildrenAddress);
      setIsYesValue(IndicatorsReportcontroller.isYes);
      form.setFieldsValue({
        ...IndicatorsReportcontroller,
        stateCriteriaID: IndicatorsReportcontroller.criteria
          ? IndicatorsReportcontroller.criteria.name
          : '',
        date: IndicatorsReportcontroller ? IndicatorsReportcontroller.date : '',
      });
    }
  }, []);

  const onChangeAddress = value => {
    setValueAddress(value);
  };

  const getDynamicChildNodes = child => {
    const childs = [];
    for (let c = 0; c < child.length; c++) {
      childs.push(
        <TreeNode value={child[c].id} title={child[c].name} key={child[c].id} />
      );
    }
    return childs;
  };

  const getDynamicTreeNodes = () => {
    const results = [];
    for (let i = 0; i < stateAimag.length; i++) {
      results.push(
        <TreeNode
          value={stateAimag[i].id + 400}
          title={stateAimag[i].name}
          key={stateAimag[i].id + 400}
          disabled
        >
          {getDynamicChildNodes(stateAimag[i].soums)}
        </TreeNode>
      );
    }
    return results;
  };

  const save = () => {
    form
      .validateFields()
      .then(values => {
        values.date = Date;
        values.soumIds = valueAddress;
        values.criteriaId = criteriaID;
        values.isYes = isYesValue;
        values.number =
          isYesValue === true || isYesValue === false ? null : values.number;
        if (isEditMode) {
          if (fileList[0]) {
            const serverApi = IndicatorsReportcontroller.file
              ? updateFileServer(
                  `file/update/${IndicatorsReportcontroller.file.id}`,
                  fileList[0]
                )
              : writeFileServer(`file/upload`, fileList[0]);
            serverApi
              .then(response => {
                values.fileId = response.data.id;
                putService(
                  `criteriaResults/update/${IndicatorsReportcontroller.id}`,
                  values
                )
                  .then(() => {
                    message.success('?????????????????? ??????????????????');
                    props.close(true);
                  })
                  .catch(error => {
                    errorCatch(error);
                  });
              })
              .catch(error => {
                errorCatch(error);
              });
          } else {
            putService(
              `criteriaResults/update/${IndicatorsReportcontroller.id}`,
              values
            )
              .then(() => {
                message.success('?????????????????? ??????????????????');
                props.close(true);
              })
              .catch(error => {
                errorCatch(error);
              });
          }
        } else if (fileList[0]) {
          writeFileServer(`file/upload`, fileList[0])
            .then(response => {
              values.fileId = response.data.id;
              postService(`criteriaResults/post`, values)
                .then(() => {
                  message.success('?????????????????? ??????????????????');
                  props.close(true);
                })
                .catch(error => {
                  errorCatch(error);
                });
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService(`criteriaResults/post`, values)
            .then(() => {
              message.success('?????????????????? ??????????????????');
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

  const isYes = e => {
    setIsYesValue(e.target.value);
  };

  return (
    <div>
      <Modal
        title="?????????????? ?????????????????????? ???? ?????? ??????????????"
        okText="????????????????"
        cancelText="??????????"
        width={800}
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
            <Row gutter={[30, 30]}>
              <Col xs={24} md={24} lg={24}>
                {/* <Form.Item
                  name="stateCriteriaID"
                  label="?????????????? ?????????????????????? ??????:"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <AutoCompleteSelect
                    placeholder="?????????????? ?????????????????????? ?????? ????????????..."
                    valueField="id"
                    defaultValue={
                      isEditMode
                        ? IndicatorsReportcontroller.stateCriteria &&
                          IndicatorsReportcontroller.stateCriteria.name
                        : null
                    }
                    data={stateCriteria}
                    size="medium"
                    onChange={value => selectCriteria(value)}
                    type={2}
                  />
                </Form.Item> */}
                <Form.Item label="????????:">
                  {ProjectChildrenAddress === null ? (
                    <TreeSelect
                      showSearch
                      style={{ width: '100%' }}
                      value={valueAddress}
                      dropdownStyle={{ maxHeight: 450, overflow: 'auto' }}
                      placeholder="????????????"
                      allowClear
                      multiple
                      maxTagCount="responsive"
                      onChange={onChangeAddress}
                    >
                      {getDynamicTreeNodes()}
                    </TreeSelect>
                  ) : (
                    <TreeSelect
                      showSearch
                      style={{ width: '100%' }}
                      value={valueAddress}
                      dropdownStyle={{ maxHeight: 450, overflow: 'auto' }}
                      placeholder="????????????"
                      allowClear
                      multiple
                      maxTagCount="responsive"
                      onChange={onChangeAddress}
                    >
                      {getDynamicTreeNodes()}
                    </TreeSelect>
                  )}
                </Form.Item>
                {criteriaID === 27 || criteriaID === 30 ? (
                  <Form.Item
                    label="???? ??????:"
                    name="isYes"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    {criteriaID === 27 || criteriaID === 30 ? (
                      <Radio.Group onChange={isYes} value={isYesValue}>
                        <Radio value>????????</Radio>
                        <Radio value={false}>????????</Radio>
                      </Radio.Group>
                    ) : (
                      <Input />
                    )}
                  </Form.Item>
                ) : (
                  <Form.Item
                    label="???? ??????:"
                    name="number"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    {criteriaID === 27 || criteriaID === 30 ? (
                      <Radio.Group onChange={isYes} value={isYesValue}>
                        <Radio value defaultChecked>
                          ????????
                        </Radio>
                        <Radio value={false}>????????</Radio>
                      </Radio.Group>
                    ) : (
                      <Input />
                    )}
                  </Form.Item>
                )}
                <Form.Item
                  label="??????????:"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <DatePicker
                    style={{ width: '100%', height: '40px' }}
                    prefix={<FontAwesomeIcon icon={faCalendarAlt} />}
                    placeholder="??????????"
                    onChange={onDateChange}
                    defaultValue={
                      isEditMode ? moment(IndicatorsReportcontroller.date) : ''
                    }
                  />
                </Form.Item>
                <Form.Item
                  label="??????????????:"
                  name="explanation"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <TextArea style={{ width: '100%', height: '80px' }} />
                </Form.Item>
                <Upload
                  maxCount={1}
                  defaultFileList={[...defaultFileList]}
                  customRequest={dummyRequest}
                  onChange={handleUpload}
                >
                  <Button icon={<UploadOutlined />}>???????? ??????????????????</Button>
                </Upload>
              </Col>
            </Row>
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
