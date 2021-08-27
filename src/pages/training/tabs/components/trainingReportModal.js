import { UploadOutlined } from '@ant-design/icons';
import { Button, Col, Form, Input, message, Modal, Row, Upload } from 'antd';
import React, { useEffect, useState } from 'react';
import { useToolsStore } from '../../../../context/Tools';
import { postService, putService } from '../../../../service/service';
import { errorCatch } from '../../../../tools/Tools';
import validateMessages from '../../../../tools/validateMessage';
import { useTrainingStore } from '../../../../context/TrainingContext';
import ContentWrapper from './trainingReport.style';

export default function TrainingReportModal(props) {
  const { TrainingReportController, isModalVisible, isEditMode, trainingIDD } =
    props;
  const [form] = Form.useForm();
  const toolsStore = useToolsStore();
  const [reportsAimID] = useState();
  const [tipsID] = useState();
  const [resultID] = useState();
  const [successID] = useState();
  const [performedProcess1ID] = useState();
  const [performedProcess2ID] = useState();
  const [performedProcess3ID] = useState();
  const [performedProcess4ID] = useState();
  const { TrainingList } = useTrainingStore();

  useEffect(() => {
    if (isEditMode) {
      form.setFieldsValue({
        ...TrainingReportController,
        CountryID: TrainingList.address.childrenAddress.map(z => z.soum.name),
        TrainingName: TrainingList && TrainingList?.name,
        TotalParticipants: TrainingList && TrainingList?.totalParticipants,
        ResponsibleUserName:
          TrainingList &&
          TrainingList?.organization?.responsibleUser?.firstname,
        PerformanceBudget:
          TrainingList && TrainingList?.trainingBudget?.performanceBudget,
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

  const save = () => {
    form
      .validateFields()
      .then(values => {
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
            initialValues={{
              name: TrainingList.name,
              TotalParticipants: TrainingList.totalParticipants,
              ResponsibleUserName:
                TrainingList.organization.responsibleUser.firstname,
              PerformanceBudget: TrainingList.trainingBudget.performanceBudget,
              CountryID: TrainingList.address.childrenAddress.map(
                z => z.soum.name
              ),
              AimagID: TrainingList.address.aimag,
              SoumID: TrainingList.address.soum,
              BagID: TrainingList.address.bag,
            }}
          >
            <Row gutter={[72]}>
              <Col xs={24} md={24} lg={12}>
                <Form.Item label="Сургалтын нэр:" name="name">
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
                <Form.Item
                  label="Сургалтад хамрагдсан:"
                  name="TotalParticipants"
                >
                  <Input className="FormItem" disabled />
                </Form.Item>
                <Form.Item label="Сургалт явагдсан газар:" name="CountryID">
                  <Input
                    className="FormItem"
                    disabled
                    valueField="id"
                    data={toolsStore.countryList}
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
                    <Form.Item
                      name="PerformedProcess1"
                      label="2.1. Суралцагчийн ирцийн мэдээлэл, нэгтгэл, дүгнэлт"
                    >
                      <Input.TextArea
                        placeholder="(Суралцагчийн ирцийн мэдээлэл, нэгтгэл, дүгнэлт...)"
                        style={{
                          width: '100%',
                          height: '140px',
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12} lg={12}>
                    <Form.Item
                      name="PerformedProcess2"
                      label="2.2. Хичээлийн явц, сургалтын хэлбэр, аргачлал"
                    >
                      <Input.TextArea
                        placeholder="(Хичээлийн явц, сургалтын хэлбэр, аргачлал...)"
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
                    <Form.Item
                      name="PerformedProcess3"
                      label="2.3. Сургалтын тараах материал,  гарын авлагын тухай"
                    >
                      <Input.TextArea
                        placeholder="(Сургалтын тараах материал,  гарын авлагын тухай...)"
                        style={{
                          width: '100%',
                          height: '140px',
                        }}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12} lg={12}>
                    <Form.Item
                      name="PerformedProcess4"
                      label="2.4. Сургалтын танхим, зохион байгуулалтын тухай"
                    >
                      <Input.TextArea
                        placeholder="(Сургалтын танхим, зохион байгуулалтын тухай...)"
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
