import { LogoutIcon, ShareIcon, UserIcon } from "@heroicons/react/outline";
import React, { useState } from "react";

import { iconSize } from "../definitions/iconSizes";
import { useMeQuery } from "../generated/types-and-hooks";
import { Avatar } from "../lib/components/Avatar";
import { FDButton } from "../lib/components/Button";
import { FDMenu } from "../lib/components/Menu";

export const LoginLogoutButtons: React.FC<{
  openLogin: () => void;
  openFDHub: () => void;
}> = ({ openLogin, openFDHub }) => {
  const { data } = useMeQuery();
  const entries = [
    {
      title: "Open",
      prefix: <ShareIcon className={iconSize} />,
      onClick: () => openFDHub(),
    },
  ];
  if (data?.user) {
    entries.push({
      title: "Logout",
      prefix: <LogoutIcon className={iconSize} />,
      onClick: () =>
        (window.location.href = `${process.env.REACT_APP_API_URL}/logout`),
    });
  } else {
    entries.push({
      title: "Login",
      prefix: <UserIcon className={iconSize} />,
      onClick: () => openLogin(),
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
