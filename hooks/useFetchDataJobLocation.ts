import { getAllCodeJobLocation } from "@/api/postApi";
import { useEffect, useState } from "react";

const useFetchDataJobLocation = () => {
  const [dataJobLocation, setDataJobLocation] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await getAllCodeJobLocation();
        setDataJobLocation(res);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);
  return { dataJobLocation, loading };
};

export { useFetchDataJobLocation };
