import { API } from "./classes/api";
import bInfo from "./interfaces/Binfo";


export async function search(query: string, tries?: number) {
    try {
        if (!query) throw new Error("Query param is required");

        let api = new API()

        let data = await api.apiRequestJson(
            `https://v3.sg.media-imdb.com/suggestion/x/${query}.json?includeVideos=0`
        );

        let response: any = {
            query: query,
        };

        let titles: bInfo[] = [];

        data.d.forEach((node) => {
            try {
                if (!node.qid) return;
                if (!["movie", "tvSeries", "tvMovie"].includes(node.qid)) return;

                let imageObj = {
                    image: null,
                    image_large: null,
                };

                if (node.i) {
                    imageObj.image_large = node.i.imageUrl;

                    try {
                        let width = Math.floor((396 * node.i.width) / node.i.height);

                        imageObj.image = node.i.imageUrl.replace(
                            /[.]_.*_[.]/,
                            `._V1_UY396_CR6,0,${width},396_AL_.`
                        );
                    } catch (_) {
                        imageObj.image = imageObj.image_large;
                    }
                }

                titles.push({
                    id: node.id,
                    title: node.l,
                    year: node.y,
                    type: node.qid,
                    imageObj: imageObj,
                    api_path: `/title/${node.id}`,
                    imdb: `https://www.imdb.com/title/${node.id}`,
                });
            } catch (_) {
                console.log(_);
            }
        });

        response.message = `Found ${titles.length} titles`;
        response.results = titles;

        return response;
    } catch (error) {
        if (tries == null || tries < 3) {
            console.log(`trying to get data for title: ${query}`);
            return search(query, tries + 1 | 1);
        }
        if (error.message.includes("Too many")) error.message = "Too many requests error from IMDB, please try again later";
        return {
            query: null,
            results: [],
            message: error.message,
        }
    }
}