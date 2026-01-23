import { fabric } from 'fabric';

declare module 'fabric' {
  namespace fabric {
    interface Object {
      isImporting?: boolean;
    }
    interface Textbox {
      isImporting?: boolean;
    }
  }
}
