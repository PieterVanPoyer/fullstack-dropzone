
export default class EventsEmitter {

    private _events: any = {};

    /////////////////////////////////////////////////////////
    //
    //
    /////////////////////////////////////////////////////////
    constructor () {
    }

    /////////////////////////////////////////////////////////
    // Supports multiple events space-separated
    //
    /////////////////////////////////////////////////////////
    on (events?: any, fct?: any) {

        events.split(' ').forEach((event: string) => {
            this._events[event] = this._events[event]	|| []
            this._events[event].push(fct)
        });

        return this;
    }

    /////////////////////////////////////////////////////////
    // Supports multiple events space-separated
    //
    /////////////////////////////////////////////////////////
    off (events?:any, fct?:any) {

        if(events == undefined){
            this._events = {};
            return;
        }

        events.split(' ').forEach((event:string) => {

            if (event in this._events === false) {
                return;
            }

            if (fct) {

                this._events[event].splice(
                    this._events[event].indexOf(fct), 1);

            } else {

                this._events[event] = [];
            }
        });

        return this
    }

    /////////////////////////////////////////////////////////
    //
    //
    /////////////////////////////////////////////////////////
    emit (event: string, ... args: any[] /* , args... */) {

        if(this._events[event] === undefined) {
            return null;
        }

        const tmpArray = this._events[event].slice()

        for (let i = 0; i < tmpArray.length; ++i) {

            const result = tmpArray[i].apply(this,
                Array.prototype.slice.call(arguments, 1));

            if(result !== undefined) {
                return result
            }
        }
    }

}
