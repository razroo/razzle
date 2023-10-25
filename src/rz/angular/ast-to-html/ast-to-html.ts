// types commented out for esm purposes
// import {
//     Attribute,
//     CDATA,
//     Comment,
//     DocType,
//     Element,
//     Node,
//     Text,
//   } from "angular-html-parser/lib/compiler/src/ml_parser/ast";

export function astToHtml(rootNodes: any): any {
  return rootNodes.map(nodeToString).join("");
}
  
  function nodeToString(node: any): string {
    switch (node.type) {
      case "element":
        return elementToString(node);
      case "text":
        return textToString(node);
      case "cdata":
        return cdataToString(node);
      case "attribute":
        return attributeToString(node);
      case "docType":
        return docTypeToString(node);
      case "comment":
        return commentToString(node);
      default:  
        return ''
    }
  }
  function elementToString(node: any): any {
    return `<${node.name}${astToHtml(node.attrs)}>${astToHtml(node.children)}</${
      node.name
    }>`;
  }
  function textToString(node: any): string {
    return node.value;
  }
  function cdataToString(node: any): string {
    return `<![CDATA[${node.value}]]>`;
  }
  function attributeToString(node: any): string {
    return ` ${node.name}="${node.value}"`;
  }
  function docTypeToString(node: any): string {
    return `<!DOCTYPE ${node.value}>`;
  }
  function commentToString(node: any): string {
    return `<!-- ${node.value} -->`;
  }