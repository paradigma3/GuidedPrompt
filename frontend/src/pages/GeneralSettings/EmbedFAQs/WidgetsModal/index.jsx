import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { X, Plus, Link } from "@phosphor-icons/react";
import ModalWrapper from "@/components/ModalWrapper";
import { baseHeaders } from "@/utils/request";
import showToast from "@/utils/toast";

export default function WidgetsModal({ isOpen, onClose, faq, onUpdate }) {
  const { t } = useTranslation();
  const [originalWidget, setOriginalWidget] = useState(null);
  const [draftWidget, setDraftWidget] = useState(null);
  const [newWidget, setNewWidget] = useState({ type: "iframe", label: "", url: "", imageUrls: [] });
  const [newImageUrl, setNewImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (faq?.widgets?.length) {
      const widget = faq.widgets[0];
      const processedWidget = {
        ...widget,
        type: widget.type || 'iframe',
        label: widget.label || '',
        url: widget.url || '',
        imageUrls: widget.type === 'gallery'
          ? (Array.isArray(widget.images)
              ? widget.images
              : typeof widget.images === 'string'
                ? JSON.parse(widget.images || '[]')
                : [])
          : [],
        id: widget.id
      };
      setOriginalWidget(processedWidget);
      setDraftWidget(processedWidget);
    } else {
      setOriginalWidget(null);
      setDraftWidget(null);
    }
  }, [faq]);

  const handleClose = () => {
    if (hasUnsavedChanges()) {
      if (window.confirm("You have unsaved changes. Are you sure you want to close?")) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  const validateUrl = (url, type = 'url') => {
    if (!url?.trim()) {
      toast.error(`Please enter a ${type} URL`);
      return false;
    }
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      toast.error("Please enter a valid URL starting with http:// or https://");
      return false;
    }
    if (type === 'image' && !url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      toast.error("URL must end with a valid image extension (.jpg, .jpeg, .png, .gif, .webp)");
      return false;
    }
    return true;
  };

  const validateGalleryUrl = (url, existingUrls = []) => {
    if (!url?.trim()) {
      toast.error("Please enter an image URL");
      return false;
    }
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      toast.error("Please enter a valid URL starting with http:// or https://");
      return false;
    }
    if (!url.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
      toast.error("URL must end with a valid image extension (.jpg, .jpeg, .png, .gif, .webp)");
      return false;
    }

    if (existingUrls.includes(url)) {
      toast.error("This image URL has already been added");
      return false;
    }

    if (existingUrls.length >= 6) {
      toast.error("Maximum of 6 images allowed per gallery");
      return false;
    }

    return true;
  };

  const validateWidget = () => {
    if (!newWidget.label?.trim()) {
      toast.error("Please enter a widget label");
      return false;
    }

    if (newWidget.type === "iframe") {
      if (!newWidget.url?.trim()) {
        toast.error("Please enter a URL");
        return false;
      }
      if (!newWidget.url.startsWith('http://') && !newWidget.url.startsWith('https://')) {
        toast.error("Please enter a valid URL starting with http:// or https://");
        return false;
      }
      return true;
    } else if (newWidget.type === "gallery") {
      if (newWidget.imageUrls.length === 0) {
        toast.error("Please add at least one image to the gallery");
        return false;
      }
      // We don't need to validate URLs here as they were validated when added
      return true;
    }

    return true;
  };

  const handleAddWidget = () => {
    if (!validateWidget()) return;

    const newDraftWidget = {
      ...newWidget,
      type: newWidget.type,
      label: newWidget.label,
      url: newWidget.type === 'iframe' ? newWidget.url : undefined,
      imageUrls: newWidget.type === 'gallery' ? newWidget.imageUrls : [],
      images: newWidget.type === 'gallery' ? newWidget.imageUrls : undefined
    };
    setDraftWidget(newDraftWidget);
    setNewWidget({ type: "iframe", label: "", url: "", imageUrls: [] });
    setNewImageUrl("");
    toast.success(`${newWidget.type === 'iframe' ? 'IFrame' : 'Gallery'} widget added`);
  };

  const handleRemoveWidget = () => {
    setDraftWidget(null);
    toast.success("Widget removed");
  };

  const handleAddImageUrl = () => {
    if (!validateGalleryUrl(newImageUrl, newWidget.imageUrls)) return;

    setNewWidget({
      ...newWidget,
      imageUrls: [...newWidget.imageUrls, newImageUrl]
    });
    setNewImageUrl("");
    toast.success("Image URL added to gallery");
  };

  const handleRemoveImage = (index) => {
    const newUrls = [...newWidget.imageUrls];
    newUrls.splice(index, 1);
    setNewWidget({ ...newWidget, imageUrls: newUrls });
    toast.success("Image removed from gallery");
  };

  const handleAddImageToExistingWidget = (newUrl) => {
    if (!validateGalleryUrl(newUrl, draftWidget.imageUrls || [])) return;

    setDraftWidget({
      ...draftWidget,
      imageUrls: [...(draftWidget.imageUrls || []), newUrl],
      images: [...(draftWidget.imageUrls || []), newUrl]
    });
    toast.success("Image added to gallery");
  };

  const handleRemoveImageFromWidget = (imageIndex) => {
    const currentImages = draftWidget.imageUrls || [];
    const newImages = [...currentImages];
    newImages.splice(imageIndex, 1);

    setDraftWidget({
      ...draftWidget,
      imageUrls: newImages,
      images: newImages
    });
    toast.success("Image removed from gallery");
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      // Format widget data according to database schema
      const widgetToSave = draftWidget ? {
        type: draftWidget.type,
        label: draftWidget.label,
        ...(draftWidget.id && { id: draftWidget.id }),
        ...(draftWidget.type === 'iframe' ? { url: draftWidget.url } : {}),
        ...(draftWidget.type === 'gallery' ? {
          images: draftWidget.imageUrls || []
        } : {})
      } : null;

      const response = await fetch(`/api/embed-faqs/${faq.embed_config_id}/faq/${faq.id}/widgets`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...baseHeaders()
        },
        body: JSON.stringify({
          widgets: widgetToSave ? [widgetToSave] : []
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update widget");
      }

      // Update the original widget with the saved data to reset the unsaved changes state
      if (data.faq?.widgets?.[0]) {
        const savedWidget = data.faq.widgets[0];
        const processedWidget = {
          ...savedWidget,
          type: savedWidget.type || 'iframe',
          label: savedWidget.label || '',
          url: savedWidget.url || '',
          imageUrls: typeof savedWidget.images === 'string'
            ? JSON.parse(savedWidget.images || '[]')
            : Array.isArray(savedWidget.images)
              ? savedWidget.images
              : [],
          id: savedWidget.id
        };
        setOriginalWidget(processedWidget);
        setDraftWidget(processedWidget);
      } else {
        setOriginalWidget(null);
        setDraftWidget(null);
      }

      onUpdate(data.faq);
      onClose();
      toast.success("Widget updated successfully");
    } catch (error) {
      console.error("Error updating widget:", error);
      toast.error(error.message || "Error updating widget");
    } finally {
      setLoading(false);
    }
  };

  const hasUnsavedChanges = () => {
    if (!originalWidget && !draftWidget) return false;
    if (!originalWidget && draftWidget) return true;
    if (originalWidget && !draftWidget) return true;

    const originalForComparison = {
      ...(originalWidget.id && { id: originalWidget.id }),
      type: originalWidget.type,
      label: originalWidget.label,
      url: originalWidget.type === 'iframe' ? originalWidget.url : undefined,
      imageUrls: originalWidget.type === 'gallery' ? (originalWidget.imageUrls || []) : undefined
    };

    const draftForComparison = {
      ...(draftWidget.id && { id: draftWidget.id }),
      type: draftWidget.type,
      label: draftWidget.label,
      url: draftWidget.type === 'iframe' ? draftWidget.url : undefined,
      imageUrls: draftWidget.type === 'gallery' ? (draftWidget.imageUrls || []) : undefined
    };

    return JSON.stringify(originalForComparison) !== JSON.stringify(draftForComparison);
  };

  return (
    <ModalWrapper
      isOpen={isOpen}
      onClose={handleClose}
      title="Manage Widget"
      className="w-full max-w-xl"
    >
      <div className="flex flex-col max-h-[36rem]">
        {!draftWidget && (
          <div className="flex flex-col space-y-3 p-4 border-b border-white/10">
            <div className="flex items-center space-x-2">
              <select
                value={newWidget.type}
                onChange={(e) => setNewWidget({ ...newWidget, type: e.target.value, imageUrls: [], url: '' })}
                className="rounded bg-zinc-900 border border-white/10 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="iframe">iFrame</option>
                <option value="gallery">Gallery</option>
              </select>
              <input
                type="text"
                value={newWidget.label}
                onChange={(e) => setNewWidget({ ...newWidget, label: e.target.value })}
                placeholder="Enter widget label"
                className="flex-1 rounded bg-zinc-900 border border-white/10 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {newWidget.type === "iframe" ? (
              <div className="flex space-x-2">
                <div className="flex-1 relative">
                  <input
                    type="url"
                    value={newWidget.url}
                    onChange={(e) => setNewWidget({ ...newWidget, url: e.target.value })}
                    placeholder="Enter iframe URL"
                    className="w-full rounded bg-zinc-900 border border-white/10 pl-8 pr-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Link className="absolute left-2.5 top-2.5 h-5 w-5 text-white/40" />
                </div>
                <button
                  onClick={handleAddWidget}
                  disabled={loading}
                  className="rounded bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white flex items-center space-x-1 disabled:opacity-50"
                >
                  <Plus size={18} />
                  <span>Add Widget</span>
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex space-x-2">
                  <div className="flex-1 relative">
                    <input
                      type="url"
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      placeholder="Enter image URL"
                      className="w-full rounded bg-zinc-900 border border-white/10 pl-8 pr-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Link className="absolute left-2.5 top-2.5 h-5 w-5 text-white/40" />
                  </div>
                  <button
                    onClick={handleAddImageUrl}
                    disabled={loading}
                    className="rounded bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white flex items-center space-x-1 disabled:opacity-50"
                  >
                    <Plus size={18} />
                    <span>Add URL</span>
                  </button>
                </div>
                {newWidget.imageUrls.length > 0 && (
                  <div className="border border-white/10 rounded-xl p-3 space-y-2 bg-zinc-900/50">
                    <p className="text-sm text-white/60">Added URLs: ({newWidget.imageUrls.length}/6)</p>
                    <ul className="space-y-1">
                      {newWidget.imageUrls.map((url, index) => (
                        <li key={index} className="flex items-center justify-between text-sm">
                          <span className="text-white truncate flex-1">{url}</span>
                          <button
                            onClick={() => handleRemoveImage(index)}
                            className="text-white/60 hover:text-red-500 p-1"
                          >
                            <X size={16} />
                          </button>
                        </li>
                      ))}
                    </ul>
                    <button
                      onClick={handleAddWidget}
                      disabled={loading}
                      className="w-full rounded bg-blue-600 hover:bg-blue-700 px-4 py-2 text-white flex items-center justify-center space-x-1 mt-2 disabled:opacity-50"
                    >
                      <Plus size={18} />
                      <span>Create Gallery Widget</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        <div className="flex-1 min-h-0 p-4">
          {!draftWidget ? (
            <p className="text-center text-white/40 py-4">No widget added yet</p>
          ) : (
            <div className="relative rounded-xl bg-zinc-900/50 border border-white/10 p-4 pt-6">
              <div className="absolute -top-[1px] -left-[1px] px-3 py-1 bg-zinc-900/80 border-r border-b border-white/10 rounded-br text-xs font-medium text-white/60">
                {draftWidget.type === 'iframe' ? 'iFrame' : 'Gallery'}
              </div>
              <div className="space-y-1">
                <p className="text-white">
                  <span className="font-medium">Label:</span> {draftWidget.label}
                </p>
                {draftWidget.type === 'iframe' ? (
                  <p className="text-white/60 text-sm flex items-center">
                    <span className="font-medium mr-1">URL:</span>
                    <Link size={14} className="mr-1" />
                    <span className="truncate">{draftWidget.url}</span>
                  </p>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-white/60 text-sm">
                        <span className="font-medium">Images:</span> ({(draftWidget.imageUrls || []).length}/6)
                      </p>
                      {(draftWidget.imageUrls || []).length < 6 && (
                        <div className="flex items-center space-x-2">
                          <input
                            type="url"
                            placeholder="Add image URL"
                            className="text-sm rounded bg-zinc-900 border border-white/10 px-2 py-1 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && e.target.value) {
                                handleAddImageToExistingWidget(e.target.value);
                                e.target.value = '';
                              }
                            }}
                          />
                          <button
                            onClick={(e) => {
                              const input = e.currentTarget.previousElementSibling;
                              if (input && input.value) {
                                handleAddImageToExistingWidget(input.value);
                                input.value = '';
                              }
                            }}
                            className="text-white/60 hover:text-blue-500 p-1"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {(draftWidget.imageUrls || []).map((url, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={url}
                            alt=""
                            className="w-full h-16 object-cover rounded-lg"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2"><path d="M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"/><path d="M15 8h.01M12 12l-3-3-3 3"/></svg>';
                              toast.error(`Failed to load image: ${url}`);
                            }}
                          />
                          <button
                            onClick={() => handleRemoveImageFromWidget(index)}
                            className="absolute top-1 right-1 p-1 bg-black/50 text-white/60 hover:text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={handleRemoveWidget}
                className="absolute top-1 right-1 text-white/60 hover:text-red-500 p-1"
              >
                <X size={16} />
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 p-4 border-t border-white/10">
          <button
            onClick={handleClose}
            className="rounded-lg border border-white/10 px-4 py-2 text-white hover:bg-zinc-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading || !hasUnsavedChanges()}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}
