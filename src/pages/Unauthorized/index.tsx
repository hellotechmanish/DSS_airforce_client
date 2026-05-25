import { useNavigate } from "react-router-dom";

import { Lock } from "lucide-react";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div
      className="flex min-h-screen items-center justify-center
      bg-slate-900 px-4"
    >
      <div
        className="w-full max-w-lg rounded-2xl
        bg-slate-800 p-10 text-center shadow-2xl"
      >
        {/* ICON */}

        <div className="mb-5 flex justify-center">
          <div
            className="flex h-20 w-20 items-center justify-center
            rounded-full bg-red-500/10"
          >
            <Lock size={40} className="text-red-500" />
          </div>
        </div>

        {/* TITLE */}

        <h1
          className="mb-3 text-3xl font-bold
          text-white"
        >
          403 - Access Denied
        </h1>

        {/* DESCRIPTION */}

        <p
          className="mb-8 text-sm leading-6
          text-slate-300"
        >
          You do not have permission to access this page.
          <br />
          Please contact your administrator if you believe this is a mistake.
        </p>

        {/* BUTTONS */}

        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/")}
            className="rounded-lg bg-blue-600 px-5 py-2
            font-medium text-white transition hover:bg-blue-700"
          >
            Go to Home
          </button>

          <button
            onClick={() => {
              localStorage.clear();

              navigate("/signIn");
            }}
            className="rounded-lg border border-slate-500
            px-5 py-2 font-medium text-white
            transition hover:bg-slate-700"
          >
            Login Again
          </button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
