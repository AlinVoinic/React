import DoctorEdit from "../components/Doctors/DoctorEdit";
import PageContent from "../UI/PageContent";

import "../../src/components/Appointment/Programare.css";

function AuthPage() {
  return (
    <PageContent title="Editare medic">
      <DoctorEdit />
    </PageContent>
  );
}

export default AuthPage;
