import {render, RenderPosition, remove} from "../utils/render.js";
import CommentComponent from "../components/comment.js";

class CommentController {
  constructor(container, commentsModel, boardComponent, api) {
    this._container = container;
    this._commentsModel = commentsModel;
    this._commentComponent = null;
    this._boardComponent = boardComponent;
    this._api = api;
  }

  render(comment) {
    this._commentComponent = new CommentComponent(comment);
    render(this._container, this._commentComponent, RenderPosition.BEFOREEND);

    this._commentComponent.setDeleteButtonClickHandler((evt) => {
      evt.preventDefault();
      this._api.deleteComment(comment.id)
      .then(() => {
        const comments = this._commentsModel.onDeleteComment(comment.id);
        remove(this._commentComponent);
        this._boardComponent.rerender(comments);
      });
    });
  }
}

export default CommentController;
