import React, { createContext, useContext, useState } from "react";

export enum InsuranceType {
  automotive = "automotive",
  home = "home",
  life = "life",
}
export interface Quote {
  id: string;
  insurance_type: InsuranceType;
  estimate: number;
  data_submitted?: string;
  ownerid?: String
}

interface QuoteContextType {
  quote: Quote;
  setQuote: (quote: Quote|null) => void;
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export const QuoteProvider = ({children}: {children: React.ReactNode}) => {
  const [quote, setQuote] = useState<Quote | null>();

  return (
    <QuoteContext.Provider value={{ quote, setQuote }}>
    {children}
    </QuoteContext.Provider>
  );
}

export const useQuote = () => {
  const context = useContext(QuoteContext);
  return context;
}
