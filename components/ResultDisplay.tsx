
import React from 'react';
import { Spinner } from './Spinner';
import { isUrl } from '../utils/helpers';
import { LinkIcon, ClipboardDocumentIcon, CheckIcon } from './icons';

interface ResultDisplayProps {
  isLoading: boolean;
  qrData: string | null;
  error: string | null;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ isLoading, qrData, error }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (qrData) {
      navigator.clipboard.writeText(qrData);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-4 h-32">
        <Spinner />
        <p className="mt-3 text-lg text-gray-300">Analyzing QR Code...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative w-full text-center" role="alert">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline ml-2">{error}</span>
      </div>
    );
  }

  if (qrData) {
    const isLink = isUrl(qrData);
    return (
      <div className="w-full text-left bg-gray-900/50 p-6 rounded-lg border border-gray-700">
        <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider mb-3">Decoded Information</h3>
        <div className="flex items-start justify-between gap-4">
          {isLink ? (
            <a
              href={qrData}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 break-all font-mono text-lg text-green-400 hover:text-green-300 hover:underline transition-colors"
            >
              <LinkIcon className="inline-block w-5 h-5 mr-2 align-middle" />
              {qrData}
            </a>
          ) : (
            <p className="flex-1 break-all font-mono text-lg text-gray-200">
              {qrData}
            </p>
          )}
          <button
            onClick={handleCopy}
            className="p-2 rounded-md bg-gray-700 hover:bg-gray-600 text-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
            aria-label="Copy to clipboard"
          >
            {copied ? <CheckIcon className="w-5 h-5 text-green-400" /> : <ClipboardDocumentIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    );
  }

  return null;
};
