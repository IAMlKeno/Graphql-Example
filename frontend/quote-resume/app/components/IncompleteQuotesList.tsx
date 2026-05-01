import { useEffect, useState } from "react";
import { useIncompleteQuote } from "~/graphql/hooks";

interface QuoteList {
  ownerid: string;
}
export function IncompleteQuotesList({ ownerid }: QuoteList) {
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    const getIncompleteQuotes = async () => {
      const quotes = await useIncompleteQuote(ownerid);
      console.debug(quotes);
      setQuotes(quotes);
    }
    getIncompleteQuotes();
  }, []);


  return (
    <>
      <div className="incomplete-quote-container">
        {quotes.length < 1 &&
          <div>Not incomplete quotes.</div>
        }
        {quotes.length >= 1 &&
          <ul>
            {(quotes).map((quote, idx) => (<ol key={idx}>{quote.id} | {quote.insurance_type}</ol>))}
          </ul>}
      </div>
    </>
  );
}
