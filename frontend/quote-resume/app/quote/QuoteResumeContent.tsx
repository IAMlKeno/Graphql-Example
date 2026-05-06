import { useQuery } from "@apollo/client/react";
import { GET_GREETING } from "~/graphql/queries";
import InsuranceQuoteForm from "~/components/forms/InsuranceQuoteForm";
import SignOutButton from "~/components/SignOutButton";
import UserDisplay from "~/components/UserDisplay";
import RegistrationActions from "~/components/RegistrationActions";
import { useUser } from "~/context/UserProvider";
import { useEffect, useState } from "react";
import { IncompleteQuotesList } from "~/components/IncompleteQuotesList";
import { QuoteProvider } from "~/context/QuoteProvider";

export function QuoteResumeContent() {
  // const { data } = useQuery(GET_GREETING);
  const { user } = useUser();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // on re-render, if a user is present
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
            <IncompleteQuotesList ownerid={user.id} />
            <div className="quote-form">
              <InsuranceQuoteForm />
            </div>
          </>
        }
      </QuoteProvider>
    </>
  );
}
