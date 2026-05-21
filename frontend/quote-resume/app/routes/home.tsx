import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { AppSelectorProvider } from "~/context/SelectedAppProvider";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Keno - GraphQL Demo App" },
    { name: "description", content: "Let's play with GraphQL!" },
  ];
}

export default function Home() {
  return (
    <>
      <AppSelectorProvider>
        <Welcome />;
      </AppSelectorProvider>
    </>
  );
}
