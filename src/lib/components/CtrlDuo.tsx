import React, {
  ReactChild,
  ReactFragment,
  ReactPortal,
  useContext,
} from "react";
import { AppStateContext } from "../../states/appState";

export const CtrlDuo: React.FC<{
  children: [
    ReactChild | ReactFragment | ReactPortal,
    ReactChild | ReactFragment | ReactPortal
  ];
}> = ({ children }) => {
  const { ctrlDown } = useContext(AppStateContext);
  return <>{!ctrlDown ? children[0] : children[1]}</>;
};
