import { UploadOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, Modal, Row, Upload, message } from 'antd';
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
  const {
    TrainingReportController,
    isModalVisible,
    isEditMode,
    orgID,
    trainingIDD,
  } = props;
  const [form] = Form.useForm();
  const [stateAimag, setStateAimag] = useState([]);
  const [stateSum, setStateSum] = useState([]);
  const [stateCountry, setStateCountry] = useState([]);
  const [stateBag, setStateBag] = useState([]);
  const [training, setTraining] = useState([]);
  const [trainingID, setTrainingID] = useState([]);
  const [guidelinesID, setGuidelinesID] = useState([]);
  const [reportsAimID, setReportsAimID] = useState([]);
  const [tipsID, setTipsID] = useState([]);
  const [resultID, setResultID] = useState([]);
  const [successID, setSuccessID] = useState([]);
  const [performedProcess1ID, setPerformedProcess1ID] = useState();
  const [performedProcess2ID, setPerformedProcess2ID] = useState();
  const [performedProcess3ID, setPerformedProcess3ID] = useState();
  const [performedProcess4ID, setPerformedProcess4ID] = useState();

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
        `soum/getList/${TrainingReportController.address.aimag.id}`
      ).then(result => {
        if (result) {
          setStateSum(result || []);
        }
      });
      getService(
        `bag/getList/${TrainingReportController.address.soum.id}`
      ).then(result => {
        if (result) {
          setStateBag(result || []);
        }
      });
    }

    if (isEditMode) {
      setTrainingID(TrainingReportController.id);
      setGuidelinesID(
        TrainingReportController.training_guidelines &&
          TrainingReportController.training_guidelines.id
      );
      setReportsAimID(
        TrainingReportController.trainingReport &&
          TrainingReportController.trainingReport.reportsAim.id
      );
      setTipsID(
        TrainingReportController.trainingReport &&
          TrainingReportController.trainingReport.reportsTips.id
      );
      setResultID(
        TrainingReportController.trainingReport &&
          TrainingReportController.trainingReport.reportsResult.id
      );
      setSuccessID(
        TrainingReportController.trainingReport &&
          TrainingReportController.trainingReport.reportsSuccessOverview.id
      );
      setPerformedProcess1ID(
        TrainingReportController.trainingReport &&
          TrainingReportController.trainingReport.reportsPerformedProcess1.id
      );
      setPerformedProcess2ID(
        TrainingReportController.trainingReport &&
          TrainingReportController.trainingReport.reportsPerformedProcess2.id
      );
      setPerformedProcess3ID(
        TrainingReportController.trainingReport &&
          TrainingReportController.trainingReport.reportsPerformedProcess3.id
      );
      setPerformedProcess4ID(
        TrainingReportController.trainingReport &&
          TrainingReportController.trainingReport.reportsPerformedProcess4.id
      );

      form.setFieldsValue({
        ...TrainingReportController,
        CountryID: TrainingReportController.address
          ? TrainingReportController.address.country.id
          : '',
        AimagID: TrainingReportController.address
          ? TrainingReportController.address.aimag.id
          : '',
        SoumID: TrainingReportController.address
          ? TrainingReportController.address.soum.id
          : '',
        BagID: TrainingReportController.address
          ? TrainingReportController.address.bag.id
          : '',
        TrainingName: TrainingReportController && TrainingReportController.name,
        TotalParticipants:
          TrainingReportController &&
          TrainingReportController.totalParticipants,
        ResponsibleUserName:
          TrainingReportController.organization.responsibleUser &&
          TrainingReportController.organization.responsibleUser.firstname,
        PerformanceBudget:
          TrainingReportController.trainingBudget &&
          TrainingReportController.trainingBudget.performanceBudget,
        ReportsAim:
          TrainingReportController.trainingReport &&
          TrainingReportController.trainingReport.reportsAim.inputText,
        ReportsSuccessOverview:
          TrainingReportController.trainingReport &&
          TrainingReportController.trainingReport.reportsSuccessOverview
            .inputText,
        ReportsResult:
          TrainingReportController.trainingReport &&
          TrainingReportController.trainingReport.reportsResult.inputText,
        ReportsTips:
          TrainingReportController.trainingReport &&
          TrainingReportController.trainingReport.reportsTips.inputText,
        PerformedProcess1:
          TrainingReportController.trainingReport &&
          TrainingReportController.trainingReport.reportsPerformedProcess1
            .inputText,
        PerformedProcess2:
          TrainingReportController.trainingReport &&
          TrainingReportController.trainingReport.reportsPerformedProcess2
            .inputText,
        PerformedProcess3:
          TrainingReportController.trainingReport &&
          TrainingReportController.trainingReport.reportsPerformedProcess3
            .inputText,
        PerformedProcess4:
          TrainingReportController.trainingReport &&
          TrainingReportController.trainingReport.reportsPerformedProcess4
            .inputText,
      });
    }
  }, []);

  const selectTraining = value => {
    getService(`training/get/${value}`).then(result => {
      if (result) {
        const selectedTraining = result;
        setTrainingID(selectedTraining.id);
        setGuidelinesID(
          selectedTraining.training_guidelines &&
            selectedTraining.training_guidelines.id
        );
        setReportsAimID(
          selectedTraining.reportsAim && selectedTraining.reportsAim.id
        );
        setTipsID(
          selectedTraining.reportsTips && selectedTraining.reportsTips.id
        );
        setResultID(
          selectedTraining.reportsResult && selectedTraining.reportsResult.id
        );
        setSuccessID(
          selectedTraining.reportsSuccessOverview &&
            selectedTraining.reportsSuccessOverview.id
        );
        setPerformedProcess1ID(
          selectedTraining.reportsPerformedProcess1 &&
            selectedTraining.reportsPerformedProcess1.id
        );
        setPerformedProcess2ID(
          selectedTraining.reportsPerformedProcess1 &&
            selectedTraining.reportsPerformedProcess2.id
        );
        setPerformedProcess3ID(
          selectedTraining.reportsPerformedProcess1 &&
            selectedTraining.reportsPerformedProcess3.id
        );
        setPerformedProcess4ID(
          selectedTraining.reportsPerformedProcess1 &&
            selectedTraining.reportsPerformedProcess4.id
        );

        form.setFieldsValue({
          ...selectedTraining,
          CountryID: selectedTraining && selectedTraining.address.country.id,
          AimagID: selectedTraining ? selectedTraining.address.aimag.id : '',
          SoumID: selectedTraining ? selectedTraining.address.soum.id : '',
          BagID: selectedTraining ? selectedTraining.address.bag.id : '',
          TrainingName: selectedTraining && selectedTraining.name,
          TotalParticipants:
            selectedTraining && selectedTraining.totalParticipants,
          PerformanceBudget:
            selectedTraining.trainingBudget &&
            selectedTraining.trainingBudget.performanceBudget,
          ResponsibleUserName:
            selectedTraining.organization &&
            selectedTraining.organization.responsibleUser.firstname,
        });
      }
    });
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

  const save = () => {
    form
      .validateFields()
      .then(values => {
        values.training = {
          id: trainingID,
          totalParticipants: values.TotalParticipants,
          organization: {
            id: orgID,
          },
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
        values.reportsAim = { id: reportsAimID, inputText: values.ReportsAim };
        values.reportsTips = { id: tipsID, inputText: values.ReportsTips };
        values.reportsResult = {
          id: resultID,
          inputText: values.ReportsResult,
        };
        values.reportsSuccessOverview = {
          id: successID,
          inputText: values.ReportsSuccessOverview,
        };
        values.reportsPerformedProcess1 = {
          id: performedProcess1ID,
          inputText: values.PerformedProcess1,
        };
        values.reportsPerformedProcess2 = {
          id: performedProcess2ID,
          inputText: values.PerformedProcess2,
        };
        values.reportsPerformedProcess3 = {
          id: performedProcess3ID,
          inputText: values.PerformedProcess3,
        };
        values.reportsPerformedProcess4 = {
          id: performedProcess4ID,
          inputText: values.PerformedProcess4,
        };
        if (isEditMode) {
          putService(
            `trainingReport/update/${TrainingReportController.trainingReport.id}`,
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
          postService(`trainingReport/post/${trainingIDD}`, values)
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
                <Form.Item
                  label="Сургалтын нэр:"
                  name="TrainingName"
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  {isEditMode ? (
                    <AutoCompleteSelect
                      disabled
                      valueField="id"
                      data={training}
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
                  <Input className="FormItem" disabled />
                </Form.Item>

                <Form.Item
                  label="Сургалт явуулсан байгууллага, хүний нэр:"
                  name="ResponsibleUserName"
                >
                  <Input className="FormItem" disabled />
                </Form.Item>

                <Form.Item label="Гүйцэтгэлийн төсөв:" name="PerformanceBudget">
                  <Input className="FormItem" disabled />
                </Form.Item>
              </Col>

              <Col xs={24} md={24} lg={12}>
                <Form.Item label="Сургалт явагдсан газар:" name="CountryID">
                  <AutoCompleteSelect
                    disabled
                    valueField="id"
                    data={stateCountry}
                    onChange={value => selectCountry(value)}
                  />
                </Form.Item>
                <Form.Item label="Аймаг, хот:" name="AimagID">
                  <AutoCompleteSelect
                    disabled
                    valueField="id"
                    data={stateAimag}
                    onChange={value => selectAimag(value)}
                  />
                </Form.Item>
                <Form.Item name="SoumID" layout="vertical" label="Сум, Дүүрэг:">
                  <AutoCompleteSelect
                    disabled
                    valueField="id"
                    data={stateSum}
                    onChange={value => selectSum(value)}
                  />
                </Form.Item>
                <Form.Item name="BagID" layout="vertical" label="Баг, Хороо:">
                  <AutoCompleteSelect
                    disabled
                    valueField="id"
                    data={stateBag}
                  />
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
                    <Form.Item name="PerformedProcess1">
                      <Input.TextArea
                        placeholder="(2.1. Суралцагчийн ирцийн мэдээлэл, нэгтгэл, дүгнэлт)"
                        style={{
                          width: '100%',
                          height: '140px',
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12} lg={12}>
                    <Form.Item name="PerformedProcess2">
                      <Input.TextArea
                        placeholder="(2.2. Хичээлийн явц, сургалтын хэлбэр, аргачлал)"
                        style={{
                          width: '100%',
                          height: '140px',
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[32, 32]} style={{ marginTop: '32px' }}>
                  <Col xs={24} md={12} lg={12}>
                    <Form.Item name="PerformedProcess3">
                      <Input.TextArea
                        placeholder="(2.3. Сургалтын тараах материал,  гарын авлагын тухай)"
                        style={{
                          width: '100%',
                          height: '140px',
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12} lg={12}>
                    <Form.Item name="PerformedProcess4">
                      <Input.TextArea
                        placeholder="(2.4. Сургалтын танхим, зохион байгуулалтын тухай)"
                        style={{
                          width: '100%',
                          height: '140px',
                        }}
                      />
                    </Form.Item>
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
                    placeholder="(Үйлчлүүлэгчдэд шаардлагатай цаашдын сургалт/зөвлөгөө зэрэг)"
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
