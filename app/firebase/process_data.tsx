import React, { useState } from 'react';
import { read, utils } from 'xlsx';

const FileProcessor: React.FC = () => {
    const [processedData, setProcessedData] = useState<any>(null);

    const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            alert("No file selected.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = read(data, { type: 'array' });

            const sheet = workbook.Sheets[workbook.SheetNames[0]];
            if (!sheet) {
                alert("No valid sheet found.");
                return;
            }

            const jsonData = utils.sheet_to_json(sheet);
            
            if (jsonData.some((row: any) => row.hasOwnProperty('Level 1'))) {
                const groupedData = jsonData.reduce((acc: any, row: any) => {
                    const key = `${row['Level 1']}|${row['Level 2']}|${row['Level 3']}`;
                    acc[key] = (acc[key] || 0) + 1;
                    return acc;
                }, {});
                
                const formattedData = Object.entries(groupedData).map(([key, count]) => {
                    const [level1, level2, level3] = key.split('|');
                    return { level1, level2, level3, count };
                });
                setProcessedData(formattedData);
            } else {
                const processedData = {
                    station: sheet['AY1']?.v,
                    downtime: Math.round(sheet['AY3']?.v * 10) / 10,
                    stops: sheet['AY4']?.v
                };
                setProcessedData(processedData);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    return (
        <div>
            <input type="file" onChange={handleFile} />
            {processedData && <pre>{JSON.stringify(processedData, null, 2)}</pre>}
        </div>
    );
};

export default FileProcessor;
