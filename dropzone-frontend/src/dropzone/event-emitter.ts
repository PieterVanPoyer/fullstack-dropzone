export default class EventsEmitter {
  private listenersByEventTypeObject: any = {};

  /////////////////////////////////////////////////////////
  // Supports multiple events space-separated
  //
  /////////////////////////////////////////////////////////
  public on(events?: any, fct?: any) {
    events.split(' ').forEach((event: string) => {
      this.listenersByEventTypeObject[event] = this.listenersByEventTypeObject[event] || [];
      this.listenersByEventTypeObject[event].push(fct);
    });

    return this;
  }

  /////////////////////////////////////////////////////////
  // Supports multiple events space-separated
  //
  /////////////////////////////////////////////////////////
  public off(events?: any, fct?: any) {
    if (events === undefined) {
      this.listenersByEventTypeObject = {};
      return;
    }

    events.split(' ').forEach((event: string) => {
      if (event in this.listenersByEventTypeObject === false) {
        return;
      }

      if (fct) {
        this.listenersByEventTypeObject[event].splice(this.listenersByEventTypeObject[event].indexOf(fct), 1);
      } else {
        this.listenersByEventTypeObject[event] = [];
      }
    });

    return this;
  }

  /////////////////////////////////////////////////////////
  //
  //
  /////////////////////////////////////////////////////////
  public emit(event: string, ...args: any[] /* , args... */) {
    if (this.listenersByEventTypeObject[event] === undefined) {
      return null;
    }

    const tmpArray = this.listenersByEventTypeObject[event].slice();

    for (const listener of tmpArray) {
      const result = listener.apply(this, Array.prototype.slice.call(arguments, 1));

      if (result !== undefined) {
        return result;
      }
    }
  }
}
