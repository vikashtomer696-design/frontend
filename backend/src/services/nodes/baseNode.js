export class BaseNode {
  constructor(type) {
    this.type = type;
  }

  async execute(_context) {
    throw new Error(`Node ${this.type} execute() not implemented`);
  }
}
