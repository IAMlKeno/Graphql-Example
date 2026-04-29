import { useUser } from "~/context/UserProvider";

export default function UserDisplay() {
  const { user } = useUser();

  return (
    <>
      {!!user?.email &&
        <h3>`Hi ${user.firstName}`</h3>
      }
    </>
  );
}