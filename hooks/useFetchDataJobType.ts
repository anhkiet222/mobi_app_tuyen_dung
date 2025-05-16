import { getAllCodeJobType } from "@/api/postApi";
import { useEffect, useState } from "react";

const useFetchDataJobType = () => {
  const [dataJobType, setDataJobType] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await getAllCodeJobType();
        setDataJobType(res);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);
  return { dataJobType, loading };
};

export { useFetchDataJobType };
