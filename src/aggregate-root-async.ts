/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { AggregateRoot } from '@nestjs/cqrs';
import { IEvent } from '@nestjs/cqrs/dist/interfaces';

const INTERNAL_EVENTS = Symbol();
const IS_AUTO_COMMIT_ENABLED = Symbol();

// export abstract class AggregateRootAsync<EventBase extends IEvent = IEvent> {
export abstract class AggregateRootAsync<EventBase extends IEvent = IEvent> extends AggregateRoot {
  public [IS_AUTO_COMMIT_ENABLED] = false;
  private readonly [INTERNAL_EVENTS]: EventBase[] = [];

  set autoCommit(value: boolean) {
    this[IS_AUTO_COMMIT_ENABLED] = value;
  }

  get autoCommit(): boolean {
    return this[IS_AUTO_COMMIT_ENABLED];
  }

  publish<T extends EventBase = EventBase>(event: T) {}

  async publishAsync <T extends EventBase = EventBase>(event: T): Promise<void> {}

  commit() {
    this[INTERNAL_EVENTS].forEach((event) => this.publish(event));
    this[INTERNAL_EVENTS].length = 0;
  }

  async commitAsync(): Promise<void> {}

  uncommit() {
    this[INTERNAL_EVENTS].length = 0;
  }

  getUncommittedEvents(): EventBase[] {
    return this[INTERNAL_EVENTS];
  }

  loadFromHistory(history: EventBase[]) {
    history.forEach((event) => this.apply(event, true));
  }

  // private getEventHandler<T extends EventBase = EventBase>(
  //   event: T,
  // ): Function | undefined {
  //   const handler = `on${this.getEventName(event)}`;
  //   return this[handler];
  // }

  protected getEventName(event: any): string {
    const { constructor } = Object.getPrototypeOf(event);
    return constructor.name as string;
  }
}