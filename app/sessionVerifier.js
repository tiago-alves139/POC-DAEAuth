import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Login from "@/components/Login";
import Logout from "@/components/Logout";
import { getServerSession } from 'next-auth'
import { authOptions } from './api/auth/[...nextauth]/route'

export async function getServerSideProps(authOptions) {
    const session = await getServerSession(authOptions);
    console.log("AUTH OPTIONS: " + authOptions);
    console.log("SESSION: " + session);
    if (!session) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }
  
    // If there is a session, return the session as a prop
    return {
      props: { session },
    };
}

const SessionVerifier = ({ session, children }) => {
  const router = useRouter();

  useEffect(() => {
    console.log("SESSION: " + session);
    if (!sessionExists) {
      // If there is no session, redirect the user to the login page
      router.push('/');
    }
  }, []);

  // Render children only if session exists
  return sessionExists ? children : null;
};

export default SessionVerifier;
