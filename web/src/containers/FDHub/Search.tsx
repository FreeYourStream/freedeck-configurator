import c from "clsx";
import React, { useCallback, useEffect, useState } from "react";

import {
  useMyPagesQuery,
  useSearchPagesLazyQuery,
  useSearchPagesQuery,
} from "../../generated/types-and-hooks";
import { FDButton } from "../../lib/components/Button";
import { Label } from "../../lib/components/LabelValue";
import { Row } from "../../lib/components/Row";
import { TextInput } from "../../lib/components/TextInput";
import { Title } from "../../lib/components/Title";
import { HubPage } from "./components/HubPage";

export const FDSearch: React.FC<{ className?: string }> = ({ className }) => {
  const [searchTerm, setTerm] = useState("");
  const [lastSearchTerm, setLastSearchTerm] = useState("");
  const [load, { called, loading, data }] = useSearchPagesLazyQuery({
    fetchPolicy: "network-only",
  });
  const search = useCallback(() => {
    if (lastSearchTerm === searchTerm) return;
    setLastSearchTerm(searchTerm);
    load({ variables: { searchTerm, after: null, before: null } });
  }, [searchTerm, load, lastSearchTerm]);

  return (
    <div className={c("flex flex-col overflow-y-auto p-4 w-full", className)}>
      <Title className="my-4">Search for Pages</Title>

      <div className="p-4">
        <Row>
          <Label>Search</Label>
          <div className="flex gap-2">
            <TextInput
              onChange={(value) => setTerm(value)}
              onEnter={search}
              value={searchTerm}
            />
            <FDButton onClick={search}>Go!</FDButton>
          </div>
        </Row>
        {!loading && data ? (
          <div className="flex flex-wrap gap-4 mt-4 w-full">
            {data.searchPages.pages.map((page, key) => (
              <div key={key}>
                <HubPage page={page} />
              </div>
            ))}
          </div>
        ) : (
          called && <p>loading</p>
        )}
        {!loading && data && !data.searchPages.pages.length && (
          <p>No pages found</p>
        )}
      </div>
    </div>
  );
};
