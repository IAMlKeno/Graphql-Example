import { useState } from "react";
import { useUser, type User } from "~/context/UserProvider";

export function UserSelectForm() {
  const [email, setEmail] = useState("");
  const [fetchedUser, setFetchedUser] = useState<User | null>(null);
  const { setUser } = useUser();

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await fetch("http://localhost:4000/graphql", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query Users($email: String!) {
          userByEmail(email: $email) {
            fname
            lname
            email
            dob
            id
          }
        }`,
        variables: { email },
      }),
    });
    const data: User|undefined = (await response.json()).data.userByEmail;
    console.log(data);
    // Mock API fetch
    const mockUser = {
      fname: "John",
      lname: "Doe",
      email,
      dob: 1777566142403,
      id: "1"
    };
    if (!data) {
      return;
    }
    setFetchedUser(data);
    setUser(data);
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
          <p><strong>First Name:</strong> {fetchedUser.fname}</p>
          <p><strong>Last Name:</strong> {fetchedUser.lname}</p>
          <p><strong>Email:</strong> {fetchedUser.email}</p>
          <p><strong>Date of Birth:</strong> {fetchedUser.dob}</p>
        </div>
      )}
    </div>
  );
}
