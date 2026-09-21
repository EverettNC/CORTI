import { createFileRoute, redirect } from "@tanstack/react-router";

// The standing order forbids a federated sign-in. This route exists only so
// an old link does not 404: it sends the visitor to the product and renders
// nothing. Do not restore a sign-in here.
export const Route = createFileRoute("/login")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});
