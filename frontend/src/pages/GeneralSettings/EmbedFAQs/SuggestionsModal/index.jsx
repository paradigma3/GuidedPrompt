import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { X, Plus, Link } from "@phosphor-icons/react";
import ModalWrapper from '@/components/ModalWrapper';
import { baseHeaders } from "@/utils/request";
import showToast from "@/utils/toast";

export default function SuggestionsModal({ isOpen, onClose, faq, onUpdate }) {
  const { t } = useTranslation();
  const [suggestions, setSuggestions] = useState([]);
  const [newSuggestion, setNewSuggestion] = useState({ type: 'message', text: '', url: '' });
  const [loading, setLoading] = useState(false);

  // Initialize suggestions when faq changes
  useEffect(() => {
    if (faq?.suggestions) {
      setSuggestions(faq.suggestions.map(suggestion => ({
        ...suggestion,
        id: suggestion.id || Date.now()
      })));
    } else {
      setSuggestions([]);
    }
  }, [faq]);

  const validateSuggestion = () => {
    if (!newSuggestion.text?.trim()) {
      toast.error("Please enter suggestion text");
      return false;
    }
    if (newSuggestion.type === 'redirect') {
      if (!newSuggestion.url?.trim()) {
        toast.error("Please enter redirect URL");
        return false;
      }
      if (!newSuggestion.url.startsWith('http://') && !newSuggestion.url.startsWith('https://')) {
        toast.error("Please enter a valid URL starting with http:// or https://");
        return false;
      }
    }
    return true;
  };

  const handleAddSuggestion = () => {
    if (!validateSuggestion()) return;

    const tempId = Date.now();
    setSuggestions([...suggestions, { ...newSuggestion, id: tempId }]);
    setNewSuggestion({ type: 'message', text: '', url: '' });
    toast.success("Suggestion added");
  };

  const handleRemoveSuggestion = (id) => {
    setSuggestions(suggestions.filter(s => s.id !== id));
    toast.success("Suggestion removed");
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // Clean up suggestions data before sending
      const cleanedSuggestions = suggestions.map(({ id, ...suggestion }) => ({
        type: suggestion.type,
        text: suggestion.text,
        url: suggestion.type === 'redirect' ? suggestion.url : null
      }));

      const response = await fetch(`/api/embed-faqs/${faq.embed_config_id}/faq/${faq.id}/suggestions`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...baseHeaders()
        },
        body: JSON.stringify({ suggestions: cleanedSuggestions })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update suggestions");
      }

      const { faq: updatedFaq } = await response.json();
      onUpdate(updatedFaq);
      onClose();
      showToast("Suggestions updated successfully");
    } catch (error) {
      console.error('Error updating suggestions:', error);
      showToast(error.message || "Error updating suggestions", "error");
    } finally {
      setLoading(false);
    }
  };


  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={onClose}
      title="Manage Suggestions"
      className="w-full max-w-xl"
    >
      <div className="flex flex-col h-[36rem]">
        <div className="flex flex-col space-y-3 p-4 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <select
              value={newSuggestion.type}
              onChange={(e) => setNewSuggestion({ ...newSuggestion, type: e.target.value, url: '' })}
              className="rounded bg-zinc-900 border border-white/10 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="message">Message</option>
              <option value="redirect">Redirect</option>
            </select>
            <input
              type="text"
              value={newSuggestion.text}
              onChange={(e) => setNewSuggestion({ ...newSuggestion, text: e.target.value })}
              placeholder="Enter suggestion text"
              className="flex-1 rounded bg-zinc-900 border border-white/10 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {newSuggestion.type === "redirect" && (
            <div className="flex space-x-2">
              <div className="flex-1 relative">
                <input
                  type="url"
                  value={newSuggestion.url}
                  onChange={(e) => setNewSuggestion({ ...newSuggestion, url: e.target.value })}
                  placeholder="Enter redirect URL"
                  className="w-full rounded bg-zinc-900 border border-white/10 pl-8 pr-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 overflow-x-hidden text-ellipsis"
                />
                <Link className="absolute left-2.5 top-2.5 h-5 w-5 text-white/40" />
              </div>
              <button
                onClick={handleAddSuggestion}
                disabled={loading}
                className="rounded bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white flex items-center space-x-1 disabled:opacity-50"
              >
                <Plus size={18} />
                <span>Add Suggestion</span>
              </button>
            </div>
          )}

          {newSuggestion.type === "message" && (
            <button
              onClick={handleAddSuggestion}
              disabled={loading}
              className="rounded bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white flex items-center space-x-1 disabled:opacity-50"
            >
              <Plus size={18} />
              <span>Add Suggestion</span>
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-2">
          {suggestions.length === 0 ? (
            <p className="text-center text-white/40 py-4">No suggestions added yet</p>
          ) : (
            <ul className="space-y-3">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.id}
                  className="relative rounded-xl bg-zinc-900/50 border border-white/10 p-4 pt-6"
                >
                  <div className="absolute -top-[1px] -left-[1px] px-3 py-1 bg-zinc-900/80 border-r border-b border-white/10 rounded-br text-xs font-medium text-white/60">
                    {suggestion.type === 'message' ? 'Message' : 'Redirect'}
                  </div>
                  <div className="space-y-1">
                    <p className="text-white">
                      <span className="font-medium">Message:</span> {suggestion.text}
                    </p>
                    {suggestion.type === 'redirect' && (
                      <p className="text-white/60 text-sm flex items-center">
                        <span className="font-medium mr-1">URL:</span>
                        <Link size={14} className="mr-1 flex-shrink-0" />
                        <span className="truncate">{suggestion.url}</span>
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveSuggestion(suggestion.id)}
                    className="absolute top-1 right-1 text-white/60 hover:text-red-500 p-1"
                  >
                    <X size={16} />
                  </button>
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
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}
