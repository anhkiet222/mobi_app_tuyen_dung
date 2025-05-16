import { getRuleUser } from "../api/userApi";
import { useEffect, useState } from "react";

const useFetchRuleUser = () => {
  const [dataRulesUser, setRulesUser] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await getRuleUser();
        setRulesUser(res);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);
  return { dataRulesUser, loading };
};
export { useFetchRuleUser };
