import Link from 'next/link';
import { UserNav } from './UserNav';
import { currentUser } from '@clerk/nextjs';

export default async function Header() {
  const user = await currentUser();
  return (
    <div className="container relative m-0 mx-auto py-4 border-b border-gray-200 md:px-10">
      <div className="max-width flex items-center justify-between">
        {/* logo */}
        <Link className="flex w-fit items-center gap-[2px]" href="/dashboard">
          <img
            src="/logo.svg"
            width={50}
            height={50}
            alt="logo"
            className="h-5 w-5 md:h-8 md:w-8"
          />
          <h1 className="text-lg font-medium text-[#25292F] md:text-xl lg:text-2xl">
            Tiger Talk
          </h1>
        </Link>
        {/* navigation */}
        <div className="flex w-fit items-center gap-[22px]">
          {user ? (
            <>
              <Link
                href={'/dashboard'}
                className="hidden cursor-pointer text-sm text-gray-800 hover:text-gray-600 md:inline-block md:text-base lg:text-lg"
              >
                Recordings
              </Link>
              <Link
                href={'/record'}
                className="hidden cursor-pointer text-sm text-gray-800 hover:text-gray-600 md:inline-block md:text-base lg:text-lg"
              >
                Record
              </Link>
              <Link
                href={'/dashboard/action-items'}
                className="hidden cursor-pointer text-sm text-gray-800 hover:text-gray-600 md:inline-block md:text-base lg:text-lg"
              >
                Action Items
              </Link>
              <UserNav
                image={user.imageUrl}
                name={user.firstName + ' ' + user.lastName}
                email={
                  user.emailAddresses.find(
                    ({ id }) => id === user.primaryEmailAddressId,
                  )!.emailAddress
                }
              />
            </>
          ) : (
            <Link href="/dashboard">
              <button className="text-sm rounded-lg bg-gray-800 px-4 py-1 text-center text-white hover:bg-gray-700 md:px-6 md:py-2 md:text-base">
                Sign in
              </button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
