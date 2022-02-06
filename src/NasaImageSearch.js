import { LitElement, html, css } from 'lit';
import '@lrnwebcomponents/accent-card/accent-card.js';

class NasaImageSearch extends LitElement {
  constructor() {
    super();
    this.images = [];
    this.loadData = false;
    this.name = 'moon';
    this.nasaEndpoint =
      'https://images-api.nasa.gov/search?q=moon&media_type=image';
    this.page = 1;
  }

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
    };
  }

  firstUpdated(changedProperties) {
    if (super.firstUpdated) {
      super.firstUpdated(changedProperties);
    }
    this.getData();
  }

  updated(changedProperties) {
    changedProperties.forEach((oldValue, propName) => {
      if (propName === 'name' && this[propName]) {
        this.getData();
      }
    });
  }

  async getData() {
    return fetch(
      `https://images-api.nasa.gov/search?q=${this.name}&media_type=image&page=${this.page}`
    )
      .then(resp => {
        if (resp.ok) {
          return resp.json();
        }

        return false;
      })
      .then(data => {
        console.log(data);
        this.images = [];
        // console.log(data.collection.items[0].links[0].href);

        for (let i = 0; i < data.collection.items.length; i++) {
          const element = {
            image: data.collection.items[i].links[0].href,
            descriptions: data.collection.items[i].data[0].description,
            heading: data.collection.items[i].data[0].title,
            author: data.collection.items[i].data[0].secondary_creator,
          };

          this.images.push(element);
          console.log(element);
        }
      });
  }

  static get styles() {
    return css`
      :host([view='list']) ul {
        margin: 20px;
      }
      input {
        margin: 20px;
      }
    `;
  }

  render() {
    return html`
      ${this.images.map(
        item => html` <accent-card
          image-src="${item.image}"
          accent-color="red"
          accent-heading
          style="max-width:1000px;"
        >
          <div slot="heading">${item.heading}</div>
          <div slot="content"><b>Description:</b> ${item.descriptions}</div>
          <div slot="content"><b>Author:</b> ${item.author}</div>
        </accent-card>`
      )}
    `;
  }
}

customElements.define('nasa-image-search', NasaImageSearch);
