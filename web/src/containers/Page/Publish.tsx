import React, { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router";

import {
  Page,
  useMeQuery,
  usePageCreateMutation,
} from "../../generated/types-and-hooks";
import { FDButton } from "../../lib/components/Button";
import { Label } from "../../lib/components/LabelValue";
import { Row } from "../../lib/components/Row";
import { TextInput } from "../../lib/components/TextInput";
import { FDWindow } from "../../lib/components/Window";
import {
  ConfigDispatchContext,
  ConfigStateContext,
} from "../../states/configState";
import { HubPage } from "../FDHub/components/HubPage";

export const PublishPage: React.FC<{}> = () => {
  const nav = useNavigate();
  const params = useParams();
  const { data } = useMeQuery();
  const [mutate, { called }] = usePageCreateMutation();
  const configState = useContext(ConfigStateContext);
  const { setPagePublished } = useContext(ConfigDispatchContext);
  const [name, setName] = useState(
    configState.pages.byId[params.pageId!].name ?? ""
  );
  const [tags, setTags] = useState("");
  if (!params.pageId) return <></>;
  const pageId = params.pageId;
  const publishPage = async () => {
    const result = await mutate({
      variables: {
        input: {
          id: pageId,
          data: configState.pages.byId[pageId],
          height: configState.height,
          width: configState.width,
          name,
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter((t) => !!t),
        },
      },
    });
    if (!result.errors) {
      setPagePublished({ pageId });
      nav(`/hubpage/${pageId}`);
    }
  };
  const page: Page = {
    id: pageId,
    upvotes: -1,
    createdBy: data?.user!,
    height: configState.height,
    width: configState.width,
    name,
    data: configState.pages.byId[pageId],
    tags: tags
      .split(",")
      .map((t) => t.trim())
      .filter((t) => !!t),
  };

  return (
    <FDWindow
      title="Publish this page"
      visible={true}
      setClose={() => nav("/")}
    >
      <div className="p-10">
        <div className="mb-4 flex flex-col">
          <Row>
            <Label>Name</Label>
            <TextInput onChange={(val) => setName(val)} value={name} />
          </Row>
          <Row>
            <Label>Tags</Label>
            <TextInput onChange={(val) => setTags(val)} value={tags} />
          </Row>
          <Row>
            <div className="flex justify-end w-full">
              <FDButton
                disabled={!name || !tags.length || called}
                onClick={publishPage}
              >
                Publish
              </FDButton>
            </div>
          </Row>
        </div>
        <HubPage page={page} />
      </div>
    </FDWindow>
  );
};
