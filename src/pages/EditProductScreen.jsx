import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import TextField from "../components/TextField";
import { Formik, Form } from "formik";
import { Col, Row } from "react-bootstrap";
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
import AddNewProductVariationScreen from "./AddnewVariationScreen";

const EditProductScreen = ({
  match,
  history,
  setRefresh,
  refresh,
  varId,
  setVarId,
  showVariatio0nscreen,
  setShowVariationScreen,
}) => {
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

  const [active, setActive] = useState({ checked: false });
  const [special, setSpecial] = useState({ checked: false });
  const [bestSeller, setBestSeller] = useState({ checked: false });
  const [show, setShow] = useState(false);

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
          setProductImage(
            "https://www.khaymatapi.mvp-apps.ae/storage/" + product.urls
          );
          console.log(product);
          setCurrentProduct(product);
          setProductVariations(product.variations);
          if (product.bestseller === true) {
            setBestSeller({ checked: true });
          } else {
            setBestSeller({ checked: false });
          }
          if (product.isactive === true) {
            setActive({ checked: true });
          } else {
            setActive({ checked: false });
          }
          if (product.special === true) {
            setSpecial({ checked: true });
          } else {
            setSpecial({ checked: false });
          }
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
      const category2 = await getCategory();

      console.log(category2);

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
    const res = await updateProduct(formdata, history);
    setRefresh(1);
     history.push('/products');
  };

  const deleteProductHandler = async (id) => {
    if (window.confirm("Are you sure")) {
      deleteProduct(id);
      setRefresh(1);
      history.push("/products");

      console.log(id + " product deleted");
    }
  };

  return (
    <div>
      <Card border="light" className="bg-white shadow-sm mb-4">
        <Card.Body>
          <Formik
            enableReinitialize
            initialValues={{
              name_ar: currentProduct.name_ar || "",
              name_en: currentProduct.name || "",
              image: currentProduct.urls || "",
              shop_id: currentProduct.shop_id || "",
              description_ar: currentProduct.description_ar || "",
              description_en: currentProduct.description_en || "",
              category_id: currentProduct.category_id,
              subcategory_id: currentProduct.subcategory_id,
              sort_index: currentProduct.sort_index || 0,
              bestseller: currentProduct.bestseller || false,
              special: currentProduct.special || false,
              isactive: currentProduct.isactive || false,
            }}
            validationSchema={validate}
            onSubmit={(values) => {
              //console.log(values.name_ar)
              let formdata = new FormData();
              formdata.append("id", productId);
              formdata.append("name_ar", values.name_ar);
              formdata.append("name_en", values.name_en);
              formdata.append("description_ar", values.description_ar);
              formdata.append("description_en", values.description_en);

              if (typeof values.image === "string") {
                formdata.delete("image");
              } else {
                formdata.append("image", values.image);
              }

              formdata.append("category_id", values.category_id);
              formdata.append("subcategory_id", values.subcategory_id);
              formdata.append("shop_id", values.shop_id);

              values.special === true
                ? formdata.append("special", 1)
                : formdata.append("special", 0);
              values.isactive === true
                ? formdata.append("isactive", 1)
                : formdata.append("isactive", 0);
              values.bestseller === true
                ? formdata.append("bestseller", 1)
                : formdata.append("bestseller", 0);
              formdata.append("sort_index", values.sort_index);
              for (var value of formdata.entries()) {
                console.log(value);
              }
              handleSubmit(formdata);
            }}
          >
            {(formik) => (
              <Form>
                <div className="my-4">
                  <div className="row">
                    <div className="col-5">
                      {console.log(formik.values)}

                      <Card
                        className="my-2 p-1 rounded"
                        style={{ height: "280px", objectFit: "cover" }}
                      >
                        <Card.Img
                          style={{ height: "270px", objectFit: "contain" }}
                          src={`${productImage}`}
                          variant="top"
                        />
                      </Card>
                      <div className="d-flex my-2 ">
                        <label className="custom-file-upload w-100">
                          <input
                            type="file"
                            onChange={(e) => handleImageChange(e, formik)}
                            name="image"
                          />
                          <i className="bx bx-cloud-upload mx-2"></i>Upload New
                          Image
                        </label>
                      </div>
                    </div>

                    <div className="col-7">
                      <Row>
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
                        <div class="form-check form-switch">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            id="flexSwitchCheckDefault"
                            checked={active.checked}
                            onChange={(d) => {
                              active.checked === true
                                ? (d = false)
                                : (d = true);
                              setActive({ checked: d });
                              formik.setFieldValue("isactive", d);
                            }}
                          />
                          {console.log(active)}
                          <label
                            class="form-check-label"
                            for="flexSwitchCheckDefault"
                          >
                            Active Status
                          </label>
                        </div>

                        <div class="form-check form-switch">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            id="flexSwitchCheckDefault"
                            checked={special.checked}
                            onChange={(d) => {
                              special.checked === true
                                ? (d = false)
                                : (d = true);
                              setSpecial({ checked: d });
                              formik.setFieldValue("special", d);
                            }}
                          />
                          <label
                            class="form-check-label"
                            for="flexSwitchCheckDefault"
                          >
                            Special
                          </label>
                        </div>

                        <div class="form-check form-switch">
                          <input
                            class="form-check-input"
                            type="checkbox"
                            id="flexSwitchCheckDefault"
                            checked={bestSeller.checked}
                            onChange={(d) => {
                              bestSeller.checked === true
                                ? (d = false)
                                : (d = true);
                              setBestSeller({ checked: d });
                              formik.setFieldValue("bestseller", d);
                            }}
                          />
                          <label
                            class="form-check-label"
                            for="flexSwitchCheckDefault"
                          >
                            Best Seller
                          </label>
                        </div>
                        <Row>
                          {productVariations.map((pv, index) => (
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
                                    setShowVariationScreen(true);
                                    setVarId(pv.id);
                                  }}
                                />
                              </Card>
                            </Col>
                          ))}
                          <Col>
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
                                src="data:image/png;base64,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"
                                variant="top"
                                onClick={(e) => {
                                  setShowVariationScreen(true);
                                  setVarId(null);
                                }}
                              />
                            </Card>
                          </Col>
                        </Row>
                      </Row>
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-end">
                  <button
                    className="btn btn-outline-danger    mx-2 mt-3 my-2 px-5 py-3"
                    onClick={() => deleteProductHandler(productId)}
                  >
                    Delete Product
                  </button>
                  <button
                    className="btn btn-outline-success mt-3 my-2 px-5 py-3"
                    type="submit"
                  >
                    Update Product
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </Card.Body>
      </Card>

      {varId ? (
        showVariatio0nscreen ? (
          <ProductVariationScreen
            varId={varId}
            setVarId={setVarId}
            match={match}
            setShowVariationScreen={setShowVariationScreen}
          />
        ) : (
          ""
        )
      ) : showVariatio0nscreen ? (
        <AddNewProductVariationScreen
          varId={varId}
          setVarId={setVarId}
          match={match}
          setShowVariationScreen={setShowVariationScreen}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default EditProductScreen;
