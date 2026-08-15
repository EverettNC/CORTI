import { createFileRoute } from "@tanstack/react-router";
import { AppShell } from "@/components/corti/app-shell";
import { HearingProvider } from "@/components/corti/hearing-context";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <HearingProvider>
      <AppShell />
    </HearingProvider>
  );
}
