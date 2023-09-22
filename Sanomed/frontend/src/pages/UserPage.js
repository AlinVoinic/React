import { useEffect, useState, useContext } from "react";

import { AuthContext } from "../components/shared/context/auth-context";
import { useHttpHook } from "../components/shared/hooks/http-hook";
import User from "../components/Auth/User";

import LoadingSpinner from "../UI/LoadingSpinner";
import PageContent from "../UI/PageContent";
import Modal from "../UI/Modal";

import { ImCancelCircle } from "react-icons/im";
import eu from "../images/user_image.png";

function UserPage() {
  const { isLoading, error, sendRequest, clearError } = useHttpHook();
  const [loadedUser, setLoadedUser] = useState();
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await sendRequest(
          `http://localhost:5000/api/user/${auth.userID}`
        );
        setLoadedUser(data.user);
      } catch (err) {}
    };
    fetchUser();
  }, [sendRequest, auth]);

  return (
    <>
      <Modal
        show={!!error}
        onCancel={clearError}
        header="A apărut o eroare!"
        footer={<ImCancelCircle onClick={clearError}></ImCancelCircle>}
      >
        <p>{error}</p>
      </Modal>
      {isLoading && <LoadingSpinner asOverlay />}

      <PageContent title="Contul meu - SANOMED">
        {!isLoading && loadedUser && <User info={loadedUser} />}
      </PageContent>
    </>
  );
}

export default UserPage;

export const DUMMY_USERS = [
  {
    id: "54011",
    imageURL: eu,
    //"https://lisimed.ro/wp-content/uploads/2020/07/26445461-Lisimed-Avatar-Placeholder-EL.jpg",
    nume: "Voinic",
    prenume: "Gigel-Alin",
    telefon: "0746029660",
    email: "alin.voinic@yahoo.com",
    password: "marzia69A!",
    gender: "Masculin", // Femeie / Barbat (input="radio")
    birthday: "August 01 2000", // pe UI, de pe dribbble
    city: "Slatina",
    zip: "077042",
    address: "Strada Garofitei nr4",
    appointments: [{}], // va include si un file upload!
    appPAST: 2,
    appFUTURE: 1,
    doctorReviews: [], // vedem ce review a lasat doctorilor
  },
  {},
];
