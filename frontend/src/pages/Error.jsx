import { useRouteError } from "react-router-dom";
import NavigationBar from "../components/navigation/NavigationBar";

export default function ErrorPage() {
  const error = useRouteError();

  let title = "An error occurred!";
  let message = "Something went wrong. Please try again later!";

  if (error.status === 500) {
    message = "We are having some technical issues. Please try again later.";
  } else if (error.status === 404) {
    title = "Not found!";
    message = "The resource you are looking for could not be found.";
  } else if (error.status === 401) {
    title = "Unauthorized!";
    message = "You are not logged in or your session has expired.";
  } else if (error.status && error.status !== 404 && error.status !== 500) {
    title = "Unexpected error!";
    message = "An unexpected issue occurred. Please try again later.";
  }

  return (
    <>
      <NavigationBar />
      <main style={{ paddingTop: "80px" }}>
      <div style={{ textAlign: "center", fontSize: "40px" }}>{title}</div>
      <div style={{ textAlign: "center", fontSize: "30px" }}>{message}</div>
      </main>
    </>
  );
}
