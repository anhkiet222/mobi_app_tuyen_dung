import React from "react";
import CandidateSetting from "../../components/User/CandidateSetting";
import SafeAreaWrapper from "../../components/SafeAreaWrapper";
import EmployerSetting from "../../components/User/EmployerSetting";
const user = () => {
  const { userData } = useContext(AuthContext);
  return (
    <SafeAreaWrapper>
      {userData ? <CandidateSetting /> : <EmployerSetting />}
    </SafeAreaWrapper>
  );
};

export default user;
