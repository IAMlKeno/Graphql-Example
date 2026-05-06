import { useMutation } from "@apollo/client/react";
import { useState } from "react";
import { useUser } from "~/context/UserProvider";
import { ADD_USER } from "~/graphql/queries";

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
}

export function UserCreateForm() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
  });

  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { setUser } = useUser();
  const [addUser, { loading }] = useMutation(ADD_USER);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.debug({...formData});
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const checkEmailAvailability = async () => {
    const unavailableEmails = ["existing@test.com"];
    setEmailAvailable(!unavailableEmails.includes(formData.email));
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();
    setSubmitError(null);

    try {
      const { data }: any = await addUser({
        variables: {
          user: {
            fname: formData.firstName,
            lname: formData.lastName,
            dob: new Date(formData.dateOfBirth).toISOString(),
            email: formData.email,
          },
        },
      });

      if (data?.addUser) {
        setUser({...data.addUser});
      }
    } catch (err) {
      setSubmitError("Failed to create account. Please try again.");
    }
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Create New User, please</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="firstName"
          placeholder="First Name"
          value={formData.firstName}
          onChange={handleChange}
          className="border p-2 w-full mb-3"
          required
        />

        <input
          name="lastName"
          placeholder="Last Name"
          value={formData.lastName}
          onChange={handleChange}
          className="border p-2 w-full mb-3"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          onBlur={checkEmailAvailability}
          className="border p-2 w-full mb-2"
          required
        />

        {emailAvailable === false && (
          <p className="text-red-500 mb-2">Email is already in use</p>
        )}
        {emailAvailable === true && (
          <p className="text-green-500 mb-2">Email is available</p>
        )}

        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          className="border p-2 w-full mb-4"
          required
        />

        {submitError && (
          <p className="text-red-500 mb-2">{submitError}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create User"}
        </button>
      </form>
    </div>
  );
}
