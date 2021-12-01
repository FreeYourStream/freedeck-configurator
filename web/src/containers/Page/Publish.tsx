import React, { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";

import {
  MyPagesQuery,
  useMeQuery,
  usePageCreateMutation,
} from "../../generated/types-and-hooks";
import { FDButton } from "../../lib/components/Button";
import { Label } from "../../lib/components/LabelValue";
import { Row } from "../../lib/components/Row";
import { TextInput } from "../../lib/components/TextInput";
import { FDWindow } from "../../lib/components/Window";
import { ConfigStateContext } from "../../states/configState";
import { HubPage } from "../FDHub/components/HubPage";

export const PublishPage: React.FC<{}> = () => {
  const nav = useNavigate();
  const params = useParams();
  const { data } = useMeQuery();
  const [mutate, { called }] = usePageCreateMutation();
  const configState = useContext(ConfigStateContext);
  const [name, setName] = useState("");
  const [tags, setTags] = useState("");
  if (!params.pageid) return <></>;
  const pageId = params.pageid;
  const publishPage = async () => {
    const result = await mutate({
      variables: {
        input: {
          data: configState.pages.byId[pageId],
          height: configState.height,
          width: configState.width,
          name,
          tags: tags
            .split(",")
            .map((t) => t.trim())
            .filter((t) => !!t),
          previewActions:
            [] ??
            configState.pages.byId[pageId].displayButtons.map(
              (page) => page.button
            ),
          previewImages: configState.pages.byId[pageId].displayButtons.map(
            (page) => page.display.previewImage
          ),
        },
      },
    });
    if (!result.errors) nav(`/hub/pages/${pageId}`);
  };
  // const page:MyPagesQuery["myPages"][0] = {
  //   height: configState.height,
  //   width: configState.width,
  //   name,
  //   previewActions: configState.pages.byId[pageId].displayButtons.map(
  //     (page) => page.button
  //   ),
  //   previewImages: configState.pages.byId[pageId].displayButtons.map(
  //     (page) => page.display.previewImage
  //   ),
  //   tags: tags
  //     .split(",")
  //     .map((t) => t.trim())
  //     .filter((t) => !!t),
  //   upvotes: -1,
  //   createdBy: data!.user,
  // };

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
        {/* <HubPage page={page} /> */}
      </div>
    </FDWindow>
  );
};
