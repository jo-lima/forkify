import icons from "url:../../img/icons.svg";
import View from "./View.js";

class PaginationView extends View {
  _parentElement = document.querySelector(".pagination");

  addHandlerClick(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const button = e.target.closest(".btn--inline");
      if (!button) return;
      const goToPage = +button.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    // prettier-ignore
    // | GET PAGE INFO |
    const numberPages = Math.ceil(this._data.results.length / this._data.resultsPerPage);
    const currentPage = this._data.page;

    // Page 1, and there are other pages
    if (currentPage === 1 && numberPages > 1) {
      return /* HTML */ `
        <button
          data-goto="${currentPage + 1}"
          class="btn--inline pagination__btn--next"
        >
          <span>Page ${currentPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
      `;
    }

    // Last page
    if (currentPage === numberPages && numberPages > 1) {
      return /* HTML */ `
        <button
          data-goto="${currentPage - 1}"
          class="btn--inline pagination__btn--prev"
        >
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${currentPage - 1}</span>
        </button>
      `;
    }
    // Other page
    if (currentPage < numberPages) {
      return /* HTML */ `
        <button
          data-goto="${currentPage - 1}"
          class="btn--inline pagination__btn--prev"
        >
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-left"></use>
          </svg>
          <span>Page ${currentPage - 1}</span>
        </button>
        <button
          data-goto="${currentPage + 1}"
          class="btn--inline pagination__btn--next"
        >
          <span>Page ${currentPage + 1}</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </button>
      `;
    }

    // Page 1, and there are NO other pages
    return ``;
  }
}

export default new PaginationView();
