import { getImageUrl } from '../../lib/images';

it('lib/string: getImageUrl returns correctly', () => {
  expect(getImageUrl({
    _embedded: {
      'wp:featuredmedia': [{
        media_details: {
          sizes: {
            full: {
              source_url: 'https://image.tmdb.org/t/p/w500/5cnLoWq9o5tuLe1Zq4BTX4LwZ2B.jpg',
            },
          },
        },
      }],
    },
  })).toEqual('https://image.tmdb.org/t/p/w500/5cnLoWq9o5tuLe1Zq4BTX4LwZ2B.jpg');
});
