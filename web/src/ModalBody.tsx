import { Route, Routes } from "react-router-dom";

import { CollectionSettingsModal } from "./containers/Collection/Settings/Modal";
import { DBSettingsModal } from "./containers/DisplayButton/DisplayButtonSettingsModal";
import { FDHub } from "./containers/FDHub";
import { GlobalSettings } from "./containers/GeneralSettingsModal";
import { LoginModal } from "./containers/Login";
import { PublishPage } from "./containers/Page/Publish";
import { PageSettingsModal } from "./containers/Page/Settings/Modal";

export const ModalBody = () => {
  return (
    <Routes>
      <Route path="/" element={<></>} />
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
