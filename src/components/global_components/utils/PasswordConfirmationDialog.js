import React, { useState } from 'react';
import {
    Dialog,
    TextField,
    IconButton,
    InputAdornment
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function PasswordConfirmationDialog({
    open,
    onClose,
    onConfirm,
    title,
    message,
    noticeId,
    noticeType,
    btnText = 'Delete'
}) {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleConfirm = () => {
        onConfirm(password);
        setPassword('');
        onClose();
    };

    const handleCancel = () => {
        setPassword('');
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={handleCancel}
            sx={{
                "& .MuiDialog-paper": {
                    padding: '16px 20px',
                    maxWidth: '460px'
                },
            }}
        >
            <div className="delete-dialog-title">
                <div className="icon-container">
                    <img src="/icons/trash.svg" alt="" />
                </div>
                <p>{title ?? "Delete Notice Draft?"}</p>
            </div>

            <div className="delete-dialog-content">
                <p className="dialog-text">
                    {message ?? "You are about to permanently delete the draft:"} <br />
                    {(noticeType) && (
                        <span>{noticeType}</span>
                    )}
                </p>

                <div className="warning">
                    <div className="icon-container">
                        <img src="/icons/danger.svg" alt="" />
                    </div>
                    <p>This action cannot be undone</p>
                </div>

                <TextField
                    type={showPassword ? 'text' : 'password'}
                    placeholder='Enter Your Password'
                    fullWidth
                    value={password}
                    sx={{
                        marginTop: '20px',
                        "& .MuiOutlinedInput-input": {
                            padding: '10px 15px'
                        }
                    }}
                    onChange={(e) => setPassword(e.target.value)}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        )
                    }}
                />
            </div>

            <div className="dialog-btns">
                <button onClick={handleCancel} className='white-cta'>Cancel</button>
                {password && (
                    <button onClick={handleConfirm} className='black-cta' disabled={!password}>{btnText}</button>
                )}
            </div>
        </Dialog>
    );
}
