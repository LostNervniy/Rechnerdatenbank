export class Processor {
  constructor(
    public processor_id: number,
    public name: string,
    public producer: string,
    public clock: string,
    public architecture: string,
    public socket: string,
  ) { }
}
