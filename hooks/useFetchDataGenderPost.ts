import { useEffect, useState } from "react";
import { getAllCodeGenderPost } from "@/api/postApi";

const useFetchDataGenderPost = () => {
  const [dataGenderPost, setDataGenderPost] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await getAllCodeGenderPost();
        setDataGenderPost(res);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);
  return { dataGenderPost, loading };
};

export { useFetchDataGenderPost };
