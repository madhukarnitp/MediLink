import { lazy, Suspense, useEffect } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AppProvider, useApp, PAGES } from "./context/AppContext";
import AppShell from "./components/layout/AppShell";
import DoctorShell from "./components/layout/DoctorShell";
import AdminShell from "./components/layout/AdminShell";
import IncomingCallNotice from "./components/layout/IncomingCallNotice";
import Toast from "./components/ui/Toast";
import { FullPageSkeleton, PageSkeleton } from "./components/ui/UI";
import { startKeepAlive, stopKeepAlive } from "./services/keepAlive";
import {
  getMissingProfileFields,
  needsProfileCompletion,
} from "./utils/profileCompletion";
import "./styles/globals.css";

const Login = lazy(() => import("./pages/auth/Login"));
const Register = lazy(() => import("./pages/auth/Register"));
const Dashboard = lazy(() => import("./pages/dashboard/Dashboard"));
const DoctorDashboard = lazy(() => import("./pages/doctor/DoctorDashboard"));
const DoctorPatients = lazy(() => import("./pages/doctor/DoctorPatients"));
const PatientVitals = lazy(() => import("./pages/health-records/PatientVitals"));
const PatientReports = lazy(() => import("./pages/health-records/PatientReports"));
const DoctorList = lazy(() => import("./pages/doctor/DoctorList"));
const Consultation = lazy(() => import("./pages/consultation/Consultation"));
const Appointments = lazy(() => import("./pages/appointments/Appointments"));
const Prescription = lazy(() => import("./pages/prescriptions/Prescription"));
const PrescriptionList = lazy(() => import("./pages/prescriptions/PrescriptionList"));
const ConsultationList = lazy(() => import("./pages/consultation/ConsultationList"));
const CreatePrescription = lazy(() => import("./pages/prescriptions/CreatePrescription"));
const DoctorPrescriptions = lazy(() => import("./pages/prescriptions/DoctorPrescriptions"));
const HealthRecords = lazy(() => import("./pages/health-records/HealthRecords"));
const Orders = lazy(() => import("./pages/orders/Orders"));
const SOSPage = lazy(() => import("./pages/sos/SOSPage"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminDoctors = lazy(() => import("./pages/admin/AdminDoctors"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders"));
const AdminMedicines = lazy(() => import("./pages/admin/AdminMedicines"));
const Profile = lazy(() => import("./pages/profile/Profile"));
const ErrorPage = lazy(() => import("./pages/error/ErrorPage"));
const ChatbotWidget = lazy(() => import("./components/ui/ChatbotWidget"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30_000,
    },
  },
});

const loadingFallback = <PageSkeleton />;

const adminPages = {
  [PAGES.ADMIN_DASHBOARD]: AdminDashboard,
  [PAGES.ADMIN_USERS]: AdminUsers,
  [PAGES.ADMIN_DOCTORS]: AdminDoctors,
  [PAGES.ADMIN_ORDERS]: AdminOrders,
  [PAGES.ADMIN_MEDICINES]: AdminMedicines,
  [PAGES.PROFILE]: Profile,
  [PAGES.NOT_FOUND]: ErrorPage,
};

const doctorPages = {
  [PAGES.DOCTOR_DASHBOARD]: DoctorDashboard,
  [PAGES.DOCTOR_PATIENTS]: DoctorPatients,
  [PAGES.PATIENT_VITALS]: PatientVitals,
  [PAGES.PATIENT_REPORTS]: PatientReports,
  [PAGES.CREATE_PRESCRIPTION]: CreatePrescription,
  [PAGES.DOCTOR_PRESCRIPTIONS]: DoctorPrescriptions,
  [PAGES.CONSULTATION]: Consultation,
  [PAGES.CONSULTATION_LIST]: ConsultationList,
  [PAGES.APPOINTMENTS]: Appointments,
  [PAGES.PRESCRIPTION]: Prescription,
  [PAGES.PRESCRIPTION_VERIFY]: Prescription,
  [PAGES.PROFILE]: Profile,
  [PAGES.NOT_FOUND]: ErrorPage,
};

const patientPages = {
  [PAGES.DASHBOARD]: Dashboard,
  [PAGES.DOCTORS]: DoctorList,
  [PAGES.CONSULTATION]: Consultation,
  [PAGES.APPOINTMENTS]: Appointments,
  [PAGES.PRESCRIPTION]: Prescription,
  [PAGES.PRESCRIPTION_VERIFY]: Prescription,
  [PAGES.PRESCRIPTION_LIST]: PrescriptionList,
  [PAGES.CONSULTATION_LIST]: ConsultationList,
  [PAGES.RECORDS]: HealthRecords,
  [PAGES.ORDERS]: Orders,
  [PAGES.SOS]: SOSPage,
  [PAGES.PROFILE]: Profile,
  [PAGES.NOT_FOUND]: ErrorPage,
};

function PageRouter() {
  const { activePage, user } = useApp();
  let Page;

  if (user?.role === "admin") {
    Page = adminPages[activePage] ?? ErrorPage;
  } else if (user?.role === "doctor") {
    Page = doctorPages[activePage] ?? ErrorPage;
  } else {
    Page = patientPages[activePage] ?? ErrorPage;
  }

  return <Page />;
}

function AppContent() {
  useEffect(() => {
    startKeepAlive();
    return () => stopKeepAlive();
  }, []);

  const location = useLocation();
  const {
    activePage,
    dismissToast,
    isAuthenticated,
    loading,
    pageParams,
    profile,
    profileLoaded,
    selectedPrescriptionId,
    toasts,
    user,
  } = useApp();
  if (loading) return <FullPageSkeleton />;
  const isVerificationPage =
    activePage === PAGES.PRESCRIPTION_VERIFY &&
    (selectedPrescriptionId || pageParams?.prescriptionId);
  const isPublicPrescription =
    activePage === PAGES.PRESCRIPTION &&
    (selectedPrescriptionId || pageParams?.prescriptionId) &&
    pageParams?.publicDetail;
  const rawRoute =
    location.hash.replace(/^#\/?/, "") || location.pathname.replace(/^\/+/, "");
  const isLoginUrl = rawRoute === "" || /^login(?:[/?#]|$)/i.test(rawRoute);
  const isRegisterUrl = /^register(?:[/?#]|$)/i.test(rawRoute);
  const isEmailVerificationUrl = /^verify-email\/[^/?#]+/i.test(rawRoute);
  const isPublicPrescriptionUrl = /^prescription\/[^/?#]+/i.test(rawRoute);
  const isPublicError =
    !isAuthenticated &&
    activePage === PAGES.NOT_FOUND &&
    !isLoginUrl &&
    !isRegisterUrl &&
    !isEmailVerificationUrl;
  const missingProfileFields = profileLoaded
    ? getMissingProfileFields(user, profile)
    : [];
  const mustCompleteProfile =
    isAuthenticated &&
    profileLoaded &&
    needsProfileCompletion(user, profile) &&
    user?.role !== "admin";

  if (
    isVerificationPage ||
    isPublicPrescription ||
    isPublicPrescriptionUrl ||
    pageParams?.publicVerification
  ) {
    return (
      <>
        <Suspense fallback={loadingFallback}>
          <Prescription />
        </Suspense>
        <Toast onDismiss={dismissToast} toasts={toasts} />
      </>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Suspense fallback={loadingFallback}>
          {isRegisterUrl || isEmailVerificationUrl ? (
            <Register />
          ) : isPublicError ? (
            <ErrorPage />
          ) : (
            <Login />
          )}
        </Suspense>
        <Toast onDismiss={dismissToast} toasts={toasts} />
      </>
    );
  }

  const Shell =
    user?.role === "doctor"
      ? DoctorShell
      : user?.role === "admin"
        ? AdminShell
        : AppShell;
  return (
    <Shell>
      <IncomingCallNotice />
      <Suspense fallback={loadingFallback}>
        {mustCompleteProfile ? (
          <Profile
            missingFields={missingProfileFields}
            requireCompletion
          />
        ) : (
          <PageRouter />
        )}
      </Suspense>
      <Toast onDismiss={dismissToast} toasts={toasts} />
      {!mustCompleteProfile && (
        <Suspense fallback={null}>
          <ChatbotWidget />
        </Suspense>
      )}
    </Shell>
  );
}

export default function App() {
  return (
    <div className="light-theme">
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <AppProvider>
            <AppContent />
          </AppProvider>
        </QueryClientProvider>
      </BrowserRouter>
    </div>
  );
}
