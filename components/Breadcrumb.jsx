"use client";

import { useRouter } from 'next/router';
import Link from 'next/link';

export default function Breadcrumb() {
  const router = useRouter();

  console.log("ROUTER PATHNAME: " + router.asPath);
  
  // Define the paths for which to create breadcrumbs
  const breadcrumbPaths = ['editTenant', 'editAssetGroup', "editDevice"];

  // Create an array of path segments
  const pathSegments = breadcrumbPaths.map(path => {
    const index = router.asPath.indexOf(path);
    if (index !== -1) {
      const endIndex = router.asPath.indexOf('/', index + path.length + 1);
      if (endIndex !== -1) {
        return router.asPath.slice(0, endIndex);
      } else {
        return router.asPath;
      }
    }
  }).filter(segment => segment);
  
  // Add the root path segment to the array
  pathSegments.unshift('/');

  console.log("PATH SEGMENTS: " + pathSegments);

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
              <Link className="px-1 py-1 bg-green-300 text-black rounded hover:bg-blue-700 transition-colors duration-200" href={segment}>{linkWord}</Link>
            </li>
          );
        })}
      </ol>
    </nav>
  );
};