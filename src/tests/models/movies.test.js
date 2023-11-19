import moment from 'moment';
import Api from '../../lib/api';
import model from '../../models/movies';
import { successMessages } from '../../constants/messages';

/**
 * Mocks
 */
jest.mock('axios');
afterEach(jest.resetAllMocks);

const mockInput = {
  title: { rendered: 'hello world' },
  content: { rendered: '<p>Hello there fellows</p>' },
  excerpt: { rendered: '<p>Hello there fellows</p>' },
  _embedded: {
    'wp:featuredmedia': [{
      media_details: {
        sizes: {
          full: {
            source_url: 'https://www.digitalsupply.co/wp-content/uploads/2018/03/glacier-blue.jpg',
          },
        },
      },
    }],
  },
  date: '2017-04-14T15:32:29',
  slug: 'using-open-source-software-to-build-your-instagram-followers',
  link: 'https://www.digitalsupply.co/using-open-source-software-to-build-your-instagram-followers/',
};

const mockOutput = {
  id: 0,
  name: 'Hello world',
  content: 'Hello there fellows',
  contentRaw: '<p>Hello there fellows</p>',
  excerpt: 'Hello there fellows',
  image: 'https://www.digitalsupply.co/wp-content/uploads/2018/03/glacier-blue.jpg',
  date: '14th Apr 2017',
  slug: 'using-open-source-software-to-build-your-instagram-followers',
  link: 'https://www.digitalsupply.co/using-open-source-software-to-build-your-instagram-followers/',
};

/**
 * Tests
 */
it('Movies fetchList() returns correctly', async () => {
  Api.get.mockResolvedValue({ data: [mockInput], headers: { 'x-wp-totalpages': 3 } });
  const initialState = { movies: { lastSync: {} } };
  const dispatch = { movies: { replace: jest.fn((res) => res) } };

  await model.effects(dispatch).fetchList({ page: 2 }, initialState).then((res) => {
    expect(Api.get).toHaveBeenCalledWith('/v2/posts?per_page=4&page=2&orderby=modified&_embed');
    expect(dispatch.movies.replace).toHaveBeenCalledTimes(1);
    expect(res).toEqual({
      data: [mockInput],
      headers: { 'x-wp-totalpages': 3 },
      page: 2,
    });
  });
});

it('Movies fetchList() does not go to API if lastSync just set', async () => {
  const initialState = { movies: { lastSync: { 2: moment() } } };
  await model.effects().fetchList({ page: 2 }, initialState).then((res) => expect(res).toEqual(true));
});

it('Movies fetchSingle() returns correctly', async () => {
  Api.get.mockResolvedValue({ data: mockInput });

  await model.effects().fetchSingle(222).then((res) => {
    expect(Api.get).toHaveBeenCalledWith('/v2/posts/222?_embed');
    expect(res).toEqual(mockOutput);
  });
});

it('Movies Model returns correctly', () => {
  expect(model.reducers.replace({}, {
    page: 1,
    headers: {
      'x-wp-totalpages': 2,
      'x-wp-total': 2,
    },
    data: [mockInput],
  })).toMatchObject({
    meta: {
      lastPage: 2,
      total: 2,
    },
    pagination: [
      { title: 1, link: '/movies/' },
      { title: 2, link: '/movies/2' },
    ],
    listPaginated: {
      1: [mockOutput],
    },
  });
});

it('Movies save() returns correctly', () => {
  const dispatch = { movies: { replaceUserInput: jest.fn((res) => res) } };

  model.effects(dispatch).save('hello@hello.com').then((res) => {
    expect(res).toEqual(successMessages.defaultForm);
  });
});

it('Movies Model Save returns correctly', () => {
  expect(model.reducers.replaceUserInput({
    meta: {
      lastPage: 2,
      total: 2,
    },
    pagination: [
      { title: 1, link: '/movies/' },
      { title: 2, link: '/movies/2' },
    ],
    listPaginated: {
      1: [mockOutput],
    },
  }, 'hello@hello.com')).toMatchObject({
    meta: {
      lastPage: 2,
      total: 2,
    },
    pagination: [
      { title: 1, link: '/movies/' },
      { title: 2, link: '/movies/2' },
    ],
    listPaginated: {
      1: [mockOutput],
    },
    userInput: 'hello@hello.com',
  });
});
