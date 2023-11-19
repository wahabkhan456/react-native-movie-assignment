import React from 'react';
import renderer from 'react-test-renderer';
import { render } from '@testing-library/react-native';
import MovieSingle from '../../../components/Movies/Single';
import { errorMessages } from '../../../constants/messages';

it('<MovieSingle /> shows a nice error message', () => {
  const Component = <MovieSingle movie={{}} />;

  // Matches snapshot
  expect(renderer.create(Component).toJSON()).toMatchSnapshot();

  // Has the correct text on the page
  const { getByText } = render(Component);
  expect(getByText(errorMessages.movies404));
});

it('<MovieSingle /> shows an movie correctly', () => {
  const movie = {
    id: 0,
    name: 'ABC',
    excerpt: 'DEF',
    content: 'DEF',
    date: '22/33/44',
  };

  const Component = <MovieSingle movie={movie} />;

  // Matches snapshot
  expect(renderer.create(Component).toJSON()).toMatchSnapshot();

  // Has the correct text on the page
  const { getByText } = render(Component);
  expect(getByText(movie.name));
});
