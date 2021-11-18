import c from "clsx";
import React, { useEffect } from "react";

import { useMyPagesQuery } from "../../generated/types-and-hooks";
import { Title } from "../../lib/components/Title";
import { HubPage } from "./components/HubPage";

export const Home: React.FC<{ className?: string }> = ({ className }) => {
  const { data, loading, refetch } = useMyPagesQuery({
    nextFetchPolicy: "network-only",
  });
  useEffect(() => {
    refetch();
  }, [refetch]);
  return (
    <div className={c("flex flex-col overflow-y-auto p-4 w-full", className)}>
      <Title className="my-4">My Pages</Title>
      {!loading && data ? (
        <div className="flex flex-wrap gap-4 p-4">
          {data.myPages.map((page, key) => (
            <div key={key}>
              <HubPage page={page} />
            </div>
          ))}
        </div>
      ) : (
        <p>loading</p>
      )}
      {!loading && data && !data.myPages.length && (
        <p>You have no pages yet :(</p>
      )}
    </div>
  );
};
