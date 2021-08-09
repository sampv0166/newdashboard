import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import TextField from "../components/TextField";
import { Formik, Form } from "formik";
import { Col, Row, Tabs } from "react-bootstrap";
import Select from "../components/Select";
import {
  addProduct,
  deleteProduct,
  getProduct,
  updateProduct,
} from "./api/products";
import { getCategory } from "./api/category";
import { getShops, getshops } from "./api/shop";

import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import ProductVariationScreen from "./VariationScreen";
import { Modal, Tab } from "bootstrap";
import { SketchPicker } from "react-color";

const EditProduct = ({ match, history }) => {
  const [productVariations, setProductVariations] = useState([]);
  const [productImage, setProductImage] = useState([]);
  const [products, setProducts] = useState([]);
  const [currentProduct, setCurrentProduct] = useState([]);
  const [category, setCategory] = useState([]);
  const [subCategory, setSubCategory] = useState([]);
  const [shops, setShops] = useState([]);
  const [images, setImages] = useState([]);
  const [variationId, setVariationId] = useState(0);
  const [img, setImg] = useState(0);
  const [showProductVariation, setProductvariation] = useState(0);
  const [varId, setVarId] = useState(0);
  const [show, setShow] = useState(false);
  const [active, setActive] = useState({ checked: false });
  const [special, setSpecial] = useState({ checked: false });
  const [bestSeller, setBestSeller] = useState({ checked: false });
  const [offer, setOffer] = useState({ checked: false });

  const productId = match.params.id;

  const validate = Yup.object({
    name_ar: Yup.string().required("Required"),
    name_en: Yup.string().required("Required"),
    image: Yup.string().required("Required"),
    shop_id: Yup.number(),
    description_ar: Yup.string().required("Required"),
    description_en: Yup.string().required("Required"),
    category_id: Yup.number(),
    subcategory_id: Yup.number(),
    sort_index: Yup.number(),
  });

  const handleImageChange = (e, formik) => {
    if (e.target.files) {
      const U = URL.createObjectURL(e.target.files[0]);
      setProductImage(U);
      URL.revokeObjectURL(e.target.files);
    }
    formik.setFieldValue("image", e.currentTarget.files[0]);
    setImg(e.currentTarget.files[0]);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await getProduct();
      data.data.map((product) => {
        if (product.id == productId) {
          setCurrentProduct(product);
          setProductVariations(product.variations);

          //console.log(productVariations);

          product.variations.map((variations) => {
            setImages(variations.images);
            setVariationId(variations.id);

            // console.log(variationId);
            console.log(images);
            variations.images.map((variationimages) => {
              // console.log(variationimages);
            });
          });

          // console.log(product);
        }
      });
    };

    products.map((product) => {
      //console.log(product);

      if (product.id == productId) {
        setCurrentProduct(product);
      }
    });

    const fetCategory = async () => {
      //const { data } = await getCategory();
      const category2 = [
        {
          active: "false",
          name_ar: "ABC",
          name_en: "CBA",
          created_at: "2021-07-01 18:11:18",
          id: 8,
          fullimageurl:
            "http://127.0.0.1:8000/storage/cdn/dxoU2rRvuky3Pvn4IyakNjT2ijIleNMMtezQzmJf.png",
        },
      ];
      let objects = [category2.length];

      for (var x = 0; x < category2.length; x++) {
        objects[x] = { key: category2[x].name_en, value: category2[x].id };
      }
      setCategory(objects);
      setSubCategory(objects);
    };

    const fetchShops = async () => {
      const user = JSON.parse(localStorage.getItem("userInfo"));

      const data = await getShops(user.success.token);
      const shops = data.data;
      console.log(shops);
      // console.log(users);
      let arr = [shops.length];

      for (var x = 0; x < shops.length; x++) {
        arr[x] = { key: shops[x].shop_name_en, value: shops[x].id };
      }
      //const { data } = await getshops();
      setShops(arr);
    };
    fetchShops();
    fetCategory();
    fetchProducts();
  }, [productId]);

  const handleSubmit = async (formdata) => {
    const res = await addProduct(formdata, history);
    // history.push('/product');
  };

  const deleteProductHandler = async (id) => {
    if (window.confirm("Are you sure")) {
      deleteProduct(id);
      history.push("/products");
      console.log(id + " category deleted");
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-end">
        <button className="btn btn-success mt-3 my-2 px-5 py-3" type="submit">
          Save
        </button>
        <button
          className="btn btn-danger mx-2 mt-3 my-2 px-5 py-3"
          type="submit"
          onClick={() => deleteProductHandler(productId)}
        >
          Delete
        </button>

       
      </div>

      <Card border="light" className="bg-white shadow-sm mb-4">
        <Card.Body>
          <Formik
            enableReinitialize
            initialValues={{
              name_ar: currentProduct.name_ar || "",
              name_en: currentProduct.name_en || "",
              image: currentProduct.coverimage || "",
              shop_id: currentProduct.shop_id || "",
              description_ar: currentProduct.description_ar || "",
              description_en: currentProduct.description_en || "",
              category_id: 0,
              subcategory_id: 0,
              sort_index: currentProduct.sort_index || 0,
            }}
            validationSchema={validate}
            onSubmit={(values) => {
              //console.log(values.name_ar)
              let formdata = new FormData();
              formdata.append("name_ar", values.name_ar);
              formdata.append("name_en", values.name_en);

              formdata.append("description_ar", values.description_ar);
              formdata.append("description_en", values.description_en);
              formdata.append("image", values.image);
              for (var value of formdata.entries()) {
                console.log(value);
              }
              handleSubmit(formdata);
            }}
          >
            {(formik) => (
              <div className="my-4">
                <div className="row">
                  <div className="col-5">
                    {console.log(formik.values)}
                    {productId ? (
                      <Card
                        className="my-2 p-1 rounded"
                        style={{ height: "280px", objectFit: "cover" }}
                      >
                        <Card.Img
                          style={{ height: "270px", objectFit: "contain" }}
                          src={productImage}
                          variant="top"
                        />
                        <div className="d-flex my-3">
                          <span className="icon icon-md"></span>
                          <input
                            type="file"
                            onChange={(e) => handleImageChange(e, formik)}
                            name="image"
                          />
                        </div>
                      </Card>
                    ) : (
                      <Card
                        className="my-2 p-1 rounded"
                        style={{ height: "280px", objectFit: "cover" }}
                      >
                        <Card.Img
                          style={{ height: "270px", objectFit: "contain" }}
                          src={currentProduct.coverimage}
                          variant="top"
                        />
                        <div className="d-flex my-3">
                          <span className="icon icon-md"></span>
                          <input
                            type="file"
                            onChange={(e) => handleImageChange(e, formik)}
                            name="image"
                          />
                        </div>
                      </Card>
                    )}
                  </div>

                  <div className="col-7">
                    <Row>
                      <Form>
                        <div className="row g-3">
                          <div className="col-md-6">
                            <TextField
                              label="Arabic Name"
                              name="name_ar"
                              type="text"
                            />
                          </div>
                          <div className="col-md-6">
                            <TextField
                              label="English Name"
                              name="name_en"
                              type="text"
                            />
                          </div>
                        </div>
                        <div className="row g-3">
                          <div className="col-md-6">
                            <TextField
                              label="Arabic Description"
                              name="description_ar"
                              type="text"
                            />
                          </div>
                          <div className="col-md-6">
                            <TextField
                              label="English Description"
                              name="description_en"
                              type="text"
                            />
                          </div>
                        </div>
                        <div className="row g-3">
                          <div className="col-md-6">
                            <Select
                              control="select"
                              label="Category"
                              name="category_id"
                              options={category}
                            ></Select>
                          </div>
                          <div className="col-md-6">
                            <Select
                              control="select"
                              label="Sub Category"
                              name="subcategory_id"
                              options={category}
                            ></Select>
                          </div>
                        </div>

                        <div className="row g-3">
                          <div className="col-md-6">
                            <Select
                              control="select"
                              label="Shop Name"
                              name="shop_id"
                              options={shops}
                            ></Select>
                          </div>
                        </div>

                        <div className="row g-3">
                          <Col>
                            <TextField
                              label="Sort Index"
                              name="sort_index"
                              type="number"
                            />
                          </Col>
                        </div>
                        <Row>
                          {productId ? <strong>Variations</strong> : ""}
                          {productVariations.map((pv) => (
                            <Col>
                              {/* <Link to={`/variations/${productId}/${pv.id}`}> */}
                              <Card
                                className="my-2 p-1 rounded"
                                style={{
                                  height: "60px",
                                  objectFit: "contain",
                                  width: "50px",
                                }}
                              >
                                <Card.Img
                                  style={{
                                    height: "50px",
                                    objectFit: "contain",
                                    cursor: "pointer",
                                  }}
                                  src={pv.images[0]}
                                  variant="top"
                                  onClick={(e) => {
                                    setVarId(pv.id);
                                  }}
                                />
                              </Card>
                            </Col>
                          ))}
                          <Col>
                            {" "}
                            <Card
                              className="my-2 p-1 rounded"
                              style={{
                                height: "60x",
                                width: "50px",
                                objectFit: "contain",
                                fontSize: "1rem",
                                color: "green",
                                cursor: "pointer",
                              }}
                              onClick={(e) => {
                                setVarId(0);
                              }}
                            >
                              <i class="bx bx-image-add bx-lg mx-3 my-3"></i>
                            </Card>
                          </Col>
                        </Row>
                      </Form>
                    </Row>
                  </div>
                </div>
              </div>
            )}
          </Formik>
        </Card.Body>
      </Card>
  
     
    </div>
  );
};

export default EditProduct;
