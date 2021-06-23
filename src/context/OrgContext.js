import React, { useState } from "react";

const OrgContext = React.createContext();

export const OrgStore = (props) => {
  const [mainState, setMainState] = useState({
    refOrgTypeId: 2,
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
    orgCategories: [],
    orgCategorySubs: [],
    stateEnterprises: [],
  });
  const [fileState, setFileState] = useState({});
  const [contactState, setContactState] = useState([{}, {}]);
  const [branchState, setBranchState] = useState([{ key: 0 }]);
  const [errorFields, setErrorFields] = useState();
  const [isVisibleOrgModal, setIsVisibleOrgModal] = useState()
  const [orgCallType, setOrgCallType] = useState()
  const [previousInfo, setPreviousInfo] = useState({});
  const [fundedProject, setFundedProject] = useState();

  const setMain = (value) => {
    setMainState({ ...mainState, ...value });
  };

  return (
    <OrgContext.Provider
      value={{
        mainState, setMain,
        fileState, setFileState,
        contactState, setContactState,
        branchState, setBranchState,
        errorFields, setErrorFields,
        references, setReferences,
        isVisibleOrgModal, setIsVisibleOrgModal,
        previousInfo, setPreviousInfo,
        orgCallType, setOrgCallType,
        fundedProject, setFundedProject
      }}
    >
      {props.children}
    </OrgContext.Provider>
  );
};

export default OrgContext;
