// src/components/auth-footer.tsx
import Link from "next/link";

const AuthFooter = ({ type }: { type: "login" | "register" }) => {
  return (
    <footer className="flex flex-col items-center gap-1 mt-6">
      <div className="text-center text-sm">
        <span className="text-gray-500">
          {type === "login"
            ? "Don't have an account?"
            : "Already have an account?"}
        </span>
        <Link
          className="font-semibold text-indigo-600 hover:text-indigo-500 ml-1"
          href={type === "login" ? "/register" : "/login"}
        >
          {type === "login" ? "Register" : "Login"}
        </Link>
      </div>

      {type === "register" && (
        <p className="px-8 text-center text-sm text-gray-500 my-2">
          By clicking continue, you agree to our{" "}
          <Link
            href="/terms"
            className="hover:text-indigo-500 underline underline-offset-4 text-indigo-600"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="hover:text-indigo-500 underline underline-offset-4 text-indigo-600"
          >
            Privacy Policy
          </Link>
          .
        </p>
      )}
    </footer>
  );
};

export default AuthFooter;
