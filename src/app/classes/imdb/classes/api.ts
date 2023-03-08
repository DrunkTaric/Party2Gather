export class API {

    async apiRequestRawHtml(url) {
      let data = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`);
      let text = await data.text();
      return text;
    }

    async apiRequestJson(url) {
      let data = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
      let text = await data.json();
      return JSON.parse(text.contents);
    }
}