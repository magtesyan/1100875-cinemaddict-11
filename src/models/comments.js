class Comments {
  constructor() {
    this._comments = [];
  }

  get() {
    return this._comments;
  }

  set(film) {
    this._comments = film.comments;
  }

  onDeleteComment(id) {
    const index = this._comments.findIndex((it) => it.id === id);
    if (index === -1) {
      return false;
    }

    this._comments = [].concat(this._comments.slice(0, index), this._comments.slice(index + 1));
    return this._comments;
  }

  onAddComment(comment) {
    this._comments = [].concat(this._comments, comment);
  }
}

export default Comments;
