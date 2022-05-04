import c from "clsx";
import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

import { useMeQuery, useMyPagesQuery } from "../../generated/types-and-hooks";
import { Title } from "../../lib/components/Title";
import { HubPage } from "./components/HubPage";

export const Home: React.FC<{ className?: string }> = ({ className }) => {
  const nav = useNavigate();
  const { data: me } = useMeQuery();
  const { data, loading, refetch } = useMyPagesQuery({
    nextFetchPolicy: "network-only",
  });
  useEffect(() => {
    refetch();
  }, [refetch]);
  return (
    <div className={c("flex flex-col overflow-y-auto p-4 w-full", className)}>
      <Title className="my-4">My Pages</Title>
      {!loading && !!data && (
        <div className="flex flex-wrap gap-4 p-4">
          {data.myPages.map((page, key) => (
            <div
              className="cursor-pointer"
              key={key}
              onClick={() => {
                nav(`/hub/page/${page.id}`);
              }}
            >
              <HubPage page={page} />
            </div>
          ))}
        </div>
      )}
      {!loading && data && !data.myPages.length && (
        <p>You have no pages yet :(</p>
      )}
      {!!loading && !!me && <p>loading</p>}
      {!loading && !me && <Link to="/login">Please login</Link>}
    </div>
  );
};
