// frontend/src/pages/GeneralSettings/EmbedFAQs/index.jsx
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trash, PencilSimple, Plus, ListBullets, SquaresFour } from "@phosphor-icons/react";
import { isMobile } from "react-device-detect";
import { useModal } from "@/hooks/useModal";
import ModalWrapper from "@/components/ModalWrapper";
import Sidebar from "@/components/SettingsSidebar";
import NewFAQModal from "./NewFAQModal";
import EditFAQModal from "./EditFAQModal";
import SuggestionsModal from "./SuggestionsModal";
import WidgetsModal from "./WidgetsModal";
import * as Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import showToast from "@/utils/toast";
import { useParams } from 'react-router-dom';
import { baseHeaders } from '@/utils/request';
import { toast } from 'react-toastify';

function truncate(str, n) {
  return str?.length > n ? str.substr(0, n - 1) + "..." : str;
}

export default function EmbedFAQs() {
  const { embedId } = useParams(); // This is actually the UUID from the URL
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [embed, setEmbed] = useState(null);
  const [selectedFAQ, setSelectedFAQ] = useState(null);
  const { t } = useTranslation();
  const {
    isOpen: isNewFAQOpen,
    openModal: openNewFAQModal,
    closeModal: closeNewFAQModal,
  } = useModal();
  const {
    isOpen: isEditFAQOpen,
    openModal: openEditFAQModal,
    closeModal: closeEditFAQModal,
  } = useModal();
  const {
    isOpen: isSuggestionsOpen,
    openModal: openSuggestionsModal,
    closeModal: closeSuggestionsModal,
  } = useModal();
  const {
    isOpen: isWidgetsOpen,
    openModal: openWidgetsModal,
    closeModal: closeWidgetsModal,
  } = useModal();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const embedResponse = await fetch(`/api/embed-config/${embedId}`, {
          headers: baseHeaders()
        });
        if (!embedResponse.ok) throw new Error('Failed to fetch embed config');
        const embedData = await embedResponse.json();
        setEmbed(embedData);

        const faqsResponse = await fetch(`/api/embed-faqs/${embedData.id}/faqs`, {
          headers: baseHeaders()
        });
        if (!faqsResponse.ok) throw new Error('Failed to fetch FAQs');
        const faqsData = await faqsResponse.json();
        setFaqs(faqsData.faqs || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error(t('errorFetchingData'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [embedId]);

  const handleDeleteFAQ = async (faqId) => {
    if (!window.confirm(t('confirmDeleteFAQ'))) return;

    try {
      const response = await fetch(`/api/embed-faqs/${embed.id}/faq/${faqId}`, {
        method: 'DELETE',
        headers: baseHeaders()
      });
      if (!response.ok) throw new Error('Failed to delete FAQ');
      setFaqs(faqs.filter(faq => faq.id !== faqId));
      toast.success(t('faqDeleted'));
    } catch (error) {
      console.error('Error deleting FAQ:', error);
      toast.error(t('errorDeletingFAQ'));
    }
  };

  const handleEditFAQ = (faq) => {
    setSelectedFAQ(faq);
    openEditFAQModal();
  };

  const handleManageSuggestions = (faq) => {
    setSelectedFAQ(faq);
    openSuggestionsModal();
  };

  const handleManageWidgets = (faq) => {
    setSelectedFAQ(faq);
    openWidgetsModal();
  };

  const handleUpdateFAQ = (updatedFAQ) => {
    if (!updatedFAQ || !updatedFAQ.id) {
      console.error('Invalid FAQ data received:', updatedFAQ);
      return;
    }
    setFaqs(faqs.map(faq => faq.id === updatedFAQ.id ? updatedFAQ : faq));
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

  if (!embed) {
    return (
      <div className="w-screen h-screen overflow-hidden bg-theme-bg-container flex">
        <Sidebar />
        <div className="w-full h-full flex items-center justify-center">
          <p className="text-theme-text-secondary">{t('embedNotFound')}</p>
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
                {t("embed-faqs.title")}
              </p>
            </div>
            <p className="text-xs leading-[18px] font-base text-theme-text-secondary mt-2">
              {t("embed-faqs.description")}
            </p>
          </div>

          <div className="w-full flex flex-col items-end mt-4">
            <button
              onClick={openNewFAQModal}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center gap-x-2"
            >
              <Plus className="h-4 w-4" weight="bold" />
              {t("embed-faqs.newFaq")}
            </button>
          </div>

          <div className="overflow-x-auto mt-6">
            <table className="w-full text-sm text-left rounded-lg min-w-[640px] border-spacing-0">
              <thead className="text-theme-text-secondary text-xs leading-[18px] font-bold uppercase border-white/10 border-b">
                <tr>
                  <th scope="col" className="px-6 py-3 rounded-tl-lg">
                    {t("embed-faqs.table.question")}
                  </th>
                  <th scope="col" className="px-6 py-3">
                    {t("embed-faqs.table.answer")}
                  </th>
                  <th scope="col" className="px-6 py-3 rounded-tr-lg">
                    {" "}
                  </th>
                </tr>
              </thead>
              <tbody>
                {faqs.map((faq) => (
                  <tr
                    key={faq.id}
                    className="bg-transparent text-white text-opacity-80 text-sm font-medium"
                  >
                    <td className="px-6 py-4 font-medium whitespace-nowrap">
                      {truncate(faq.question, 40)}
                    </td>
                    <td className="px-6 py-4">{truncate(faq.answer, 40)}</td>
                    <td className="px-6 py-4 flex items-center gap-x-4">
                      <button
                        onClick={() => handleManageSuggestions(faq)}
                        className="border-none font-medium px-2 py-1 rounded-lg text-theme-text-primary hover:text-blue-500"
                        title="Manage Suggestions"
                      >
                        <ListBullets className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleManageWidgets(faq)}
                        className="border-none font-medium px-2 py-1 rounded-lg text-theme-text-primary hover:text-blue-500"
                        title="Manage Widgets"
                      >
                        <SquaresFour className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleEditFAQ(faq)}
                        className="border-none font-medium px-2 py-1 rounded-lg text-theme-text-primary hover:text-amber-500"
                        title="Edit FAQ"
                      >
                        <PencilSimple className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteFAQ(faq.id)}
                        className="border-none font-medium px-2 py-1 rounded-lg text-theme-text-primary hover:text-red-500"
                        title="Delete FAQ"
                      >
                        <Trash className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <ModalWrapper isOpen={isNewFAQOpen}>
          <NewFAQModal
            closeModal={closeNewFAQModal}
            setFaqs={setFaqs}
            embedId={embed.id}
          />
        </ModalWrapper>

        <ModalWrapper isOpen={isEditFAQOpen}>
          <EditFAQModal
            closeModal={closeEditFAQModal}
            faq={selectedFAQ}
            setFaqs={setFaqs}
            embedId={embed.id}
          />
        </ModalWrapper>

        {selectedFAQ && (
          <>
            <SuggestionsModal
              isOpen={isSuggestionsOpen}
              onClose={closeSuggestionsModal}
              faq={selectedFAQ}
              setFaqs={setFaqs}
              onUpdate={handleUpdateFAQ}
            />

            <WidgetsModal
              isOpen={isWidgetsOpen}
              onClose={closeWidgetsModal}
              faq={selectedFAQ}
              setFaqs={setFaqs}
              onUpdate={handleUpdateFAQ}
            />
          </>
        )}
      </div>
    </div>
  );
}



