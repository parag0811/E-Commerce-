import BlueLogo from "../../assets/logo/w-logo-blue.png";
import classes from "./Login.module.css";
import { useActionData, Form, NavLink } from "react-router-dom";
import { redirect } from "react-router-dom";

export default function LoginUser() {
  const actionData = useActionData();

  return (
    <div className={classes.container}>
      <img src={BlueLogo} alt="WordPress Logo" className={classes.logo} />
      <div className={classes.loginBox}>
        <Form method="post">
          <div className={classes.inputContainer}>
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className={classes.inputField}
              placeholder="Enter your email"
            />
          </div>
          <div className={classes.inputContainer}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className={classes.inputField}
              placeholder="Enter your password"
            />
          </div>
          {actionData?.error && (
            <div className={classes.errorBox}>
              <p className={classes.errorText}>{actionData.error}</p>
              {actionData.errors?.map((err, index) => (
                <p key={index} className={classes.fieldError}>
                  {err.msg}
                </p>
              ))}
            </div>
          )}

          <div className={classes.rememberMe}>
            <input type="checkbox" id="remember" name="remember" />
            <label htmlFor="remember">Remember Me</label>
          </div>
          <button className={classes.loginButton} type="submit">
            Login Now!
          </button>
        </Form>
        <NavLink to="/auth/register" className={classes.registerUser}>
          Don't have an account? Register Now
        </NavLink>
        <p className={classes.forgotPassword}>Forgot your password?</p>
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
    email: data.get("email"),
    password: data.get("password"),
  };

  const response = await fetch("http://localhost:5050/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(eventData),
  });

  const authData = await response.json();

  if (!response.ok) {
    return {
      error: authData.message || "Login Failed.",
      errors: authData.data || [],
    };
  }
  sessionStorage.setItem("token", authData.token);
  sessionStorage.setItem("userId", authData.userId);
  sessionStorage.setItem("username", authData.name);
  alert("login success");

  return redirect("/");
}
