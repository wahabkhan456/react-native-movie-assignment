import React from 'react';
import renderer from 'react-test-renderer';
import { render } from '@testing-library/react-native';
import MoviesList from '../../../components/Movies/List';
import { errorMessages } from '../../../constants/messages';

it('<MoviesList /> shows a nice error message', () => {
  const Component = <MoviesList list={[]} />;

  // Matches snapshot
  expect(renderer.create(Component).toJSON()).toMatchSnapshot();

  // Has the correct text on the page
  const { getByText } = render(Component);
  expect(getByText(errorMessages.moviesEmpty));
});

it('<MoviesList /> shows a list of movies correctly', () => {
  const listItem = {
    id: 0,
    name: 'ABC',
    excerpt: 'DEF',
    contentRaw: 'DEF',
    date: '22/33/44',
  };

  const Component = <MoviesList listFlat={[listItem]} />;

  // Matches snapshot
  expect(renderer.create(Component).toJSON()).toMatchSnapshot();

  // Has the correct text on the page
  const { getByText } = render(Component);
  expect(getByText(listItem.name));
});
