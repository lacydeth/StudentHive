// LoginPage.tsx
import React from 'react';

const LoginPage: React.FC = () => {
  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex justify-center items-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 p-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Sign in to your account
        </h1>
        <form className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Your email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500"
              placeholder="name@company.com"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember"
                type="checkbox"
                className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-500"
              />
              <label htmlFor="remember" className="ml-2 text-sm text-gray-500 dark:text-gray-300">
                Remember me
              </label>
            </div>
            <a href="#" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500">
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-500"
          >
            Sign in
          </button>
          <p className="text-sm font-light text-gray-500 dark:text-gray-400 mt-4">
            Don’t have an account?{' '}
            <a href="#" className="font-medium text-blue-600 hover:underline dark:text-blue-500">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </section>
  );
};

export default LoginPage;
