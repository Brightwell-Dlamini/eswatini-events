'use client';

export function GoogleButton() {
  const handleGoogleLogin = () => {
    // Redirect to backend Google OAuth endpoint
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <button
      onClick={handleGoogleLogin}
      type="button"
      className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 text-center"
    >
      Continue with Google
    </button>
  );
}
