import { useState } from "react";
import { X } from "lucide-react";

export default function TagInput({
  tags = [],
  onChange,
  placeholder = "Add a skill and press Enter...",
  suggestions = [],
  label,
  id = "skills-tag-input",
  helperText,
}) {
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");

  const addTag = (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const exists = tags.some(
      (t) => t.toLowerCase() === trimmed.toLowerCase()
    );

    if (exists) {
      setError(`"${trimmed}" is already added.`);
      setTimeout(() => setError(""), 2500);
      return;
    }

    const updated = [...tags, trimmed];
    onChange(updated);
    setInputValue("");
    setError("");
  };

  const removeTag = (indexToRemove) => {
    const updated = tags.filter((_, idx) => idx !== indexToRemove);
    onChange(updated);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
      e.preventDefault();
      removeTag(tags.length - 1);
    }
  };

  return (
    <div className="tag-input-container">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
        </label>
      )}

      <div className="tag-input-box" onClick={() => document.getElementById(id)?.focus()}>
        <div className="tag-list" role="list">
          {tags.map((tag, index) => (
            <span key={index} className="tag-pill" role="listitem">
              <span className="tag-text">{tag}</span>
              <button
                type="button"
                className="tag-remove-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(index);
                }}
                aria-label={`Remove skill ${tag}`}
              >
                <X size={12} />
              </button>
            </span>
          ))}
          <input
            id={id}
            type="text"
            className="tag-field-input"
            placeholder={tags.length === 0 ? placeholder : "Add more..."}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (error) setError("");
            }}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              if (inputValue.trim()) {
                addTag(inputValue);
              }
            }}
          />
        </div>
      </div>

      {error && <p className="form-error-inline" role="alert">{error}</p>}
      {helperText && !error && <p className="form-hint">{helperText}</p>}

      {suggestions && suggestions.length > 0 && (
        <div className="tag-suggestions-row">
          <span className="suggestions-label">Suggestions:</span>
          <div className="suggestions-chips">
            {suggestions.map((item) => {
              const isAdded = tags.some(
                (t) => t.toLowerCase() === item.toLowerCase()
              );
              return (
                <button
                  key={item}
                  type="button"
                  className={`suggestion-chip ${isAdded ? "is-added" : ""}`}
                  onClick={() => addTag(item)}
                  disabled={isAdded}
                >
                  <span>{isAdded ? "✓" : "+"}</span>
                  <span>{item}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
