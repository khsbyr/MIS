import { Descriptions } from 'antd';
import React, { useEffect, useState } from 'react';
import { useToolsStore } from '../../context/Tools';
import { getService } from '../../service/service';
import { errorCatch } from '../../tools/Tools';
import ContentWrapper from './more/briefDraft.style';

function mainInfo(props) {
  const [mainInfoRow, setMainInfoRow] = useState({});
  const { setIsShowLoader } = useToolsStore();

  useEffect(() => {
    setIsShowLoader(true);
    getService(`/project/get/${props.projectId}`)
      .then(result => {
        setMainInfoRow(result);
      })
      .finally(setIsShowLoader(false))
      .catch(error => {
        errorCatch(error);
        setIsShowLoader(false);
      });
  }, []);
  return (
    <div>
      <ContentWrapper>
        <p style={{ fontSize: '18px' }}>Төслийн мэдээлэл</p>
        <Descriptions bordered column={1}>
          <Descriptions.Item
            label="Төслийн нэр"
            contentStyle={{ width: '65%' }}
          >
            {mainInfoRow.projectName}
          </Descriptions.Item>
          <Descriptions.Item label="Төсөл хэрэгжих байршил:">
            {' '}
            {mainInfoRow.address && mainInfoRow.address.country.name},{' '}
            {mainInfoRow.address && mainInfoRow.address.aimag.name},{' '}
            {mainInfoRow.address && mainInfoRow.address.soum.name},{' '}
            {mainInfoRow.address && mainInfoRow.address.bag.name}
          </Descriptions.Item>
          <Descriptions.Item label="Төсөл хэрэгжүүлэх хугацаа">
            {mainInfoRow.period}
          </Descriptions.Item>
        </Descriptions>

        <p style={{ fontSize: '18px', marginTop: '50px' }}>
          Байгууллагын мэдээлэл
        </p>
        <Descriptions bordered column={1}>
          <Descriptions.Item
            label="Байгууллагын нэр"
            contentStyle={{ width: '65%' }}
          >
            {mainInfoRow.organization && mainInfoRow.organization.name}
          </Descriptions.Item>
          <Descriptions.Item label="Байгууллагын pегистрийн дугаар:">
            {mainInfoRow.organization &&
              mainInfoRow.organization.registerNumber}
          </Descriptions.Item>
          <Descriptions.Item label="Байгууллагын улсын бүртгэлийн гэрчилгээний дугаар">
            {mainInfoRow.organization &&
              mainInfoRow.organization.certificateNumber}
          </Descriptions.Item>
          <Descriptions.Item label="Байгуулагдсан он">
            {mainInfoRow.organization && mainInfoRow.organization.foundedYear}
          </Descriptions.Item>
          <Descriptions.Item label="Эрх бүхий этгээд / Холбогдох ажилтан нэр">
            {mainInfoRow.organization &&
              mainInfoRow.organization.responsibleUser.firstname}
          </Descriptions.Item>
          <Descriptions.Item label="Хаяг (Төв  оффис болон зорилтот сумд дахь салбарын хаяг)">
            {mainInfoRow.organization &&
              mainInfoRow.organization.address.country.name}
            ,{' '}
            {mainInfoRow.organization &&
              mainInfoRow.organization.address.aimag.name}
            ,{' '}
            {mainInfoRow.organization &&
              mainInfoRow.organization.address.soum.name}
            ,{' '}
            {mainInfoRow.organization &&
              mainInfoRow.organization.address.bag.name}
          </Descriptions.Item>
          <Descriptions.Item label="Утасны дугаар">
            {mainInfoRow.organization && mainInfoRow.organization.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Цахим шуудангийн хаяг">
            {mainInfoRow.organization && mainInfoRow.organization.email}
          </Descriptions.Item>
        </Descriptions>

        <p style={{ fontSize: '18px', marginTop: '50px' }}>Бусад мэдээлэл</p>
        <Descriptions bordered column={1}>
          <Descriptions.Item
            label="Өргөдөл гаргагчийн туршлага болон үйл ажиллагааны чиглэл"
            contentStyle={{ width: '65%' }}
          >
            {mainInfoRow && mainInfoRow.expierenceActivity}
          </Descriptions.Item>
          <Descriptions.Item label="Өргөдөл гаргагчийн санал болгож буй үйл ажиллагааны чиглэл">
            {mainInfoRow && mainInfoRow.proposedActivity}
          </Descriptions.Item>
          <Descriptions.Item label="Хамтран ажиллах түншлэгч байгууллагатай бол үйл ажиллагааны төрөл болон бусад дэлгэрэнгүй мэдээлэл">
            {mainInfoRow && mainInfoRow.partnerActivity}
          </Descriptions.Item>
        </Descriptions>
      </ContentWrapper>
    </div>
  );
}

export default mainInfo;
