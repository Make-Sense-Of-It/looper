import React from 'react';
import { useFileProcessing } from '../../providers/FileProcessingProvider';
import { useFileAnalysis } from '../../providers/FileAnalysisProvider';

const ProgressBar: React.FC = () => {
    const { isLoading, processedFiles } = useFileProcessing();
    const { files } = useFileAnalysis();

    if (!isLoading || files.length === 0) {
        return null;
    }

    const progress = (processedFiles / files.length) * 100;

    return (
        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
                className="bg-[#948469] h-2.5 rounded-full"
                style={{ width: `${progress}%` }}
            ></div>
        </div>
    );
};

export default ProgressBar;