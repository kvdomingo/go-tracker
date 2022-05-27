import { useState } from "react";
import { AxiosError } from "axios";
import { Provider } from "../types/provider";
import api from "../index";

function useGetProviders() {
  const [data, setData] = useState<Provider[]>([]);
  const [error, setError] = useState<AxiosError | null>(null);
  const [loading, setLoading] = useState(false);

  function getProviders() {
    const debounceLoadingAnimation = setTimeout(() => setLoading(true), 500);
    api
      .get("/provider")
      .then(res => setData(res.data))
      .catch(err => setError(err))
      .finally(() => {
        clearTimeout(debounceLoadingAnimation);
        setLoading(false);
      });
  }

  return { data, error, loading, getProviders };
}

export default useGetProviders;
