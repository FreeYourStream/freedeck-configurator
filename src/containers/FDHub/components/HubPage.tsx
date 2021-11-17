import { ThumbUpIcon } from "@heroicons/react/solid";
import c from "clsx";
import React from "react";

import { iconSize } from "../../../definitions/iconSizes";
import { MyPagesQuery } from "../../../generated/types-and-hooks";
import { Avatar } from "../../../lib/components/Avatar";
import { ImagePreview } from "../../../lib/components/ImagePreview";
import { Value } from "../../../lib/components/LabelValue";
import { Title } from "../../../lib/components/Title";

export const HubPage: React.FC<{
  className?: string;
  page: MyPagesQuery["myPages"][0];
}> = ({ className, page }) => {
  return (
    <div
      className={c(
        "flex flex-col w-publish-page justify-center rounded-md bg-gray-600 ",
        className
      )}
    >
      <div className="px-4 py-2 bg-gray-400 rounded-md">
        <div className="flex justify-between items-center h-10">
          <div className="flex gap-2 justify-center items-center">
            <Avatar src={page.createdBy.avatar} />
            <div className="overflow-ellipsis overflow-hidden whitespace-nowrap">
              {page.createdBy.displayName}
            </div>
          </div>
          {page.upvotes !== -1 && (
            <div className="flex justify-end items-center">
              <ThumbUpIcon className={c(iconSize, "mr-2")} />
              <Value>{page.upvotes}</Value>
            </div>
          )}
        </div>
      </div>
      <div className="px-4 py-4">
        <div className="flex h-12">
          {page.name ? (
            <div className="text-lg overflow-ellipsis overflow-hidden whitespace-nowrap">
              {page.name}
            </div>
          ) : (
            <div
              className="flex w-full justify-between items-center mb-3 italic text-gray-300 "
              title="no name"
            >
              <div className="text-lg">Enter a name</div>
            </div>
          )}
        </div>
        <div
          className={c(
            "grid gap-2 min-w-max",
            `grid-cols-${page.width}`,
            `grid-rows-${page.height}`
          )}
        >
          {page.previewImages.map((image, key) => (
            <ImagePreview
              clickable={false}
              key={key}
              size={1}
              previewImage={image}
            />
          ))}
        </div>
        <div className="gap-1 flex justify-end items-center mt-4 w-full overflow-hidden flex-wrap h-16">
          {!!page.tags.length &&
            page.tags.map((tag, key) => (
              <div
                key={key}
                className="rounded bg-primary-500 px-1 overflow-hidden overflow-ellipsis whitespace-nowrap"
              >
                {tag}
              </div>
            ))}
          {!page.tags.length && (
            <div className="rounded bg-danger-500 px-1 italic">no tags</div>
          )}
        </div>
      </div>
    </div>
  );
};
