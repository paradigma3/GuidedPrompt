import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Plus, Link, Image } from "@phosphor-icons/react";
import ModalWrapper from '@/components/ModalWrapper';
import { baseHeaders } from "@/utils/request";
import showToast from "@/utils/toast";

export default function EmbedArticlesModal({ isOpen, onClose, embedConfigId }) {
  const { t } = useTranslation();
  const [articles, setArticles] = useState([]);
  const [newArticle, setNewArticle] = useState({ title: '', description: '', image_url: '', url: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && embedConfigId) {
      fetchArticles();
    }
  }, [isOpen, embedConfigId]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/embed-faqs/${embedConfigId}/articles`, {
        headers: baseHeaders()
      });
      if (!response.ok) throw new Error('Failed to fetch articles');
      const fetchedArticles = await response.json();
      setArticles(fetchedArticles || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
      showToast(t("embed-faqs.articles.fetchError"), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!validateArticle()) return;
    console.log("New Article Data:", newArticle);
    setLoading(true);
    try {
      const response = await fetch(`/api/embed-faqs/${embedConfigId}/articles`, {
        method: 'POST',
        headers: { ...baseHeaders(), 'Content-Type': 'application/json' },
        body: JSON.stringify(newArticle),
      });
      if (!response.ok) throw new Error('Failed to save article');
      const newArticleData = await response.json();
      setArticles([...articles, newArticleData]);
      setNewArticle({ title: '', description: '', image_url: '', url: '' });
      showToast(t("embed-faqs.articles.saveSuccess"), "success");
    } catch (error) {
      console.error('Error saving article:', error);
      showToast(t("embed-faqs.articles.saveError"), "error");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (articleId) => {
    if (!window.confirm(t("embed-faqs.articles.confirmDelete"))) return;
    setLoading(true);
    try {
      const response = await fetch(`/api/embed-faqs/${embedConfigId}/articles/${articleId}`, {
        method: 'DELETE',
        headers: baseHeaders(),
      });
      if (!response.ok) throw new Error('Failed to delete article');
      setArticles(articles.filter(article => article.id !== articleId));
      showToast(t("embed-faqs.articles.deleteSuccess"), "success");
    } catch (error) {
      console.error('Error deleting article:', error);
      showToast(t("embed-faqs.articles.deleteError"), "error");
    } finally {
      setLoading(false);
    }
  };

  const validateArticle = () => {
    if (!newArticle.title?.trim()) {
      showToast("Please enter a title", "error");
      return false;
    }
    if (!newArticle.description?.trim()) {
      showToast("Please enter a description", "error");
      return false;
    }
    if (!newArticle.url?.trim()) {
      showToast("Please enter an article URL", "error");
      return false;
    }
    if (!newArticle.url.startsWith('http://') && !newArticle.url.startsWith('https://')) {
      showToast("Please enter a valid URL starting with http:// or https://", "error");
      return false;
    }
    if (articles.length >= 3) {
      showToast(t("embed-faqs.articles.maxLimitReached"), "error");
      return false;
    }
    return true;
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title={t("embed-faqs.manageArticles")}
      className="w-full max-w-xl"
      showCloseButton={false}
    >
      <div className="flex flex-col h-[36rem]">
        <div className="flex flex-col space-y-3 p-4 border-b border-white/10">
          <input
            type="text"
            value={newArticle.title}
            onChange={(e) => setNewArticle({ ...newArticle, title: e.target.value })}
            placeholder={t("embed-faqs.articles.enterTitle")}
            className="rounded bg-zinc-900 border border-white/10 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea
            value={newArticle.description}
            onChange={(e) => setNewArticle({ ...newArticle, description: e.target.value })}
            placeholder={t("embed-faqs.articles.enterDescription")}
            className="rounded bg-zinc-900 border border-white/10 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
          />
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <input
                type="url"
                value={newArticle.image_url}
                onChange={(e) => setNewArticle({ ...newArticle, image_url: e.target.value })}
                placeholder={t("embed-faqs.articles.imageUrl")}
                className="w-full rounded bg-zinc-900 border border-white/10 pl-8 pr-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Image className="absolute left-2.5 top-2.5 h-5 w-5 text-white/40" />
            </div>
          </div>
          <div className="flex space-x-2">
            <div className="flex-1 relative">
              <input
                type="url"
                value={newArticle.url}
                onChange={(e) => setNewArticle({ ...newArticle, url: e.target.value })}
                placeholder={t("embed-faqs.articles.url")}
                className="w-full rounded bg-zinc-900 border border-white/10 pl-8 pr-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Link className="absolute left-2.5 top-2.5 h-5 w-5 text-white/40" />
            </div>
            <button
              onClick={handleSave}
              disabled={loading}
              className="rounded bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white flex items-center space-x-1 disabled:opacity-50"
            >
              <Plus size={18} />
              <span>{t("embed-faqs.articles.addArticle")}</span>
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2">
          {articles.length === 0 ? (
            <p className="text-center text-white/40 py-4">{t("embed-faqs.articles.noArticles")}</p>
          ) : (
            <ul className="space-y-3">
              {articles.map((article) => (
                <li
                  key={article.id}
                  className="relative rounded-xl bg-zinc-900/50 border border-white/10 p-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="text-white font-medium">{article.title}</h3>
                      <button
                        onClick={() => handleDelete(article.id)}
                        className="text-white/60 hover:text-red-500 p-1"
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <p className="text-white/60 text-sm">{article.description}</p>
                    {article.image_url && (
                      <div className="relative w-full">
                        <img
                          src={article.image_url}
                          alt={article.title}
                          className="w-full max-h-48 object-contain rounded-lg bg-zinc-800/50"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"><path d="M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/><path d="M15 8h.01M12 12l-3-3-3 3"/></svg>';
                          }}
                        />
                      </div>
                    )}
                    <p className="text-white/60 text-sm flex items-center">
                      <Link size={14} className="mr-1 flex-shrink-0" />
                      <a
                        href={article.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="truncate hover:text-blue-400"
                      >
                        {article.url}
                      </a>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex justify-end space-x-2 p-4 border-t border-white/10">
          <button
            onClick={onClose}
            className="rounded-lg border border-white/10 px-4 py-2 text-white hover:bg-zinc-800"
          >
            {t("common.close")}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}
