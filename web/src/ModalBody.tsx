import React from "react";
import { Route, Routes } from "react-router-dom";

import { DBSettingsModal } from "./containers/DisplayButton/DisplayButtonSettingsModal";
import { FDHub } from "./containers/FDHub";
import { GlobalSettings } from "./containers/GeneralSettingsModal";
import { LoginModal } from "./containers/Login";
import { PublishPage } from "./containers/Page/Publish";
import { PageSettingsModal } from "./containers/Page/Settings/Modal";

export const ModalBody = () => {
  return (
    <Routes>
      <Route path="/" />
      <Route
        path="/displaybutton/:pageId/:displayIndex"
        element={<DBSettingsModal />}
      />
      <Route path="/page/:pageId" element={<PageSettingsModal />} />
      <Route path="/collection/:collectionId" element={<DBSettingsModal />} />
      <Route path="/settings" element={<GlobalSettings />} />
      {process.env.REACT_APP_ENABLE_API === "true" && (
        <>
          <Route path="/login" element={<LoginModal />} />
          <Route path="/hub/*" element={<FDHub />} />
          <Route path="/publish/page/:pageId" element={<PublishPage />} />
        </>
      )}
    </Routes>
  );
};
