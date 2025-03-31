// frontend/src/pages/GeneralSettings/EmbedFaqsCollections/index.jsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { isMobile } from "react-device-detect";
import { Plus } from "@phosphor-icons/react";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Sidebar from "@/components/SettingsSidebar";
import ModalWrapper from "@/components/ModalWrapper";
import CTAButton from "@/components/lib/CTAButton";
import { useModal } from "@/hooks/useModal";
import Embed from "@/models/embed";
import paths from "@/utils/paths";
import showToast from "@/utils/toast";
import EmbedFaqCollectionRow from "./EmbedFaqCollectionRow";

export default function EmbedFaqsCollections() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    async function fetchCollections() {
      setLoading(true);
      try {
        const response = await fetch('/api/embed-faqs/collections');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const { collections: fetchedCollections } = await response.json();
        setCollections(fetchedCollections || []);
      } catch (error) {
        console.error('Error fetching collections:', error);
        showToast(t("embed-faqs.collectionsFetchError"), "error");
      } finally {
        setLoading(false);
      }
    }
    fetchCollections();
  }, [t]);

  if (loading) {
    return (
      <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex">
        <Sidebar />
        <div className="w-full h-full overflow-y-scroll">
          <Skeleton.default
            height="80vh"
            width="100%"
            highlightColor="var(--theme-bg-primary)"
            baseColor="var(--theme-bg-secondary)"
            count={1}
            className="w-full p-4 rounded-b-2xl rounded-tr-2xl rounded-tl-sm"
            containerClassName="flex w-full"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex">
      <Sidebar />
      <div
        style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
        className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary w-full h-full overflow-y-scroll p-4 md:p-0"
      >
        <div className="flex flex-col w-full px-1 md:pl-6 md:pr-[50px] md:py-6 py-16">
          <div className="w-full flex flex-col gap-y-1 pb-6 border-white/10 border-b-2">
            <div className="items-center flex gap-x-4">
              <p className="text-lg leading-6 font-bold text-theme-text-primary">
                {t("embed-faqs.collectionsTitle")}
              </p>
            </div>
            <p className="text-xs leading-[18px] font-base text-theme-text-secondary mt-2">
              {t("embed-faqs.collectionsDescription")}
            </p>
          </div>
          {/* Create FAQ Collection button - if you want to add it later */}
          {/* <div className="w-full justify-end flex">
            <CTAButton
              onClick={openModal} // Define openModal if you add a modal for creating collections
              className="mt-3 mr-0 mb-4 md:-mb-14 z-10"
            >
              <Plus className="h-4 w-4" weight="bold" />
              {t("embed-faqs.newFaqCollection")}
            </CTAButton>
          </div> */}
          <div className="overflow-x-auto mt-6">
            {collections.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-theme-text-secondary">{t("embed-faqs.noCollections")}</p>
                <p className="text-sm text-theme-text-secondary mt-2">
                  {t("embed-faqs.createEmbedFirst")}
                </p>
              </div>
            ) : (
              <table className="w-full text-sm text-left rounded-lg min-w-[640px] border-spacing-0">
                <thead className="text-theme-text-secondary text-xs leading-[18px] font-bold uppercase border-white/10 border-b">
                  <tr>
                    <th scope="col" className="px-6 py-3 rounded-tl-lg">
                      {t("embed-faqs.tableCollections.embed")}
                    </th>
                    <th scope="col" className="px-6 py-3">
                      {t("embed-faqs.tableCollections.faqs")}
                    </th>
                    <th scope="col" className="px-6 py-3 rounded-tr-lg">
                      {" "}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {collections.map((collection) => (
                    <tr key={collection.id} className="bg-transparent text-white text-opacity-80 text-sm">
                      <th scope="row" className="px-6 py-4 whitespace-nowrap flex items-center gap-x-1">
                        <div className="flex items-center">
                          {collection.workspace?.name || 'Unknown Workspace'}
                          <p className="ml-2 text-theme-text-secondary text-xs">
                            ID: {collection.uuid}
                          </p>
                        </div>
                      </th>
                      <td className="px-6 py-4">
                        {collection._count?.faqs || 0}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => window.location.href = paths.settings.embedFaqs(collection.uuid)}
                          className="font-medium text-blue-600 dark:text-blue-300 px-2 py-1 rounded-lg hover:bg-blue-50 hover:dark:bg-blue-800 hover:dark:bg-opacity-20"
                        >
                          {t("embed-faqs.manageFaqs")}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        {/* New FAQ Collection Modal - if you add it later */}
        {/* <ModalWrapper isOpen={isOpen}>
          <NewFAQCollectionModal closeModal={closeModal} />
        </ModalWrapper> */}
      </div>
    </div>
  );
}


function FAQCollectionsContainer({ collections, loading, t }) {


  return (
    <table className="w-full text-sm text-left rounded-lg min-w-[640px] border-spacing-0">
      <thead className="text-theme-text-secondary text-xs leading-[18px] font-bold uppercase border-white/10 border-b">
        <tr>
          <th scope="col" className="px-6 py-3 rounded-tl-lg">
            {t("embed-faqs.tableCollections.embed")}
          </th>
          <th scope="col" className="px-6 py-3">
            {t("embed-faqs.tableCollections.faqs")}
          </th>
          <th scope="col" className="px-6 py-3 rounded-tr-lg">
            {" "}
          </th>
        </tr>
      </thead>
      <tbody>
        {collections.map((collection) => (
          <EmbedFaqCollectionRow key={collection.id} collection={collection} /> // Render EmbedFaqCollectionRow
        ))}
      </tbody>
    </table>
  );
}
