import { useQuery } from "@apollo/client/react";
import React, { useContext, useEffect, useState } from "react";
import { useQuote, type Quote } from "~/context/QuoteProvider";
import { useIncompleteQuote } from "~/graphql/hooks";
import { GET_INCOMPLETE_QUOTES } from "~/graphql/queries";
import { getUuidSubstring } from "~/utils";

interface QuoteList {
  ownerid: string;
}
export function IncompleteQuotesList({ ownerid }: QuoteList) {
  const [quotes, setQuotes] = useState([]);
  const { setQuote } = useQuote();
  const { loading, error, data } = useQuery(GET_INCOMPLETE_QUOTES, {
    variables: { ownerid },
    skip: !ownerid
  });

  useEffect(() => {
    if (ownerid && data) {
      console.debug('quotes', data);
      setQuotes(data.incompleteQuotesForUser);
    }
    // const getIncompleteQuotes = async () => {
    //   const quotes = await useIncompleteQuote(ownerid);
    //   console.debug('INCOMPLETE QUOTES:', quotes);
    //   setQuotes(quotes);
    // }
    // getIncompleteQuotes();
  }, [loading]);

  const handleOnClick = (e: React.SubmitEvent, input) => {
    e.preventDefault();
    const v = e.target.value;
    console.debug()
  }

  const handleContinue = (quote: Quote) => {
    console.log(`Continuing qoute: ${quote.id}`, {...quote});
    setQuote(quote);
  }

  const handleDelete = (quote: string) => {
    console.log(`deleting qoute: ${quote}`);
  }

  return (
    <>
      <div className="incomplete-quote-container">
        {quotes.length < 1 &&
          <div>Not incomplete quotes.</div>
        }
        {quotes.length >= 1 &&
          <>
            <div style={{ margin: "auto", textAlign: "center" }}> Here are some quotes you haven't complete:</div>
            <table className="incomplete-quotes-table">
              <thead>
                <tr>
                  <th>Date Started</th>
                  <th>Type</th>
                  <th>Quote Id</th>
                  <th>Actions</th></tr>
              </thead>
              <tbody>
                {(quotes).map((quote, idx) => (
                  <tr key={idx}>
                    <td>{quote.date_submitted}</td>
                    <td>{quote.insurance_type}</td>
                    <td>{getUuidSubstring(quote.id)}</td>
                    <td>
                      <a className="function-link" onClick={() => handleContinue(quote)}>continue</a> | <a className="function-link" onClick={() => handleDelete(quote)}>delete</a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        }
      </div>
    </>
  );
}
