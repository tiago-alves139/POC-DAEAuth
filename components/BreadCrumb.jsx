"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logout from './Logout';

export default function Breadcrumb() {
  const pathname = usePathname();
  
  // Define the paths for which to create breadcrumbs
  const breadcrumbPaths = ['editTenant', 'editAssetGroup', "editDevice"];

  // Create an array of path segments
  const pathSegments = breadcrumbPaths.map(path => {
    const index = pathname.indexOf(path);
    if (index !== -1) {
      const endIndex = pathname.indexOf('/', index + path.length + 1);
      if (endIndex !== -1) {
        return pathname.slice(0, endIndex);
      } else {
        return pathname;
      }
    }
  }).filter(segment => segment);
  
  // Add the root path segment to the array
  pathSegments.unshift('/');

  return (
    <nav className="flex justify-between items-center bg-slate-300 px-2 py-3 rounded" aria-label="breadcrumb">
      <ol className="ml-flex space-x-2 text-white">
        {pathSegments.map((segment, index) => {
          var actualId = segment.split('/').pop();
          var segmentArray = segment.split('/');
          var truncResourceType = segmentArray[segmentArray.length - 2].replace("edit", "");
          var linkWord = truncResourceType + " - " + actualId;
          if(linkWord === " - ") {
            linkWord = "Home";
          }
          return (
            <li key={segment} className="flex items-center">
              {index > 0 && <span className="mx-3">|</span>}
              <Link className="px-1 py-1 font-bold bg-green-300 text-black rounded hover:bg-blue-700 transition-colors duration-200" href={segment}>{linkWord}</Link>
            </li>
          );
        })}
      </ol>
      <div className='mr-2'><Logout /> </div>
    </nav>
  );
};