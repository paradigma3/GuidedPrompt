// frontend/src/pages/GeneralSettings/EmbedFaqsCollections/index.jsx
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { isMobile } from "react-device-detect";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Sidebar from "@/components/SettingsSidebar";
import showToast from "@/utils/toast";
import EmbedFaqCollectionRow from "./EmbedFaqCollectionRow";
import EmbedArticlesModal from '../EmbedFAQs/EmbedArticlesModal';

export default function EmbedFaqsCollections() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [collections, setCollections] = useState([]);
  const [isArticlesModalOpen, setIsArticlesModalOpen] = useState(false);
  const [selectedEmbedConfig, setSelectedEmbedConfig] = useState(null);

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

  const handleManageArticles = (embedConfig) => {
    setSelectedEmbedConfig(embedConfig);
    setIsArticlesModalOpen(true);
  };

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
                    <EmbedFaqCollectionRow
                      key={collection.id}
                      collection={collection}
                      onManageArticles={handleManageArticles}
                    />
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        <EmbedArticlesModal
          isOpen={isArticlesModalOpen}
          onClose={() => setIsArticlesModalOpen(false)}
          embedConfigId={selectedEmbedConfig?.id}
        />
      </div>
    </div>
  );
}
