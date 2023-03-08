//both
import { API } from "./classes/api";

//search
import bInfo from "./interfaces/Binfo";

//title
import DomParser from "dom-parser";
import parseMoreInfo from "./util/parse_info";
import seriesFetcher from "./util/parse_series";
import { decode as entityDecoder } from "html-entities";

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
    if (error.message.includes("Too many") == false && (tries < 3 || tries == null)) { 
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


function getNode(dom, tag, id) {
  return dom
    .getElementsByTagName(tag)
    .find((e) => e.attributes.find((e) => e.value === id));
}

export async function info(id: string, tries?: number) {
  try {
    let parser = new DomParser();
    let api = new API()
    let rawHtml = await api.apiRequestRawHtml(`https://www.imdb.com/title/${id}`);

    let dom = parser.parseFromString(rawHtml);

    let moreDetails = parseMoreInfo(dom);
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
      count: schema.aggregateRating?.ratingCount?? 0,
      star: schema.aggregateRating?.ratingValue?? 0.0,
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
    if (!response.year && response.releaseDeatiled.year !== -1)
      response.year = response.releaseDeatiled.year;
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

    return response;
  } catch (error) {
    console.log(error)
    if (error.message.includes("Too many") == false && (tries < 3 || tries == null)) { 
      console.log(`trying to get data for id: ${id}`); return info(id, tries + 1 | 1)
    }
    return {
      message: error.message,
    };
  }
}