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
                            btnClassName={'blue-cta'}
                            btnText='Send Reset Link'
                            spacing={1}
                        >
                        </GlobalForm>
                    </div>
                </div>


            </div>


        </div>
    )
}

export default Index