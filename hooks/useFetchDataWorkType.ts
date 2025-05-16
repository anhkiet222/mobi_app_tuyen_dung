import { getAllCodeWorkType } from "@/api/postApi";
import { useEffect, useState } from "react";

const useFetchDataWorkType = () => {
  const [dataWorkType, setDataWorkType] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await getAllCodeWorkType();
        setDataWorkType(res);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);
  return { dataWorkType, loading };
};

export { useFetchDataWorkType };
