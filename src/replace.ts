import * as ejs from 'ejs';
import { kebabCase } from 'lodash';

export const replaceTagParameters = (
  parameters: Record<string, string>,
  toReplace: string
): string => {
  for (const [key, value] of Object.entries(parameters)) {
    const keyString = `<%= ${key} %>`;
    const keyStringRegex = new RegExp(keyString, 'g');
    toReplace = toReplace.replace(keyStringRegex, value);
  }
  return toReplace;
};


export const parseEJSCode = (
  parameters: Record<string, string>,
  toReplace: string
): any => {
  return ejs.render(toReplace, parameters)
}

export const replaceCurlyBrace = (mockParameters: Record<string, any>, mockFileStringWithCurlyBrace: string, useKebabCase?: boolean): string => {
  let result = mockFileStringWithCurlyBrace;
  const processValue = (value: any, useKebabCase: boolean): string => {
    if (value === null || value === undefined) return 'null';
    if (typeof value === 'string') {
      if (useKebabCase && !value.includes('/')) {
        return kebabCase(value);
      }
      return value;
    }
    return String(value);
  };

  for (const key in mockParameters) {
    const value = mockParameters[key];
    const processedValue = processValue(value, useKebabCase || false);
    result = result.replace(new RegExp(`{${key}}`, 'g'), processedValue);
  }

  // Handle nested curly braces
  let iterations = 0;
  while (/{.*}/.test(result) && iterations < 3) {
    for (const key in mockParameters) {
      const value = mockParameters[key];
      const processedValue = processValue(value, useKebabCase || false);
      result = result.replace(new RegExp(`{${key}}`, 'g'), processedValue);
    }
    iterations++;
  }

  // Remove leading forward slash if present
  result = result.replace(/^\//, '');

  // Remove any remaining empty path segments
  result = result.replace(/\/+/g, '/').replace(/^\/|\/$/g, '');

  return result;
}
