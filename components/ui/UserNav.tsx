'use client';

import { LogOut, Paintbrush2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Button } from './button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './dropdown-menu';
import Link from 'next/link';
import { useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export function UserNav({
  image,
  name,
  email,
}: {
  image: string;
  name: string;
  email: string;
}) {
  const { signOut } = useClerk();
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 rounded-full p-0">
          <Avatar className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10">
            <Image src={image} fill alt="profile picture" sizes="10rem" />
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 sm:w-56 bg-white" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-2xs sm:text-xs md:text-sm font-medium leading-none text-black">
              {name}
            </p>
            <p className="text-[9px] sm:text-[10px] md:text-xs leading-none text-black">{email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <Link href="/dashboard">
          <DropdownMenuItem className="hover:cursor-pointer hover:bg-gray-200">
            <Paintbrush2 className="mr-2 h-3 w-3 sm:h-4 sm:w-4 text-black" />
            <span className="text-2xs sm:text-xs md:text-sm text-black">Dashboard</span>
          </DropdownMenuItem>
        </Link>
        <DropdownMenuItem
          onClick={() => signOut(() => router.push('/'))}
          className="hover:cursor-pointer hover:bg-gray-200"
        >
          <LogOut className="mr-2 h-3 w-3 sm:h-4 sm:w-4 text-black" />
          <span className="text-2xs sm:text-xs md:text-sm text-black">Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
