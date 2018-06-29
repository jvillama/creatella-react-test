import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { GridList, Card, CardTitle, CardText, Media } from "react-md";
import Loading from "./Loading";

class ProductsList extends Component {
  constructor(props) {
    super(props);

    this.convertDate = this.convertDate.bind(this);
  }
  convertDate(date) {
    const dateMils = Date.parse(date);

    const weekMils = 604800000;
    const dayMils = 86400000;
    const hourMils = 3600000;
    const minMils = 60000;
    const secMils = 1000;
    const nowMils = Date.now() - dateMils;
    if (nowMils <= weekMils && nowMils >= dayMils) {
      // console.log(Math.floor(nowMils/dayMils))
      return Math.floor(nowMils / dayMils) + " day(s) ago";
    } else if (nowMils <= dayMils && nowMils >= hourMils) {
      // console.log(Math.floor(nowMils/hourMils))
      return Math.floor(nowMils / hourMils) + " hour(s) ago";
    } else if (nowMils <= hourMils && nowMils >= minMils) {
      // console.log(Math.floor(nowMils/minMils))
      return Math.floor(nowMils / minMils) + " min(s) ago";
    } else if (nowMils <= minMils && nowMils >= secMils) {
      // console.log(Math.floor(nowMils/secMils))
      return Math.floor(nowMils / secMils) + " sec(s) ago";
    }
    return date;
  }
  render() {
    return (
      <GridList container="pictures" size={4} component="section">
        {this.props.products.map(product => {
          if (product.hasOwnProperty("media")) {
            return (
              <Card key={product.media}>
                <Media>
                  <img
                    className="ad"
                    alt=""
                    src={"http://localhost:3000/ads/?r=" + product.adNum}
                  />
                </Media>
              </Card>
            );
          }
          return (
            <Card key={product.id}>
              <CardTitle title={product.id} />
              <CardText style={{ fontSize: product.size, height: "120px" }}>
                {product.face}
              </CardText>
              <CardText>${(product.price / 100).toFixed(2)}</CardText>
              <CardText style={{ fontSize: "10px" }}>
                {this.convertDate(product.date)}
              </CardText>
            </Card>
          );
        })}
        {this.props.loading && <Loading />}
      </GridList>
    );
  }
}

ProductsList.propTypes = {
  products: PropTypes.array.isRequired,
  loading: PropTypes.bool.isRequired,
};

// ProductsList.defaultProps = {
//   products: [],
//   loading: true
// };

export default ProductsList;