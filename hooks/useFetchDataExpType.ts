import { fetchDataExpType } from "@/api/jobApi";
import { useEffect, useState } from "react";

const useFetchDataExpType = () => {
  const [dataExpType, setDataExpType] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetchDataExpType();
        setDataExpType(res);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);
  return { dataExpType, loading };
};

export { useFetchDataExpType };
