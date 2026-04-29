import React, { useContext, useState } from "react";
import { UserProvider, useUser } from "~/context/UserProvider";

interface QuoteFormData {
  insuranceType?: string;
  estimate?: string;
  ownerId?: string;
}

interface InsuranceQuoteFormProps {
  initialData?: QuoteFormData;
}

export default function InsuranceQuoteForm({ initialData }: InsuranceQuoteFormProps) {
  const [insuranceType, setInsuranceType] = useState(
    initialData?.insuranceType || ""
  );
  const { user } = useUser();

  const ownerId = initialData?.ownerId || "user-12345";

  const calculateEstimate = (type: string) => {
    switch (type) {
      case "automotive":
        return "$120/month";
      case "home":
        return "$85/month";
      case "life":
        return "$60/month";
      default:
        return "";
    }
  };

  const estimate = initialData?.estimate || calculateEstimate(insuranceType);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload = {
      insuranceType,
      estimate,
      ownerId,
    };

    console.log("Submitting quote:", payload);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4">Insurance Quote Form</h2>

        <label className="block mb-2 font-medium">Insurance Type</label>
        <select
          value={insuranceType}
          onChange={(e) => setInsuranceType(e.target.value)}
          className="w-full border rounded-lg p-2 mb-4"
          required
        >
          <option value="">Select Insurance Type</option>
          <option value="automotive">Automotive</option>
          <option value="home">Home</option>
          <option value="life">Life</option>
        </select>

        <label className="block mb-2 font-medium">Estimated Premium</label>
        <input
          type="text"
          value={estimate}
          readOnly
          className="w-full border rounded-lg p-2 mb-4 bg-gray-100"
        />

        <input type="hidden" value={ownerId} name="ownerId" />

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
  );
}
