import {
  LogoutIcon,
  PhotographIcon,
  ShareIcon,
  UserIcon,
} from "@heroicons/react/outline";
import React, { useState } from "react";

import { iconSize } from "../definitions/iconSizes";
import { useMeQuery } from "../generated/types-and-hooks";
import { Avatar } from "../lib/components/Avatar";
import { FDButton } from "../lib/components/Button";
import { FDMenu } from "../lib/components/Menu";
import { TabView } from "../lib/components/TabView";
import { FDWindow } from "../lib/components/Window";
import { FDHub } from "./FDHub";
import { Home } from "./FDHub/Home";

export const LoginLogoutButtons: React.FC<{
  openLogin: () => void;
  openFDHub: () => void;
}> = ({ openLogin, openFDHub }) => {
  const { data } = useMeQuery();
  const [showHub, setShowHub] = useState(false);
  if (data?.user) {
    return (
      <>
        <FDMenu
          entries={[
            {
              title: "FreeDeck Hub",
              prefix: <ShareIcon className={iconSize} />,
              onClick: () => setShowHub(true),
            },
            {
              title: "Logout",
              prefix: <LogoutIcon className={iconSize} />,
              onClick: () =>
                (window.location.href = `${process.env.REACT_APP_API_URL}/logout`),
            },
          ]}
        >
          <FDButton
            size={3}
            prefix={<Avatar size={24} src={data.user.avatar} />}
          >
            {data.user.displayName}
          </FDButton>
        </FDMenu>
      </>
    );
  }
  return (
    <FDButton
      size={3}
      prefix={<UserIcon className={iconSize} />}
      onClick={() => openLogin()}
    >
      Login
    </FDButton>
  );
};
