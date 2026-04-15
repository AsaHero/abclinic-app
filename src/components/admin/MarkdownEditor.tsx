import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({ value, onChange, rows = 20 }) => {
  return (
    <div className="grid grid-cols-2 gap-4 h-full">
      {/* Editor pane */}
      <div className="flex flex-col">
        <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wider">Markdown</p>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={rows}
          className="flex-1 w-full bg-[#12161b] border border-white/10 rounded-lg px-4 py-3 text-sm text-gray-200 font-mono leading-relaxed focus:outline-none focus:border-blue-400 resize-y"
          placeholder="Write markdown here…"
          spellCheck={false}
        />
      </div>

      {/* Preview pane */}
      <div className="flex flex-col overflow-hidden">
        <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wider">Preview</p>
        <div
          className="flex-1 bg-[#12161b] border border-white/10 rounded-lg px-4 py-3 overflow-y-auto
            prose prose-sm prose-invert max-w-none
            prose-headings:text-white prose-p:text-gray-300 prose-li:text-gray-300
            prose-strong:text-white prose-blockquote:text-blue-300
            prose-blockquote:border-l-blue-500 prose-a:text-blue-400"
          style={{ minHeight: `${rows * 1.5}rem` }}
        >
          {value.trim() ? (
            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>
              {value}
            </ReactMarkdown>
          ) : (
            <p className="text-gray-600 italic text-sm">Preview will appear here…</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MarkdownEditor;
