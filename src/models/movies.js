import { ToastAndroid } from 'react-native';
import moment from 'moment';
import Api from '../lib/api';
import HandleErrorMessage from '../lib/format-error-messages';
import initialState from '../store/movies';
import Config from '../constants/config';
import { getImageUrl } from '../lib/images';
import arrayRemoveItem from '../lib/removeItemFromArray';
import { ucfirst, stripHtml } from '../lib/string';
import { errorMessages, successMessages } from '../constants/messages';
import pagination from '../lib/pagination';
import AsyncStorage from '@react-native-community/async-storage';

const API_KEY = '22907ab1c4830499c6f448ee8846a29c';
/**
 * Transform the endpoint data structure into our redux store format
 * @param {obj} item
 */
const transform = (item) => {
  // console.log(item.id)
  return {
    id: item?.id || 0,
    name: item?.original_title ? ucfirst(item.original_title) : '',
    content: item?.overview ? ucfirst(item.overview) : '',
    contentRaw: item?.content && item?.content?.rendered,
    excerpt: item.excerpt && item.excerpt.rendered ? stripHtml(item.excerpt.rendered) : '',
    date: moment(item.release_date).format(Config.dateFormat) || '',
    slug: item.poster_path || null,
    link: item.poster_path || null,
    image: getImageUrl(item),
    voteAverage: item?.vote_average || null,
    popularity: item?.popularity && Math.round(item.popularity) || null,

  }
};

export default {
  namespace: 'movies',

  /**
   *  Initial state
   */
  state: initialState,

  /**
   * Effects/Actions
   */
  effects: (dispatch) => ({
    /**
     * Get a list from the API
     * @param {obj} rootState
     * @returns {Promise}
     */
    async fetchList({ forceSync = false, page = 1 } = {}, rootState) {
      const { movies = {} } = rootState;
      const { lastSync = {}, meta = {}, favourites } = movies;
      const { lastPage } = meta;

      // Only sync when it's been 5mins since last sync
      if (lastSync[page]) {
        if (!forceSync && moment().isBefore(moment(lastSync[page]).add(5, 'minutes'))) {
          return true;
        }
      }

      // We've reached the end of the list
      if (page && lastPage && page > lastPage) {
        throw HandleErrorMessage({ message: `Page ${page} does not exist` });
      }

      try {
        // I used with_genres = 27 it means id=27 we have some categories like action, romantic, horror etc 
        // So i hard code id=27 which means i am rendering only horror movies
        const response = await Api.get(`/discover/movie?api_key=${API_KEY}&with_genres=27`);
        const { data, headers } = response;
        return !data?.results || data?.results?.length < 1
          ? true
          : dispatch.movies.replace({ data: data.results, headers, page, endPage: data?.total_pages, totalResults: data?.total_results });
      } catch (error) {
        throw HandleErrorMessage(error);
      }
    },


    async addItemToFavouriteList(data) {
      try {
        if (!data) {
          throw new Error({ message: errorMessages.missingData });
        }

        dispatch.movies.replaceFavouriteList(data);
        return successMessages.defaultForm; // Message for the UI
      } catch (error) {
        throw HandleErrorMessage(error);
      }
    },


    /**
     * Get a single item from the API
     * @param {number} id
     * @returns {Promise[obj]}
     */
    async fetchSingle(id) {
      try {
        const response = await Api.get(`/movie/${id}?api_key=${API_KEY}`);
        const { data } = response;
        if (!data) {
          throw new Error({ message: errorMessages.movies404 });
        }

        return transform(data);
      } catch (error) {
        throw HandleErrorMessage(error);
      }
    },

  }),

  /**
   * Reducers
   */
  reducers: {
    /**
     * Replace list in store
     * @param {obj} state
     * @param {obj} payload
     */
    replace(state, payload) {

      let newList = null;
      const { data, headers, page, endPage, totalResults } = payload;

      // Loop data array, saving items in a usable format
      if (data && typeof data === 'object') {
        newList = data.map((item) => transform(item));
      }

      // Create our paginated and flat lists
      const listPaginated = page === 1 ? { [page]: newList } : { ...state.listPaginated, [page]: newList };
      const listFlat = Object.keys(listPaginated).map((k) => listPaginated[k]).flat() || [];

      return newList
        ? {
          ...state,
          listPaginated,
          listFlat,
          lastSync: page === 1
            ? { [page]: moment().format() }
            : { ...state.lastSync, [page]: moment().format() },
          meta: {
            page,
            lastPage: parseInt(endPage, 10) || null,
            total: parseInt(totalResults, 10) || null,
          },
          pagination: pagination(headers['x-wp-totalpages'], '/movies/'),
        }
        : initialState;
    },

    /**
     * Save favourite data
     * @param {obj} state
     * @param {obj} payload
    */
    replaceFavouriteList(state, payload) {
      const id = payload.id;
      let favourites = state.favourites;
      if (favourites && favourites.length != 0) {
        if (favourites.some(item => item.id === id)) {
          let updatedArray = arrayRemoveItem(state.favourites, id)
          ToastAndroid.showWithGravity(
            "Item removed",
            ToastAndroid.SHORT,
            ToastAndroid.CENTER
          );
          return {
            ...state,
            favourites: updatedArray,
          };
        } else {
          ToastAndroid.showWithGravity(
            "Item added",
            ToastAndroid.SHORT,
            ToastAndroid.CENTER
          );
          return {
            ...state,
            favourites: [...state.favourites, payload],
          };
        }
      }
      ToastAndroid.showWithGravity(
        "Item added",
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
      return {
        ...state,
        favourites: [...state.favourites, payload],
      };
    },
  },
};
