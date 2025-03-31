// New file: frontend/src/pages/GeneralSettings/EmbedConfigs/EditFAQModal/index.jsx
// This is the modal for editing an existing FAQ.
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { X } from "@phosphor-icons/react";

export default function EditFAQModal({ closeModal, faq, setFaqs, embedId }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState(null);
  const { t } = useTranslation();

  useEffect(() => {
    if (faq) {
      setQuestion(faq.question);
      setAnswer(faq.answer);
    }
  }, [faq]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);

    if (!question.trim() || !answer.trim()) {
      setError("Both question and answer are required.");
      return;
    }

    try {
      const res = await fetch(`/api/embed-faqs/${embedId}/faq/${faq.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, answer }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to update FAQ");
      }

      const { faq: updatedFaq } = await res.json();
      setFaqs((prevFaqs) =>
        prevFaqs.map((item) => (item.id === faq.id ? updatedFaq : item))
      );
      closeModal();
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-auto bg-black bg-opacity-50 flex items-center justify-center">
      <div className="relative w-full max-w-2xl bg-theme-bg-secondary rounded-lg shadow border-2 border-theme-modal-border">
        <div className="relative p-6 border-b rounded-t border-theme-modal-border">
          <div className="w-full flex gap-x-2 items-center">
            <h3 className="text-xl font-semibold text-white overflow-hidden overflow-ellipsis whitespace-nowrap">
              {t("embed-faqs.editFaq")}
            </h3>
          </div>
          <button
            onClick={closeModal}
            type="button"
            className="absolute top-4 right-4 transition-all duration-300 bg-transparent rounded-lg text-sm p-1 inline-flex items-center hover:bg-theme-modal-border hover:border-theme-modal-border hover:border-opacity-50 border-transparent border"
          >
            <X size={24} weight="bold" className="text-white" />
          </button>
        </div>
        <div className="px-7 py-6">
          <form onSubmit={handleUpdate} className="space-y-6 max-h-[60vh] overflow-y-auto">
            <div>
              <label
                htmlFor="question"
                className="block text-sm font-medium text-white"
              >
                {t("embed-faqs.question")}
              </label>
              <textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg block w-full p-2.5"
                required
                placeholder={t("embed-faqs.enterQuestion")}
              />
            </div>
            <div>
              <label
                htmlFor="answer"
                className="block text-sm font-medium text-white"
              >
                {t("embed-faqs.answer")}
              </label>
              <textarea
                id="answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="border-none bg-theme-settings-input-bg text-white placeholder:text-theme-settings-input-placeholder text-sm rounded-lg block w-full p-2.5"
                required
                placeholder={t("embed-faqs.enterAnswer")}
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="flex justify-between items-center mt-6 pt-6 border-t border-theme-modal-border">
              <button
                onClick={closeModal}
                type="button"
                className="transition-all duration-300 text-white hover:bg-zinc-700 px-4 py-2 rounded-lg text-sm"
              >
                 {t("common.cancel")}
              </button>
              <button
                type="submit"
                className="transition-all duration-300 bg-white text-black hover:opacity-60 px-4 py-2 rounded-lg text-sm"
              >
                {t("embed-faqs.update")}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
