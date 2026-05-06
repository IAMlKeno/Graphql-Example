import { useUser } from "~/context/UserProvider";

export default function SignOutButton() {
  const { setUser } = useUser();

  return (
    <button
      type="button"
      onClick={() => setUser(null)}
      className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
    >
      Sign Out
    </button>
  );
}
