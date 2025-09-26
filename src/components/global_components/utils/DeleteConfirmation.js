import React, { useState } from 'react';
import { Dialog } from '@mui/material';
import PasswordConfirmationDialog from './PasswordConfirmationDialog';

export default function DeleteConfirmation({
    open,
    onClose,
    onConfirm,
    title,
    message,
    warning,
    btnText,
    noticeId,
    noticeType,
    totalRecipients,
    step_no = 1
}) {
    const [step, setStep] = useState(step_no);

    const handleContinue = () => setStep(2);

    const handleFinalConfirm = (password) => {
        onConfirm(password);
        setStep(1);
        onClose();
    };

    const handleCancel = () => {
        setStep(1);
        onClose();
    };

    return (
        <>
            {/* Step 1: Delete Confirmation */}
            <Dialog
                open={open && step === 1}
                onClose={handleCancel}
                sx={{
                    "& .MuiDialog-paper": {
                        padding: '16px 20px',
                        maxWidth: '460px'
                    },
                }}>

                <div className="delete-dialog-title">
                    <div className="icon-container">
                        <img src="/icons/danger.svg" alt="" />
                    </div>
                    <p>{title}</p>
                </div>

                <div className="delete-dialog-content">
                    <p className="dialog-text">{message}</p>

                    <div className="notice-details">
                        <p><span>Notice ID:</span> {noticeId}</p>
                        <p><span>Notice Type:</span> {noticeType}</p>
                        <p><span>Total Recipients:</span> {totalRecipients}</p>
                    </div>

                    <div className="warning">
                        <div className="icon-container">
                            <img src="/icons/danger.svg" alt="" />
                        </div>
                        <p>{warning ?? 'This action cannot be undone'}</p>
                    </div>
                </div>

                <div className="dialog-btns">
                    <button onClick={handleCancel} className='white-cta'>Cancel</button>
                    <button onClick={handleContinue} className='black-cta'>Continue</button>
                </div>
            </Dialog>

            {/* Step 2: Password Confirmation (Using extracted component) */}
            <PasswordConfirmationDialog
                open={open && step === 2}
                onClose={handleCancel}
                onConfirm={handleFinalConfirm}
                noticeId={noticeId}
                noticeType={noticeType}
                btnText={btnText}
            />
        </>
    );
}
