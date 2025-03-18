import { SignIn } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function SignInPage() {
  const session = await auth();

  // If already signed in, redirect to dashboard
  if (session.userId) {
    return redirect("/dashboard");
  }

  return (
    <div
      className="flex flex-col justify-center items-center min-h-screen"
      style={{ backgroundColor: "var(--dark-bg)" }}
    >
      <Link
        href="/"
        className="mb-8 text-2xl font-bold gradient-text flex items-center"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7 mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          style={{ color: "var(--gradient-mid)" }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        SummaryDojo
      </Link>

      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "shadow-lg rounded-lg",
            headerTitle: "gradient-text",
            headerSubtitle: "",
            formButtonPrimary: "btn-primary",
            formFieldInput: "",
            formFieldLabel: "",
            footerActionLink: "",
          },
          variables: {
            colorBackground: "#242424",
            colorText: "#e0e0e0",
            colorTextSecondary: "#888888",
            colorDanger: "#ef4444",
            colorInputText: "#e0e0e0",
            colorInputBackground: "#1e1e1e",
            borderRadius: "0.5rem",
          },
        }}
        redirectUrl="/dashboard"
      />
    </div>
  );
}
