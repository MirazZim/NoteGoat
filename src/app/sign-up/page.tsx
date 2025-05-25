import AuthForm from "@/components/AuthForm";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";

function SignUpPage() {
  return (
    <div className="mt-20 flex flex-1 flex-col items-center">
      <Card className="w-full max-w-md">
        <CardHeader className="mb-4">
        <CardTitle className="text-center text-3xl font-bold text-zinc-800 dark:text-white">
            Create an Account 🚀
          </CardTitle>
          <p className="text-center mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Join us and start taking better notes
          </p>
        </CardHeader>

        <AuthForm type="signUp" />
      </Card>
    </div>
  );
}

export default SignUpPage;