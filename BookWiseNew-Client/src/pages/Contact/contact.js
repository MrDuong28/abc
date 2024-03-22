import React, { useState, useEffect } from "react";
import "./contact.css";
import { DatePicker, Input } from "antd";
import {
  Card,
  Table,
  Space,
  Tag,
  PageHeader,
  Divider,
  Form,
  Button,
  notification,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  PhoneOutlined,
  MailOutlined,
  AimOutlined,
  MoneyCollectOutlined,
} from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import axiosClient from "../../apis/axiosClient";

const { Search } = Input;

const Contact = () => {
  const [delivery, setDelivery] = useState([]);
  let history = useHistory();

  const onFinish = async (values) => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    var date = yyyy + "-" + mm + "-" + dd;

    try {
      const formatData = {
        email: values.email,
        username: values.username,
        password: values.password,
        phone: values.phoneNo,
        role: "isClient",
        status: "actived",
      };
      await axiosClient
        .post("http://localhost:3100/api/auth/register", formatData)
        .then((response) => {
          console.log(response);
          if (response === "Email is exist") {
            return notification["error"]({
              message: "Thông báo",
              description: "Email đã tồn tại",
            });
          }
          if (response === undefined) {
            notification["error"]({
              message: "Thông báo",
              description: "Đăng ký thất bại",
            });
          } else {
            notification["success"]({
              message: "Thông báo",
              description: "Đăng kí thành công",
            });
            setTimeout(function () {
              history.push("/login");
            }, 1000);
          }
        });
    } catch (error) {
      throw error;
    }
  };
  return (
    <section class="py-10 bg-gray-50 sm:py-16 lg:py-24">
    <div class="px-4 mx-auto sm:px-6 lg:px-8 max-w-7xl">
      <div class="max-w-2xl mx-auto text-center">
        <h2 class="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">Câu Hỏi Thường Gặp</h2>
        <p class="max-w-xl mx-auto mt-4 text-base leading-relaxed text-gray-600">Dưới đây là những câu hỏi mà khách hàng thường gặp khi mua sách của chúng tôi</p>
      </div>
  
      <div class="max-w-3xl mx-auto mt-8 space-y-4 md:mt-16">
        <div class="transition-all duration-200 bg-white border border-gray-200 shadow-lg cursor-pointer hover:bg-gray-50">
          <button type="button" class="flex items-center justify-between w-full px-4 py-5 sm:p-6">
            <span class="flex text-lg font-semibold text-black"> Làm thế nào để đặt hàng? </span>
  
            <svg class="w-6 h-6 text-gray-400 rotate-180" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
  
          <div class="px-4 pb-5 sm:px-6 sm:pb-6">
            <p>Để đặt hàng, quý khách có thể thực hiện trực tuyến trên trang web hoặc liên hệ trực tiếp với chúng tôi để được hỗ trợ tốt nhất.</p>
          </div>
        </div>
  
        <div class="transition-all duration-200 bg-white border border-gray-200 cursor-pointer hover:bg-gray-50">
          <button type="button" class="flex items-center justify-between w-full px-4 py-5 sm:p-6">
            <span class="flex text-lg font-semibold text-black"> Làm thế nào để thanh toán bằng thẻ Visa/MasterCard? </span>
  
            <svg class="w-6 h-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
  
          <div class="hidden px-4 pb-5 sm:px-6 sm:pb-6">
            <p>Chúng tôi chấp nhận thanh toán bằng thẻ Visa hoặc MasterCard thông qua cổng thanh toán an toàn và tiện lợi.</p>
          </div>
        </div>
  
        <div class="transition-all duration-200 bg-white border border-gray-200 cursor-pointer hover:bg-gray-50">
          <div class="">
            <button type="button" class="flex items-center justify-between w-full px-4 py-5 sm:p-6">
              <span class="flex text-lg font-semibold text-black"> Tôi có thể hủy đơn hàng của mình không? </span>
  
              <svg class="w-6 h-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
  
            <div class="hidden px-4 pb-5 sm:px-6 sm:pb-6">
              <p>Quý khách có thể hủy đơn hàng trước khi chúng tôi xác nhận và gửi hàng. Vui lòng liên hệ với chúng tôi ngay để được hỗ trợ.</p>
            </div>
          </div>
        </div>
  
        <div class="transition-all duration-200 bg-white border border-gray-200 cursor-pointer hover:bg-gray-50">
          <button type="button" class="flex items-center justify-between w-full px-4 py-5 sm:p-6">
            <span class="flex text-lg font-semibold text-black"> Làm thế nào để liên hệ với bộ phận hỗ trợ? </span>
  
            <svg class="w-6 h-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
  
          <div class="hidden px-4 pb-5 sm:px-6 sm:pb-6">
            <p>Để liên hệ với bộ phận hỗ trợ của chúng tôi, quý khách vui lòng gửi email hoặc liên hệ trực tiếp qua số điện thoại được cung cấp trên trang web.</p>
          </div>
        </div>
      </div>
  
      <p class="text-center text-gray-600 textbase mt-9">Nếu quý khách không tìm thấy câu trả lời mà mình đang tìm kiếm, vui lòng <a href="#" title="" class="font-medium text-blue-600 transition-all duration-200 hover:text-blue-700 focus:text-blue-700 hover:underline">liên hệ với chúng tôi</a></p>
    </div>
  </section>
  

  );
};

export default Contact;
