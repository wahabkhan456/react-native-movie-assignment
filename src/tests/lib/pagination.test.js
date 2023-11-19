import pagination from '../../lib/pagination';

it('lib/pagination: pagination returns correctly', () => {
  const threePages = pagination(3, '/movies/');
  expect(threePages).toEqual([
    { title: 1, link: '/movies/' },
    { title: 2, link: '/movies/2' },
    { title: 3, link: '/movies/3' },
  ]);

  // No links when only 1 page
  const onePage = pagination({ last_page: 1 }, '/movies/');
  expect(onePage).toEqual([]);
});
