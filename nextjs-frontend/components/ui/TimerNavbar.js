import Link from "next/link";

import { useState } from "react";
import { useRouter } from "next/router";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

const Navbar = () => {
  const router = useRouter();

  return (
    <Disclosure as="nav" className="bg-white shadow">
      {({ open }) => (
        <>
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 justify-between">
              <div className="flex">
                <div className="-ml-2 mr-2 flex items-center md:hidden">
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div
                  onClick={() => {
                    router.push("/");
                  }}
                  className="flex flex-shrink-0 items-center cursor-pointer"
                ></div>
                <div className="hidden md:ml-6 md:flex md:space-x-8">
                  <Link
                    href="/"
                    className="inline-flex items-center border-b-2 border-blue-500 px-1 pt-1 text-sm font-medium text-gray-900"
                  >
                    See Summaries
                  </Link>
                  <Link
                    href="/study-timer"
                    className="inline-flex items-center border-b-2 border-blue-500 px-1 pt-1 text-sm font-medium text-gray-900"
                  >
                    Study Timer
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="md:hidden">
            <div className="space-y-1 pt-2 pb-3">
              {}
              <Disclosure.Button
                as="a"
                href="/"
                className="block border-l-4 border-blue-500 bg-blue-50 py-2 pl-3 pr-4 text-base font-medium text-blue-700 sm:pl-5 sm:pr-6"
              >
                See Summaries
              </Disclosure.Button>
              <Disclosure.Button
                as="a"
                href="/study-timer"
                className="block border-l-4 border-blue-500 bg-blue-50 py-2 pl-3 pr-4 text-base font-medium text-blue-700 sm:pl-5 sm:pr-6"
              >
                Study Timer
              </Disclosure.Button>
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export default Navbar;
