import React from 'react';
import PropTypes from 'prop-types';
import { Image } from 'react-native';
import {
  Container, Content, Card, CardItem, Body, H3, Text,
} from 'native-base';
import { Loading, Error, Spacer } from '../UI';
import { errorMessages } from '../../constants/messages';

const MovieSingle = ({
  error, loading, movie, reFetch,
}) => {
  if (error) {
    return <Error content={error} tryAgain={reFetch} />;
  }

  if (loading) {
    return <Loading content={loading} />;
  }

  if (Object.keys(movie).length < 1) {
    return <Error content={errorMessages.movies404} />;
  }

  return (
    <Container>
      <Content padder>
        {!!movie.image && (
          <Image
            source={{ uri: movie.image }}
            style={{
              height: 200,
              width: '100%',
              flex: 1
            }}
          />
        )}

        <Spacer size={25} />
        <H3>{movie.name}</H3>
        <Spacer size={15} />

        {!!movie.content && (
          <Card>
            <CardItem header bordered>
              <Text>Content</Text>
            </CardItem>
            <CardItem>
              <Body>
                <Text>{movie.content}</Text>
              </Body>
            </CardItem>
          </Card>
        )}
        <Spacer size={20} />
      </Content>
    </Container>
  );
};

MovieSingle.propTypes = {
  error: PropTypes.string,
  loading: PropTypes.bool,
  movie: PropTypes.shape(),
  reFetch: PropTypes.func,
};

MovieSingle.defaultProps = {
  error: null,
  loading: false,
  movie: {},
  reFetch: null,
};

export default MovieSingle;
