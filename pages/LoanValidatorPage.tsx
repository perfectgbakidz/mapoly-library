
import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner, Html5QrcodeScannerState } from 'html5-qrcode';
import { useToast } from '../hooks/useToast';
import * as api from '../services/api';
import Spinner from '../components/common/Spinner';
import Button from '../components/common/Button';

interface ScanResultData {
    loanId: number;
    studentName: string;
    matricNo: string;
    bookTitle: string;
    dueDate: string;
}

const QR_READER_ID = "qr-reader-container";

const LoanValidatorPage: React.FC = () => {
    const [isScanning, setIsScanning] = useState(false);
    const [scanResult, setScanResult] = useState<ScanResultData | null>(null);
    const [validationStatus, setValidationStatus] = useState<'idle' | 'valid' | 'invalid' | 'loading'>('idle');
    const [validationMessage, setValidationMessage] = useState('');
    const { addToast } = useToast();

    useEffect(() => {
        if (!isScanning) return;

        // A new scanner is created whenever scanning starts. This is intended to ensure a clean state.
        const scanner = new Html5QrcodeScanner(
            QR_READER_ID,
            { fps: 10, qrbox: { width: 250, height: 250 } },
            false // verbose
        );

        const onScanSuccess = async (decodedText: string) => {
            // Let the useEffect cleanup handle clearing the scanner by setting isScanning to false.
            // This prevents race conditions and double-clearing issues.
            setIsScanning(false);
            setValidationStatus('loading');

            try {
                const parsedData: ScanResultData = JSON.parse(decodedText);
                setScanResult(parsedData);
                
                if (!parsedData.loanId || !parsedData.matricNo) {
                    throw new Error("QR code does not contain valid loan data.");
                }

                // Fetch all loans to verify against the scanned one. 
                // A dedicated API endpoint `getLoanById` would be more efficient in a larger system.
                const allLoans = await api.getLoans(); 
                const matchingLoan = allLoans.find(loan => loan.id === parsedData.loanId);

                if (!matchingLoan) {
                    throw new Error(`Loan with ID ${parsedData.loanId} not found in the system.`);
                }
                
                if (matchingLoan.status !== 'approved') {
                     throw new Error(`This loan's status is "${matchingLoan.status}", not "approved". It cannot be picked up.`);
                }
                
                if (matchingLoan.returnDate) {
                     throw new Error('This book has already been returned.');
                }
                
                // All checks passed
                setValidationStatus('valid');
                setValidationMessage('Loan details are valid. You can hand over the book to the student.');

            } catch (error) {
                const errorMessage = (error instanceof Error) ? error.message : "An unknown error occurred during validation.";
                setScanResult(null);
                setValidationStatus('invalid');
                setValidationMessage(`Validation Failed: ${errorMessage}`);
                addToast(errorMessage, 'error');
            }
        };

        scanner.render(onScanSuccess, undefined);

        // The cleanup function is critical for stopping the scanner gracefully.
        return () => {
             // Use a more specific check to ensure we only clear an active scanner.
             // This robustly handles React 18's Strict Mode and fast component updates.
            if (scanner && scanner.getState() === Html5QrcodeScannerState.SCANNING) {
                 scanner.clear().catch(error => console.error("Failed to clear scanner on cleanup", error));
            }
        };
    }, [isScanning, addToast]);

    const handleStartScan = () => {
        setIsScanning(true);
        setScanResult(null);
        setValidationStatus('idle');
        setValidationMessage('');
    };

    const handleReset = () => {
        setIsScanning(false);
        setScanResult(null);
        setValidationStatus('idle');
        setValidationMessage('');
    };

    const ResultCard = () => {
        const isSuccess = validationStatus === 'valid';
        const borderColor = isSuccess ? 'border-green-500' : 'border-red-500';
        const textColor = isSuccess ? 'text-green-700' : 'text-red-700';

        return (
            <div className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${borderColor}`}>
                <h3 className={`text-xl font-bold ${textColor} mb-4`}>
                    {isSuccess ? 'Validation Successful' : 'Validation Failed'}
                </h3>
                <p className="text-slate-600 mb-4">{validationMessage}</p>
                {scanResult && (
                    <div className="space-y-2 border-t pt-4 mt-4 text-slate-700">
                        <p><strong>Student:</strong> {scanResult.studentName}</p>
                        <p><strong>Matric No:</strong> {scanResult.matricNo}</p>
                        <p><strong>Book:</strong> {scanResult.bookTitle}</p>
                        <p><strong>Due Date:</strong> {scanResult.dueDate}</p>
                    </div>
                )}
                <div className="mt-6">
                     <Button onClick={handleReset}>Scan Another QR Code</Button>
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-slate-800 mb-2">Loan Validator</h1>
                <p className="text-slate-500">Use the camera to scan a student's loan QR code to validate their book pickup.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md min-h-[350px] flex flex-col justify-center items-center">
                 {!isScanning && validationStatus === 'idle' && (
                    <div className="text-center">
                        <QRCodeIcon />
                        <p className="text-slate-600 my-4">Ready to validate a loan.</p>
                        <Button onClick={handleStartScan}>Start Scanner</Button>
                    </div>
                 )}

                 {isScanning && <div id={QR_READER_ID} className="w-full"></div>}

                 {validationStatus === 'loading' && <Spinner />}
                 {(validationStatus === 'valid' || validationStatus === 'invalid') && <ResultCard />}
            </div>
        </div>
    );
};

const QRCodeIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v1m6 11h2m-6.5 6.5v.01M4 12V4h8v8H4zm0 8v-4h4v4H4zm8 0v-4h4v4h-4zm4-12v-4h4v4h-4zm0 8h-4v-4h4v4z" />
    </svg>
);


export default LoanValidatorPage;
