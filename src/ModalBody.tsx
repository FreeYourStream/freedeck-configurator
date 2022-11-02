import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

import { CollectionSettingsModal } from "./containers/Collection/Settings/Modal";
import { DeprecatedInfoModal } from "./containers/DeprecatedInfoModal";
import { DBSettingsModal } from "./containers/DisplayButton/DisplayButtonSettingsModal";
import { FDHub } from "./containers/FDHub";
import { GlobalSettings } from "./containers/GeneralSettingsModal";
import { HelpModal } from "./containers/HelpModal";
import { LoginModal } from "./containers/Login";
import { PublishPage } from "./containers/Page/Publish";
import { PageSettingsModal } from "./containers/Page/Settings/Modal";
import { CustomAlert } from "./CustomAlert";

export const ModalBody = () => {
  const nav = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("dontShow128Info") === null) {
      nav("/deprecated-info");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Routes>
      <Route path="/" element={<CustomAlert />} />
      <Route path="/help" element={<HelpModal />} />
      <Route path="/deprecated-info" element={<DeprecatedInfoModal />} />
      <Route
        path="/displaybutton/:pageId/:displayIndex"
        element={<DBSettingsModal />}
      />
      <Route path="/page/:pageId" element={<PageSettingsModal />} />
      <Route
        path="/collection/:collectionId"
        element={<CollectionSettingsModal />}
      />
      <Route path="/settings" element={<GlobalSettings />} />
      {process.env.REACT_APP_ENABLE_API === "true" && (
        <>
          <Route path="/login" element={<LoginModal />} />
          <Route path="/hub/*" element={<FDHub />} />
          <Route path="/publishpage/:pageId" element={<PublishPage />} />
        </>
      )}
    </Routes>
  );
};
