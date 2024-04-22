import {
  Avatar, Breadcrumb, Button, Card, Carousel, Col, Form,
  Input, List, Modal, Rate, Row,
  Spin,
  message, notification
} from "antd";
import { PlayCircleOutlined, PauseCircleOutlined } from '@ant-design/icons';
import Paragraph from "antd/lib/typography/Paragraph";
import React, { useEffect, useState, useRef } from "react";
import { useHistory, useParams } from "react-router-dom";
import axiosClient from "../../../apis/axiosClient";
import productApi from "../../../apis/productApi";
import triangleTopRight from "../../../assets/icon/Triangle-Top-Right.svg";
import { numberWithCommas } from "../../../utils/common";
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

import "./productDetail.css";

const { TextArea } = Input;

const ProductDetail = () => {
  const [productDetail, setProductDetail] = useState([]);
  const [recommend, setRecommend] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartLength, setCartLength] = useState();
  const [form] = Form.useForm();
  let { id } = useParams();
  const history = useHistory();
  const [visible2, setVisible2] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [colorProduct, setColorProduct] = useState("");
  const [selectedColor, setSelectedColor] = useState(null);


  const viewBookOnline = (url) => {
    window.location.href = url;
  };

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const [showAudioPlayer, setShowAudioPlayer] = useState(false);

  const handleListenBook = () => {
    setShowAudioPlayer(true);

    if (audioRef.current && audioRef.current.audio.current) {
      if (isPlaying) {
        audioRef.current.audio.current.pause(); // Dừng phát âm thanh
      } else {
        audioRef.current.audio.current.play(); // Phát âm thanh
      }
    }
    setIsPlaying(!isPlaying); // Cập nhật trạng thái phát nhạc
  };

  const addCart = (product) => {
    console.log(product);
    const existingItems = JSON.parse(localStorage.getItem("cart")) || [];
    let updatedItems;
    const existingItemIndex = existingItems.findIndex(
      (item) => item._id === product._id
    );
    if (existingItemIndex !== -1) {
      // If product already exists in the cart, increase its quantity
      updatedItems = existingItems.map((item, index) => {
        if (index === existingItemIndex) {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }
        return item;
      });
    } else {
      // If product does not exist in the cart, add it to the cart
      updatedItems = [...existingItems, { ...product, quantity: 1 }];
    }
    console.log(updatedItems.length);
    setCartLength(updatedItems.length);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
    localStorage.setItem("cartLength", updatedItems.length);
    window.location.reload(true);
  };

  const paymentCard = (product) => {
    console.log(product);
    const existingItems = JSON.parse(localStorage.getItem("cart")) || [];
    let updatedItems;
    const existingItemIndex = existingItems.findIndex(
      (item) => item._id === product._id
    );
    if (existingItemIndex !== -1) {
      // If product already exists in the cart, increase its quantity
      updatedItems = existingItems.map((item, index) => {
        if (index === existingItemIndex) {
          return {
            ...item,
            quantity: item.quantity + 1,
          };
        }
        return item;
      });
    } else {
      // If product does not exist in the cart, add it to the cart
      updatedItems = [...existingItems, { ...product, quantity: 1 }];
    }
    console.log(updatedItems.length);
    setCartLength(updatedItems.length);
    localStorage.setItem("cart", JSON.stringify(updatedItems));
    localStorage.setItem("cartLength", updatedItems.length);
    history.push("/cart");
  };
  const handleReadMore = (id) => {
    console.log(id);
    history.push("/product-detail/" + id);
    window.location.reload();
  };

  const handleOpenModal = () => {
    setVisible2(true);
  };

  const handleCloseModal = () => {
    setVisible2(false);
  };

  const handleRateChange = (value) => {
    setRating(value);
  };

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  function handleClick(color) {
    // Xử lý logic khi click vào điểm màu
    console.log("Selected color:", color);
    setColorProduct(color);
    setSelectedColor(color);
  }

  const handleReviewSubmit = async () => {
    // Tạo payload để gửi đến API
    const payload = {
      comment,
      rating,
    };

    // Gọi API đánh giá và bình luận
    await axiosClient
      .post(`/product/${id}/reviews`, payload)
      .then((response) => {
        console.log(response);
        // Xử lý khi gọi API thành công
        console.log("Review created");
        // Đóng modal và thực hiện các hành động khác nếu cần
        message.success("Thông báo:" + response);
        handleList();
        handleCloseModal();
      })
      .catch((error) => {
        // Xử lý khi gọi API thất bại
        console.error("Error creating review:", error);
        // Hiển thị thông báo lỗi cho người dùng nếu cần
        message.error("Đánh giá thất bại: " + error);
      });
  };

  const [reviews, setProductReview] = useState([]);
  const [reviewsCount, setProductReviewCount] = useState([]);
  const [avgRating, setAvgRating] = useState(null);
  const [user, setUser] = useState(null);

  const handleList = () => {
    (async () => {
      try {
        const local = localStorage.getItem("user");
        const user = JSON.parse(local);
        setUser(user);

        await productApi.getDetailProduct(id).then((item) => {
          setProductDetail(item.product);
          setProductReview(item.reviews);
          setProductReviewCount(item.reviewStats);
          setAvgRating(item.avgRating);
          console.log(((reviewsCount[4] || 0) / reviews.length) * 100);
        });
        await productApi.getRecommendProduct(id).then((item) => {
          setRecommend(item?.recommendations);
        });
        setLoading(false);
      } catch (error) {
        console.log("Failed to fetch event detail:" + error);
      }
    })();
  }

  useEffect(() => {
    handleList();
    window.scrollTo(0, 0);
  }, [cartLength]);



  return (
    <div>
      <Spin spinning={false}>
        <Card className="container_details">
          <div className="product_detail">
            <div style={{ marginLeft: 5, marginBottom: 10, marginTop: 10 }}>
              <Breadcrumb>
                <Breadcrumb.Item href="http://localhost:3500/home">
                  {/* <HomeOutlined /> */}
                  <span>Trang chủ</span>
                </Breadcrumb.Item>
                <Breadcrumb.Item href="http://localhost:3500/product-list/643cd88879b4192efedda4e6">
                  {/* <AuditOutlined /> */}
                  <span>Sản phẩm</span>
                </Breadcrumb.Item>
                <Breadcrumb.Item href="">
                  <span>{productDetail.name}</span>
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
            <hr></hr>
            <Row gutter={12} style={{ marginTop: 20 }}>
              <Col span={8}>
                {productDetail?.slide?.length > 0 ? (
                  <Carousel autoplay className="carousel-image">
                    {productDetail.slide.map((item) => (
                      <div className="img" key={item}>
                        <img
                          style={{ width: "50%", height: "50%", marginLeft: "100px" }}
                          src={item}
                          alt=""
                        />
                      </div>
                    ))}
                  </Carousel>
                ) : (
                  <Card className="card_image" bordered={false}>
                    <img src={productDetail.image} />
                    <div className="promotion"></div>
                  </Card>
                )}
              </Col>
              <Col span={16}>

                <div className="price">
                  <h1 className="product_name">{productDetail.name}</h1>
                  <Rate disabled value={avgRating} className="rate" />
                </div>
                <Card
                  className="card_total"
                  bordered={false}
                  style={{ width: "50%" }}
                >
                  {productDetail?.promotion === productDetail?.price ? (
                    <div className="price_product">
                      {productDetail?.promotion?.toLocaleString("vi", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </div>
                  ) : (
                    <div>
                      <div className="price_product">
                        {productDetail?.promotion?.toLocaleString("vi", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </div>
                      <div className="promotion_product">
                        {productDetail?.price?.toLocaleString("vi", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </div>
                    </div>
                  )}

                  <div>
                    <span style={{ fontSize: 15 }}>
                      Tác giả: {productDetail.manufacturer}</span>
                    {productDetail?.status === 'Unavailable' || productDetail?.status === 'Discontinued' ? (
                      <Paragraph
                        className="badge"
                        style={{ marginTop: 10 }}
                      >
                        {productDetail?.status === 'Unavailable' ? (
                          <span>Hết hàng</span>
                        ) : (
                          <span>Ngừng kinh doanh</span>
                        )}
                        <img src={triangleTopRight} alt="Triangle" />
                      </Paragraph>
                    ) : null}
                  </div>
                  <div class="box-product-promotion">
                    <div class="box-product-promotion-header">
                      <p>Ưu đãi</p>
                    </div>
                    <div class="box-content-promotion">
                      <p class="box-product-promotion-number"></p>
                      <a>
                        Thu mua sách cũ - Giá thu cao nhất <br />
                        <br /> Tặng thêm phiếu mua hàng <br />
                        <br /> Giảm giá cho khách hàng mới
                      </a>
                    </div>
                  </div>

                  <div className="color-product">
                    {productDetail?.color?.map((color) => (
                      <span
                        key={color}
                        style={{ backgroundColor: color }} // Sửa đổi ở đây
                        className={`dot ${selectedColor === color ? "active" : ""
                          }`}
                        onClick={() => handleClick(color)}
                      ></span>
                    ))}
                  </div>
                  <div className="box_cart_1">
                    <Button
                      type="primary"
                      className="by"
                      size={"large"}
                      onClick={() => paymentCard(productDetail)}
                      disabled={productDetail?.status === 'Unavailable' || productDetail?.status === 'Discontinued'}
                    >
                      Mua ngay
                    </Button>
                    <Button
                      type="primary"
                      className="cart"
                      size={"large"}
                      onClick={() => addCart(productDetail)}
                      disabled={productDetail?.status === 'Unavailable' || productDetail?.status === 'Discontinued'}
                    >
                      Thêm vào giỏ
                    </Button>
                    {productDetail?.audioUrl && (
                      <Button
                        type="primary"
                        className="cart"
                        size="large"
                        onClick={handleListenBook}
                        icon={isPlaying ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
                      >
                        {isPlaying ? 'Dừng sách' : 'Nghe sách'}
                      </Button>
                    )}
                    {!productDetail?.audioUrl && (
                      <>
                        <Button
                          type="primary"
                          className="cart"
                          size="large"
                          onClick={() => viewBookOnline(productDetail.url_book)}
                        >
                          Xem sách online
                        </Button>
                      </>
                    )}
                  </div>

                </Card>
              </Col>
            </Row>
            <div className="describe">
              <div className="title_total">
                Giới thiệu sách "{productDetail.name}"
              </div>
              <div
                className="describe_detail_description"
                dangerouslySetInnerHTML={{ __html: productDetail.description }}
              ></div>
            </div>
            {showAudioPlayer && (
              <div className="audio-player-container">
                <AudioPlayer
                  ref={audioRef}
                  autoPlay
                  src={productDetail.audioUrl}
                  onPause={() => setIsPlaying(false)}
                  onPlay={() => setIsPlaying(true)}
                />
              </div>
            )}
            <Row gutter={12} style={{ marginTop: 20 }}>
              <Col span={16}>
                <Card className="card_total" bordered={false}>
                  <div className="card_number">
                    <div>
                      <div className="number_total">
                        {productDetail.categoryTotal}
                      </div>
                      <div className="title_total">
                        Đánh giá & nhận xét "{productDetail.name}"
                      </div>
                      <div class="review">
                        <div class="policy-review">
                          <div class="policy__list">
                            <Row gutter={12}>
                              <Col span={8}>
                                <div className="comment_total">
                                  <p class="title">{avgRating}/5</p>
                                  <Rate disabled value={avgRating} />
                                  <p>
                                    <strong>{reviews.length}</strong> đánh giá
                                    và nhận xét
                                  </p>
                                </div>
                              </Col>
                              <Col span={16}>
                                <div className="progress_comment">
                                  <div class="is-active">
                                    <div>5</div>
                                    <div>
                                      <svg
                                        height="15"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 576 512"
                                      >
                                        <path d="M381.2 150.3L524.9 171.5C536.8 173.2 546.8 181.6 550.6 193.1C554.4 204.7 551.3 217.3 542.7 225.9L438.5 328.1L463.1 474.7C465.1 486.7 460.2 498.9 450.2 506C440.3 513.1 427.2 514 416.5 508.3L288.1 439.8L159.8 508.3C149 514 135.9 513.1 126 506C116.1 498.9 111.1 486.7 113.2 474.7L137.8 328.1L33.58 225.9C24.97 217.3 21.91 204.7 25.69 193.1C29.46 181.6 39.43 173.2 51.42 171.5L195 150.3L259.4 17.97C264.7 6.954 275.9-.0391 288.1-.0391C300.4-.0391 311.6 6.954 316.9 17.97L381.2 150.3z"></path>
                                      </svg>
                                    </div>
                                  </div>
                                  Đánh giá 5 sao gồm có:
                                  <span className="review-count">
                                    {reviewsCount[4] || 0}
                                  </span>
                                  {/* <div class="total_comment">16 đánh giá</div> */}
                                </div>
                                <div className="progress_comment">
                                  <div class="is-active">
                                    <div>4</div>
                                    <div>
                                      <svg
                                        height="15"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 576 512"
                                      >
                                        <path d="M381.2 150.3L524.9 171.5C536.8 173.2 546.8 181.6 550.6 193.1C554.4 204.7 551.3 217.3 542.7 225.9L438.5 328.1L463.1 474.7C465.1 486.7 460.2 498.9 450.2 506C440.3 513.1 427.2 514 416.5 508.3L288.1 439.8L159.8 508.3C149 514 135.9 513.1 126 506C116.1 498.9 111.1 486.7 113.2 474.7L137.8 328.1L33.58 225.9C24.97 217.3 21.91 204.7 25.69 193.1C29.46 181.6 39.43 173.2 51.42 171.5L195 150.3L259.4 17.97C264.7 6.954 275.9-.0391 288.1-.0391C300.4-.0391 311.6 6.954 316.9 17.97L381.2 150.3z"></path>
                                      </svg>
                                    </div>
                                  </div>
                                  Đánh giá 4 sao gồm có:
                                  <span className="review-count">
                                    {reviewsCount[3] || 0}
                                  </span>
                                  {/* <div class="total_comment">16 đánh giá</div> */}
                                </div>
                                <div className="progress_comment">
                                  <div class="is-active">
                                    <div>3</div>
                                    <div>
                                      <svg
                                        height="15"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 576 512"
                                      >
                                        <path d="M381.2 150.3L524.9 171.5C536.8 173.2 546.8 181.6 550.6 193.1C554.4 204.7 551.3 217.3 542.7 225.9L438.5 328.1L463.1 474.7C465.1 486.7 460.2 498.9 450.2 506C440.3 513.1 427.2 514 416.5 508.3L288.1 439.8L159.8 508.3C149 514 135.9 513.1 126 506C116.1 498.9 111.1 486.7 113.2 474.7L137.8 328.1L33.58 225.9C24.97 217.3 21.91 204.7 25.69 193.1C29.46 181.6 39.43 173.2 51.42 171.5L195 150.3L259.4 17.97C264.7 6.954 275.9-.0391 288.1-.0391C300.4-.0391 311.6 6.954 316.9 17.97L381.2 150.3z"></path>
                                      </svg>
                                    </div>
                                  </div>
                                  Đánh giá 3 sao gồm có:
                                  <span className="review-count">
                                    {reviewsCount[2] || 0}
                                  </span>
                                  {/* <div class="total_comment">16 đánh giá</div> */}
                                </div>
                                <div className="progress_comment">
                                  <div class="is-active">
                                    <div>2</div>
                                    <div>
                                      <svg
                                        height="15"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 576 512"
                                      >
                                        <path d="M381.2 150.3L524.9 171.5C536.8 173.2 546.8 181.6 550.6 193.1C554.4 204.7 551.3 217.3 542.7 225.9L438.5 328.1L463.1 474.7C465.1 486.7 460.2 498.9 450.2 506C440.3 513.1 427.2 514 416.5 508.3L288.1 439.8L159.8 508.3C149 514 135.9 513.1 126 506C116.1 498.9 111.1 486.7 113.2 474.7L137.8 328.1L33.58 225.9C24.97 217.3 21.91 204.7 25.69 193.1C29.46 181.6 39.43 173.2 51.42 171.5L195 150.3L259.4 17.97C264.7 6.954 275.9-.0391 288.1-.0391C300.4-.0391 311.6 6.954 316.9 17.97L381.2 150.3z"></path>
                                      </svg>
                                    </div>
                                  </div>
                                  Đánh giá 2 sao gồm có:
                                  <span className="review-count">
                                    {reviewsCount[1] || 0}
                                  </span>
                                  {/* <div class="total_comment">16 đánh giá</div> */}
                                </div>
                                <div className="progress_comment">
                                  <div class="is-active">
                                    <div>1</div>
                                    <div>
                                      <svg
                                        height="15"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 576 512"
                                      >
                                        <path d="M381.2 150.3L524.9 171.5C536.8 173.2 546.8 181.6 550.6 193.1C554.4 204.7 551.3 217.3 542.7 225.9L438.5 328.1L463.1 474.7C465.1 486.7 460.2 498.9 450.2 506C440.3 513.1 427.2 514 416.5 508.3L288.1 439.8L159.8 508.3C149 514 135.9 513.1 126 506C116.1 498.9 111.1 486.7 113.2 474.7L137.8 328.1L33.58 225.9C24.97 217.3 21.91 204.7 25.69 193.1C29.46 181.6 39.43 173.2 51.42 171.5L195 150.3L259.4 17.97C264.7 6.954 275.9-.0391 288.1-.0391C300.4-.0391 311.6 6.954 316.9 17.97L381.2 150.3z"></path>
                                      </svg>
                                    </div>
                                  </div>
                                  Đánh giá 1 sao gồm có:
                                  <span className="review-count">
                                    {reviewsCount[0] || 0}
                                  </span>
                                  {/* <div class="total_comment">16 đánh giá</div> */}
                                </div>
                              </Col>
                            </Row>
                          </div>
                        </div>
                      </div>
                      <p class="subtitle">Bạn đánh giá sao sản phẩm này</p>
                      <div class="group_comment">
                        <Button
                          type="primary"
                          className="button_comment"
                          size={"large"}
                          onClick={handleOpenModal}
                          disabled={!user}
                        >
                          Đánh giá ngay
                        </Button>
                      </div>
                      <Modal
                        visible={visible2}
                        onCancel={handleCloseModal}
                        onOk={handleReviewSubmit}
                        okText="Gửi đánh giá"
                        cancelText="Hủy"
                      >
                        <h2>Đánh giá và bình luận</h2>
                        <Rate
                          value={rating}
                          onChange={handleRateChange}
                          style={{ marginBottom: 10 }}
                        />
                        <TextArea
                          placeholder="Nhập bình luận của bạn"
                          value={comment}
                          onChange={handleCommentChange}
                        ></TextArea>
                      </Modal>
                    </div>
                    <div style={{ marginTop: 40 }}>
                      <Card>
                        <div style={{ padding: 20 }}>
                          <List
                            itemLayout="horizontal"
                            dataSource={reviews}
                            renderItem={(item, index) => (
                              <List.Item>
                                <List.Item.Meta
                                  avatar={
                                    <Avatar
                                      src={`https://xsgames.co/randomusers/avatar.php?g=pixel&key=1`}
                                    />
                                  }
                                  title={
                                    <a href="https://ant.design">
                                      {item?.user?.username}
                                    </a>
                                  }
                                  description={item?.comment}
                                />
                              </List.Item>
                            )}
                          />
                        </div>
                      </Card>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
            <div></div>

            <div className="price" style={{ marginTop: 40 }}>
              <h1 className="product_name">Sản phẩm bạn có thể quan tâm</h1>
            </div>
            <Row
              style={{ marginTop: 40 }}
              gutter={{ xs: 8, sm: 16, md: 24, lg: 48 }}
              className="row-product"
            >
              {recommend?.map((item) => (
                <Col
                  xl={{ span: 6 }}
                  lg={{ span: 6 }}
                  md={{ span: 12 }}
                  sm={{ span: 12 }}
                  xs={{ span: 24 }}
                  className="col-product"
                  onClick={() => handleReadMore(item._id)}
                  key={item._id}
                >
                  <div className="show-product">
                    {item.image ? (
                      <img className="image-product" src={item.image} />
                    ) : (
                      <img
                        className="image-product"
                        src={require("../../../assets/image/NoImageAvailable.jpg")}
                      />
                    )}
                    <div className="wrapper-products">
                      <Paragraph
                        className="title-product"
                        ellipsis={{ rows: 2 }}
                      >
                        {item.name}
                      </Paragraph>
                      <div className="price-amount">
                        <Paragraph className="price-product">
                          {numberWithCommas(item.price - item.promotion)} đ
                        </Paragraph>
                        {item.promotion !== 0 && (
                          <Paragraph className="price-cross">
                            {numberWithCommas(item.price)} đ
                          </Paragraph>
                        )}
                      </div>
                    </div>
                  </div>
                  <Paragraph
                    className="badge"
                    style={{ position: "absolute", top: 10, left: 9 }}
                  >
                    <span>Giảm giá</span>
                    <img src={triangleTopRight} />
                  </Paragraph>
                </Col>
              ))}
            </Row>
          </div>
        </Card>
      </Spin>
    </div>
  );
};

export default ProductDetail;
