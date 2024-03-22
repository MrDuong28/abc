import QueueAnim from "rc-queue-anim";
import { OverPack } from "rc-scroll-anim";
import Texty from "rc-texty";
import TweenOne from "rc-tween-one";
import React, { useEffect, useRef, useState } from "react";
import eventApi from "../../apis/eventApi";
import productApi from "../../apis/productApi";
import triangleTopRight from "../../assets/icon/Triangle-Top-Right.svg";
import service10 from "../../assets/image/service/service10.png";
import service6 from "../../assets/image/service/service6.png";
import service7 from "../../assets/image/service/service7.png";
import service8 from "../../assets/image/service/service8.png";
import service9 from "../../assets/image/service/service9.png";
import "../Home/home.css";

import {
  BackTop,
  Card,
  Carousel,
  Col,
  Row,
  Spin
} from "antd";
import Paragraph from "antd/lib/typography/Paragraph";
import { useHistory } from "react-router-dom";
import { numberWithCommas } from "../../utils/common";

const Home = () => {
  const [event, setEvent] = useState([]);
  const [productList, setProductList] = useState([]);
  const [eventListHome, setEventListHome] = useState([]);
  const [totalEvent, setTotalEvent] = useState(Number);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [categories, setCategories] = useState([]);
  const [productsPhone, setProductsPhone] = useState([]);
  const [productsPC, setProductsPC] = useState([]);
  const [productsTablet, setProductsTablet] = useState([]);
  const [visible, setVisible] = useState(true);
  const tawkMessengerRef = useRef();
  const initialCountdownDate = new Date().getTime() + 24 * 60 * 60 * 1000;
  const [countdownDate, setCountdownDate] = useState(
    localStorage.getItem("countdownDate") || initialCountdownDate
  );

  const [timeLeft, setTimeLeft] = useState(
    countdownDate - new Date().getTime()
  );

  const history = useHistory();

  const handlePage = async (page, size) => {
    try {
      const response = await eventApi.getListEvents(page, 8);
      setEventListHome(response.data);
      setTotalEvent(response.total_count);
      setCurrentPage(page);
    } catch (error) {
      console.log("Failed to fetch event list:" + error);
    }
  };

  const handleReadMore = (id) => {
    console.log(id);
    history.push("product-detail/" + id);
  };

  const handleCategoryDetails = (id) => {
    console.log(id);
    history.push("product-list/" + id);
  };

  const onLoad = () => {
    setVisible(false);
  };

  useEffect(() => {
    (async () => {
      try {
        const response = await productApi.getListProducts({
          page: 1,
          limit: 10,
        });
        setProductList(response.data.docs);
        setTotalEvent(response);
        setLoading(false);
      } catch (error) {
        console.log("Failed to fetch event list:" + error);
      }

      try {
        const response = await productApi.getListEvents(1, 6);
        setEventListHome(response.data);
        setTotalEvent(response.total_count);
      } catch (error) {
        console.log("Failed to fetch event list:" + error);
      }
      try {
        const response = await productApi.getCategory({ limit: 10, page: 1 });
        console.log(response);
        setCategories(response.data.docs);
      } catch (error) {
        console.log(error);
      }
      try {
        const data = { limit: 10, page: 1 };
        const response = await productApi.getProductsByCategory(
          data,
          "643cd88879b4192efedda4e6"
        );
        console.log(response);
        setProductsPhone(response.data.docs);
        const response2 = await productApi.getProductsByCategory(
          data,
          "643cd89a79b4192efedda4ee"
        );
        console.log(response2);
        setProductsPC(response2.data.docs);
        const response3 = await productApi.getProductsByCategory(
          data,
          "643d030051fc7a906603da39"
        );
        console.log(response3);
        setProductsTablet(response3.data.docs);
      } catch (error) {
        console.log(error);
      }

      localStorage.setItem("countdownDate", countdownDate);

      const interval = setInterval(() => {
        const newTimeLeft = countdownDate - new Date().getTime();
        setTimeLeft(newTimeLeft);

        if (newTimeLeft <= 0) {
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    })();
  }, [countdownDate]);

  return (
    <Spin spinning={false}>
      <div
        style={{
          background: "#FFFFFF",
          overflowX: "hidden",
          overflowY: "hidden",
          paddingTop: 15,
        }}
        className="home"
      >
        <div
          style={{ background: "#FFFFFF" }}
          className="container-home container banner-promotion"
        >
          <Row justify="center" align="top" key="1">
            <Col span={4}>
              <ul className="menu-tree">
                {categories.map((category) => (
                  <li
                    key={category.id}
                    onClick={() => handleCategoryDetails(category._id)}
                  >
                    <div className="menu-category">
                      {category.name}
                      {/* <RightOutlined /> */}
                    </div>
                  </li>
                ))}
              </ul>
            </Col>
            <Col span={15}>
              <Carousel autoplay className="carousel-image">
                <div className="img">
                  <img
                    style={{ width: "100%", height: 260 }}
                    src="https://sachnhanam.s3.ap-southeast-1.amazonaws.com/wp-content/uploads/20230608095234/Backdrop2-scaled.jpg"
                    alt=""
                  />
                </div>
                <div className="img">
                  <img
                    style={{ width: "100%", height: 260 }}
                    src="https://cdn0.fahasa.com/media/magentothem/banner7/NCC1980BooksT1023_Gold_BannerSlide_840x320.jpg"
                    alt=""
                  />
                </div>
                <div className="img">
                  <img
                    style={{ width: "100%", height: 260 }}
                    src="https://bookish.vn/wp-content/uploads/2020/03/banner_FB_khuyen-mai-thang-3_1200x520.jpg"
                    alt=""
                  />
                </div>
                <div className="img">
                  <img
                    style={{ width: "100%", height: 260 }}
                    src="https://bookish.vn/wp-content/uploads/2022/12/Banner_YES_2022_890x396px-01.jpg"
                  />
                </div>
              </Carousel>
              <div className="product-promotion">
                <div class="product-card">
                  <div class="product-image">
                    <img
                      src="https://nhasachphuongnam.com/images/promo/274/gift.png"
                      alt="Sách 1"
                    />
                  </div>
                  <div class="product-name">Gift Books For You</div>
                </div>
                <div class="product-card">
                  <div class="product-image">
                    <img
                      src="https://nhasachphuongnam.com/images/promo/274/gift.png"
                      alt="Sách 2"
                    />
                  </div>
                  <div class="product-name">Chợ sách</div>
                </div>
                <div class="product-card">
                  <div class="product-image">
                    <img
                      src="https://nhasachphuongnam.com/images/promo/274/gift.png"
                      alt="Sách 3"
                    />
                  </div>
                  <div class="product-name">Stickers Sáng Tạo</div>
                </div>
              </div>
            </Col>
            <Col span={5}>
              <div class="right-banner image-promotion">
                <a
                  href="https://nhasachphuongnam.com/images/promo/263/Banner_KM_Halloween_890x396px.jpg"
                  class="right-banner__item"
                >
                  <img
                    src="https://nhasachphuongnam.com/images/promo/274/Asset_24.png"
                    alt="Giá rẻ bất ngờ"
                    loading="lazy"
                    class="right-banner__img"
                  />
                </a>
                <a
                  href="https://nhasachphuongnam.com/images/promo/262/Noi_sao_khi_tre_khong_nghe_loi.jpg"
                  class="right-banner__item"
                >
                  <img
                    src="https://nhasachphuongnam.com/images/promo/262/Noi_sao_khi_tre_khong_nghe_loi.jpg"
                    alt="THIẾT KẾ ĐẸP"
                    loading="lazy"
                    class="right-banner__img"
                  />
                </a>
                <a
                  href="https://cdn.ivolunteervietnam.com/wp-content/uploads/2023/07/07092910/cuoc-thi-thiet-ke-lai-bia-sach-nha-nam-1688696946.png"
                  class="right-banner__item"
                >
                  <img
                    style={{ width: "100%", height: 120 }}
                    src="https://cdn.ivolunteervietnam.com/wp-content/uploads/2023/07/07092910/cuoc-thi-thiet-ke-lai-bia-sach-nha-nam-1688696946.png"
                    alt="THIẾT KẾ ĐẸP"
                    loading="lazy"
                    class="right-banner__img"
                  />
                </a>
              </div>
            </Col>
          </Row>
        </div>

        {/* <div className="container-home container">
                    <img src="https://nhasachphuongnam.com/images/promo/262/Banner_Halloween_1180x200px.jpg" className="promotion1"></img>
                </div> */}

        <div className="image-one">
          <div className="texty-demo">
            <Texty>Khuyến Mãi</Texty>
          </div>
          <div className="texty-title">
            <p>
              Sách <strong style={{ color: "#3b1d82" }}>Mới Xuất Bản</strong>
            </p>
          </div>

          {/* <div class="item" key="0">
                        <div class="event-item">
                            <div class="countdown-timer">
                                <ul class="countdown-list" data-countdown="2020/08/08">
                                    <li className="timer-item days">
                                        <strong style={{ fontSize: 18 }}>01</strong><br />
                                        <small>Ngày</small>
                                    </li>
                                    <li className="timer-item hours">
                                        <strong style={{ fontSize: 18 }}>{hours.toString().padStart(2, '0')}</strong><br />
                                        <small>Giờ</small>
                                    </li>
                                    <li className="timer-item mins">
                                        <strong style={{ fontSize: 18 }}>{minutes.toString().padStart(2, '0')}</strong><br />
                                        <small>Phút</small>
                                    </li>
                                    <li className="timer-item seco">
                                        <strong style={{ fontSize: 18 }}>{seconds.toString().padStart(2, '0')}</strong><br />
                                        <small>Giây</small>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div> */}
          <div className="list-products container" key="1">
            {/* <Row>
                            <Col>
                                <div className="title-category">
                                    <a href="" class="title">
                                        <h3>Sách NỔI BẬT NHẤT</h3>
                                    </a>
                                </div>
                            </Col>
                        </Row> */}
            <Row
              gutter={{ xs: 8, sm: 16, md: 24, lg: 48 }}
              className="row-product"
            >
              {productsPhone.map((item) => (
                <Col
                  xl={{ span: 6 }}
                  lg={{ span: 8 }}
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
                        src={require("../../assets/image/NoImageAvailable.jpg")}
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
                          {numberWithCommas(item.promotion)} đ
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
        </div>
        <div></div>

        <div className="image-one">
          <div className="texty-demo">
            <Texty>Giờ Vàng</Texty>
          </div>
          <div className="texty-title">
            <p>
              Sách <strong style={{ color: "#3b1d82" }}>Bán Chạy</strong>
            </p>
          </div>

          <div className="list-products container" key="1">
            {/* <Row>
                            <Col>
                                <div className="title-category">
                                    <a href="" class="title">
                                        <h3>Sách KHUYẾN MÃI</h3>
                                    </a>
                                </div>
                            </Col>
                        </Row> */}
            <Row
              gutter={{ xs: 8, sm: 16, md: 24, lg: 48 }}
              className="row-product"
            >
              {productsPC.map((item) => (
                <Col
                  xl={{ span: 6 }}
                  lg={{ span: 8 }}
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
                        src={require("../../assets/image/NoImageAvailable.jpg")}
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
                          {numberWithCommas(item.promotion)} đ
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
        </div>

        <div className="image-one">
          <div className="texty-demo">
            <Texty>Giờ Vàng</Texty>
          </div>
          <div className="texty-title">
            <p>
              Giảm Giá <strong style={{ color: "#3b1d82" }}>Đặc Biệt</strong>
            </p>
          </div>

          <div className="list-products container" key="1">
            <Row>
              {/* <Col>
                <div className="title-category">
                  <a href="" class="title">
                    <h3></h3>
                  </a>
                </div>
              </Col> */}
            </Row>
            <Row
              gutter={{ xs: 8, sm: 16, md: 24, lg: 48 }}
              className="row-product"
            >
              {productsTablet.map((item) => (
                <Col
                  xl={{ span: 6 }}
                  lg={{ span: 8 }}
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
                        src={require("../../assets/image/NoImageAvailable.jpg")}
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
                          {numberWithCommas(item.promotion)} đ
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
        </div>
      </div>

      <BackTop style={{ textAlign: "right" }} />
    </Spin>
  );
};

export default Home;
