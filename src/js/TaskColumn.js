export default class TaskColumn {
  constructor(container, nameColumn) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('This is not HTML element!');
    }
    if (typeof nameColumn !== 'string') {
      throw new Error('Pass the string');
    }
    this.container = container;
    this.nameColumn = nameColumn;
  }

  static markup(title) {
    return `
      <div class="tasks-container" data-id-column="${title}">
        <div class="tasks-header">
            <h3 class="tasks-title">${title}</h3>
        </div>
        <div class="tasks-content">
        <ul class="task-items"></ul>
        </div>
        <div class="tasks-footer">
            <div class="tasks-add-card">
                <button>+ <span>Add another card<span></button>
            </div>
            <form class="add-task hidden">
              <div class="wrapper-input">
               <input type="text" class="add-task-input" placeholder="Enter a title for this card..."/>
              </div>               
              <button class="add-task-newcard btn btn-primary">Add Card</button>
              <button class="add-task-delete"><span></span></button>
            </form>
        </div>
      </div>      
    `;
  }

  bindToDOM() {
    this.container.insertAdjacentHTML('beforeend', this.constructor.markup(this.nameColumn));
  }
}
