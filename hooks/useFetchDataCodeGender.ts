import { useEffect, useState } from "react";
import { fetchDataCodeGender } from "../api/userApi";

const useFetchDataCodeGender = () => {
  const [dataGender, setDataGender] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetchDataCodeGender();
        setDataGender(res);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);
  return { dataGender, loading };
};
export { useFetchDataCodeGender };
