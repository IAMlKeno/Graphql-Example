import { useState } from "react";
import { UserCreateForm } from "./forms/UserCreateForm";
import { UserSelectForm } from "./forms/UserSelectForm";

export default function RegistrationActions() {
  const [displayLogin, setDisplayLogin] = useState(false);
  const [displaySignup, setDisplaySignup] = useState(false);

  const handleToggleLogin = () => {
    setDisplaySignup(false);
    setDisplayLogin(true);
  }
  const handleToggleSignup = () => {
    setDisplayLogin(false);
    setDisplaySignup(true);
  }

  return (
    <>
    <div className="login-signup" style={{display: "flex", margin: "auto", width: "80%", justifyContent: "center"}}>
      <button
        type="button"
        className="w-full bg-blue-200 text-white py-2 rounded-lg hover:bg-blue-300"
        onClick={handleToggleLogin}
      >Sign In</button> | 
      {/* ---------- */}
      <button
        type="button"
        className="w-full bg-blue-200 text-white py-2 rounded-lg hover:bg-blue-300"
        onClick={handleToggleSignup}
      >Sign Up</button>
    </div>

    {displaySignup &&
      <div className="signup">
        <UserCreateForm />
      </div>
    }
    {displayLogin &&
      <div className="signin">
        <UserSelectForm />
      </div>
    }
    </>
  )
}
