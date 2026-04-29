// ----------------------
// User Create Form

import { useState } from "react";
import type { User } from "~/context/UserProvider";

// ----------------------
export function UserCreateForm() {
  const [formData, setFormData] = useState<User>({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
  });

  const [emailAvailable, setEmailAvailable] = useState<boolean | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const checkEmailAvailability = async () => {
    // Mock API check
    const unavailableEmails = ["existing@test.com"];

    if (unavailableEmails.includes(formData.email)) {
      setEmailAvailable(false);
    } else {
      setEmailAvailable(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Creating user:", formData);
  };

  return (
    <div className="p-4 border rounded-lg">
      <h2 className="text-xl font-bold mb-4">Create New User</h2>

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

        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Create User
        </button>
      </form>
    </div>
  );
}
