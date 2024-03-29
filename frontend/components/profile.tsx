import axios from 'axios';
import { getSession, useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const backendURL = process.env.BACKEND_URL;

const Profile = () => {
  interface IProfile {
    image: string;
    fullname: string;
    username: string;
    about: string;
    email: string;
    following: number;
    followers: number;
    profileVisitor: number;
  }

  const [profile, setProfile] = useState<IProfile>({
    image: '/pixel8labs/images/pixel8labs-logo.png',
    fullname: 'Pixel8Labs',
    username: 'pixel8Labs',
    about:
      'Web3 startup with a team from all over the world. Need help with smart contracts? Launching NFT Collections? Come with us!',
    email: 'gm@pixel8labs.com',
    profileVisitor: 821320,
    following: 1,
    followers: 2,
  });

  // update user data if session exists
  useEffect(() => {
    const checkSession = async () => {
      const session = await getSession();
      if (session) {
        const response = await axios.get(
          backendURL + '/api/v1/github/profile',
          {
            params: {
              username: session.git_username,
              access_token: session.access_token,
            },
          },
        );

        const profile: IProfile = {
          image: response.data.data.avatar_url,
          fullname: response.data.data.name,
          username: session.git_username,
          email: response.data.data.email,
          about:
            'Web3 startup with a team from all over the world. Need help with smart contracts? Launching NFT Collections? Come with us!',
          profileVisitor: 10,
          following: response.data.data.following,
          followers: response.data.data.followers,
        };

        setProfile(profile);
      }
    };

    checkSession();
  }, []);

  interface IVisitor {
    image: string;
    link: string;
  }

  const visitors: IVisitor[] = [
    {
      image: '/pixel8labs/images/pixel8labs-logo.png',
      link: '',
    },
    {
      image: '/pixel8labs/images/pixel8labs-logo.png',
      link: '',
    },
    {
      image: '/pixel8labs/images/pixel8labs-logo.png',
      link: '',
    },
  ];

  const Visitor: React.FC<{ visitor: IVisitor }> = ({ visitor }) => {
    return (
      <div className="mr-2">
        <Link href={visitor.link}>
          <Image
            className="rounded-full"
            src={visitor.image}
            alt="logo"
            width={50}
            height={50}
          />
        </Link>
      </div>
    );
  };

  const renderVisitors = () => {
    return visitors.map((visitor) => {
      return <Visitor key={visitor.link} visitor={visitor} />;
    });
  };

  return (
    <div className="lg:w-1/4 justify-center items-center text-center">
      <div className="flex lg:flex-col justify-start items-center">
        <Image
          className="mr-6 lg:mr-0 rounded-full"
          src={profile.image}
          alt="logo"
          width={160}
          height={100}
        />
        <div className="lg:pt-4 text-start">
          <span className="font-bold text-2xl">{profile.fullname}</span> <br />
          <span>@{profile.username}</span>
        </div>
      </div>
      <div className="flex flex-col text-start py-4">
        <span className="font-bold">About</span>
        <p>{profile.about}</p>
      </div>
      <div className="flex">
        <svg
          className="h-8 w-8 text-black"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
        </svg>
        <span className="pl-2 text-gray-500">{profile.email}</span>
      </div>

      <div className="flex text-start py-4">
        <span className="font-bold px-2">{profile.followers} </span>
        <span>Followers</span>
        <span className="font-bold px-2">{profile.following}</span>
        <span>Followings</span>
      </div>

      <div className="flex">
        <svg
          className="h-8 w-8 text-black"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" />{' '}
          <circle cx="9" cy="7" r="4" />{' '}
          <path d="M3 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />{' '}
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />{' '}
          <path d="M21 21v-2a4 4 0 0 0 -3 -3.85" />
        </svg>
        <span className="font-bold px-2">{profile.profileVisitor} </span>
        <span className="text-gray-500">profile visitors</span>
      </div>

      <div className="text-start mt-4">
        <span className="font-bold">Latest Visitors</span>
        <div className="flex mt-2">{renderVisitors()}</div>
      </div>
    </div>
  );
};

export default Profile;
