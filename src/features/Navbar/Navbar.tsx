import React, { useEffect } from 'react';
import { Link} from 'react-router-dom';
import { routes } from '../../App';  // routes importálása

const Navbar: React.FC = () => {
  useEffect(() => {
    const dropdownToggles = document.querySelectorAll('[data-dropdown-toggle]');

    const handleToggle = (event: Event) => {
      const target = event.currentTarget as HTMLElement;
      const dropdownId = target.getAttribute('data-dropdown-toggle');
      const dropdown = document.getElementById(dropdownId!);

      if (dropdown) {
        dropdown.classList.toggle('hidden');
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      dropdownToggles.forEach((toggle) => {
        const target = toggle as HTMLElement;
        const dropdownId = target.getAttribute('data-dropdown-toggle');
        const dropdown = document.getElementById(dropdownId!);

        if (
          dropdown &&
          !dropdown.contains(event.target as Node) &&
          !target.contains(event.target as Node)
        ) {
          dropdown.classList.add('hidden');
        }
      });
    };

    dropdownToggles.forEach((toggle) => {
      toggle.addEventListener('click', handleToggle);
    });
    document.addEventListener('click', handleClickOutside);

    return () => {
      dropdownToggles.forEach((toggle) => {
        toggle.removeEventListener('click', handleToggle);
      });
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <div className="main-container">
      <nav className="w-full bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-700">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="h-8"
              alt="Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              StudentHive
            </span>
          </a>
          <button
            data-dropdown-toggle="navbarDropdown"
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
            aria-controls="navbarDropdown"
            aria-expanded="false"
          >
            <span className="sr-only"></span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 17 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M1 1h15M1 7h15M1 13h15"
              />
            </svg>
          </button>
          <div id="navbarDropdown" className="hidden w-full md:block md:w-auto">
            <ul className="flex flex-col font-medium p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
              <li>
                <Link
                  to={routes.homePage.path}
                  className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
                >
                  Kezdőlap
                </Link>
              </li>
              <li>
                <button
                  data-dropdown-toggle="dropdownMenu"
                  className="flex items-center justify-between w-full py-2 px-3 text-gray-900 hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:focus:text-white dark:hover:bg-gray-700 md:dark:hover:bg-transparent"
                >
                    Belépés
                  <svg
                    className="w-2.5 h-2.5 ml-2"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 10 6"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 4 4 4-4"
                    />
                  </svg>
                </button>
                <div
                  id="dropdownMenu"
                  className="hidden z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
                >
                  <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                    <li>
                      <Link
                        to={routes.loginPage.path} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                      >
                        Bejelentkezés
                      </Link>
                    </li>
                    <li>
                        <Link to={routes.registerPage.path} className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                          Regisztráció
                        </Link>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
