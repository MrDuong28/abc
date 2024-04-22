import {
    DeleteOutlined,
    EditOutlined,
    FormOutlined,
    HomeOutlined,
    PlusOutlined,
    UploadOutlined
} from '@ant-design/icons';
import { PageHeader } from '@ant-design/pro-layout';
import {
    BackTop,
    Breadcrumb,
    Button,
    Col,
    Drawer,
    Form,
    Checkbox,
    Input,
    Modal, Popconfirm,
    Row,
    Select,
    Space,
    Spin,
    Table,
    Tag,
    Typography,
    Upload,
    message,
    notification
} from 'antd';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css';
import axiosClient from '../../apis/axiosClient';
import newsApi from "../../apis/newsApi";
import productApi from "../../apis/productsApi";
import uploadFileApi from '../../apis/uploadFileApi';
import "./productList.css";
const { confirm } = Modal;
const { Option } = Select;
const { Title } = Typography;
const DATE_TIME_FORMAT = "DD/MM/YYYY HH:mm";

const ProductList = () => {
    const [product, setProduct] = useState([]);
    const [category, setCategoryList] = useState([]);
    const [openModalCreate, setOpenModalCreate] = useState(false);
    const [openModalUpdate, setOpenModalUpdate] = useState(false);
    const [image, setImage] = useState();
    const [audioUrl, setAudio] = useState();

    const [newsList, setNewsList] = useState([]);

    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [form] = Form.useForm();
    const [form2] = Form.useForm();
    const [totalEvent, setTotalEvent] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [description, setDescription] = useState();
    const [total, setTotalList] = useState(false);
    const [id, setId] = useState();
    const [visible, setVisible] = useState(false);
    const [images, setImages] = useState([]);
    const [bookUrl, setBookUrl] = useState([]);

    const history = useHistory();

    const showModal = () => {
        setOpenModalCreate(true);
    };

    const handleOkUser = async (values) => {
        setLoading(true);
        try {
            var formData = new FormData();
            formData.append("image", image);

            await axiosClient.post("/uploadFile", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }).then(response => {
                const categoryList = {
                    "name": values.name,
                    "description": description,
                    "slug": values.slug,
                    "price": values.price,
                    "category": values.category,
                    "image": response.image_url,
                    "promotion": values.promotion,
                    "status": values.status,
                    "slide": images,
                    "color": values.colors,
                    "url_book": bookUrl,
                    "manufacturer": values.manufacturer,
                    "audioUrl": audioUrl
                };

                return axiosClient.post("/product", categoryList).then(response => {
                    if (response === undefined) {
                        notification["error"]({
                            message: `Thông báo`,
                            description: 'Tạo sản phẩm thất bại',
                        });
                    } else {
                        notification["success"]({
                            message: `Thông báo`,
                            description: 'Tạo sản phẩm thành công',
                        });
                        setImages([]);
                        setOpenModalCreate(false);
                        handleProductList();
                    }
                });
            });

            setLoading(false);
        } catch (error) {
            throw error;
        }
    };


    const handleImageUpload = async (info) => {
        const image = info.file;
        const formData = new FormData();
        formData.append('image', image);

        try {
            const response = await axiosClient.post('/uploadFile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then(response => {
                const imageUrl = response.image_url;
                console.log(imageUrl);
                // Lưu trữ URL hình ảnh trong trạng thái của thành phần
                setImages(prevImages => [...prevImages, imageUrl]);

                console.log(images);
                message.success(`${info.file.name} đã được tải lên thành công!`);
            });
        } catch (error) {
            console.log(error);
        }
    }

    const handleFileUpload = async (info) => {
        const image = info.file;
        const formData = new FormData();
        formData.append('image', image);

        try {
            await axiosClient.post('/uploadFile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }).then(response => {
                const imageUrl = response.image_url;
                console.log(imageUrl);
                // Lưu trữ URL hình ảnh trong trạng thái của thành phần
                setBookUrl(imageUrl);

                console.log(images);
                message.success(`${info.file.name} đã được tải lên thành công!`);
            });
        } catch (error) {
            console.log(error);
        }
    }

    const handleUpdateProduct = async (values) => {
        setLoading(true);
        try {
            if (image) {
                var formData = new FormData();
                formData.append("image", image);

                await axiosClient.post("/uploadFile", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then(response => {
                    const categoryList = {
                        "name": values.name,
                        "description": description,
                        "price": values.price,
                        "category": values.category,
                        "image": response.image_url,
                        "promotion": values.promotion || 0,
                        "status": values.status,
                        "color": values.colors,
                        "url_book": bookUrl,
                        "manufacturer": values.manufacturer,
                        "audioUrl": audioUrl
                    };

                    return axiosClient.put("/product/" + id, categoryList).then(response => {
                        if (response === undefined) {
                            notification["error"]({
                                message: `Thông báo`,
                                description: 'Chỉnh sửa sản phẩm thất bại',
                            });
                            setLoading(false);
                        } else {
                            notification["success"]({
                                message: `Thông báo`,
                                description: 'Chỉnh sửa sản phẩm thành công',
                            });
                            setOpenModalUpdate(false);
                            handleProductList();
                            setLoading(false);
                        }
                    });
                });
            } else { // Nếu image không tồn tại, chỉ gọi API put
                const categoryList = {
                    "name": values.name,
                    "description": description,
                    "price": values.price,
                    "category": values.category,
                    "promotion": values.promotion || 0,
                    "status": values.status,
                    "color": values.colors,
                    "url_book": bookUrl.length > 0 ? bookUrl : "",
                    "manufacturer": values.manufacturer,
                    "audioUrl": audioUrl

                };

                return axiosClient.put("/product/" + id, categoryList).then(response => {
                    if (response === undefined) {
                        notification["error"]({
                            message: `Thông báo`,
                            description: 'Chỉnh sửa sản phẩm thất bại',
                        });
                        setLoading(false);
                    } else {
                        notification["success"]({
                            message: `Thông báo`,
                            description: 'Chỉnh sửa sản phẩm thành công',
                        });
                        setOpenModalUpdate(false);
                        handleProductList();
                        setLoading(false);
                    }
                });
            }
        } catch (error) {
            throw error;
        }
    };


    const handleCancel = (type) => {
        if (type === "create") {
            setOpenModalCreate(false);
        } else {
            setOpenModalUpdate(false)
        }
        console.log('Clicked cancel button');
    };

    const handleProductList = async () => {
        try {
            await productApi.getListProducts({ page: 1, limit: 10000 }).then((res) => {
                console.log(res);
                setProduct(res.data.docs);
                setLoading(false);
            });
            ;
        } catch (error) {
            console.log('Failed to fetch product list:' + error);
        };
    };

    const handleDeleteCategory = async (id) => {
        setLoading(true);
        try {
            await productApi.deleteProduct(id).then(response => {
                if (response === undefined) {
                    notification["error"]({
                        message: `Thông báo`,
                        description:
                            'Xóa sản phẩm thất bại',

                    });
                    setLoading(false);
                }
                else {
                    notification["success"]({
                        message: `Thông báo`,
                        description:
                            'Xóa sản phẩm thành công',

                    });
                    setCurrentPage(1);
                    handleProductList();
                    setLoading(false);
                }
            }
            );

        } catch (error) {
            console.log('Failed to fetch event list:' + error);
        }
    }

    const handleChangeImage = (event) => {
        setImage(event.target.files[0]);
    }

    const handleChangeAudioUrl = async (e) => {
        setLoading(true);
        const response = await uploadFileApi.uploadFile(e);
        if (response) {
            setAudio(response);
        }
        setLoading(false);
    }



    const handleProductEdit = (id) => {
        setOpenModalUpdate(true);
        (async () => {
            try {
                const response = await productApi.getDetailProduct(id);
                console.log(response);
                setId(id);
                form2.setFieldsValue({
                    name: response.product.name,
                    price: response.product.price,
                    category: response?.product.category?._id,
                    status: response.product.status,
                    promotion: response.product.promotion || 0,
                    color: response.product.color,
                    manufacturer: response.product.manufacturer
                });
                if (response.product.audioUrl) {
                    setShowPromotion(true)
                }
                console.log(form2);
                setAudio(response?.product?.audioUrl)
                setDescription(response.product.description);
                setLoading(false);
            } catch (error) {
                throw error;
            }
        })();
    }

    const handleFilter = async (name) => {
        try {
            const res = await productApi.searchProduct(name);
            setTotalList(res.totalDocs)
            setProduct(res.data.docs);
        } catch (error) {
            console.log('search to fetch category list:' + error);
        }
    }

    const handleChange = (content) => {
        console.log(content);
        setDescription(content);
    }

    const columns = [
        {
            title: 'ID',
            key: 'index',
            render: (text, record, index) => index + 1,
        },
        {
            title: 'Ảnh',
            dataIndex: 'image',
            key: 'image',
            render: (image) => <img src={image} style={{ height: 80 }} />,
            width: '10%'
        },
        {
            title: 'Tên',
            dataIndex: 'name',
            key: 'name',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Giá gốc',
            key: 'price',
            dataIndex: 'price',
            render: (slugs) => (
                <span>
                    <div>{slugs?.toLocaleString('vi', { style: 'currency', currency: 'VND' })}</div>
                </span>
            ),
        },
        {
            title: 'Giá giảm',
            key: 'promotion',
            dataIndex: 'promotion',
            render: (promotion) => (
                <span>
                    <Tag color="geekblue" key={promotion}>
                        {promotion?.toLocaleString('vi', { style: 'currency', currency: 'VND' })}
                    </Tag>
                </span>
            ),
        },
        {
            title: 'Danh mục',
            dataIndex: 'category',
            key: 'category',
            render: (res) => (
                <span>
                    {res?.name}
                </span>
            ),
        },
        {
            title: 'Tên tác giả',
            dataIndex: 'manufacturer',
            key: 'manufacturer',
            render: (text) => <a>{text}</a>,
        },
        {
            title: 'Audio',
            dataIndex: 'audioUrl',
            key: 'audioUrl',
            render: (audioUrl) => (
                <span>
                    <a href={audioUrl} target="_blank" rel="noopener noreferrer">Nghe audio</a>
                </span>
            ),
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status) => (
                <span>
                    {status === 'Available' ? (
                        <Tag color="green">Còn hàng</Tag>
                    ) : status === 'Unavailable' ? (
                        <Tag color="red">Hết hàng</Tag>
                    ) : (
                        <Tag color="yellow">Ngừng kinh doanh</Tag>
                    )}
                </span>
            ),
        },

        {
            title: 'Action',
            key: 'action',
            render: (text, record) => (
                <div>
                    <Row>
                        <div className='groupButton'>
                            {/* <Button
                                size="small"
                                icon={<EyeOutlined />}
                                style={{ width: 150, borderRadius: 15, height: 30 }}
                            >{"Xem chi tiết"}
                            </Button> */}
                            <Button
                                size="small"
                                icon={<EditOutlined />}
                                style={{ width: 150, borderRadius: 15, height: 30, marginTop: 5 }}
                                onClick={() => handleProductEdit(record._id)}
                            >{"Chỉnh sửa"}
                            </Button>
                            <div
                                style={{ marginTop: 5 }}>
                                <Popconfirm
                                    title="Bạn có chắc chắn xóa sản phẩm này?"
                                    onConfirm={() => handleDeleteCategory(record._id)}
                                    okText="Yes"
                                    cancelText="No"
                                >
                                    <Button
                                        size="small"
                                        icon={<DeleteOutlined />}
                                        style={{ width: 150, borderRadius: 15, height: 30 }}
                                    >{"Xóa"}
                                    </Button>
                                </Popconfirm>
                            </div>
                        </div>
                    </Row>
                </div >
            ),
        },
    ];

    const handleOpen = () => {
        setVisible(true);
    };

    const handleSubmit = () => {
        form.validateFields().then((values) => {
            form.resetFields();
            handleOkUser(values);
            setVisible(false);
        });
    };


    useEffect(() => {
        (async () => {
            try {
                await productApi.getListProducts({ page: 1, limit: 10000 }).then((res) => {
                    console.log(res);
                    setTotalList(res.totalDocs)
                    setProduct(res.data.docs);
                    setLoading(false);
                });

                await productApi.getListCategory({ page: 1, limit: 10000 }).then((res) => {
                    console.log(res);
                    setCategoryList(res.data.docs);
                    setLoading(false);
                });

                await newsApi.getListColor({ page: 1, limit: 10 }).then((res) => {
                    console.log(res);
                    setTotalList(res.totalDocs)
                    setNewsList(res.data.docs);
                    setLoading(false);
                });

                ;
            } catch (error) {
                console.log('Failed to fetch event list:' + error);
            }
        })();
    }, [])

    // Định nghĩa state để theo dõi trạng thái của checkbox
    const [showPromotion, setShowPromotion] = useState(false);

    // Xử lý sự kiện khi checkbox được thay đổi
    const handleShowPromotionChange = (e) => {
        setShowPromotion(e.target.checked);
    };

    return (
        <div>
            <Spin spinning={loading}>
                <div className='container'>
                    <div style={{ marginTop: 20 }}>
                        <Breadcrumb>
                            <Breadcrumb.Item href="">
                                <HomeOutlined />
                            </Breadcrumb.Item>
                            <Breadcrumb.Item href="">
                                <FormOutlined />
                                <span>Danh sách sản phẩm</span>
                            </Breadcrumb.Item>
                        </Breadcrumb>
                    </div>

                    <div style={{ marginTop: 20 }}>
                        <div id="my__event_container__list">
                            <PageHeader
                                subTitle=""
                                style={{ fontSize: 14 }}
                            >
                                <Row>
                                    <Col span="18">
                                        <Input
                                            placeholder="Tìm kiếm"
                                            allowClear
                                            onChange={handleFilter}
                                            style={{ width: 300 }}
                                        />
                                    </Col>
                                    <Col span="6">
                                        <Row justify="end">
                                            <Space>
                                                <Button onClick={handleOpen} icon={<PlusOutlined />} style={{ marginLeft: 10 }} >Tạo sản phẩm</Button>
                                            </Space>
                                        </Row>
                                    </Col>
                                </Row>

                            </PageHeader>
                        </div>
                    </div>

                    <div style={{ marginTop: 30 }}>
                        <Table columns={columns} dataSource={product} pagination={{ position: ['bottomCenter'] }} />
                    </div>
                </div>

                <Drawer
                    title="Tạo sản phẩm mới"
                    visible={visible}
                    onClose={() => setVisible(false)}
                    width={1000}
                    footer={
                        <div
                            style={{
                                textAlign: 'right',
                            }}
                        >
                            <Button onClick={() => setVisible(false)} style={{ marginRight: 8 }}>
                                Hủy
                            </Button>
                            <Button onClick={handleSubmit} type="primary">
                                Hoàn thành
                            </Button>
                        </div>
                    }
                >
                    <Form
                        form={form}
                        name="eventCreate"
                        layout="vertical"
                        initialValues={{
                            residence: ['zhejiang', 'hangzhou', 'xihu'],
                            prefix: '86',
                        }}
                        scrollToFirstError
                    >
                        <Spin spinning={loading}>
                            <Form.Item
                                name="showPromotion"
                                style={{ marginBottom: 10 }}
                            >
                                <Checkbox onChange={handleShowPromotionChange}>Sách nói?</Checkbox>
                            </Form.Item>
                            <Form.Item
                                name="name"
                                label="Tên"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập tên!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <Input placeholder="Tên" />
                            </Form.Item>
                            {!showPromotion && (
                                <>
                                    <Form.Item
                                        name="status"
                                        label="Trạng thái"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng chọn trạng thái!',
                                            },
                                        ]}
                                        style={{ marginBottom: 10 }}
                                    >
                                        <Select placeholder="Chọn trạng thái">
                                            <Select.Option value="Available">Còn hàng</Select.Option>
                                            <Select.Option value="Unavailable">Hết hàng</Select.Option>
                                            <Select.Option value="Discontinued">Ngừng kinh doanh</Select.Option>
                                        </Select>
                                    </Form.Item>

                                    <Form.Item
                                        name="price"
                                        label="Giá gốc"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Vui lòng nhập giá gốc!',
                                            },
                                        ]}
                                        style={{ marginBottom: 10 }}
                                    >
                                        <Input placeholder="Giá gốc" type="number" />
                                    </Form.Item>

                                    <Form.Item
                                        name="promotion"
                                        label="Giá giảm"
                                        style={{ marginBottom: 10 }}
                                    >
                                        <Input placeholder="Giá giảm" type="number" />
                                    </Form.Item>
                                </>)}
                            <Form.Item
                                name="manufacturer"
                                label="Nhà xuất bản"
                                style={{ marginBottom: 10 }}
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập nhà xuất bản!',
                                    },
                                ]}
                            >
                                <Input placeholder="Nhà xuất bản" />
                            </Form.Item>

                            <Form.Item
                                name="image"
                                label="Ảnh"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập chọn ảnh!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <input type="file" onChange={handleChangeImage}
                                    id="avatar" name="file"
                                    accept="image/png, image/jpeg" />
                            </Form.Item>

                            <Form.Item
                                name="audioUrl"
                                label="Audio URL"
                                style={{ marginBottom: 10 }}
                            >
                                <input
                                    type="file"
                                    onChange={handleChangeAudioUrl}
                                    id="audioUrl"
                                    name="audioUrl"
                                    accept="audio/mpeg, audio/wav, audio/ogg, audio/mp3"
                                />
                            </Form.Item>


                            <Form.Item
                                name="images"
                                label="Hình ảnh slide"
                                style={{ marginBottom: 10 }}
                            >
                                <Upload
                                    name="images"
                                    listType="picture-card"
                                    showUploadList={true}
                                    beforeUpload={() => false}
                                    onChange={handleImageUpload}
                                    multiple
                                >
                                    <Button icon={<UploadOutlined />}>Tải lên</Button>
                                </Upload>
                            </Form.Item>

                            <Form.Item
                                name="url_book"
                                label="File sách"
                                style={{ marginBottom: 10 }}
                            >
                                <Upload
                                    name="images"
                                    listType="picture-card"
                                    showUploadList={true}
                                    beforeUpload={() => false}
                                    onChange={handleFileUpload}
                                    multiple
                                >
                                    <Button icon={<UploadOutlined />}>Tải lên sách</Button>
                                </Upload>
                            </Form.Item>

                            <Form.Item
                                name="category"
                                label="Danh mục"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng chọn danh mục!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >
                                <Select style={{ width: '100%' }} tokenSeparators={[',']} placeholder="Danh mục" showSearch filterOption={(input, option) =>
                                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }>
                                    {category.map((item, index) => {
                                        return (
                                            <Option value={item._id} key={index} >
                                                {item.name}
                                            </Option>
                                        )
                                    })}
                                </Select>
                            </Form.Item>

                            <Form.Item
                                name="description"
                                label="Mô tả"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Vui lòng nhập mô tả!',
                                    },
                                ]}
                                style={{ marginBottom: 10 }}
                            >

                                <SunEditor
                                    lang="en"
                                    placeholder="Content"
                                    onChange={handleChange}
                                    setOptions={{
                                        buttonList: [
                                            ["undo", "redo"],
                                            ["font", "fontSize"],
                                            // ['paragraphStyle', 'blockquote'],
                                            [
                                                "bold",
                                                "underline",
                                                "italic",
                                                "strike",
                                                "subscript",
                                                "superscript"
                                            ],
                                            ["fontColor", "hiliteColor"],
                                            ["align", "list", "lineHeight"],
                                            ["outdent", "indent"],

                                            ["table", "horizontalRule", "link", "image", "video"],
                                            // ['math'] //You must add the 'katex' library at options to use the 'math' plugin.
                                            // ['imageGallery'], // You must add the "imageGalleryUrl".
                                            // ["fullScreen", "showBlocks", "codeView"],
                                            ["preview", "print"],
                                            ["removeFormat"]

                                            // ['save', 'template'],
                                            // '/', Line break
                                        ],
                                        fontSize: [
                                            8, 10, 14, 18, 24,
                                        ], // Or Array of button list, eg. [['font', 'align'], ['image']]
                                        defaultTag: "div",
                                        minHeight: "500px",
                                        showPathLabel: false,
                                        attributesWhitelist: {
                                            all: "style",
                                            table: "cellpadding|width|cellspacing|height|style",
                                            tr: "valign|style",
                                            td: "styleinsert|height|style",
                                            img: "title|alt|src|style"
                                        }
                                    }}
                                />
                            </Form.Item>

                        </Spin>
                    </Form>
                </Drawer>


                <Drawer
                    title="Chỉnh sửa sản phẩm"
                    visible={openModalUpdate}
                    onClose={() => handleCancel("update")}
                    width={1000}
                    footer={
                        <div
                            style={{
                                textAlign: 'right',
                            }}
                        >
                            <Button onClick={() => {
                                form2
                                    .validateFields()
                                    .then((values) => {
                                        form2.resetFields();
                                        handleUpdateProduct(values);
                                    })
                                    .catch((info) => {
                                        console.log('Validate Failed:', info);
                                    });
                            }} type="primary" style={{ marginRight: 8 }}>
                                Hoàn thành
                            </Button>
                            <Button onClick={() => handleCancel("update")}>
                                Hủy
                            </Button>
                        </div>
                    }
                >
                    <Form
                        form={form2}
                        name="eventCreate"
                        layout="vertical"
                        initialValues={{
                            residence: ['zhejiang', 'hangzhou', 'xihu'],
                            prefix: '86',
                        }}
                        scrollToFirstError
                    >
                        <Form.Item
                            name="name"
                            label="Tên"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập tên!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Input placeholder="Tên" />
                        </Form.Item>

                        {!showPromotion && (
                            <>
                                <Form.Item
                                    name="status"
                                    label="Trạng thái"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng chọn trạng thái!',
                                        },
                                    ]}
                                    style={{ marginBottom: 10 }}
                                >
                                    <Select placeholder="Chọn trạng thái">
                                        <Select.Option value="Available">Còn hàng</Select.Option>
                                        <Select.Option value="Unavailable">Hết hàng</Select.Option>
                                        <Select.Option value="Discontinued">Ngừng kinh doanh</Select.Option>
                                    </Select>
                                </Form.Item>

                                <Form.Item
                                    name="price"
                                    label="Giá gốc"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Vui lòng nhập giá gốc!',
                                        },
                                    ]}
                                    style={{ marginBottom: 10 }}
                                >
                                    <Input placeholder="Giá gốc" type="number" />
                                </Form.Item>

                                <Form.Item
                                    name="promotion"
                                    label="Giá giảm"
                                    style={{ marginBottom: 10 }}
                                >
                                    <Input placeholder="Giá giảm" type="number" />
                                </Form.Item>
                            </>)}

                        <Form.Item
                            name="manufacturer"
                            label="Nhà xuất bản"
                            style={{ marginBottom: 10 }}
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập nhà xuất bản!',
                                },
                            ]}
                        >
                            <Input placeholder="Nhà xuất bản" />
                        </Form.Item>

                        <Form.Item
                            name="image"
                            label="Ảnh sản phẩm"
                            style={{ marginBottom: 10 }}
                        >
                            <input type="file" onChange={handleChangeImage}
                                id="avatar" name="file"
                                accept="image/png, image/jpeg" />
                        </Form.Item>

                        <Form.Item
                            name="url_book"
                            label="File sách"
                            style={{ marginBottom: 10 }}
                        >
                            <Upload
                                name="images"
                                listType="picture-card"
                                showUploadList={true}
                                beforeUpload={() => false}
                                onChange={handleFileUpload}
                            >
                                <Button icon={<UploadOutlined />}>Tải lên sách</Button>
                            </Upload>
                        </Form.Item>

                        <Form.Item
                            name="audioUrl"
                            label="Audio URL"
                            style={{ marginBottom: 10 }}
                        >
                            <input
                                type="file"
                                onChange={handleChangeAudioUrl}
                                id="audioUrl"
                                name="audioUrl"
                                accept="audio/mpeg, audio/wav, audio/ogg, audio/mp3"
                            />
                        </Form.Item>

                        <Form.Item
                            name="category"
                            label="Danh mục"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng chọn danh mục!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >
                            <Select style={{ width: '100%' }} tokenSeparators={[',']} placeholder="Danh mục" showSearch filterOption={(input, option) =>
                                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }>
                                {category.map((item, index) => {
                                    return (
                                        <Option value={item?._id} key={index} >
                                            {item?.name}
                                        </Option>
                                    )
                                })}
                            </Select>
                        </Form.Item>

                        <Form.Item
                            name="description"
                            label="Mô tả"
                            rules={[
                                {
                                    required: true,
                                    message: 'Vui lòng nhập mô tả!',
                                },
                            ]}
                            style={{ marginBottom: 10 }}
                        >

                            <SunEditor
                                lang="en"
                                placeholder="Content"
                                onChange={handleChange}
                                setContents={description}
                                setOptions={{
                                    buttonList: [
                                        ["undo", "redo"],
                                        ["font", "fontSize"],
                                        // ['paragraphStyle', 'blockquote'],
                                        [
                                            "bold",
                                            "underline",
                                            "italic",
                                            "strike",
                                            "subscript",
                                            "superscript"
                                        ],
                                        ["fontColor", "hiliteColor"],
                                        ["align", "list", "lineHeight"],
                                        ["outdent", "indent"],

                                        ["table", "horizontalRule", "link", "image", "video"],
                                        // ['math'] //You must add the 'katex' library at options to use the 'math' plugin.
                                        // ['imageGallery'], // You must add the "imageGalleryUrl".
                                        // ["fullScreen", "showBlocks", "codeView"],
                                        ["preview", "print"],
                                        ["removeFormat"]

                                        // ['save', 'template'],
                                        // '/', Line break
                                    ],
                                    fontSize: [
                                        8, 10, 14, 18, 24,
                                    ], // Or Array of button list, eg. [['font', 'align'], ['image']]
                                    defaultTag: "div",
                                    minHeight: "500px",
                                    showPathLabel: false,
                                    attributesWhitelist: {
                                        all: "style",
                                        table: "cellpadding|width|cellspacing|height|style",
                                        tr: "valign|style",
                                        td: "styleinsert|height|style",
                                        img: "title|alt|src|style"
                                    }
                                }}
                            />
                        </Form.Item>

                    </Form>
                </Drawer>



                {/* <Pagination style={{ textAlign: "center", marginBottom: 20 }} current={currentPage} defaultCurrent={1} total={totalEvent} onChange={handlePage}></Pagination> */}
                <BackTop style={{ textAlign: 'right' }} />
            </Spin>
        </div >
    )
}

export default ProductList;