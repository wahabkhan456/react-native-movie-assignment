import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Layout from '../../components/Movies/FavouriteList';

class FavouriteListContainer extends Component {
  constructor(props) {
    super();

    // Prioritize (web) page route over last meta value
    const page = props.page || props.meta.page;

    this.state = {
      error: null, loading: false, page: parseInt(page, 10) || 1,
    };
  }

  /**
   * Render
   */
  render = () => {
    const { listFlat, listPaginated, pagination, meta, data, addItemToFavouriteList, navigation } = this.props;
    const { loading, error, page } = this.state;
    return (
      <Layout
        page={page}
        meta={meta}
        error={error}
        loading={loading}
        listFlat={listFlat}
        listPaginated={listPaginated}
        pagination={pagination}
        navigation={navigation}
        addItemToFavouriteList={addItemToFavouriteList}
      />
    );
  };
}

FavouriteListContainer.propTypes = {
  listFlat: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
  listPaginated: PropTypes.shape({}).isRequired,
  meta: PropTypes.shape({
    page: PropTypes.number,
  }).isRequired,
  fetchData: PropTypes.func.isRequired,
  pagination: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  page: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

FavouriteListContainer.defaultProps = {
  page: 1,
};

const mapStateToProps = (state) => ({
  data: state,
  listFlat: state.movies.favourites || [],
  listPaginated: state.movies.listPaginated || {},
  meta: state.movies.meta || [],
  pagination: state.movies.pagination || {},
});

const mapDispatchToProps = (dispatch) => ({
  fetchData: dispatch.movies.fetchList,
  addItemToFavouriteList: dispatch.movies.addItemToFavouriteList
});

export default connect(mapStateToProps, mapDispatchToProps)(FavouriteListContainer);
