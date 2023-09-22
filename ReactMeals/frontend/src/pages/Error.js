import { useRouteError } from "react-router-dom";

import PageContent from "../UI/PageContent";
import NavBar from "../UI/NavBar";
// import Footer from "../components/shared/Footer";

function Error() {
  const error = useRouteError();

  let title = "An error occured!";
  let message = "Something went wrong";

  if (error.status === 500) {
    // message = JSON.parse(error.data).message; // din Response
    message = error.data.message; // folosind functia 'json'
  }
  if (error.status === 404) {
    title = "Page Not found!";
    message = "Could not find resourse or page.";
  }

  return (
    <>
      <NavBar />
      <PageContent title={title}>
        <div>{message}</div>
      </PageContent>
      {/* <Footer /> */}
    </>
  );
}

export default Error;
