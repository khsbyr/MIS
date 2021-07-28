import React, { useState } from 'react';

const OrgContext = React.createContext();

export const OrgStore = props => {
  const rejectFields = {};
  const [mainState, setMainState] = useState({
    refOrgTypeId: null,
    refOrgTypeName: null,
    cityCode: null,
  });
  const [references, setReferences] = useState({
    cities: [],
    districts: [],
    countryTypes: [],
    cityTypes: [],
    infoTypes: [],
    centralBudget: [],
    locals: [],
    stateEnterprises: [],
  });
  const [fileState, setFileState] = useState([]);
  const [contactState, setContactState] = useState([{}, {}]);
  const [errorFields, setErrorFields] = useState();
  const [isVisibleOrgModal, setIsVisibleOrgModal] = useState();
  const [orgCallType, setOrgCallType] = useState();
  const [previousInfo, setPreviousInfo] = useState({});
  const [fundedProject, setFundedProject] = useState();

  const setMain = value => {
    setMainState({ ...mainState, ...value });
  };

  const onCheckFields = (e, field) => {
    if (e.target.checked) rejectFields[field] = e.target.checked;
    else delete rejectFields[field];
  };

  return (
    <OrgContext.Provider
      value={{
        mainState,
        setMain,
        fileState,
        setFileState,
        contactState,
        setContactState,
        errorFields,
        setErrorFields,
        references,
        setReferences,
        isVisibleOrgModal,
        setIsVisibleOrgModal,
        previousInfo,
        setPreviousInfo,
        orgCallType,
        setOrgCallType,
        fundedProject,
        setFundedProject,
        rejectFields,
        onCheckFields,
      }}
    >
      {props.children}
    </OrgContext.Provider>
  );
};

export default OrgContext;
