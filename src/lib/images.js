import config from "../constants/config";

// eslint-disable-next-line
export const getImageUrl = (item) => (
  (item.poster_path
    && `${config.imageBaseUrl}/${item.poster_path}`)
    || null
  );
