import GlobalForm from '@/components/global_components/GlobalForm'
import React from 'react'

const Index = () => {
    const contact_form_json = [
        {
            type: "email",
            name: "email",
            label: "Email",
            fullWidth: true,
            variant: 'outlined',
            xs: 12,
            validation_message: "Please enter your Email",
            required: true,
        },
    ]

    return (
        <div className="login-container">
            <div className="left-container">
                <div className="logo-container">
                    <img src="/logo/logo.png" alt="" />
                </div>

                <div className="form-container">
                    <h4>Reset Password</h4>
                    <div className="form">
                        <GlobalForm
                            form_config={contact_form_json}
                            on_Submit={() => { }}
                            btnClassName={'black-cta'}
                            btnText='Send Reset Link'
                            spacing={1}
                        >

                        </GlobalForm>
                    </div>
                </div>

                <div className="terms">
                    <a href="/privacy-policy">
                        Privacy Policy</a>

                    <a href="/terms-conditions">
                        Terms & Conditions</a>

                    <p>© {new Date().getFullYear()} Apex ODR. All rights reserved.</p>
                </div>
            </div>

            <div className="right-container">
                <div className="img-container">
                    <img src="/images/login-bg.png" alt="" />
                </div>

                <div className="content">
                    <h4>Digital Disputes. Seamlessly Resolved.</h4>
                    <p>Manage notices, monitor hearings, and streamline arbitration all in one place.</p>
                </div>
            </div>
        </div>
    )
}

export default Index