import { useState } from "react";
import BlueLogo from "../../assets/logo/w-logo-blue.png";
import classes from "./Register.module.css";
import { useActionData, Form, NavLink } from "react-router-dom";
import { redirect } from "react-router-dom";

export default function RegisterUser() {
  const actionData = useActionData();

  return (
    <div className={classes.container}>
      <img src={BlueLogo} alt="WordPress Logo" className={classes.logo} />
      <div className={classes.loginBox}>
        <Form method="post">
          <div className={classes.inputContainer}>
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className={classes.inputField}
              placeholder="Enter your name"
              // required
            />
          </div>
          {actionData?.errors?.map((err, index) => (
            <p key={index} className={classes.fieldError}>
              {err.path === "name" ? err.msg : null}
            </p>
          ))}
          <div className={classes.inputContainer}>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className={classes.inputField}
              placeholder="Enter your email"
              // required
            />
          </div>
          {actionData?.errors?.map((err, index) => (
            <p key={index} className={classes.fieldError}>
              {err.path === "email" ? err.msg : null}
            </p>
          ))}
          <div className={classes.inputContainer}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className={classes.inputField}
              placeholder="Enter your password"
              // required
            />
          </div>
          {actionData?.errors?.map((err, index) => (
            <p key={index} className={classes.fieldError}>
              {err.path === "password" ? err.msg : null}
            </p>
          ))}
          {actionData?.error && (
            <div className={classes.errorBox}>
              <p className={classes.errorText}>{actionData.error}</p>
            </div>
          )}
          <div className={classes.rememberMe}>
            <input type="checkbox" id="remember" name="remember" />
            <label htmlFor="remember">Remember Me</label>
          </div>
          <button className={classes.loginButton} type="submit">
            Register Now!
          </button>
        </Form>
        <NavLink to="/auth/login" className={classes.loginUser}>
          Already a User? Login Now
        </NavLink>
        <p className={classes.forgotPassword}>Lost your password?</p>
        <NavLink to="/" className={classes.brandstore}>
          ← Go to Brandstore
        </NavLink>
      </div>
    </div>
  );
}

export async function action({ request, params }) {
  const data = await request.formData();

  const eventData = {
    name: data.get("name"),
    email: data.get("email"),
    password: data.get("password"),
  };

  console.log(eventData);

  const response = await fetch("http://localhost:5050/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(eventData),
  });

  const authData = await response.json();

  if (!response.ok) {
    return {
      error: authData.message || "Fill the details first.",
      errors: authData.data || [],
    };
  }

  return redirect("/auth/login");
}
