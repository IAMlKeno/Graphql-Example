// ----------------------
// User Select Form

import { useState } from "react";
import { useUser, type User } from "~/context/UserProvider";

// ----------------------
export function UserSelectForm() {
  const [email, setEmail] = useState("");
  const [fetchedUser, setFetchedUser] = useState<User | null>(null);
  const { setUser } = useUser();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mock API fetch
    const mockUser = {
      firstName: "John",
      lastName: "Doe",
      email,
      dateOfBirth: "1990-05-10",
    };

    setFetchedUser(mockUser);
    setUser(mockUser);
  };

  return (
    <div className="p-4 border rounded-lg mb-6">
      <h2 className="text-xl font-bold mb-4">Find Existing User</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 w-full mb-4"
          required
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Search User
        </button>
      </form>

      {fetchedUser && (
        <div className="mt-4 bg-gray-100 p-4 rounded">
          <p><strong>First Name:</strong> {fetchedUser.firstName}</p>
          <p><strong>Last Name:</strong> {fetchedUser.lastName}</p>
          <p><strong>Email:</strong> {fetchedUser.email}</p>
          <p><strong>Date of Birth:</strong> {fetchedUser.dateOfBirth}</p>
        </div>
      )}
    </div>
  );
}
