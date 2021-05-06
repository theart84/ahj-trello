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
    // const addNewCardButtonElement = this.tasksContainer.querySelector('.tasks-add-card button');
    // const addTaskDeleteElement = this.tasksContainer.querySelector('.add-task-delete');
    //
    // // Listeners
    // this.taskItems.addEventListener('click', (event) => {
    //   const { target } = event;
    //   if (target.classList.contains('card-delete') || target.tagName === 'SPAN') {
    //     this.deleteCard(event);
    //   }
    // });
    // this.formAddCard.addEventListener('submit', (event) => this.createNewCard(event));
    // addNewCardButtonElement.addEventListener('click', () => this.onClickAddNewCard());
    // addTaskDeleteElement.addEventListener('click', (event) => this.onClickCloseAddCard(event));
  }

  // get tasksContainer() {
  //   return this.container.querySelector(`.tasks-container[data-id-column="${this.nameColumn}"]`);
  // }
  // //
  // get taskItems() {
  //   return this.tasksContainer.querySelector('.task-items');
  // }
  //
  // get cardContainer() {
  //   return [...this.taskItems.querySelectorAll('.card')];
  // }
  //
  // get formAddCard() {
  //   return this.tasksContainer.querySelector('.add-task');
  // }
  //
  // onClickAddNewCard() {
  //   const tasksAddCardElement = this.tasksContainer.querySelector('.tasks-add-card');
  //   const addTaskElement = this.tasksContainer.querySelector('.add-task');
  //   tasksAddCardElement.classList.toggle('hidden');
  //   addTaskElement.classList.toggle('hidden');
  // }
  //
  // onClickCloseAddCard(event) {
  //   event.preventDefault();
  //   const tasksAddCardElement = this.tasksContainer.querySelector('.tasks-add-card');
  //   const addTaskElement = this.tasksContainer.querySelector('.add-task');
  //   tasksAddCardElement.classList.toggle('hidden');
  //   addTaskElement.classList.toggle('hidden');
  // }
  //
  // deleteCard(event) {
  //   const parentElement = event.target.closest('li');
  //   parentElement.remove();
  // }
  //
  // createNewCard(event) {
  //   event.preventDefault();
  //   const { currentTarget } = event;
  //   const title = currentTarget[0].value;
  //   const newCard = new Card(this.taskItems);
  //   newCard.createCard(title, 'test', this.nameColumn);
  //   currentTarget[0].value = '';
  // }
}
