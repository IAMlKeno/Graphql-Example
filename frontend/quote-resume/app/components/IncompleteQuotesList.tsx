import React, { useContext, useEffect, useState } from "react";
import { useQuote, type Quote } from "~/context/QuoteProvider";
import { useIncompleteQuote } from "~/graphql/hooks";

interface QuoteList {
  ownerid: string;
}
export function IncompleteQuotesList({ ownerid }: QuoteList) {
  const [quotes, setQuotes] = useState([]);
  const { setQuote } = useQuote();

  useEffect(() => {
    const getIncompleteQuotes = async () => {
      const quotes = await useIncompleteQuote(ownerid);
      console.debug(quotes);
      setQuotes(quotes);
    }
    getIncompleteQuotes();
  }, []);

  const handleOnClick = (e: React.SubmitEvent, input) => {
    e.preventDefault();
    const v = e.target.value;
    console.debug()
  }

  const handleContinue = (quote: Quote) => {
    console.log(`Continuing qoute: ${quote.id}`);
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
              <tr><th>Qoute Id</th><th>Type</th><th>Actions</th></tr>
              {(quotes).map((quote, idx) => (
                <tr key={idx}>
                  <td>{quote.id.substr(0, 7)}</td>
                  <td>{quote.insurance_type}</td>
                  <td><a className="function-link" onClick={() => handleContinue(quote)}>continue</a> | <a className="function-link" onClick={() => handleDelete(quote)}>delete</a></td>
                </tr>
              ))}
            </table>
          </>
        }
      </div>
    </>
  );
}
