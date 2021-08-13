import {Component} from 'react'
// import {Redirect} from 'react-router-dom'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import ProductCard from '../ProductCard'
import Header from '../Header'

import './index.css'

const status = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class ProductItemDetails extends Component {
  state = {
    apiStatus: status.initial,
    productDetailsData: {},
    similarProductsData: [],
    orderCount: 1,
  }

  componentDidMount() {
    this.getProductItemDetails()
  }

  getProductItemDetails = async () => {
    this.setState({apiStatus: status.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const token = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const data = await response.json()
      //   console.log(data)

      const updatedData = {
        availability: data.availability,
        brand: data.brand,
        description: data.description,
        id: data.id,
        imageUrl: data.image_url,
        price: data.price,
        rating: data.rating,
        similarProducts: data.similar_products,
        title: data.title,
        totalReviews: data.total_reviews,
      }

      const similarProducts = updatedData.similarProducts.map(item => ({
        availability: item.availability,
        brand: item.brand,
        description: item.description,
        id: item.id,
        imageUrl: item.image_url,
        price: item.price,
        rating: item.rating,
        style: item.style,
        title: item.title,
        totalReviews: item.total_reviews,
      }))

      this.setState({
        productDetailsData: updatedData,
        similarProductsData: similarProducts,
        apiStatus: status.success,
      })
    } else {
      this.setState({apiStatus: status.failure})
    }
  }

  increaseOrderCount = () => {
    this.setState(prevState => ({orderCount: prevState.orderCount + 1}))
  }

  decreaseOrderCount = () => {
    this.setState(prevState => ({
      orderCount: prevState.orderCount > 1 ? prevState.orderCount - 1 : 1,
    }))
  }

  addToCart = () => {}

  redirectToProductsRoute = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderLoadingView = () => (
    <div testid="loader" className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="product-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="error view"
        className="product-failure-img"
      />
      <h1 className="product-failure-heading-text">Product Not Found</h1>
      <button
        type="button"
        onClick={this.redirectToProductsRoute}
        className="continue-shopping"
      >
        Continue Shopping
      </button>
    </div>
  )

  renderSimilarProducts = () => {
    const {similarProductsData} = this.state

    return (
      <div className="similar-products-container">
        <h1>Similar Products</h1>
        <ul className="similar-items">
          {similarProductsData.map(item => (
            <ProductCard productData={item} key={item.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderProductDetails = () => {
    const {productDetailsData, orderCount} = this.state
    const {
      title,
      price,
      brand,
      rating,
      totalReviews,
      description,
      imageUrl,
      similarProducts,
      availability,
    } = productDetailsData
    // console.log(productDetailsData)

    return (
      <>
        <div className="product-item-container">
          <img src={imageUrl} alt="product" className="product-image" />
          <div className="item-details">
            <h1 className="product-title">{title}</h1>
            <p className="product-price">Rs {price}/-</p>
            <div className="product-rating-review-container">
              <div className="product-ratings">
                <p className="product-rating">{rating}</p>
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                  alt="star"
                  className="star"
                />
              </div>
              <p className="reviews">
                {totalReviews === undefined ? 'No Reviews' : totalReviews}{' '}
                Reviews
              </p>
            </div>
            <p className="description">{description}</p>
            <p className="availability">Available: {availability}</p>
            <p className="brand">Brand: {brand}</p>
            <hr />
            <div className="order-count-container">
              <button
                type="button"
                testid="minus"
                onClick={this.decreaseOrderCount}
                className="plus-minus-button"
              >
                <BsDashSquare className="plus-minus" />
              </button>
              <p className="order-count"> {orderCount} </p>
              <button
                type="button"
                testid="plus"
                onClick={this.increaseOrderCount}
                className="plus-minus-button"
              >
                <BsPlusSquare className="plus-minus" />
              </button>
            </div>
            <button
              type="button"
              onClick={this.addToCart}
              className="add-cart-btn"
            >
              ADD TO CART
            </button>
          </div>
        </div>
        {this.renderSimilarProducts(similarProducts)}
      </>
    )
  }

  renderProductItemDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case status.inProgress:
        return this.renderLoadingView()
      case status.success:
        return this.renderProductDetails()
      case status.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="product-section">{this.renderProductItemDetails()}</div>
      </>
    )
  }
}

export default ProductItemDetails
