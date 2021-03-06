import API from "./api/index.js";
import FilterController from "./controllers/filter.js";
import FooterStatsComponent from "./components/footer-stats.js";
import MoviesModel from "./models/movies.js";
import PageController from "./controllers/page.js";
import Provider from "./api/provider.js";
import Store from "./api/store.js";
import {SHOWING_FILMS_COUNT_ON_START} from "./const.js";
import {render, RenderPosition, remove} from "./utils/render.js";

const AUTHORIZATION = `Basic eo0w590ik29777b=`;
const END_POINT = `https://11.ecmascript.pages.academy/cinemaddict`;
const STORE_PREFIX = `cinemaaddicted-localstorage`;
const STORE_VER = `v1`;
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const api = new API(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);
const moviesModel = new MoviesModel();

const siteMain = document.querySelector(`.main`);
const pageController = new PageController(`.films-list`, moviesModel, apiWithProvider);
const filterController = new FilterController(siteMain, moviesModel, pageController);

const siteFooter = document.querySelector(`.footer`);
const siteFooterStatiscticsSection = siteFooter.querySelector(`.footer__statistics`);

const renderMainBlocks = (filmCards) => {
  moviesModel.set(filmCards);
  filterController.render();
  pageController.render(0, SHOWING_FILMS_COUNT_ON_START);
  render(siteFooterStatiscticsSection, footerStatsComponent, RenderPosition.BEFOREEND);
};

let footerStatsComponent = new FooterStatsComponent([]);
renderMainBlocks();

apiWithProvider.getMovies()
  .then((filmCards) => {
    return filmCards;
  })
  .then((filmCards) => {
    let fetches = [];
    filmCards.map((film) => {
      fetches.push(
          apiWithProvider.getComments(film[`id`])
            .then((comments) => {
              film.comments = comments;
            })
            .catch(() => {
              return;
            }));
    });
    Promise.all(fetches).then(() => {
      remove(footerStatsComponent);
      footerStatsComponent = new FooterStatsComponent(filmCards);
      renderMainBlocks(filmCards);
    });
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .then(() => {
    }).catch(() => {
    });
});

window.addEventListener(`online`, () => {
  document.title = document.title.replace(` [offline]`, ``);

  apiWithProvider.sync();
});
window.addEventListener(`offline`, () => {
  document.title = document.title.concat(` [offline]`);
});
