export default function AdminStyles() {
  return (
    <style jsx global>{`
      .admin-container {
        margin: 0 auto;
        max-width: 1100px;
        width: 100%;
      }

      .admin-stack {
        display: grid;
        gap: 1.25rem;
      }

      .admin-form-card {
        border: 1px solid rgb(32 35 21 / 0.12);
        border-radius: 18px;
        background: #ffffff;
        padding: clamp(1.25rem, 2.5vw, 2rem);
        box-shadow: 0 18px 44px rgb(26 32 16 / 0.05);
      }

      .admin-form-card-muted {
        background: #e8e8e2;
      }

      .admin-form-title {
        margin-bottom: 1.25rem;
        border-bottom: 1px solid rgb(32 35 21 / 0.1);
        padding-bottom: 1rem;
      }

      .admin-form-title h2 {
        font-family: var(--font-sans, inherit);
        font-size: 1.05rem;
        font-weight: 700;
        color: #202315;
      }

      .admin-form-title p {
        margin-top: 0.35rem;
        max-width: 48rem;
        font-family: var(--font-sans, inherit);
        font-size: 0.875rem;
        line-height: 1.6;
        color: #5f6648;
      }

      .admin-field-grid {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 1rem;
      }

      .admin-field {
        display: block;
        min-width: 0;
      }

      .admin-field-full {
        grid-column: 1 / -1;
      }

      .admin-label {
        margin-bottom: 0.5rem;
        display: block;
        font-family: var(--font-sans, inherit);
        font-size: 0.74rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.14em;
        color: #5f6648;
      }

      .admin-input,
      .admin-textarea {
        display: block;
        width: 100%;
        border: 1px solid rgb(32 35 21 / 0.18);
        border-radius: 12px;
        background: #ffffff;
        padding: 0.75rem 0.9rem;
        font-family: var(--font-sans, inherit);
        font-size: 0.95rem;
        line-height: 1.45;
        color: #202315;
        outline: none;
        transition: border-color 160ms ease, box-shadow 160ms ease, background-color 160ms ease;
      }

      .admin-input {
        min-height: 44px;
      }

      .admin-input:focus,
      .admin-textarea:focus {
        border-color: #b28e5e;
        box-shadow: 0 0 0 3px rgb(178 142 94 / 0.14);
      }

      .admin-textarea {
        min-height: 120px;
        resize: vertical;
      }

      .admin-textarea-excerpt,
      .admin-textarea-seo {
        min-height: 120px;
      }

      .admin-textarea-content {
        min-height: 360px;
        font-size: 0.9rem;
        line-height: 1.65;
      }

      .admin-primary {
        display: inline-flex;
        min-height: 42px;
        align-items: center;
        justify-content: center;
        border: 1px solid #1a2010;
        background: #1a2010;
        color: #f4f1e8;
        border-radius: 999px;
        padding: 0.75rem 1.15rem;
        font-family: var(--font-sans, inherit);
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.14em;
        transition: background-color 160ms ease, border-color 160ms ease, color 160ms ease;
      }

      .admin-primary:hover {
        border-color: #b28e5e;
        background: #2a321d;
      }

      .admin-secondary {
        display: inline-flex;
        min-height: 42px;
        align-items: center;
        justify-content: center;
        border: 1px solid rgb(32 35 21 / 0.18);
        background: transparent;
        border-radius: 999px;
        color: #202315;
        padding: 0.7rem 1rem;
        font-family: var(--font-sans, inherit);
        font-size: 0.75rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.12em;
      }

      .admin-danger {
        color: #8a3f34;
      }

      .admin-action-row {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        justify-content: flex-end;
        gap: 0.75rem;
      }

      .admin-save-bar {
        position: sticky;
        bottom: 0;
        z-index: 10;
        margin-top: 1.25rem;
        border: 1px solid rgb(32 35 21 / 0.1);
        border-radius: 18px;
        background: rgb(244 241 232 / 0.92);
        padding: 1rem;
        backdrop-filter: blur(14px);
      }

      .admin-check {
        display: flex;
        align-items: center;
        gap: 0.65rem;
        border: 1px solid rgb(32 35 21 / 0.12);
        border-radius: 14px;
        background: #ffffff;
        padding: 0.85rem 1rem;
        font-family: var(--font-sans, inherit);
        font-size: 0.9rem;
        font-weight: 650;
        color: #202315;
      }

      .admin-check input {
        height: 1rem;
        width: 1rem;
        accent-color: #1a2010;
      }

      .admin-panel {
        border: 1px solid rgb(32 35 21 / 0.12);
        border-radius: 18px;
        background: #ffffff;
        box-shadow: 0 16px 38px rgb(26 32 16 / 0.04);
      }

      .admin-tools-card {
        border: 1px solid rgb(32 35 21 / 0.12);
        border-radius: 18px;
        background: #ffffff;
        padding: 1rem;
        box-shadow: 0 16px 38px rgb(26 32 16 / 0.04);
      }

      .admin-table {
        width: 100%;
        text-align: left;
        font-family: var(--font-sans, inherit);
        font-size: 0.875rem;
        color: #5f6648;
      }

      .admin-table thead {
        border-bottom: 1px solid rgb(32 35 21 / 0.12);
        background: #e8e8e2;
        color: #5f6648;
        font-size: 0.72rem;
        text-transform: uppercase;
        letter-spacing: 0.12em;
      }

      .admin-table th,
      .admin-table td {
        padding: 1rem;
        vertical-align: middle;
        white-space: nowrap;
      }

      .admin-table td:first-child,
      .admin-table th:first-child {
        white-space: normal;
      }

      .admin-table tbody tr {
        border-bottom: 1px solid rgb(32 35 21 / 0.08);
      }

      .admin-table tbody tr:hover {
        background: #f4f1e8;
      }

      .admin-table-actions {
        display: flex;
        flex-wrap: wrap;
        gap: 0.65rem;
        align-items: center;
      }

      .admin-table-actions a,
      .admin-table-actions button {
        font-family: var(--font-sans, inherit);
        font-size: 0.78rem;
        font-weight: 700;
        color: #202315;
        text-decoration: underline;
        text-underline-offset: 4px;
      }

      .admin-table-actions button.admin-danger {
        color: #8a3f34;
      }

      .admin-row-title {
        font-family: var(--font-sans, inherit);
        font-weight: 700;
        color: #202315;
      }

      .admin-row-meta {
        margin-top: 0.25rem;
        display: block;
        font-family: var(--font-sans, inherit);
        font-size: 0.75rem;
        color: #5f6648;
      }

      .admin-media-picker {
        display: grid;
        gap: 1rem;
        border: 1px solid rgb(32 35 21 / 0.12);
        border-radius: 18px;
        background: #f4f1e8;
        padding: 1rem;
      }

      .admin-media-picker-head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 1rem;
      }

      .admin-media-picker-head p,
      .admin-media-message {
        margin-top: 0.25rem;
        font-family: var(--font-sans, inherit);
        font-size: 0.82rem;
        line-height: 1.5;
        color: #5f6648;
      }

      .admin-media-message {
        margin-top: 0;
        white-space: nowrap;
      }

      .admin-media-upload {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: 1rem;
      }

      .admin-media-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
        gap: 0.75rem;
        max-height: 360px;
        overflow: auto;
        padding-right: 0.25rem;
      }

      .admin-media-tile,
      .admin-media-library-card {
        display: grid;
        gap: 0.55rem;
        border: 1px solid rgb(32 35 21 / 0.12);
        border-radius: 16px;
        background: #ffffff;
        padding: 0.5rem;
        text-align: left;
        transition: border-color 160ms ease, transform 160ms ease;
      }

      .admin-media-tile:hover,
      .admin-media-library-card:hover {
        border-color: rgb(178 142 94 / 0.5);
        transform: translateY(-2px);
      }

      .admin-media-tile-active,
      .admin-media-library-card-active {
        border-color: #b28e5e;
        box-shadow: 0 0 0 3px rgb(178 142 94 / 0.12);
      }

      .admin-media-tile img,
      .admin-media-library-card img {
        aspect-ratio: 4 / 3;
        width: 100%;
        border-radius: 12px;
        object-fit: cover;
        background: #e8e8e2;
      }

      .admin-media-tile span,
      .admin-media-library-card span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-family: var(--font-sans, inherit);
        font-size: 0.75rem;
        font-weight: 700;
        color: #202315;
      }

      .admin-media-library-card small {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-family: var(--font-sans, inherit);
        font-size: 0.68rem;
        color: #5f6648;
      }

      .admin-media-preview {
        overflow: hidden;
        border: 1px solid rgb(32 35 21 / 0.12);
        border-radius: 16px;
        background: #e8e8e2;
      }

      .admin-media-preview img {
        aspect-ratio: 4 / 3;
        width: 100%;
        object-fit: cover;
      }

      .admin-media-empty {
        display: grid;
        min-height: 130px;
        place-items: center;
        border: 1px dashed rgb(32 35 21 / 0.2);
        border-radius: 16px;
        background: #ffffff;
        padding: 1rem;
        font-family: var(--font-sans, inherit);
        font-size: 0.82rem;
        color: #5f6648;
      }

      .admin-media-empty-wide {
        grid-column: 1 / -1;
      }

      .admin-media-library-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 1rem;
        padding: 1rem;
      }

      .admin-gallery-preview {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
        gap: 1rem;
      }

      .admin-gallery-item {
        display: grid;
        gap: 0.75rem;
      }

      .admin-digital-asset-list,
      .admin-digital-asset-table {
        display: grid;
        gap: 0.65rem;
      }

      .admin-digital-asset-table {
        padding: 1rem;
      }

      .admin-digital-asset-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        border: 1px solid rgb(32 35 21 / 0.12);
        border-radius: 14px;
        background: #ffffff;
        padding: 0.85rem 1rem;
        text-align: left;
        transition: border-color 160ms ease, transform 160ms ease;
      }

      .admin-digital-asset-row:hover {
        border-color: rgb(178 142 94 / 0.5);
        transform: translateY(-1px);
      }

      .admin-digital-asset-row-active {
        border-color: #b28e5e;
        box-shadow: 0 0 0 3px rgb(178 142 94 / 0.12);
      }

      .admin-digital-asset-row span {
        min-width: 0;
        display: grid;
        gap: 0.25rem;
      }

      .admin-digital-asset-row strong {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-family: var(--font-sans, inherit);
        font-size: 0.9rem;
        color: #202315;
      }

      .admin-digital-asset-row small,
      .admin-digital-asset-row em {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-family: var(--font-sans, inherit);
        font-size: 0.75rem;
        font-style: normal;
        color: #5f6648;
      }

      @media (max-width: 767px) {
        .admin-field-grid {
          grid-template-columns: 1fr;
        }

        .admin-media-upload {
          grid-template-columns: 1fr;
        }

        .admin-media-picker-head {
          display: grid;
        }

        .admin-media-message {
          white-space: normal;
        }

        .admin-digital-asset-row {
          display: grid;
        }

        .admin-form-card {
          border-radius: 16px;
          padding: 1rem;
        }

        .admin-action-row {
          justify-content: stretch;
        }

        .admin-action-row .admin-primary,
        .admin-action-row .admin-secondary {
          width: 100%;
        }
      }
    `}</style>
  );
}
