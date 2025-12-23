export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <div>
          <h2 className="text-2xl font-bold text-center">Check Your Email</h2>
          <p className="mt-4 text-sm text-gray-600 text-center">
            A sign-in link has been sent to your email address.
          </p>
          <p className="mt-2 text-sm text-gray-600 text-center">
            Click the link in the email to sign in.
          </p>
        </div>
      </div>
    </div>
  );
}


