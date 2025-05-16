import { getAllCodeJobLevel } from "@/api/postApi";
import { useEffect, useState } from "react";

const useFetchDataJobLevel = () => {
  const [dataJobLevel, setDataJobLevel] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await getAllCodeJobLevel();
        setDataJobLevel(res);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);
  return { dataJobLevel, loading };
};
export { useFetchDataJobLevel };
