import InsuranceQuoteForm from "~/components/forms/InsuranceQuoteForm";
import SignOutButton from "~/components/SignOutButton";
import UserDisplay from "~/components/UserDisplay";
import RegistrationActions from "~/components/RegistrationActions";
import { useUser } from "~/context/UserProvider";
import { useEffect, useState } from "react";
import { IncompleteQuotesList } from "~/components/IncompleteQuotesList";
import { QuoteProvider } from "~/context/QuoteProvider";

export function QuoteResumeContent() {
  const { user } = useUser();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (user) {
      setIsLoggedIn(true);
    }
  }, [user]);

  return (
    <>
      <h2 className="center">Insurance Quote System</h2>
      {!user &&
        <div>
          <div className="center">Sign in or sign up to create a quote</div>
          <RegistrationActions />
        </div>
      }
      {user &&
        <div className="user-display-container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <UserDisplay />
          <SignOutButton />
        </div>
      }
      <hr />
      <QuoteProvider>
        {isLoggedIn && user &&
          <>
            <div className="incomplete-list-container">
              <IncompleteQuotesList ownerid={user.id} />
            </div>
            <div className="quote-form">
              <InsuranceQuoteForm />
            </div>
          </>
        }
      </QuoteProvider>
    </>
  );
}
