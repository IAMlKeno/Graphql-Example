import { useMutation } from "@apollo/client/react";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { InsuranceType, useQuote, type Quote } from "~/context/QuoteProvider";
import { useUser } from "~/context/UserProvider";
import { ADD_QUOTE, DELETE_INCOMPLETE_QUOTE, type QuoteInput } from "~/graphql/queries";
import { calculateAge, calculateInsuranceRate } from "~/quote/utils";
import { getUuidSubstring } from "~/utils";

interface QuoteFormData {
  insuranceType?: string;
  estimate?: number;
  ownerid?: string;
}

interface InsuranceQuoteFormProps {
  initialData?: QuoteFormData;
}

export default function InsuranceQuoteForm({ initialData }: InsuranceQuoteFormProps) {
  const [insuranceType, setInsuranceType] = useState(
    initialData?.insuranceType || ""
  );
  const { user } = useUser();
  const { quote, setQuote } = useQuote();
  const [estimate, setEstimate] = useState(0);
  const [ownerid, setOwnerId] = useState('');
  const typeElem = useRef(null);
  const quoteIdElem = useRef(null);

  const userAge = useMemo(() => calculateAge(user.dob.toString()), [user]);

  const [addQuote, { loading, error }] = useMutation<QuoteInput>(ADD_QUOTE);
  const [deleteQuote] = useMutation<boolean>(DELETE_INCOMPLETE_QUOTE);

  useEffect(() => {
    setOwnerId(initialData?.ownerid || user.id);
    if (quote && quote.insurance_type != undefined) {
      setInsuranceType(quote.insurance_type);
      if (quote.estimate) {
        console.log(quote.estimate);
        setEstimate(quote.estimate);
      } else {
        console.log(`useeffect`, quote.insurance_type);
        setEstimate(calculateEstimate(quote.insurance_type));
      }
    }
  }, [user, quote]);

  const calculateEstimate = (type: string): number => {
    return calculateInsuranceRate(userAge, InsuranceType[type]);
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    const payload = {
      insuranceType,
      estimate,
      ownerid,
      id: quote.id
    };

    console.log("Submitting quote:", payload);
    try{
      await handleAddQuote();
      if (quote.id) {
        handleDeleteIncompleteQuote();
      }
    } catch(e) {
      console.error(`Failed to add the quote with the following error`, e, error);
    }
  };

  const handleDeleteIncompleteQuote = async () => {
    try {
      const { data }: any = await deleteQuote({
        variables: {
          id: quote.id
        }
      });
      console.log(`Result of deletion: ${data?.deleteIncompleteQuote}`);
      if (data?.deleteIncompleteQuote) {
        // remove from state

      }
    } catch (e) {

    }
  }

  const handleAddQuote = async (): Promise<Quote | undefined> => {
    const { data }: any = await addQuote({
      variables: {
        quote: {
          insurance_type: insuranceType,
          ownerid,
          estimate,
        },
      },
    });
    if (data?.addQuote) {
      alert(`Successfully added quote ${data.addQuote.id}`)
      return { ...data?.addQuote }
    }
    return undefined
  }

  const handleInsuranceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const type = e.currentTarget.value;
    console.log(type);
    setInsuranceType(type);
    const estimate: number = calculateEstimate(type);
    setEstimate(estimate);
  }

  const handleClearForm = () => {
    setQuote(null);
    setEstimate(0);
    setInsuranceType('');
  }

  return (
    <>
      <div className="justify-blocks" style={{display: "flex", justifyContent: "center", border:"1px solid", alignContent: "space-between", gap: "10px"}}>
        Quote Id: <span className="data-highlight">{(quote && quote?.id) ? getUuidSubstring(quote.id) : '--'}</span>
        <div className="">&nbsp;</div>
        <a className="function-link" onClick={handleClearForm}>Clear</a>
      </div>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <form
          onSubmit={handleSubmit}
          className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md"
        >
          <h2 className="text-2xl font-bold mb-4">Insurance Quote Form</h2>

          <label className="block mb-2 font-medium">Insurance Type</label>
          <select
            value={insuranceType}
            name="type"
            ref={typeElem}
            onChange={handleInsuranceChange}
            className="w-full border rounded-lg p-2 mb-4"
            required
          >
            <option value="">Select Insurance Type</option>
            <option value="automotive">Automotive</option>
            <option value="home">Home</option>
            <option value="life">Life</option>
          </select>

          <label className="block mb-2 font-medium">Estimated Premium (Based on your calculated age of: {userAge})</label>
          <input
            type="text"
            name="estimate"
            value={estimate}
            readOnly
            className="w-full border rounded-lg p-2 mb-4 bg-gray-100"
          />

          <input type="hidden" value={ownerid} name="ownerId" />

          <hr />
          <div className="user-context">
            {!user?.email &&
              (<p>Select user</p>)
            }
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            disabled={!user?.email}
          >
            Submit Quote
          </button>
        </form>
      </div>
    </>
  );
}
