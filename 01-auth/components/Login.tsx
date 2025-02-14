export function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <form
        method="post"
        action="/api/login"
        className="p-8 bg-gray-800 rounded-lg shadow-xl w-96"
      >
        <h2 className="text-2xl font-bold mb-6 text-white text-center">
          Login
        </h2>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-300"
            >
              Username (deno)
            </label>
            <input
              type="text"
              name="username"
              id="username"
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password (land)
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="mt-1 block w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md shadow-sm text-white placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500"
            />
          </div>
          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-purple-500"
          >
            Sign in
          </button>
        </div>
      </form>
    </div>
  );
}
