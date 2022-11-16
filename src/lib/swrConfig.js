import request from "./request";

const fetcher = (url) => request.get(url).then((res) => res.data);

const swrConfig = {
  fetcher,
  revalidateOnFocus: false,
};

export default swrConfig;
