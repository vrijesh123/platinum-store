import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

export default function Custom404() {
    const router = useRouter()
    return (
        <div className="page-not-found container">
            <div className="img-container">
                <img src="/icons/404.svg" alt="404" />
            </div>


            <div className="message">
                <h4>Page not found</h4>
                <p>Oops! This page doesn’t exist or was moved. Check the URL or return to the dashboard.</p>
                <Button className="cta-btn" onClick={() => router.back()}>Go Back</Button>
            </div>
        </div>
    )
}