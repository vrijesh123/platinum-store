import GlobalForm from "@/components/global_components/GlobalForm";
import { useTenantAPI } from "@/hooks/useTenantAPI";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

export default function Login() {
    const { tenantNoAuthAPI } = useTenantAPI();
    const router = useRouter()
    const [otp, setOtp] = useState("")
    const [showOtp, setshowOtp] = useState(false)
    const [isComplete, setIsComplete] = useState(false);
    const [number, setnumber] = useState(null)

    const [submitting, setsubmitting] = useState(false)

    const form_json = [
        // {
        //     type: "text",
        //     name: "username",
        //     label: "Username",
        //     fullWidth: true,
        //     variant: 'outlined',
        //     xs: 12,
        //     validation_message: "Please enter username",
        //     required: true,
        // },
        {
            type: "tel",
            name: "mobile_number",
            label: "Mobile Number",
            fullWidth: true,
            variant: 'outlined',
            show_password: true,
            xs: 12,
            placeholder: 'Enter your 10-digit mobile number',
            validation_message: "Please enter mobile number",
            required: true,
        },
    ]

    const handleSubmit = async (value, resetForm) => {
        const { mobile_number } = value

        setsubmitting(true)

        try {
            await tenantNoAuthAPI.post('/client/request-otp/', { calling_code: '91', phone_number: mobile_number });

            setnumber(mobile_number)
            toast.success("OTP has been sent successfully");
            setshowOtp(true)

        } catch (error) {
            toast.error("Error in sending OTP");
        } finally {
            setsubmitting(false)
        }
    }

    const handleOtpComplete = (code) => {
        setIsComplete(true);
        // optionally auto-submit:
        // verifyOTP(code)
    };

    const verifyOTP = async () => {
        // call your API here

        try {
            const res = await tenantNoAuthAPI.post('/client/verify-otp/', { phone_number: number, otp: otp });

            const { access, refresh, client } = res;

            Cookies.set('access_token', access);
            Cookies.set('refresh_token', refresh);
            Cookies.set('client', client);
            Cookies.set('is_client', true);

            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);

            // Redirect to dashboard after setting tokens
            window.location.href = '/tenant/store';

        } catch (error) {
            console.log(error)
        }
    };

    return (
        <>
            <div className="login-container">
                <div className="left-container">
                    <div className="logo-container">
                        <img src="/logo/logo.png" alt="" />
                    </div>

                    {showOtp ? (
                        <div className="form-container">
                            <div className="form-heading">
                                <h4>Enter OTP</h4>
                                <p>We’ve sent a 6-digit code to +91 {number}</p>
                            </div>
                            <div className="form" style={{ marginTop: 12 }}>
                                <OTPInput
                                    length={6}
                                    value={otp}
                                    onChange={setOtp}
                                    onComplete={handleOtpComplete}
                                    className="otp-wrap"
                                    inputClassName="otp-box"
                                />
                                <button
                                    className="blue-cta"
                                    style={{ marginTop: 16 }}
                                    disabled={otp.length !== 6 || !isComplete}
                                    onClick={verifyOTP}
                                >
                                    Verify
                                </button>
                            </div>
                        </div>
                    ) : (

                        <div className="form-container">
                            <div className="form-heading">
                                <h4>Welcome</h4>
                                <p>Check stock, see prices & place orders quickly.</p>
                            </div>
                            <div className="form">
                                <GlobalForm
                                    form_config={form_json}
                                    on_Submit={handleSubmit}
                                    btnClassName={'blue-cta'}
                                    btnText="Get OTP"
                                    spacing={1}
                                    is_submitting={submitting}
                                >
                                </GlobalForm>
                            </div>
                        </div>
                    )}
                </div>
            </div>

        </>
    );
}


function OTPInput({
    length = 6,
    value = "",
    onChange,
    onComplete,
    className = "",
    inputClassName = "",
}) {
    const [digits, setDigits] = useState(() =>
        Array.from({ length }, (_, i) => value[i] || "")
    );
    const refs = useRef([...Array(length)].map(() => null));

    useEffect(() => {
        if (typeof value === "string" && value.length) {
            const arr = Array.from({ length }, (_, i) => value[i] || "");
            setDigits(arr);
        }
    }, [value, length]);

    // update parent + fire onComplete when filled
    const emit = (next) => {
        const joined = next.join("");
        onChange?.(joined);
        if (joined.length === length && !next.includes("")) {
            onComplete?.(joined);
        }
    };

    const handleChange = (idx, ch) => {
        const digitsOnly = ch.replace(/\D/g, "");
        if (!digitsOnly) return;

        const next = [...digits];

        if (digitsOnly.length > 1) {
            // iOS OTP AutoFill or user pasted multiple chars directly into the field
            for (let i = 0; i < digitsOnly.length && idx + i < length; i++) {
                next[idx + i] = digitsOnly[i];
            }
            setDigits(next);
            emit(next);

            // focus last filled box
            const last = Math.min(idx + digitsOnly.length - 1, length - 1);
            refs.current[last]?.focus();
        } else {
            // regular single-character entry
            next[idx] = digitsOnly;
            setDigits(next);
            emit(next);
            if (idx < length - 1) refs.current[idx + 1]?.focus();
        }
    };


    const handleKeyDown = (idx, e) => {
        const key = e.key;

        if (key === "Backspace") {
            e.preventDefault();
            const next = [...digits];
            if (next[idx]) {
                next[idx] = "";
                setDigits(next);
                emit(next);
            } else if (idx > 0) {
                refs.current[idx - 1]?.focus();
                const prev = [...digits];
                prev[idx - 1] = "";
                setDigits(prev);
                emit(prev);
            }
        } else if (key === "ArrowLeft" && idx > 0) {
            e.preventDefault();
            refs.current[idx - 1]?.focus();
        } else if (key === "ArrowRight" && idx < length - 1) {
            e.preventDefault();
            refs.current[idx + 1]?.focus();
        }
    };

    const handlePaste = (idx, e) => {
        e.preventDefault();
        const clip = e.clipboardData.getData("text").replace(/\D/g, "");
        if (!clip) return;

        const next = [...digits];
        for (let i = 0; i < length - idx; i++) {
            next[idx + i] = clip[i] || next[idx + i] || "";
        }
        setDigits(next);
        emit(next);

        // focus last filled or last input
        const last = Math.min(idx + clip.length - 1, length - 1);
        refs.current[last]?.focus();
    };

    return (
        <div className={`otp-container ${className}`} style={{ display: "flex", justifyContent: 'center', gap: 8 }}>
            {digits.map((d, i) => (
                <input
                    key={i}
                    ref={(el) => (refs.current[i] = el)}
                    value={d}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={(e) => handlePaste(i, e)}
                    inputMode="numeric"
                    autoComplete={i === 0 ? "one-time-code" : "off"}
                    pattern="\d*"
                    maxLength={1}
                    className={`otp-input ${inputClassName}`}
                    style={{
                        width: "100%",
                        maxWidth: '50px',
                        height: "50px",
                        textAlign: "center",
                        fontSize: 20,
                        borderRadius: 10,
                        border: "1px solid #e5e7eb",
                        outline: "none",
                    }}
                />
            ))}
        </div>
    );
}

