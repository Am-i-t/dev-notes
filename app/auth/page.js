import AuthForm from "@/components/authForm";

export default async function AuthPage({ searchParams }) {
  const params = await searchParams;
  const formMode = params.mode || "login";

  return <AuthForm mode={formMode} />;
}