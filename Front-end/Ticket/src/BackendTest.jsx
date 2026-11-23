
import React, { useEffect, useState } from "react";
import api from "./Api/axiosConfig";

function BackendTest() {

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        api.get("/api/test")
            .then((response) => {

                setMessage(response.data);
                setLoading(false);

            })
            .catch((error) => {

                console.log(error);
                setError("Backend connection failed");
                setLoading(false);

            });

    }, []);
    
    if (loading) {
        return <h2>Connecting to backend...</h2>;
    }

    if (error) {
        return <h2>{error}</h2>;
    }

    return (
        <div>
            <h1>Helpdesk Projectt</h1>
            <h2>{message}</h2>
        </div>
    );
}

export default BackendTest;
