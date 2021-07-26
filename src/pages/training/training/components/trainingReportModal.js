import { UploadOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Modal, Row, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import AutoCompleteSelect from '../../../../components/Autocomplete';
import {
  getService,
  postService,
  putService,
} from '../../../../service/service';
import { errorCatch } from '../../../../tools/Tools';
import ContentWrapper from './trainingReport.style';
import validateMessages from '../../../../tools/validateMessage';

export default function TrainingReportModal(props) {
  const { TrainingReportController, isModalVisible, isEditMode, orgID } = props;
  const [form] = Form.useForm();
  const [stateAimag, setStateAimag] = useState([]);
  const [stateSum, setStateSum] = useState([]);
  const [stateCountry, setStateCountry] = useState([]);
  const [stateBag, setStateBag] = useState([]);
  const [training, setTraining] = useState([]);
  const [trainingID, setTrainingID] = useState([]);
  const [guidelinesID, setGuidelinesID] = useState([]);
  const [reportsAimID, setReportsAimID] = useState([]);

  useEffect(() => {
    getService(`training/getListForReport/${orgID}`).then(result => {
      if (result) {
        setTraining(result || []);
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

    if (TrainingReportController !== undefined) {
      getService(
        `soum/getList/${TrainingReportController.training.training_guidelines.address.aimag.id}`
      ).then(result => {
        if (result) {
          setStateSum(result || []);
        }
      });
      getService(
        `bag/getList/${TrainingReportController.training.training_guidelines.address.soum.id}`
      ).then(result => {
        if (result) {
          setStateBag(result || []);
        }
      });
    }

    if (isEditMode) {
      setTrainingID(TrainingReportController.training.id);
      setGuidelinesID(TrainingReportController.training.training_guidelines.id);
      setReportsAimID(TrainingReportController.reportsAim.id);
      form.setFieldsValue({
        ...TrainingReportController,
        CountryID: TrainingReportController.training.training_guidelines.address
          ? TrainingReportController.training.training_guidelines.address
              .country.id
          : '',
        AimagID: TrainingReportController.training.training_guidelines.address
          ? TrainingReportController.training.training_guidelines.address.aimag
              .id
          : '',
        SoumID: TrainingReportController.training.training_guidelines.address
          ? TrainingReportController.training.training_guidelines.address.soum
              .id
          : '',
        BagID: TrainingReportController.training.training_guidelines.address
          ? TrainingReportController.training.training_guidelines.address.bag.id
          : '',
        TrainingName: TrainingReportController.training.name,
        TotalParticipants: TrainingReportController.training.totalParticipants,
        ResponsibleUser:
          TrainingReportController.training.organization.responsibleUser.id,
        ResponsibleUserName:
          TrainingReportController.training.organization.responsibleUser
            .firstname,
        PerformanceBudget: TrainingReportController.training.performanceBudget,
        ReportsAim: TrainingReportController.reportsAim.inputText,
        ReportsSuccessOverview:
          TrainingReportController.reportsSuccessOverview.inputText,
        ReportsResult: TrainingReportController.reportsResult.inputText,
        ReportsTips: TrainingReportController.reportsTips.inputText,
      });
    }
    // else {
    //   form.setFieldsValue({
    //     ...training,
    //     CountryID: training.training_guidelines.address ? training.training_guidelines.address.country.id : '',
    //     AimagID: TrainingReportController.training.training_guidelines.address ? TrainingReportController.training.training_guidelines.address.aimag.id : '',
    //     SoumID: TrainingReportController.training.training_guidelines.address ? TrainingReportController.training.training_guidelines.address.soum.id : '',
    //     BagID: TrainingReportController.training.training_guidelines.address ? TrainingReportController.training.training_guidelines.address.bag.id : '',
    //     TrainingName: TrainingReportController.training.name,
    //     TotalParticipants: TrainingReportController.training.totalParticipants,
    //     ResponsibleUser: TrainingReportController.training.organization.responsibleUser.id,
    //     ResponsibleUserName: TrainingReportController.training.organization.responsibleUser.firstname,
    //     PerformanceBudget: TrainingReportController.training.performanceBudget,
    //     ReportsAim: TrainingReportController.reportsAim.inputText,
    //     ReportsSuccessOverview: TrainingReportController.reportsSuccessOverview.inputText,
    //     ReportsResult: TrainingReportController.reportsResult.inputText,
    //     ReportsTips: TrainingReportController.reportsTips.inputText,
    //   });
    // }
  }, []);

  const selectTraining = value => {
    console.log(value);
    console.log(orgID);
    getService(`training/getListForReport/${orgID}`).then(result => {
      console.log('asdas', result);
      if (result) {
        setTraining(result || []);
      }
    });
    setTrainingID(value);
  };

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
    console.log(`aimagId${aimagId}`);
    getService(`soum/getList/${aimagId}`, {}).then(result => {
      if (result) {
        console.log(`asd${result}`);
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

  const save = () => {
    form
      .validateFields()
      .then(values => {
        values.training = {
          id: trainingID,
          totalParticipants: values.TotalParticipants,
          organization: {
            id: orgID,
            responsibleUser: { id: values.ResponsibleUser },
          },
          performanceBudget: values.PerformanceBudget,
          training_guidelines: {
            id: guidelinesID,
            address: {
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
            },
          },
        };
        // values.training = {organization: {id: orgID}}
        values.reportsAim = { id: reportsAimID, inputText: values.ReportsAim };
        // values.reportsTips = {inputText: values.ReportsTips}
        if (isEditMode) {
          putService(
            `trainingReport/update/${TrainingReportController.id}`,
            values
          )
            .then(result => {
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        } else {
          postService('trainingReport/post', values)
            .then(result => {
              props.close(true);
            })
            .catch(error => {
              errorCatch(error);
            });
        }
      })
      .catch(info => {
        console.log('Validate Failed:', info);
      });
  };
  return (
    <div>
      <Modal
        title="Сургалтын тайлан бүртгэх"
        okText="Хадгалах"
        cancelText="Буцах"
        width={1200}
        alignItems="center"
        visible={isModalVisible}
        onOk={save}
        onCancel={() => props.close()}
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
                <Form.Item label="Сургалтын нэр:" name="TrainingName">
                  {isEditMode ? (
                    <AutoCompleteSelect
                      disabled
                      valueField="id"
                      data={training}
                      // onChange={(value) => selectAimag(value)}
                    />
                  ) : (
                    <AutoCompleteSelect
                      valueField="id"
                      data={training}
                      onChange={value => selectTraining(value)}
                    />
                  )}
                </Form.Item>

                <Form.Item
                  label="Сургалтад хамрагдсан:"
                  name="TotalParticipants"
                >
                  {isEditMode ? (
                    <Input className="FormItem" disabled />
                  ) : (
                    <Input className="FormItem" />
                  )}
                </Form.Item>

                <Form.Item
                  label="Сургалт явуулсан байгууллага, хүний нэр:"
                  name="ResponsibleUser"
                >
                  {isEditMode ? (
                    <Input className="FormItem" disabled />
                  ) : (
                    <Input className="FormItem" />
                  )}
                </Form.Item>

                <Form.Item label="Гүйцэтгэлийн төсөв:" name="PerformanceBudget">
                  <Input className="FormItem" />
                </Form.Item>
              </Col>

              <Col xs={24} md={24} lg={12}>
                <Form.Item label="Сургалт явагдсан газар:" name="CountryID">
                  {isEditMode ? (
                    <AutoCompleteSelect
                      disabled
                      valueField="id"
                      data={stateCountry}
                      onChange={value => selectCountry(value)}
                    />
                  ) : (
                    <AutoCompleteSelect
                      valueField="id"
                      data={stateCountry}
                      onChange={value => selectCountry(value)}
                    />
                  )}
                </Form.Item>
                <Form.Item label="Аймаг, хот:" name="AimagID">
                  {isEditMode ? (
                    <AutoCompleteSelect
                      disabled
                      valueField="id"
                      data={stateAimag}
                      onChange={value => selectAimag(value)}
                    />
                  ) : (
                    <AutoCompleteSelect
                      valueField="id"
                      data={stateAimag}
                      onChange={value => selectAimag(value)}
                    />
                  )}
                </Form.Item>
                <Form.Item name="SoumID" layout="vertical" label="Сум, Дүүрэг:">
                  {isEditMode ? (
                    <AutoCompleteSelect
                      disabled
                      valueField="id"
                      data={stateSum}
                      onChange={value => selectSum(value)}
                    />
                  ) : (
                    <AutoCompleteSelect
                      valueField="id"
                      data={stateSum}
                      onChange={value => selectSum(value)}
                    />
                  )}
                </Form.Item>
                <Form.Item name="BagID" layout="vertical" label="Баг, Хороо:">
                  {isEditMode ? (
                    <AutoCompleteSelect
                      disabled
                      valueField="id"
                      data={stateBag}
                    />
                  ) : (
                    <AutoCompleteSelect valueField="id" data={stateBag} />
                  )}
                </Form.Item>
              </Col>
              <Col xs={24} md={24} lg={3} />
            </Row>
            <Row>
              <Col xs={24} md={24} lg={24}>
                <h1 className="title">1. Сургалтын зорилго</h1>
                <Form.Item name="ReportsAim">
                  <Input.TextArea
                    placeholder="(Сургалтын бэлтгэл, өмнө тодорхойлсон сургалтын хэрэгцээ, сургалтын үйл ажиллагааны зорилтын талаар мэдээлнэ үү)"
                    style={{
                      width: '100%',
                      height: '140px',
                    }}
                  />
                </Form.Item>
                <h1 className="title">
                  2. Сургалтын хөтөлбөр, төлөвлөгөөний дагуу гүйцэтгэсэн ажил,
                  сургалтын үйл явц:{' '}
                </h1>
                <Row gutter={[32, 32]}>
                  <Col xs={24} md={12} lg={12}>
                    <Input.TextArea
                      placeholder="(2.1. Суралцагчийн ирцийн мэдээлэл, нэгтгэл, дүгнэлт)"
                      style={{
                        width: '100%',
                        height: '140px',
                      }}
                    />
                  </Col>
                  <Col xs={24} md={12} lg={12}>
                    <Input.TextArea
                      placeholder="(2.2. Хичээлийн явц, сургалтын хэлбэр, аргачлал)"
                      style={{
                        width: '100%',
                        height: '140px',
                      }}
                    />
                  </Col>
                </Row>
                <Row gutter={[32, 32]} style={{ marginTop: '32px' }}>
                  <Col xs={24} md={12} lg={12}>
                    <Input.TextArea
                      placeholder="(2.3. Сургалтын тараах материал,  гарын авлагын тухай)"
                      style={{
                        width: '100%',
                        height: '140px',
                      }}
                    />
                  </Col>
                  <Col xs={24} md={12} lg={12}>
                    <Input.TextArea
                      placeholder="(2.4. Сургалтын танхим, зохион байгуулалтын тухай)"
                      style={{
                        width: '100%',
                        height: '140px',
                      }}
                    />
                  </Col>
                </Row>
                <h1 className="title">3. Амжилт, бэрхшээлийн тойм</h1>

                <Form.Item name="ReportsSuccessOverview">
                  <Input.TextArea
                    placeholder="(Суралцагчид сургалтыг хэрхэн хүлээн авсан, сургалт бодит хэрэгцээг  хангасан эсэх, тулгарсан бэрхшээл, хэрхэн шийдвэрлэсэн тухай, сургалтын үнэлгээний санал асуулгын дүн  г.м.)"
                    style={{
                      width: '100%',
                      height: '140px',
                    }}
                  />
                </Form.Item>

                <h1 className="title">4. Гарсан үр дүн</h1>
                <Form.Item name="ReportsResult">
                  <Input.TextArea
                    placeholder="(Суралцагчид сургалтыг хэрхэн хүлээн авсан, сургалт бодит хэрэгцээг  хангасан эсэх, тулгарсан бэрхшээл, хэрхэн шийдвэрлэсэн тухай, сургалтын үнэлгээний санал асуулгын дүн  г.м.)"
                    style={{
                      width: '100%',
                      height: '140px',
                    }}
                  />
                </Form.Item>

                <h1 className="title">5. Зөвлөмж</h1>
                <Form.Item name="ReportsTips">
                  <Input.TextArea
                    placeholder="((Үйлчлүүлэгчдэд шаардлагатай цаашдын сургалт/зөвлөгөө зэрэг)"
                    style={{
                      width: '100%',
                      height: '140px',
                    }}
                  />
                </Form.Item>
                <h1 className="title">6. Зураг, хавсралт файл</h1>
                <Form.Item>
                  <Upload {...props}>
                    <Button
                      icon={<UploadOutlined />}
                      style={{ height: '40px' }}
                    >
                      Зураг, хавсралт файл
                    </Button>
                  </Upload>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </ContentWrapper>
      </Modal>
    </div>
  );
}
