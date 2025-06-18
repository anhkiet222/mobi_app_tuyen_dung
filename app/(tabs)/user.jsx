import CandidateSetting from "../../components/User/CandidateSetting";
import SafeAreaWrapper from "../../components/SafeAreaWrapper";
import EmployerSetting from "../../components/User/EmployerSetting";
import { useContext } from "react";
import { AuthContext } from "../../components/AuthContext";
const UserScreen = () => {
  const { userData } = useContext(AuthContext);
  return (
    <SafeAreaWrapper>
      {userData?.codeRoleAccount === "CANDIDATE" ? (
        <CandidateSetting />
      ) : (
        <EmployerSetting />
      )}
    </SafeAreaWrapper>
  );
};

export default UserScreen;
