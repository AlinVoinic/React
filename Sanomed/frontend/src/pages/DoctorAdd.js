import DoctorAdd from "../components/Doctors/DoctorAdd";
import PageContent from "../UI/PageContent";

import "../../src/components/Appointment/Programare.css";

function AuthPage() {
  return (
    <PageContent title="Adaugare medic">
      <DoctorAdd />
    </PageContent>
  );
}

export default AuthPage;
