App.ToggleComponent = ToggleComponent;
function ToggleComponent(config) {
  var name = config.name;
  var toggle = this.toggle = document.getElementById('toggle-' + name);

  // Если кнопка переключения не найдена, не пытаемся вешать на неё логику
  if (!toggle) {
    console.warn('Toggle element not found: toggle-' + name);
    return;
  }

  this.setupKey(config.key);
  this.setupMenu(config.menu);

  this.isActive = config.isActive != null ? config.isActive : false;
  this._toggleClassName = toggle.className || '';
  this.syncState();

  toggle.addEventListener('click', this.toggleState.bind(this), false);
}

ToggleComponent.create = App.ctor(ToggleComponent);
App.Dispatcher.extend(ToggleComponent.prototype);

ToggleComponent.prototype.setupKey = function (key) {
  if (!key || !this.toggle) { return; }
  this.keyDelegator.addBinding(key, this, 'toggleState');
};

ToggleComponent.prototype.setupMenu = function (name) {
  if (!name || !this.toggle) { return; }

  var menu = this.menu = document.getElementById('menu-' + name);
  if (!menu) { return; }

  var inner = this.menuInner = document.createElement('div');
  inner.className = 'inner';
  menu.appendChild(inner);

  this._menuClassName = menu.className || '';
  this.toggle.className += ' has-menu';
};

ToggleComponent.prototype.toggleState = function (event) {
  this.isActive = !this.isActive;
  this.syncState();
  this.triggerListeners('toggle', this.isActive);
};

ToggleComponent.prototype.syncState = function () {
  this.updateElClass(this.toggle, this._toggleClassName);
  this.updateElClass(this.menu, this._menuClassName);
  this.updateElHeight(this.menu, this.menuInner);
};

ToggleComponent.prototype.updateElClass = function (element, className) {
  if (!element) { return; }
  if (this.isActive) {
    element.className = (className + ' active').trim();
  } else {
    element.className = className;
  }
};

ToggleComponent.prototype.updateElHeight = function (element, inner) {
  if (!element || !inner) { return; }
  if (this.isActive) {
    element.style.height = inner.offsetHeight + 'px';
    this._willBecomeVisible = setTimeout(
      this.becomeVisible.bind(null, element), 200);
  } else {
    element.style.height = '';
  }
};

ToggleComponent.prototype.becomeVisible = function (element) {
  if (element) {
    element.className = (element.className + ' visible').trim();
  }
};

ToggleComponent.prototype.hide = function () {
  // Добавлена проверка на существование элементов перед скрытием
  if (this.toggle) {
    this.toggle.className = (this.toggle.className + ' hidden').trim();
  }
  if (this.menu) {
    this.menu.className = (this.menu.className + ' hidden').trim();
  }
};

ToggleComponent.prototype.keyDelegator = App.KeyDelegator.create();