import { createBrowserRouter } from "react-router";
import Protected from "./features/auth/components/Protected";
import Home from "./features/interview/pages/Home";
import Interview from "./features/interview/pages/Interview";
import MockInterview from "./features/interview/pages/MockInterview";
import LoginSignup from "./features/auth/pages/LoginSignup"; // Clean & Correct Import
import History from "./features/interview/pages/History"; // Added History Import

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <LoginSignup />
    },
    {
        path: "/register",
        element: <LoginSignup />
    },
    {
        path: "/",
        element: <Protected><Home /></Protected>
    },
    {
        path: "/interview/:interviewId",
        element: <Protected><Interview /></Protected>
    },
    {
        path: "/mock-interview/:interviewId",
        element: <Protected><MockInterview /></Protected>
    },
    {
        path: "/history",
        element: <Protected><History /></Protected> // Added /history route protected setup
    }
]);