export class API {
    async apiRequestRawHtml(url) {
      let data = await fetch(`https://proxy.cors.sh/${url}`, {headers: {
        'x-cors-api-key': 'temp_6efa2a43278f2a57c3c06e2c628e1a2f',
      }});
      let text = await data.text();
      return text;
    }

    async apiRequestJson(url) {
      let data = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
      let text = await data.json();
      return JSON.parse(text.contents);
    }
}