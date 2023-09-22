import { Outlet, useNavigation } from "react-router-dom";
import Footer from "../UI/Footer";
import NavBar from "../UI/NavBar";

function Root() {
  const navigation = useNavigation();

  return (
    <>
      <NavBar />
      <main>
        {navigation.state === "loading" && <p>Loading...</p>}
        <Outlet />
      </main>
      <Footer />
    </>
  );
}

export default Root;
