/*
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except
 * in compliance with the License. You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under the License
 * is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
 * or implied. See the License for the specific language governing permissions and limitations under
 * the License.
 */

/**
 * Options for opening a dialog.
 */
enum DialogType {
  confirm,
  input,
}
interface DialogOptions {
  title: string,
  messageHtml?: string,
  bodyHtml?: string,
  inputLabel?: string,
  inputValue?: string,
  okLabel?: string,
  cancelLabel?: string,
  big?: boolean,
}

/**
 * Class provides helper methods for various operations.
 */
class Utils {

  /**
   * Opens a dialog with the specified options. It uses the Datalab custom element
   * according to the specified dialog type, attaches a new instance to the current
   * document, opens it, and returns a promise that resolves when the dialog is closed.
   * @param type specifies which type of dialog to use
   * @param dialogOptions specifies different options for opening the dialog
   */
  static showDialog(type: DialogType, dialogOptions: DialogOptions) {
    let dialogElement = '';
    if (type === DialogType.input) {
      dialogElement = 'input-dialog';
    } else if (type === DialogType.confirm) {
      dialogElement = 'base-dialog';
    }
    const dialog = <any>document.createElement(dialogElement);
    document.body.appendChild(dialog);

    if (dialogOptions.title)
      dialog.title = dialogOptions.title;
    if (dialogOptions.messageHtml)
      dialog.messageHtml = dialogOptions.messageHtml;
    if (dialogOptions.inputLabel)
      dialog.inputLabel = dialogOptions.inputLabel;
    if (dialogOptions.inputValue)
      dialog.inputValue = dialogOptions.inputValue;
    if (dialogOptions.okLabel)
      dialog.okLabel = dialogOptions.okLabel;
    if (dialogOptions.cancelLabel)
      dialog.cancelLabel = dialogOptions.cancelLabel;
    if (dialogOptions.big !== undefined)
      dialog.big = dialogOptions.big;

    // Open the dialog
    return new Promise(resolve => {
      dialog.openAndWaitAsync((closeResult: InputDialogCloseResult) => {
        document.body.removeChild(dialog);
        resolve(closeResult);
      });
    });
  }

  /**
   * Utility function that helps with the Polymer inheritance mechanism. It takes the subclass,
   * the superclass, and an element selector. It loads the templates for the two classes,
   * and inserts all of the elements from the subclass into the superclass's template, under
   * the element specified with the CSS selector, then returns the merged template.
   * 
   * This allows for a very flexible expansion of the superclass's HTML template, so that we're
   * not limited by wrapping the extended element, but we can actually inject extra elements
   * into its template, all while extending all of its javascript and styles.
   * @param subType class that is extending a superclass
   * @param baseType the superclass being extended
   * @param baseRootElementSelector a selector for an element that will be root
   *                                for the stamped template
   */
  static stampInBaseTemplate(subType: string, baseType: string,
                             baseRootElementSelector: string) {
    // Start with the base class's template
    const basetypeTemplate = Polymer.DomModule.import(baseType, 'template');
    const subtypeTemplate = Polymer.DomModule.import(subType, 'template');
    // Clone the base template; we don't want to change it in-place
    const stampedTemplate = <PolymerTemplate>basetypeTemplate.cloneNode(true);

    // Insert this template's elements in the base class's #body
    const bodyElement = stampedTemplate.content.querySelector(baseRootElementSelector);
    if (bodyElement) {
      while (subtypeTemplate.content.children.length) {
        const childNode = <HTMLElement>subtypeTemplate.content.firstElementChild;
        bodyElement.insertAdjacentElement('beforeend', childNode);
      }
    }

    return stampedTemplate;
  }
 
}
