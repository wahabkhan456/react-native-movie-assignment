import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Layout from '../../components/Movies/Single';

class MovieSingleContainer extends Component {
  constructor() {
    super();
    this.state = { loading: false, error: null, movie: {} };
  }

  componentDidMount = () => this.fetchData();

  /**
   * Fetch Data
   */
  fetchData = async () => {
    const { fetchData, route } = this.props;
    const id = route?.params?.id;
    this.setState({ loading: true, error: null });

    try {
      const movie = await fetchData(id);
      // console.log("movie========",movie)
      this.setState({ loading: false, error: null, movie });
    } catch (err) {
      this.setState({ loading: false, error: err.message, movies: {} });
    }
  };

  /**
   * Render
   */
  render = () => {
    const { loading, error, movie } = this.state;

    return <Layout loading={loading} error={error} movie={movie} reFetch={this.fetchData} />;
  };
}

MovieSingleContainer.propTypes = {
  fetchData: PropTypes.func.isRequired,
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

MovieSingleContainer.defaultProps = {
  id: null,
};

const mapStateToProps = () => ({});

const mapDispatchToProps = (dispatch) => ({
  fetchData: dispatch.movies.fetchSingle,
});

export default connect(mapStateToProps, mapDispatchToProps)(MovieSingleContainer);
