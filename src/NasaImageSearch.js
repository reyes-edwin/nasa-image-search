import { html, css, LitElement } from 'lit';
import '@lrnwebcomponents/accent-card';

class NasaImageSearch extends LitElement {
  constructor() {
    super();
    this.images = [];
    this.loadData = false;
    this.name = 'moon';
    this.page = 1;
    this.listOnly = false;
    this.year_start = 2000;
    this.year_end = 2021;
  }
  // year_start is _ cased while loadData is camel, pick a convention
  // though camel and then attribute reflected to same value is my personal preference for readability
  static get properties() {
    return {
      images: { type: Array },
      loadData: {
        type: Boolean,
        reflect: true,
        attribute: 'load-data',
      },
      name: { type: String },
      page: { type: Number },
      listOnly: {
        type: Boolean,
        reflect: true,
        attribute: 'list-only',
      },
      year_start: { type: Number },
      year_end: { type: Number },
    };
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      // because of how this works imagine the following
      // changedProperties has 2 values that changed in its array
      // 1 is name, next is page
      // if that's the case it'll run name changes then immediately again when page changes
      // this is just a needless web request and we attempt to reduce the noise across the internet when we can
      // this also is why your element won't update on date values because there's nothing saying to rerun on them
      if (propName === 'name' && this[propName]) {
        this.getData();
      } else if (propName === 'page' && this[propName]) {
        this.getData();
      }
    });
  }

  async getData() {
    return fetch(
      `https://images-api.nasa.gov/search?q=${this.name}&media_type=image&page=${this.page}&year_start=${this.year_start}&year_end=${this.year_end}`
    )
      .then(resp => {
        if (resp.ok) {
          return resp.json();
        }
        return false;
      })
      .then(data => {
        this.images = [];
        for (let i = 0; i < data.collection.items.length; i++) {
          const element = {
            image: data.collection.items[i].links[0].href,
            descriptions: data.collection.items[i].data[0].description,
            heading: data.collection.items[i].data[0].title,
            author: data.collection.items[i].data[0].secondary_creator,
          };
          this.images.push(element);
        }
        // tell the browser to wait for 1 second
        setTimeout(() => {
          this.loadData = false;
        }, 1000);
      });
  }

  static get styles() {
    return css`
      :host([view='list']) ul {
        margin: 20px;
      }
    `;
  }

  render() {
    return html` ${this.listOnly === true
      ? html`
          <ul>
            ${this.images.map(
              item => html`
                <li>
                  <a href="${item.image}" target="_blank"><b>Image Source</b></a>-
                  <b>Heading: </b>${item.heading} -
                  <b>Description: </b>${item.descriptions} -
                  <b>Author: </b>${item.author}
                </li>
              `
            )}
          </ul>
        `
      : html` ${this.images.map(
          item => html`
          <accent-card
            image-src="${item.image}"
            accent-color="blue"
            accent-heading
            style="max-width:2000px;"
          >
            <div slot="heading"><a href="${item.image}" target="_blank">${item.heading}</a></div>
            <div slot="content"><b>Description: </b>${item.descriptions}</div>
            <div slot="content"><b>Credit: </b>${item.author}</div>
          ></accent-card>`
        )}`}`;
  }
}

customElements.define('nasa-image-search', NasaImageSearch);
