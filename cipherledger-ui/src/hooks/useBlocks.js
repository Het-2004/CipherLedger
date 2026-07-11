import {
    useEffect,
    useState
}
    from "react";

import { getBlocks }
    from "../api/blockchainApi";

export default function useBlocks() {

    const [blocks, setBlocks] = useState([]);

    useEffect(() => { load(); }, []);

    async function load() {

        const res = await getBlocks();

        setBlocks(res.data);
    }

    return { blocks, refresh: load };
}