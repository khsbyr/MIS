import moment from 'moment';
import React, { useContext, useEffect, useState } from 'react';
import { ToolsContext } from '../../context/Tools';
import { getService } from '../../service/service';
import { errorCatch } from '../../tools/Tools';
import './exportTraining.style.scss';

const ExportTraining = React.forwardRef((props, ref) => {
  const loadLazyTimeout = null;
  const toolsStore = useContext(ToolsContext);
  const [list, setList] = useState([]);

  function getQueryVariable(variable) {
    const query = window.location.search.substring(1);
    const vars = query.split('&');
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split('=');
      if (pair[0] === variable) {
        return pair[1];
      }
    }
    return false;
  }

  const onInit = () => {
    toolsStore.setIsShowLoader(true);
    if (loadLazyTimeout) {
      clearTimeout(loadLazyTimeout);
    }
    getService(
      `training/getTrainingForExport/${getQueryVariable('trainingId')}`
    )
      .then(result => {
        const listResult = result || [];
        setList(listResult);
      })
      .finally(toolsStore.setIsShowLoader(false))
      .catch(error => {
        errorCatch(error);
        toolsStore.setIsShowLoader(false);
      });
  };

  useEffect(() => {
    onInit();
  }, []);

  return (
    <>
      <div className="trainingExport" id="all" ref={ref}>
        <div className="headerExportTraining">
          <div>
            <img src="/images/svg/yam-logo.png" height="40px" />
          </div>
          <div>
            <img src="/images/svg/thworldbank-logo.png" height="35px" />
          </div>
          <div>
            <img src="/images/svg/logo.png" height="50px" />
          </div>
        </div>
        <div className="exportTbody">
          <div className="Guideline">
            <p className="redTitle">1. Сургалтын удирдамж</p>
            <p className="titleGuidelines">СУРГАЛТЫН УДИРДАМЖ</p>
            <p>
              <b>Сургалтын сэдэв:</b> {list?.training?.name}
            </p>
            <p>
              <b>Сургалтын зорилго:</b>{' '}
              {list?.training?.trainingGuidelines?.aim}
            </p>
            <p>
              <b>Сургалт зохион байгуулах үндэслэл:</b>{' '}
              {list?.training?.trainingGuidelines?.reason}
            </p>
            <p>
              <b>Хэрэгжүүлэх үйл ажиллагаа:</b>{' '}
              {list?.training?.trainingGuidelines?.operation}
            </p>
            <p>
              <b>Хүлээгдэж буй үр дүн:</b>{' '}
              {list?.training?.trainingGuidelines?.result}
            </p>
            <p>
              <b>Сургалт явуулах аймаг, сум:</b>{' '}
              {list?.training?.address?.childrenAddress?.map(z => (
                <>
                  {z.aimag.name} {z.soum.name},{' '}
                </>
              ))}
            </p>
          </div>

          <div className="Teachers">
            <div className="page-break" />
            <p className="redTitle">2. Сургалтын баг /Багш нарын АНКЕТ/</p>
            <p className="titleGuidelines">АНКЕТ</p>
            {list?.trainingTeamExportDTOs?.map(z => (
              <>
                <p className="subTitleExportTraining">
                  <b>1. Хувь хүний мэдээлэл:</b>
                </p>
                <div className="tabler">
                  <table className="tableTraining" align="center">
                    <tbody>
                      <tr className="tableTrTraining">
                        <td className="tableThTraining">Овог:</td>
                        <td className="tableThInfo">
                          {z.trainingTeam?.user?.lastname}
                        </td>
                        <td className="tableImage" rowSpan="7" width="10%">
                          <img
                            src={z.trainingTeam?.user?.trainers?.file?.path}
                            width={150}
                            height={150}
                            style={{
                              top: 100,
                            }}
                          />
                        </td>
                      </tr>
                      <tr className="tableTr">
                        <td className="tableThTraining">Нэр:</td>
                        <td className="tableThInfo">
                          {z.trainingTeam?.user?.firstname}
                        </td>
                      </tr>

                      <tr className="tableTr">
                        <td className="tableThTraining">Төрсөн он сар өдөр:</td>
                        <td className="tableThInfo">
                          {moment(
                            z.trainingTeam && z.trainingTeam?.user?.birthDate
                          ).format('YYYY-MM-DD')}
                        </td>
                      </tr>

                      <tr className="tableTr">
                        <td className="tableThTraining">Регистрийн дугаар:</td>
                        <td className="tableThInfo">
                          {z.trainingTeam?.user?.register}
                        </td>
                      </tr>

                      <tr className="tableTr">
                        <td className="tableThTraining">Хаяг:</td>
                        <td className="tableThInfo">
                          {z.trainingTeam?.user?.address?.country?.name},{' '}
                          {z.trainingTeam?.user?.address?.aimag?.name},{' '}
                          {z.trainingTeam?.user?.address?.soum?.name},{' '}
                          {z.trainingTeam?.user?.address?.bag?.name},{' '}
                          {z.trainingTeam?.user?.address?.addressDetail}
                        </td>
                      </tr>

                      <tr className="tableTr">
                        <td className="tableThTraining">Утас, факс:</td>
                        <td className="tableThInfo">
                          {z.trainingTeam?.user?.phoneNumber}
                        </td>
                      </tr>

                      <tr className="tableTr">
                        <td className="tableThTraining">Е-майл хаяг:</td>
                        <td className="tableThInfo">
                          {' '}
                          {z.trainingTeam?.user?.email}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="subTitleExportTraining">
                  <b>2. Ажлын зорилго:</b>{' '}
                  {z.trainingTeam?.user?.trainers?.purpose}
                </p>

                <p className="subTitleExportTraining">
                  <b>3. Боловсрол:</b>
                </p>

                <div className="tabler">
                  <table className="tableTraining" align="center">
                    <tbody>
                      <tr className="tableTrTraining">
                        <td className="tableThTrainingEducation">№</td>
                        <td className="tableThTrainingEducation">Зэрэг цол</td>
                        <td className="tableThTrainingEducation">
                          Их дээд сургуулийн нэр
                        </td>
                        <td className="tableThTrainingEducation">
                          Элссэн огноо
                        </td>
                        <td className="tableThTrainingEducation">
                          Төгссөн огноо
                        </td>
                      </tr>
                      {z.educations?.map((d, index1) => (
                        <tr>
                          <td className="tableThInfo1">{index1 + 1}</td>
                          <td className="tableThInfo1">{d.degree}</td>
                          <td className="tableThInfo1">{d.universityName}</td>
                          <td className="tableThInfo1">
                            {moment(d && d.enrolledDate).format('YYYY-MM-DD')}
                          </td>
                          <td className="tableThInfo1">
                            {moment(d && d.graduatedDate).format('YYYY-MM-DD')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="subTitleExportTraining">
                  <b>4. Ажлын туршлага:</b>
                </p>

                <div className="tabler">
                  <table className="tableTraining" align="center">
                    <tbody>
                      <tr className="tableTrTraining">
                        <td className="tableThTrainingEducation">№</td>
                        <td className="tableThTrainingEducation">
                          Албан тушаал
                        </td>
                        <td className="tableThTrainingEducation">
                          Байгууллагын нэр
                        </td>
                        <td className="tableThTrainingEducation">
                          Ажилд орсон огноо
                        </td>
                        <td className="tableThTrainingEducation">
                          Ажлаас гарсан огноо
                        </td>
                      </tr>
                      {z.expierences?.map((d, index1) => (
                        <tr>
                          <td className="tableThInfo1">{index1 + 1}</td>
                          <td className="tableThInfo1">{d.position}</td>
                          <td className="tableThInfo1">{d.organizationName}</td>
                          <td className="tableThInfo1">
                            {moment(d && d.hiredDate).format('YYYY-MM-DD')}
                          </td>
                          <td className="tableThInfo1">
                            {moment(d && d.firedDate).format('YYYY-MM-DD')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="subTitleExportTraining">
                  <b>5. Зөвлөх үйлчилгээний ажлын туршлага:</b>
                </p>

                <div className="tabler">
                  <table className="tableTraining" align="center">
                    <tbody>
                      <tr className="tableTrTraining">
                        <td className="tableThTrainingEducation">№</td>
                        <td className="tableThTrainingEducation">
                          Албан тушаал
                        </td>
                        <td className="tableThTrainingEducation">
                          Байгууллагын нэр
                        </td>
                        <td className="tableThTrainingEducation">
                          Ажилд орсон огноо
                        </td>
                        <td className="tableThTrainingEducation">
                          Ажлаас гарсан огноо
                        </td>
                      </tr>
                      {z.expierenceForAdvices?.map((d, index1) => (
                        <tr>
                          <td className="tableThInfo1">{index1 + 1}</td>
                          <td className="tableThInfo1">{d.position}</td>
                          <td className="tableThInfo1">{d.organizationName}</td>
                          <td className="tableThInfo1">
                            {moment(d && d.hiredDate).format('YYYY-MM-DD')}
                          </td>
                          <td className="tableThInfo1">
                            {moment(d && d.firedDate).format('YYYY-MM-DD')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="subTitleExportTraining">
                  <b>6. Багшийн ажлын туршлага:</b>
                </p>

                <div className="tabler">
                  <table className="tableTraining" align="center">
                    <tbody>
                      <tr className="tableTrTraining">
                        <td className="tableThTrainingEducation">№</td>
                        <td className="tableThTrainingEducation">
                          Албан тушаал
                        </td>
                        <td className="tableThTrainingEducation">
                          Байгууллагын нэр
                        </td>
                        <td className="tableThTrainingEducation">
                          Ажилд орсон огноо
                        </td>
                        <td className="tableThTrainingEducation">
                          Ажлаас гарсан огноо
                        </td>
                      </tr>
                      {z.expierenceForTeaches?.map((d, index1) => (
                        <tr>
                          <td className="tableThInfo1">{index1 + 1}</td>
                          <td className="tableThInfo1">{d.position}</td>
                          <td className="tableThInfo1">{d.organizationName}</td>
                          <td className="tableThInfo1">
                            {moment(d && d.hiredDate).format('YYYY-MM-DD')}
                          </td>
                          <td className="tableThInfo1">
                            {moment(d && d.firedDate).format('YYYY-MM-DD')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="subTitleExportTraining">
                  <b>
                    7. Хэвлүүлсэн бүтээл (Эрдэм шинжилгээ, судалгааны бүтээл,
                    ном гарын авлага, хэлэлцүүлсэн илтгэлүүд):
                  </b>
                </p>

                <div className="tabler">
                  <table className="tableTraining" align="center">
                    <tbody>
                      <tr className="tableTrTraining">
                        <td className="tableThTrainingEducation">№</td>
                        <td className="tableThTrainingEducation">
                          Бүтээлийн нэр
                        </td>
                        <td className="tableThTrainingEducation">Огноо</td>
                      </tr>
                      {z.publishedWorks?.map((d, index1) => (
                        <tr>
                          <td className="tableThInfo1">{index1 + 1}</td>
                          <td className="tableThInfo1">{d.name}</td>
                          <td className="tableThInfo1">
                            {moment(d && d.publishedDate).format('YYYY-MM-DD')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="subTitleExportTraining">
                  <b>
                    8. Өөрийн нэр дээр бүртгэлтэй оюуны өмч, гэрчилгээ, лиценз,
                    тусгай зөвшөөрөл:
                  </b>
                </p>

                <div className="tabler">
                  <table className="tableTraining" align="center">
                    <tbody>
                      <tr className="tableTrTraining">
                        <td className="tableThTrainingEducation">№</td>
                        <td className="tableThTrainingEducation">
                          Оюуны өмч, гэрчилгээ, лицензийн нэр
                        </td>
                        <td className="tableThTrainingEducation">
                          Олгосон байгууллагын нэр
                        </td>
                        <td className="tableThTrainingEducation">Огноо</td>
                      </tr>
                      {z.propertyLicenses?.map((d, index1) => (
                        <tr>
                          <td className="tableThInfo1">{index1 + 1}</td>
                          <td className="tableThInfo1">{d.propertyName}</td>
                          <td className="tableThInfo1">{d.licensedBy}</td>
                          <td className="tableThInfo1">
                            {moment(d && d.licensedDate).format('YYYY-MM-DD')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="subTitleExportTraining">
                  <b>
                    9. Гишүүнчлэл (Олон нийтийн болон төрийн бус байгууллагын
                    гишүүн эсэх):
                  </b>
                </p>

                <div className="tabler">
                  <table className="tableTraining" align="center">
                    <tbody>
                      <tr className="tableTrTraining">
                        <td className="tableThTrainingEducation">№</td>
                        <td className="tableThTrainingEducation">
                          Албан тушаал
                        </td>
                        <td className="tableThTrainingEducation">
                          Байгууллагын нэр
                        </td>
                        <td className="tableThTrainingEducation">Огноо</td>
                      </tr>
                      {z.memberships?.map((d, index1) => (
                        <tr>
                          <td className="tableThInfo1">{index1 + 1}</td>
                          <td className="tableThInfo1">{d.position}</td>
                          <td className="tableThInfo1">{d.organization}</td>
                          <td className="tableThInfo1">
                            {moment(d && d.enrolledDate).format('YYYY-MM-DD')}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="subTitleExportTraining">
                  <b>10. Ур чадвар:</b> {z.trainingTeam?.user?.trainers?.skill}
                  {/* <div className="page-break" /> */}
                </p>
              </>
            ))}
          </div>

          <div className="TrainingProgram">
            <div className="page-break" />
            <p className="redTitle">3. Сургалтын хөтөлбөр</p>
            <p className="titleGuidelines">
              МАЛЧДЫН БҮЛГИЙН СУРГАЛТЫН ХӨТӨЛБӨР
            </p>

            <div className="tabler">
              <table className="tableTraining" align="center">
                <tbody>
                  <tr className="tableTrTraining">
                    <th className="tableThTrainingProgram">Цаг</th>
                    <th className="tableThTrainingProgram">
                      Сургалтын хөтөлбөр
                    </th>
                    <th className="tableThTrainingProgram">Мэдээлэл</th>
                  </tr>
                  {list.trainingProgramDTOs?.map(d => (
                    <>
                      <tr>
                        <td
                          className="tableThInfo1"
                          colSpan="3"
                          style={{ textAlign: 'center', background: '#e8e8e8' }}
                        >
                          <b>
                            {moment(d && d.trainingProgram?.date).format(
                              'YYYY-MM-DD'
                            )}{' '}
                          </b>
                        </td>
                      </tr>
                      <tr>
                        <td
                          className="tableThInfo1"
                          colSpan="3"
                          style={{ textAlign: 'center', background: '#e8e8e8' }}
                        >
                          <b>{d.trainingProgram?.operation}</b>
                        </td>
                      </tr>
                      {d.trainingTopicList.map(k => (
                        <tr>
                          <td className="tableThInfo1">{k.time}</td>
                          <td className="tableThInfo1">{k.topic}</td>
                          <td className="tableThInfo1">
                            {k.resPersonTrainingTopics
                              .map(c => c.resPersonName)
                              .join(', ')}
                          </td>
                        </tr>
                      ))}
                    </>
                  ))}
                </tbody>
              </table>
            </div>

            <div
              style={{
                display: 'flex',
                paddingTop: '20px',
                paddingBottom: '50px',
              }}
            >
              <div style={{ width: '50%' }}>
                <h4>
                  <b>Боловсруулсан:</b>
                </h4>
              </div>
              <div style={{ width: '50%' }}>
                <h4>
                  <b>Хянасан:</b>
                </h4>
              </div>
            </div>
          </div>

          <div className="Participants">
            <div className="page-break" />

            <p className="redTitle">4. Сургалтын ирцийн бүртгэл</p>
            <p className="titleGuidelines">
              СУРГАЛТАД ОРОЛЦОГЧИЙН ИРЦИЙН БҮРТГЭЛ
            </p>
            <p>{list?.training?.name}</p>

            <div className="tabler">
              <table className="tableTraining" align="center">
                <tbody>
                  <tr className="tableTrTraining">
                    <td className="tableThTraining">Сургалтын сэдэв, нэр:</td>
                    <td className="tableThInfo">{list?.training?.name}</td>
                  </tr>
                  <tr className="tableTr">
                    <td className="tableThTraining">Огноо:</td>
                    <td className="tableThInfo">
                      {list?.training?.startDateFormat} -{' '}
                      {list?.training?.endDateFormat}
                    </td>
                  </tr>

                  <tr className="tableTr">
                    <td className="tableThTraining">Аймаг, сум:</td>
                    <td className="tableThInfo">
                      {list?.training?.address?.childrenAddress?.map(z => (
                        <>
                          {z.aimag.name} {z.soum.name},{' '}
                        </>
                      ))}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="tabler" style={{ marginTop: '20px' }}>
              <table className="tableTraining" align="center">
                <tbody>
                  <tr className="tableTrTraining">
                    <td className="tableThTrainingEducation">№</td>
                    <td className="tableThTrainingEducation">
                      Суралцагчийн нэр
                    </td>
                    <td className="tableThTrainingEducation">
                      Регистрийн дугаар
                    </td>
                    <td className="tableThTrainingEducation">Нас</td>
                    <td className="tableThTrainingEducation">Хүйс</td>
                    <td className="tableThTrainingEducation">Утас</td>
                    {/* <td className="tableThTrainingEducation">И-мэйл хаяг</td> */}
                    <td className="tableThTrainingEducation">Ирцийн хувь</td>
                    <td className="tableThTrainingEducation">Гарын үсэг</td>
                  </tr>
                  {list.trainingParticipants?.map((d, index1) => (
                    <tr>
                      <td className="tableThInfo1">{index1 + 1}</td>
                      <td className="tableThInfo1">
                        {d.participant?.user?.lastname}{' '}
                        {d.participant?.user?.firstname}
                      </td>
                      <td className="tableThInfo1">
                        {d.participant?.user?.register}
                      </td>
                      <td className="tableThInfo1">
                        {d.participant?.user?.age}
                      </td>
                      <td className="tableThInfo1">
                        {d.participant?.user?.gender.gender}
                      </td>
                      <td className="tableThInfo1">
                        {d.participant?.user?.phoneNumber}
                      </td>
                      {/* <td className="tableThInfo1">
                        {d.participant?.user?.email}
                      </td> */}
                      <td className="tableThInfo1">{d.percent}%</td>
                      <td className="tableThInfo1">
                        {/* {d.participant?.user?.email} */}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="tableTrTraining">
                    <td className="tableThInfo1" colSpan="9" align="right">
                      <b>Нийт хамрагдсан хүний тоо:</b>{' '}
                      {list?.trainingParticipants?.length}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          <div className="Report">
            <div className="page-break" />
            <p className="redTitle">5. Сургалтын тайлан</p>
            <p className="titleGuidelines">СУРГАЛТЫН ТАЙЛАН</p>
            <p>
              <b>1. ЗОРИЛГО:</b>{' '}
              {list?.training?.trainingReport?.reportsAim?.inputText}
            </p>
            <p>
              <b>
                2. Сургалтын хөтөлбөр, төлөвлөгөөний дагуу гүйцэтгэсэн ажил,
                сургалтын үйл явц:
              </b>{' '}
            </p>
            <p>
              2.1. Суралцагчийн ирцийн мэдээлэл, нэгтгэл, дүгнэлт:{' '}
              {
                list?.training?.trainingReport?.reportsPerformedProcess1
                  ?.inputText
              }
            </p>
            <p>
              2.2. Хичээлийн явц, сургалтын хэлбэр, аргачлал:{' '}
              {
                list?.training?.trainingReport?.reportsPerformedProcess2
                  ?.inputText
              }
            </p>
            <p>
              2.3. Сургалтын тараах материал, гарын авлагын тухай:{' '}
              {
                list?.training?.trainingReport?.reportsPerformedProcess3
                  ?.inputText
              }
            </p>
            <p>
              2.4. Сургалтын танхим, зохион байгуулалтын тухай:{' '}
              {
                list?.training?.trainingReport?.reportsPerformedProcess4
                  ?.inputText
              }
            </p>

            <p>
              <b>3. Амжилт, бэрхшээлийн тойм:</b>{' '}
              {
                list?.training?.trainingReport?.reportsSuccessOverview
                  ?.inputText
              }
            </p>

            <p>
              <b>4. Гарсан үр дүн:</b>{' '}
              {list?.training?.trainingReport?.reportsResult?.inputText}
            </p>

            <p>
              <b>5. Зөвлөмж:</b>{' '}
              {list?.training?.trainingReport?.reportsTips?.inputText}
            </p>
          </div>

          <div className="File">
            <div className="page-break" />
            <p className="redTitle">6. Сургалтын хавсралт материал</p>
            {list.trainingFiles?.map(z => (
              <p style={{ display: 'list-item', marginLeft: '17px' }}>
                {z.description}
              </p>
            ))}
          </div>
        </div>
      </div>
    </>
  );
});

export default ExportTraining;
