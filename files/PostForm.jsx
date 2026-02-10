import { useState, useEffect } from 'react';
import { validatePost, isValid, serializeTags } from '../utils/validators';

const DRAFT_KEY = 'postflow-draft';

export default function PostForm({ initialData = {}, onSubmit, submitLabel = 'Publish Post', isEditing = false }) {
  const [form, setForm] = useState({
    title: initialData.title || '',
    author: initialData.author || '',
    content: initialData.content || '',
    tags: serializeTags(initialData.tags) || '',
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Auto-save draft (only for new posts)
  useEffect(() => {
    if (isEditing) return;
    const timer = setTimeout(() => {
      if (form.title || form.content) {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(form));
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [form, isEditing]);

  // Load draft on mount (only for new posts)
  useEffect(() => {
    if (isEditing) return;
    try {
      const draft = localStorage.getItem(DRAFT_KEY);
      if (draft) {
        const parsed = JSON.parse(draft);
        if (parsed.title || parsed.content) {
          setForm(parsed);
        }
      }
    } catch { /* no draft */ }
  }, [isEditing]);

  const clearDraft = () => localStorage.removeItem(DRAFT_KEY);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Re-validate touched fields on change
    if (touched[name]) {
      const errs = validatePost({ ...form, [name]: value });
      setErrors(prev => ({ ...prev, [name]: errs[name] }));
    }
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const errs = validatePost(form);
    setErrors(prev => ({ ...prev, [name]: errs[name] }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setTouched({ title: true, author: true, content: true, tags: true });
    const errs = validatePost(form);
    setErrors(errs);
    if (!isValid(errs)) {
      // Focus first error
      const firstErrField = Object.keys(errs)[0];
      document.getElementById(`field-${firstErrField}`)?.focus();
      return;
    }
    setSubmitting(true);
    await onSubmit(form);
    clearDraft();
    setSubmitting(false);
  }

  const charCounts = {
    title: form.title.length,
    author: form.author.length,
    content: form.content.length,
  };

  return (
    <form className="post-form" onSubmit={handleSubmit} noValidate aria-label={isEditing ? 'Edit post form' : 'Create post form'}>

      {/* Title */}
      <div className="form-group">
        <label htmlFor="field-title" className="form-label">
          Title <span className="required" aria-hidden="true">*</span>
        </label>
        <input
          id="field-title"
          name="title"
          type="text"
          className={`form-input ${touched.title && errors.title ? 'is-invalid' : touched.title ? 'is-valid' : ''}`}
          value={form.title}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="An engaging title for your post…"
          maxLength={120}
          aria-required="true"
          aria-describedby="title-help title-error"
        />
        <div className="field-footer">
          {touched.title && errors.title
            ? <span id="title-error" className="field-error" role="alert">{errors.title}</span>
            : <span id="title-help" className="field-hint">Clear, descriptive titles get more reads</span>
          }
          <span className="char-count" aria-live="polite">{charCounts.title}/120</span>
        </div>
      </div>

      {/* Author */}
      <div className="form-group">
        <label htmlFor="field-author" className="form-label">
          Author <span className="required" aria-hidden="true">*</span>
        </label>
        <input
          id="field-author"
          name="author"
          type="text"
          className={`form-input ${touched.author && errors.author ? 'is-invalid' : touched.author ? 'is-valid' : ''}`}
          value={form.author}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Your name…"
          maxLength={80}
          aria-required="true"
          aria-describedby="author-error"
        />
        {touched.author && errors.author && (
          <span id="author-error" className="field-error" role="alert">{errors.author}</span>
        )}
      </div>

      {/* Content */}
      <div className="form-group">
        <label htmlFor="field-content" className="form-label">
          Content <span className="required" aria-hidden="true">*</span>
        </label>
        <textarea
          id="field-content"
          name="content"
          className={`form-input form-textarea ${touched.content && errors.content ? 'is-invalid' : touched.content ? 'is-valid' : ''}`}
          value={form.content}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Write your post content here (minimum 50 characters)…"
          rows={14}
          aria-required="true"
          aria-describedby="content-help content-error"
        />
        <div className="field-footer">
          {touched.content && errors.content
            ? <span id="content-error" className="field-error" role="alert">{errors.content}</span>
            : <span id="content-help" className="field-hint">Minimum 50 characters. Separate paragraphs with a blank line.</span>
          }
          <span className="char-count" aria-live="polite">{charCounts.content.toLocaleString()} chars</span>
        </div>
      </div>

      {/* Tags */}
      <div className="form-group">
        <label htmlFor="field-tags" className="form-label">
          Tags <span className="optional-label">(optional)</span>
        </label>
        <input
          id="field-tags"
          name="tags"
          type="text"
          className={`form-input ${touched.tags && errors.tags ? 'is-invalid' : ''}`}
          value={form.tags}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="react, javascript, frontend"
          aria-describedby="tags-help tags-error"
        />
        <div className="field-footer">
          {touched.tags && errors.tags
            ? <span id="tags-error" className="field-error" role="alert">{errors.tags}</span>
            : <span id="tags-help" className="field-hint">Comma-separated. Up to 10 tags.</span>
          }
        </div>

        {/* Live tag preview */}
        {form.tags.trim() && (
          <div className="tags-preview" aria-label="Tag preview">
            {form.tags.split(',').map(t => t.trim()).filter(Boolean).slice(0, 10).map(tag => (
              <span key={tag} className="tag-chip tag-chip--preview">{tag}</span>
            ))}
          </div>
        )}
      </div>

      {/* Draft indicator */}
      {!isEditing && (
        <p className="draft-notice" aria-live="polite">
          <span aria-hidden="true">💾</span> Draft auto-saved as you type
        </p>
      )}

      {/* Actions */}
      <div className="form-actions">
        <button
          type="submit"
          className="btn-submit"
          disabled={submitting}
          aria-busy={submitting}
        >
          {submitting ? (
            <><span className="spinner" aria-hidden="true"></span> Saving…</>
          ) : (
            <>{isEditing ? '✔ Save Changes' : `🚀 ${submitLabel}`}</>
          )}
        </button>
      </div>
    </form>
  );
}
