import { nanoid } from 'nanoid';
import TaskColumn from './TaskColumn';
import Card from './Card';
import StateService from './StateService';

export default class Board {
  constructor(container) {
    if (!(container instanceof HTMLDivElement)) {
      throw new Error('This is not HTML element!');
    }
    this.container = container;
    this.state = [];
    this.stateService = new StateService();
  }

  init() {
    this.bindToDOM();
    this.toDoColumn = new TaskColumn(this.boardContainer, 'todo');
    this.toDoColumn.bindToDOM();

    this.inProgressColumn = new TaskColumn(this.boardContainer, 'in-progress');
    this.inProgressColumn.bindToDOM();

    this.doneColumn = new TaskColumn(this.boardContainer, 'done');
    this.doneColumn.bindToDOM();
    this.state = this.stateService.getCards();
    this.loadState(this.state);
    this.registerEvents();
  }

  static get markup() {
    return `
      <div class="board"></div>
    `;
  }

  get boardContainer() {
    return this.container.querySelector('.board');
  }

  bindToDOM() {
    this.container.insertAdjacentHTML('beforeend', this.constructor.markup);
  }

  registerEvents() {
    const ulElements = document.querySelectorAll('ul');
    const taskItems = this.container.querySelectorAll('.task-items');
    const formAddCard = this.container.querySelectorAll('.add-task');
    ulElements.forEach((element) => {
      element.addEventListener('mouseover', (event) => {
        if (event.target.tagName === 'LI') {
          this.showDeleteButton(event);
        }
      });
      element.addEventListener('mouseout', (event) => {
        if (
          event.relatedTarget.classList.contains('card-header') ||
          event.relatedTarget.tagName === 'SPAN'
        ) {
          return;
        }
        if (event.target.tagName === 'LI') {
          this.hideDeleteButton(event);
        }
      });
    });
    this.container.addEventListener('mousedown', (event) => {
      const { target } = event;
      if (target.tagName === 'SPAN') {
        return;
      }
      if (target.closest('li')) {
        this.onMouseDown(event);
      }
    });
    this.container.addEventListener('mouseup', (event) => this.onMouseUp(event));
    this.container.addEventListener('mousemove', (event) => this.onMouseMove(event));
    taskItems.forEach((element) =>
      element.addEventListener('click', (event) => {
        const { target } = event;
        if (target.classList.contains('card-delete') || target.tagName === 'SPAN') {
          this.deleteCard(event);
        }
      })
    );
    formAddCard.forEach((element) =>
      element.addEventListener('submit', (event) => {
        this.createNewCard(event);
        this.onClickCloseAddCard(event);
      })
    );
    const addNewCardButtonElement = this.boardContainer.querySelectorAll('.tasks-add-card button');
    const addTaskDeleteElement = this.boardContainer.querySelectorAll('.add-task-delete');
    addNewCardButtonElement.forEach((element) =>
      element.addEventListener('click', (event) => this.onClickAddNewCard(event))
    );
    addTaskDeleteElement.forEach((element) =>
      element.addEventListener('click', (event) => this.onClickCloseAddCard(event))
    );
  }

  onMouseDown(event) {
    event.preventDefault();
    document.body.style.cursor = 'grabbing';
    const currentElement = event.target.closest('li');
    this.cloneElement = currentElement.cloneNode(true);
    const { width, height, left, top } = currentElement.getBoundingClientRect();
    this.cloneElement.classList.add('dragged');
    this.cloneElement.style.width = `${width}px`;
    this.cloneElement.style.height = `${height}px`;
    document.body.appendChild(this.cloneElement);
    this.coordX = event.clientX - left;
    this.coordY = event.clientY - top;
    this.cloneElement.style.top = `${top}px`;
    this.cloneElement.style.left = `${left}px`;
    this.currentElement = currentElement;
    this.currentElement.classList.add('hidden');
  }

  onMouseMove(event) {
    event.preventDefault();
    if (!this.cloneElement) {
      return;
    }
    this.cloneElement.style.left = `${event.pageX - this.coordX}px`;
    this.cloneElement.style.top = `${event.pageY - this.coordY}px`;
  }

  onMouseUp(event) {
    event.preventDefault();
    document.body.style.cursor = 'default';
    if (!this.currentElement || !this.cloneElement) {
      return;
    }
    const closest = document.elementFromPoint(event.clientX, event.clientY).closest('li');
    const columnContainer = event.target.closest('.tasks-container');
    if (!columnContainer) {
      this.cloneElement.remove();
      this.currentElement.classList.remove('hidden');
      return;
    }
    const ulContainer = columnContainer.querySelector('.task-items');
    this.currentElement.dataset.type = columnContainer.dataset.idColumn;
    ulContainer.insertBefore(this.currentElement, closest);
    const currentCard = this.state.find((item) => item.id === this.currentElement.dataset.id);
    currentCard.type = this.currentElement.dataset.type;
    this.stateService.saveCards(this.state);
    this.currentElement.classList.remove('hidden');
    this.cloneElement.remove();
    this.cloneElement = null;
  }

  onClickAddNewCard(event) {
    const parentElement = event.currentTarget.closest('.tasks-container');
    const tasksAddCardElement = parentElement.querySelector('.tasks-add-card');
    const addTaskElement = parentElement.querySelector('.add-task');
    tasksAddCardElement.classList.toggle('hidden');
    addTaskElement.classList.toggle('hidden');
  }

  onClickCloseAddCard(event) {
    event.preventDefault();
    const parentElement = event.currentTarget.closest('.tasks-container');
    const tasksAddCardElement = parentElement.querySelector('.tasks-add-card');
    const addTaskElement = parentElement.querySelector('.add-task');
    tasksAddCardElement.classList.toggle('hidden');
    addTaskElement.classList.toggle('hidden');
  }

  deleteCard(event) {
    const parentElement = event.target.closest('li');
    const idx = this.state.findIndex((item) => item.id === parentElement.dataset.id);
    this.state.splice(idx, 1);
    this.stateService.saveCards(this.state);
    parentElement.remove();
  }

  createNewCard(event) {
    event.preventDefault();
    const { currentTarget } = event;
    const parentElement = currentTarget.closest('.tasks-container');
    const cardContainer = parentElement.querySelector('.task-items');
    const title = currentTarget[0].value;
    const newCard = new Card(cardContainer);
    const payload = {
      title,
      type: parentElement.dataset.idColumn,
      id: nanoid(),
    };
    newCard.createCard(payload);
    this.state.push(payload);
    this.stateService.saveCards(this.state);
    currentTarget[0].value = '';
  }

  loadState(cards) {
    cards.forEach((card) => {
      const cardContainer = this.container
        .querySelector(`.tasks-container[data-id-column="${card.type}"]`)
        .querySelector('.task-items');
      const newCard = new Card(cardContainer);
      newCard.createCard(card);
    });
  }

  showDeleteButton(event) {
    const buttonElement = event.target.querySelector('button');
    buttonElement.classList.remove('hidden');
  }

  hideDeleteButton(event) {
    const buttonElement = event.target.querySelector('button');
    buttonElement.classList.add('hidden');
  }
}
