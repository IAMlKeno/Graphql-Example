import React, { createContext, useContext, useState } from "react";

export enum InsuranceType {
  automotive,
  home,
  life,
}
export interface Quote {
  id: string;
  insurance_type: InsuranceType;
  estimate: number;
  // ownerid: String
}

interface QuoteContextType {
  quote: Quote;
  setQuote: (quote: Quote|null) => void;
}

const QuoteContext = createContext<QuoteContextType | undefined>(undefined);

export const QuoteProvider = ({children}: {children: React.ReactNode}) => {
  const [quote, setQuote] = useState<Quote | null>(null);

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