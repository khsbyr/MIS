import { Col, Form, Input, message, Row } from 'antd';
import React, { useEffect } from 'react';
import { useProjectStore } from '../../../context/ProjectContext';
import { putService } from '../../../service/service';
import { errorCatch } from '../../../tools/Tools';
import validateMessages from '../../../tools/validateMessage';

const { TextArea } = Input;

function projectImplementer() {
  const [form] = Form.useForm();
  const { ProjectList } = useProjectStore();

  const applicantExpierence = value => {
    form.validateFields().then(values => {
      values.applicantExpierence = value;
      putService(
        `implementationManagementCapacity/update/${ProjectList.summaryBallotForm.implementationManagementCapacity.id}`,
        values
      )
        .then(() => {
          message.success('Амжилттай хадгаллаа');
        })
        .catch(error => {
          errorCatch(error);
        });
    });
  };

  const durationOfSimilarProject = value => {
    form.validateFields().then(values => {
      values.durationOfSimilarProject = value;
      putService(
        `implementationManagementCapacity/update/${ProjectList.summaryBallotForm.implementationManagementCapacity.id}`,
        values
      )
        .then(() => {
          message.success('Амжилттай хадгаллаа');
        })
        .catch(error => {
          errorCatch(error);
        });
    });
  };

  const expierenceWithEntrepreneurs = value => {
    form.validateFields().then(values => {
      values.expierenceWithEntrepreneurs = value;
      putService(
        `implementationManagementCapacity/update/${ProjectList.summaryBallotForm.implementationManagementCapacity.id}`,
        values
      )
        .then(() => {
          message.success('Амжилттай хадгаллаа');
        })
        .catch(error => {
          errorCatch(error);
        });
    });
  };

  const expierenceOfApplications = value => {
    form.validateFields().then(values => {
      values.expierenceOfApplications = value;
      putService(
        `implementationManagementCapacity/update/${ProjectList.summaryBallotForm.implementationManagementCapacity.id}`,
        values
      )
        .then(() => {
          message.success('Амжилттай хадгаллаа');
        })
        .catch(error => {
          errorCatch(error);
        });
    });
  };

  const recievedAssistance = value => {
    form.validateFields().then(values => {
      values.recievedAssistance = value;
      putService(
        `implementationManagementCapacity/update/${ProjectList.summaryBallotForm.implementationManagementCapacity.id}`,
        values
      )
        .then(() => {
          message.success('Амжилттай хадгаллаа');
        })
        .catch(error => {
          errorCatch(error);
        });
    });
  };

  const howCanbeMoreEfficient = value => {
    form.validateFields().then(values => {
      values.howCanbeMoreEfficient = value;
      putService(
        `implementationManagementCapacity/update/${ProjectList.summaryBallotForm.implementationManagementCapacity.id}`,
        values
      )
        .then(() => {
          message.success('Амжилттай хадгаллаа');
        })
        .catch(error => {
          errorCatch(error);
        });
    });
  };

  const benefitsOfSimilarProjects = value => {
    form.validateFields().then(values => {
      values.benefitsOfSimilarProjects = value;
      putService(
        `implementationManagementCapacity/update/${ProjectList.summaryBallotForm.implementationManagementCapacity.id}`,
        values
      )
        .then(() => {
          message.success('Амжилттай хадгаллаа');
        })
        .catch(error => {
          errorCatch(error);
        });
    });
  };

  useEffect(() => {
    form.setFieldsValue({
      ...ProjectList.summaryBallotForm,
      applicantExpierence:
        ProjectList.summaryBallotForm.implementationManagementCapacity
          ?.applicantExpierence,
      durationOfSimilarProject:
        ProjectList.summaryBallotForm.implementationManagementCapacity
          ?.durationOfSimilarProject,
      expierenceWithEntrepreneurs:
        ProjectList.summaryBallotForm.implementationManagementCapacity
          ?.expierenceWithEntrepreneurs,
      expierenceOfApplications:
        ProjectList.summaryBallotForm.implementationManagementCapacity
          ?.expierenceOfApplications,
      recievedAssistance:
        ProjectList.summaryBallotForm.implementationManagementCapacity
          ?.recievedAssistance,
      howCanbeMoreEfficient:
        ProjectList.summaryBallotForm.implementationManagementCapacity
          ?.howCanbeMoreEfficient,
      benefitsOfSimilarProjects:
        ProjectList.summaryBallotForm.implementationManagementCapacity
          ?.benefitsOfSimilarProjects,
    });
  }, []);

  return (
    <div>
      <h2 className="titleBrief">
        7. Төсөл хэрэгжүүлэгчийн менежментийн чадавхи, давуу тал
      </h2>
      <Form
        form={form}
        labelAlign="left"
        layout="vertical"
        name="nest-messages"
        validateMessages={validateMessages}
      >
        <Row gutter={[40, 30]}>
          <Col xs={24} md={24} lg={12}>
            <Form.Item name="applicantExpierence">
              <TextArea
                rows={4}
                placeholder="1. Өргөдөл гаргагч нь өнгөрсөн хугацаанд санал болгож буй төсөлтэй ижил эсвэл ойролцоо төсөл хэрэгжүүлж байсан туршлагатай эсэх?"
                onBlur={e => applicantExpierence(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={12}>
            <Form.Item name="durationOfSimilarProject">
              <TextArea
                rows={4}
                placeholder="2. Өнгөрсөн хугацаанд хэрэгжүүлсэн ижил төстэй төслийн хэрэгжсэн хугацаа"
                onBlur={e => durationOfSimilarProject(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={12}>
            <Form.Item name="expierenceWithEntrepreneurs">
              <TextArea
                rows={4}
                placeholder="3. Өнгөрсөн хугацаанд ижил төстэй төслүүдэд хамтарч ажилласан мах, сүү, ноос, ноолуурын нэмүү өртгийн сүлжээнд хамтран ажилласан малчид, мах, сүүний чиглэлийн аж ахуй эрхлэгч нартай хамтарч ажилласан туршлага юу вэ? "
                onBlur={e => expierenceWithEntrepreneurs(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={12}>
            <Form.Item name="expierenceOfApplications">
              <TextArea
                rows={4}
                placeholder="4. Гарал үүсэл мөшгих тогтолцоо, ШУ-ны ололтыг ХАА-д нэвтрүүлэх үйл ажиллагаа, малын эрүүл мэнд, маркетинг зэрэгт ашигласан технологийн дэвшлийн хэрэглээний туршлагын талаар дурдана уу. "
                onBlur={e => expierenceOfApplications(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={12}>
            <Form.Item name="recievedAssistance">
              <TextArea
                rows={4}
                placeholder="5. Танай компани/байгууллага төрийн болон олон улсын байгууллага, үндэсний ТББ, хөгжлийн болон арилжааны банкууд гэх зэрэг байгууллагуудаас хүлээн авч байсан аливаа санхүүгийн болон мэргэжлийн тусламж, дэмжлэгийг дурдана уу. "
                onBlur={e => recievedAssistance(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={12}>
            <Form.Item name="howCanbeMoreEfficient">
              <TextArea
                rows={4}
                placeholder="6. Санал болгож буй төсөл нь Засгийн газрын бодлого, хөтөлбөрийн хүрээнд хэрхэн хамаарах болон хөгжлийн байгууллагуудаас авсан өмнөх дэмжлэгийг энэ төслийн хүрээнд хэрхэн илүү үр дүнтэй болгож, үр өгөөжийг нь нэмэгдүүлж чадах вэ? "
                onBlur={e => howCanbeMoreEfficient(e.target.value)}
              />
            </Form.Item>
          </Col>
          <Col xs={24} md={24} lg={12}>
            <Form.Item name="benefitsOfSimilarProjects">
              <TextArea
                rows={4}
                placeholder="7. Өмнө нь хэрэгжүүлсэн ижил төстэй төсөл, хөтөлбөр нь өнөөгийн эрхэлж буй МАА-н үйл ажиллагаанд нөлөөлсөн үр дүн, ашиг шим юу байсан талаар дурдана уу? "
                onBlur={e => benefitsOfSimilarProjects(e.target.value)}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default projectImplementer;
