import React, { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {  useNavigate } from "react-router-dom";
import '../styles/styles.css';

function Registration() {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const initialValues = {
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "name must be at least 3 characters")
      .required("name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Confirm Password is required"),
  });

  const onSubmit = (values, { setSubmitting }) => {
    fetch("http://localhost:3333/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    })
      .then((response) => {
        if (response.ok) {
          setSuccessMessage("Registration successful!");
          setErrorMessage("");
          navigate('/login')
        } else {
          setSuccessMessage("");
          setErrorMessage("Registration failed. Please try again.");
        }
        setSubmitting(false);
      })
      .catch((error) => {
        setSuccessMessage("");
        setErrorMessage("Registration failed. Please try again.");
        setSubmitting(false);
      });
  };

  return (
    <div>
    <h1>Registration Page</h1>
    <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
    >
        {({ isSubmitting }) => (
        <Form>
            <div>
            <label htmlFor="name">Name:</label>
            <Field type="text" name="name" />
            <ErrorMessage name="name" component="div" />
            </div>
            <div>
            <label htmlFor="email">Email:</label>
            <Field type="email" name="email" />
            <ErrorMessage name="email" component="div" />
            </div>
            <div>
            <label htmlFor="password">Password:</label>
            <Field type="password" name="password" />
            <ErrorMessage name="password" component="div" />
            </div>
            <div>
            <label htmlFor="confirmPassword">Confirm Password:</label>
            <Field type="password" name="confirmPassword" />
            <ErrorMessage name="confirmPassword" component="div" />
            </div>
            <button type="submit" disabled={isSubmitting}>
            Register
            </button>
            
        </Form>
        )}
    </Formik>
    {successMessage && <div>{successMessage}</div>}
    {errorMessage && <div>{errorMessage}</div>}
    </div>
  );
}

export default Registration