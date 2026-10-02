import { useEffect, useState } from "react"
import api from "../api/api";
import { Link } from "react-router-dom";


function Home() {
    const [message, setMessage] = useState("");
    useEffect(() => {
        api.get<{ message: string }>("/").then((data) => {
            setMessage(data.message)
        }).catch((error) => { console.error(error) })
    }, [])
    return (
        <div>
            <h1>{message}</h1>
            <Link to="/stocks">Stocks Analysis</Link>
            <br />
            <Link to={`/monte-carlo-weekly/${encodeURIComponent("^NSEI")}`}>Weekly Monte Carlo</Link>
        </div>
    );
}

export default Home