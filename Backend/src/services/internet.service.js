import { config } from "../config/config.js";
import { tavily as Tavily } from "@tavily/core";

const tavily = Tavily({ apiKey: config.TAVILY_API_KEY, });

export const searchInternet = async ({ query }) => {
    try {
        const results = await tavily.search(query, {
            maxResults: 5,
            searchDepth: "basic",
        });
        return JSON.stringify(results);
    } catch (err) {
        throw new Error("Error fetching data from the internet: " + err.message);
    }
}
