export default class StateService {
  getCards() {
    return JSON.parse(localStorage.getItem('cards')) || [];
  }

  saveCards(data) {
    localStorage.setItem('cards', JSON.stringify(data));
  }
}
