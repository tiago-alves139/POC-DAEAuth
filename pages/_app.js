import '@/app/globals.css';
import { Inter } from 'next/font/google';
import Breadcrumb from '@/components/Breadcrumb';
import { get } from 'http';
import Keycloak from 'keycloak-js';

const inter = Inter({ subsets: ["latin"] });

// export const getServerSideProps = async (context) => {
//   const keycloak = new Keycloak({
//     url: 'http://localhost:8080',
//     realm: 'POC-DaeAuth',
//     clientId: 'poc-daeauth'
//   });

//   try {
//       const authenticated = await keycloak.init();
//       console.log(`User is ${authenticated ? 'authenticated' : 'not authenticated'}`);
//   } catch (error) {
//       console.error('Failed to initialize adapter:', error);
//   } 
// };

export default function MyApp({ Component, pageProps }) {
  return (
        <>
        <div className="max-w-3xl mx-auto p-4">
          <Breadcrumb />
          <div className="mt-8"><Component {...pageProps} />
          </div>
        </div>
        </>
    );
}
