import { useState } from "react";
import { AxiosError } from "axios";
import { GroupOrder } from "../types/groupOrder";
import api from "../index";

function useGetGroupOrders() {
  const [data, setData] = useState<GroupOrder[]>([]);
  const [error, setError] = useState<AxiosError | null>(null);
  const [loading, setLoading] = useState(false);

  function getGroupOrders() {
    const debounceLoadingAnimation = setTimeout(() => setLoading(true), 500);
    api
      .get("/order")
      .then(res => setData(res.data))
      .catch(err => setError(err))
      .finally(() => {
        clearTimeout(debounceLoadingAnimation);
        setLoading(false);
      });
  }

  return { data, error, loading, getGroupOrders };
}

export default useGetGroupOrders;
