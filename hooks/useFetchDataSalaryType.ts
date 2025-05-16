import { getAllCodeSalaryType } from "@/api/postApi";
import { useEffect, useState } from "react";

const useFetchDataSalaryType = () => {
  const [dataSalaryType, setDataSalaryType] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await getAllCodeSalaryType();
        setDataSalaryType(res);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);
  return { dataSalaryType, loading };
};
export { useFetchDataSalaryType };
