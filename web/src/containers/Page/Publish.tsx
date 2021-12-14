import React, { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { v4 } from "uuid";

import {
  Page,
  PageCreateInput,
  useMeQuery,
  usePageCreateMutation,
  usePageQuery,
  usePageUpdateMutation,
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
  const pageId = params.pageId;
  const { data: me } = useMeQuery();
  const { data: hubPage } = usePageQuery({ variables: { id: pageId! } });

  const [publish] = usePageCreateMutation();
  const [update] = usePageUpdateMutation();

  const configState = useContext(ConfigStateContext);
  const { setPagePublished } = useContext(ConfigDispatchContext);

  const [name, setName] = useState(configState.pages.byId[pageId!]?.name ?? "");
  const [tags, setTags] = useState(hubPage?.page.tags.join(", ") ?? "");

  if (!pageId || !me) return <></>;
  const page = configState.pages.byId[pageId];

  const mutate = async () => {
    const createdBy = hubPage?.page.createdBy.id;
    const forkedFromId = createdBy === me?.user.id ? undefined : pageId;
    const id = forkedFromId && createdBy ? v4() : pageId;
    const payload: PageCreateInput = {
      forkedFromId,
      id,
      data: { ...page, name },
      height: configState.height,
      width: configState.width,
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => !!t),
    };
    let result;
    if (hubPage?.page.createdBy.id !== me.user.id) {
      result = await publish({
        variables: {
          input: payload,
        },
      });
    } else {
      delete payload.forkedFromId;
      result = await update({
        variables: {
          input: payload,
        },
      });
    }
    if (!result.errors) {
      setPagePublished({
        pageId: id,
        forkedId: forkedFromId,
      });
      nav(`/hubpage/${pageId}`);
    } else console.log(result.errors);
  };
  const pageData: Page = {
    id: pageId,
    upvotes: -1,
    createdBy: me.user!,
    height: configState.height,
    width: configState.width,
    data: { ...page, name },
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
            <HubPage page={pageData} />
          </Row>
          <Row>
            <div className="flex justify-end w-full">
              <FDButton disabled={!name || !tags.length} onClick={mutate}>
                Publish
              </FDButton>
            </div>
          </Row>
        </div>
      </div>
    </FDWindow>
  );
};
