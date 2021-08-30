import { Descriptions } from 'antd';
import React from 'react';
import { useProjectStore } from '../../../context/ProjectContext';
import ContentWrapper from '../../project/more/briefDraft.style';

function mainInfo() {
  const { ProjectList } = useProjectStore();

  return (
    <div>
      <ContentWrapper>
        <p style={{ fontSize: '18px' }}>Төслийн мэдээлэл</p>
        <Descriptions bordered column={1}>
          <Descriptions.Item
            label="Төслийн нэр"
            contentStyle={{ width: '65%' }}
          >
            {ProjectList.projectName}
          </Descriptions.Item>
          <Descriptions.Item label="Төсөл хэрэгжих байршил:">
            {ProjectList.address?.childrenAddress.map(z => (
              <p>
                {z.aimag.name}, {z.soum.name}
              </p>
            ))}
          </Descriptions.Item>
          <Descriptions.Item label="Төсөл хэрэгжүүлэх хугацаа">
            {ProjectList.period}
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
            {ProjectList.organization && ProjectList.organization.name}
          </Descriptions.Item>
          <Descriptions.Item label="Байгууллагын pегистрийн дугаар:">
            {ProjectList.organization &&
              ProjectList.organization.registerNumber}
          </Descriptions.Item>
          <Descriptions.Item label="Байгууллагын улсын бүртгэлийн гэрчилгээний дугаар">
            {ProjectList.organization &&
              ProjectList.organization.certificateNumber}
          </Descriptions.Item>
          <Descriptions.Item label="Байгуулагдсан он">
            {ProjectList.organization && ProjectList.organization.foundedYear}
          </Descriptions.Item>
          <Descriptions.Item label="Эрх бүхий этгээд / Холбогдох ажилтан нэр">
            {ProjectList.organization &&
              ProjectList.organization.responsibleUser.firstname}
          </Descriptions.Item>
          <Descriptions.Item label="Хаяг (Төв  оффис болон зорилтот сумд дахь салбарын хаяг)">
            {ProjectList.organization &&
              ProjectList.organization.address.country.name}
            ,{' '}
            {ProjectList.organization &&
              ProjectList.organization.address.aimag.name}
            ,{' '}
            {ProjectList.organization &&
              ProjectList.organization.address.soum.name}
            ,{' '}
            {ProjectList.organization &&
              ProjectList.organization.address.bag.name}
          </Descriptions.Item>
          <Descriptions.Item label="Утасны дугаар">
            {ProjectList.organization && ProjectList.organization.phone}
          </Descriptions.Item>
          <Descriptions.Item label="Цахим шуудангийн хаяг">
            {ProjectList.organization && ProjectList.organization.email}
          </Descriptions.Item>
        </Descriptions>

        <p style={{ fontSize: '18px', marginTop: '50px' }}>Бусад мэдээлэл</p>
        <Descriptions bordered column={1}>
          <Descriptions.Item
            label="Өргөдөл гаргагчийн туршлага болон үйл ажиллагааны чиглэл"
            contentStyle={{ width: '65%' }}
          >
            {ProjectList && ProjectList.expierenceActivity}
          </Descriptions.Item>
          <Descriptions.Item label="Өргөдөл гаргагчийн санал болгож буй үйл ажиллагааны чиглэл">
            {ProjectList && ProjectList.proposedActivity}
          </Descriptions.Item>
          <Descriptions.Item label="Хамтран ажиллах түншлэгч байгууллагатай бол үйл ажиллагааны төрөл болон бусад дэлгэрэнгүй мэдээлэл">
            {ProjectList && ProjectList.partnerActivity}
          </Descriptions.Item>
        </Descriptions>
      </ContentWrapper>
    </div>
  );
}

export default mainInfo;
