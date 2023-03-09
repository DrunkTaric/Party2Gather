import DomParser from "dom-parser";
import { API } from "./classes/api";
import parseMoreInfo from "./util/parse_info";
import seriesFetcher from "./util/parse_series";
import { decode as entityDecoder } from "html-entities";


export async function info(id: string, cb?: any, tries?: number) {
    try {
        let parser = new DomParser();
        let api = new API()
        let start = Date.now();
        let rawHtml = await api.apiRequestRawHtml(`https://www.imdb.com/title/${id}`);
        let end = Date.now();
        console.log(`Execution time for apiRequestRawHtml: ${end - start} ms`);
        start = Date.now();
        let dom = parser.parseFromString(rawHtml);
        end = Date.now();
        start = Date.now();
        console.log(`Execution time for parseFromString: ${end - start} ms`);
        let moreDetails = parseMoreInfo(dom);
        end = Date.now();
        console.log(`Execution time for parseMoreInfo: ${end - start} ms`);
        let response: any = {};

        // schema parse
        let schema = getNode(dom, "script", "application/ld+json");
        schema = JSON.parse(schema.innerHTML);

        // id
        response.id = id;

        // review
        response.review_api_path = `/reviews/${id}`;

        // imdb link
        response.imdb = `https://www.imdb.com/title/${id}`;

        // content type
        response.contentType = schema["@type"];

        // production status
        response.productionStatus = moreDetails.productionStatus;

        // title
        // response.title = getNode(dom, "h1", "hero-title-block__title").innerHTML;
        response.title = entityDecoder(schema.name, { level: "html5" });

        // image
        response.image = schema.image;
        response.images = moreDetails.images;

        // plot
        // response.plot = getNode(dom, "span", "plot-l").innerHTML;
        response.plot = entityDecoder(schema.description, { level: "html5" });

        // rating
        response.rating = {
            count: schema.aggregateRating?.ratingCount ?? 0,
            star: schema.aggregateRating?.ratingValue ?? 0.0,
        };

        // award
        response.award = moreDetails.award;

        // content rating
        response.contentRating = schema.contentRating;

        // genre
        response.genre = schema.genre.map((e) =>
            entityDecoder(e, { level: "html5" })
        );

        // year and runtime
        try {
            let metadata = getNode(dom, "ul", "hero-title-block__metadata");
            response.year = metadata.firstChild.firstChild.innerHTML;
            response.runtime = metadata.lastChild.innerHTML
                .split("<!-- -->")
                .join("");
        } catch (_) {
            if (!response.year) response.year = null;
            response.runtime = null;
        }

        // Relesde detail, laguages, fliming locations
        response.releaseDeatiled = moreDetails.releaseDeatiled;
        if (!response.year && response.releaseDeatiled.year !== -1) response.year = response.releaseDeatiled.year;
        response.spokenLanguages = moreDetails.spokenLanguages;
        response.filmingLocations = moreDetails.filmingLocations;

        // actors
        try {
            response.actors = schema.actor.map((e) =>
                entityDecoder(e.name, { level: "html5" })
            );
        } catch (_) {
            response.actors = [];
        }
        // director
        try {
            response.directors = schema.director.map((e) =>
                entityDecoder(e.name, { level: "html5" })
            );
        } catch (_) {
            response.directors = [];
        }

        // top credits
        try {
            let top_credits = getNode(dom, "div", "title-pc-expanded-section")
                .firstChild.firstChild;

            response.top_credits = top_credits.childNodes.map((e) => {
                return {
                    name: e.firstChild.textContent,
                    value: e.childNodes[1].firstChild.childNodes.map((e) =>
                        entityDecoder(e.textContent, { level: "html5" })
                    ),
                };
            });
        } catch (_) {
            response.top_credits = [];
        }

        try {
            if (["TVSeries"].includes(response.contentType)) {
                let seasons = await seriesFetcher(id);
                response.seasons = seasons;
            }
        } catch (error) { }

        cb(response);
    } catch (error) {
        console.log(error)
        if (tries == null || tries < 3) {
            console.log(`trying to get data for id: ${id}`); 
            info(id, cb, tries + 1 | 1)
        }else {
            cb({
                message: error.message,
            });
        }
    }
}

function getNode(dom, tag, id) {
    return dom
        .getElementsByTagName(tag)
        .find((e) => e.attributes.find((e) => e.value === id));
}
