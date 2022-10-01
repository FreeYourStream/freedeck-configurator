import {
  ArrowLeftOnRectangleIcon,
  ShareIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import React from "react";
import { useNavigate } from "react-router";

import { iconSize } from "../definitions/iconSizes";
import { useMeQuery } from "../generated/types-and-hooks";
import { Avatar } from "../lib/components/Avatar";
import { FDButton } from "../lib/components/Button";
import { FDMenu } from "../lib/components/Menu";

export const LoginLogoutButtons: React.FC = () => {
  const { data } = useMeQuery();
  const nav = useNavigate();
  const entries = [
    {
      title: "Open",
      prefix: <ShareIcon className={iconSize} />,
      onClick: () => nav("/hub"),
    },
  ];
  if (data?.user) {
    entries.push({
      title: "Logout",
      prefix: <ArrowLeftOnRectangleIcon className={iconSize} />,
      onClick: () =>
        (window.location.href = `${process.env.REACT_APP_API_URL}/logout`),
    });
  } else {
    entries.push({
      title: "Login",
      prefix: <UserIcon className={iconSize} />,
      onClick: () => nav("/login"),
    });
  }
  return (
    <>
      <FDMenu entries={entries}>
        <FDButton
          size={3}
          prefix={
            data?.user ? (
              <Avatar size={24} src={data.user.avatar} />
            ) : (
              <UserIcon className={iconSize} />
            )
          }
        >
          FreeDeck Hub
        </FDButton>
      </FDMenu>
    </>
  );
};
